import moment from "moment";
import { Group, Category, ObjectMeta, Product, ServiceProfile, Order, Webpage, Character } from "@kidztime/models";
import { CreateProductProps, create_product } from "../product/product";
import { CreateCategoryProps, create_category } from "../classification/classification"
import { chirp, slugify, updateIsNewProd } from "@kidztime/utilities";
import Datasource from "@kidztime/models/datasource";
import { Transaction } from "sequelize/types";
import ShopeeApi, { IShopeeConfig } from "../shopee/shopee_service";
import config from "@kidztime/config";
import { SvOrder } from "..";
import frontend from "../frontend";

export const ShopeeOrderStatusMap: any = {
  UNPAID: "open",
  READY_TO_SHIP:  "unprocessed",
  PROCESSED: "processed",
  RETRY_SHIP: "processed", 
  SHIPPED: "shipped",
  TO_CONFIRM_RECEIVE: "shipped",
  IN_CANCEL: "cancelled",
  CANCELLED: "cancelled",
  TO_RETURN: "cancelled",
  COMPLETED: "completed"
}

export type GenericOpts = {
  transaction?: Transaction;
  ip_address?: string;
};

export const checkGroupJob = async () => {
  const groups = await Group.findAll();
  const timeFormat = "YYYY-MM-DD"
  if (groups && groups.length) {
    for (let group of groups) {
      const diff_start = moment().startOf("day").diff(moment(group.start_at, timeFormat), "days") >= 0;
      const diff_end = moment(group.end_at, timeFormat).diff(moment().startOf("day"), "days") > 0;
      const diff_end_over = moment().startOf("day").diff(moment(group.end_at, timeFormat), "days") >= 0;
      if (diff_end_over && group.published) {
        await group.update({ published: false });
      } else if (diff_start && diff_end && !group.published) {
        await group.update({ published: true });
      }
    }
  }
};

export const syncB2BProduct = async () => {
  chirp(`====sync b2b products started====`);
  const opt:GenericOpts = {};
  const { transaction } = opt;
  try {
    await Datasource.sources['b2b'].query("SELECT 1+1 AS result");
    let isSyncing = await ObjectMeta.findOne({
      where: {
        key: 'b2b-syncing',
      }
    });
    if (!isSyncing) {
      isSyncing = await ObjectMeta.create({
        key: 'b2b-syncing',
        value: "in-progress"
      })
    } else {
      await isSyncing.update({
        value: "in-progress"
      }, { transaction })
    }

    const bproducts = [];
    // check if b2b has no product from kidztime 
    const kidz_products = await Product.findAll();
    //unavailable things
    const bIds: string[] = []
    bproducts.forEach(function(obj){
        bIds.push(obj.product_code!)
    });
    // Return all elements in A, unless in B
    let unavailable_products = kidz_products.filter(function(obj){
        return !( bIds.includes(obj.sku!));
    });
    for(let i = 0; i < unavailable_products.length; i++){
      let uproduct = unavailable_products[i];
      await uproduct.update({ status: Product.Status.Unavilable}, {
        transaction
      })
    }

    for (let i = 0; i < bproducts.length; i++) {
      try {
        const item = bproducts[i];
        const kidz_product = await Product.findOne({
          where:{
            sku: item.product_code
          }
        })
        let product: Product
        if(!kidz_product){
          // //product doesn't exist on kidztime
          const create_prop: CreateProductProps = {
            name: item['name']!,
            handle: slugify(item['name']!),
            alt_name: "",
            sku: item['product_code']!,
            upc: item['upc']!,
            material: item['baseMaterial'],
            stock: item['quantity']!,
            price: item['price']!,
            description: item['description']!,
            actor_id: 0,
            status: item["status"]!
          }
          product = await create_product(create_prop);
        }else{
          /// if exists update the product, stock, update preview uri
          product = await kidz_product.update({
            name: item['name']!,
            handle: slugify(item['name']!),
            alt_name: "",
            sku: item['product_code']!,
            upc: item['upc']!,
            material: item['baseMaterial'],
            stock: item['quantity']!,
            price: item['price']!,
            actor_id: 0,
            status: item["status"]!
          }, { transaction });
          await product.product_info?.update({ 
            description: item['description']!
          }, { transaction })
          
          if(item.udf_photo)
            await product.PreviewImage?.update({
              uri: "item.udf_photo"
            })
          if(product.status === Product.Status.Unavilable){
            if(item.quantity! > 0)
              await product.update({
                stock: item.quantity,
                status: Product.Status.ReadyForSale
              }, { transaction })
            else
              await product.update({
                stock: item.quantity,
                status: Product.Status.OutOfStock
              }, { transaction })  
          }
        } 
        
        // update or create category according to b2b product category
        const findCategory = await Category.findOne({
          where: {
            handle: slugify(item?.Category?.name),
            type: Category.TYPE.category
          }
        }) 
        if(item.Category?.name){
          if (findCategory) {
            await product.setCategories([findCategory], { transaction });
          } else {
            const category_prop: CreateCategoryProps = {
              name: item?.Category['name'],
              handle: slugify(item?.Category['name']),
              type: Category.TYPE.category,
              published: true,
              published_at: new Date(),
              actor_id: 0
            }
            let category = await create_category(category_prop, { transaction });
            await product.setCategories([category], { transaction });
          }
        }

        const findCharacter = await Category.findOne({
          where: {
            handle: slugify(item?.Character?.name),
            type: Category.TYPE.character
          }
        }) 
        if(item.Character?.name){
          if (findCharacter) {
            await product.setCategories([findCategory], { transaction });
          } else {
            const category_prop: CreateCategoryProps = {
              name: item?.Character['name'],
              handle: slugify(item?.Character['name']),
              type: Category.TYPE.character,
              published: true,
              published_at: new Date(),
              actor_id: 0
            }
            let character = await create_category(category_prop, { transaction });
            await product.setCategories([character], { transaction });
          }
        }
      } catch (e) {
        console.log(e)
        continue
      }
    }
    await isSyncing.update({
      value: "idle"
    }, { transaction });
    chirp(`====sync b2b products ended====`);
  } catch (e) {
    chirp(`====sync b2b products failed====${e}`);
    return
  }
};

export const syncShopeeOrder = async () => {
  const seller_profiles = await ServiceProfile.findAll({
    where:{
      extra0: config["shopee"]["shop_id"]
    }
  })
  
  for(let i = 0; i < seller_profiles.length; i++){
    const seller = seller_profiles[i]
    const shopee_config: IShopeeConfig = {
      partner_id: Number(seller.reference) ,
      partner_key: seller.key!,
      is_live: false,
      redirect_uri: config["paths"]["shopee_auth_redirect_url"],
      shop_id: Number(seller.extra0),
      access_token: seller.extra2!,
      refresh_token: seller.extra3!
    }
    
    const shopee_api  = new ShopeeApi(shopee_config)
    const status_list = Object.keys(ShopeeOrderStatusMap)
    let order_list: any = []
    for(let i = 0; i < status_list.length; i++){
      const status = status_list[i]
      const order_sub_list = await shopee_api.getOrderList(status)
      if(order_sub_list?.length > 0)
        order_list = order_list.concat(order_sub_list)
    }
    if(order_list.length === 0) return
    const order_sn_list = order_list.reduce((acc: string[], currentValue: any) =>{
      acc.push(currentValue["order_sn"])
      return acc
    },[])
    //todo # will need to chunk this order sn list into 50
    let kidz_orders = await Order.findAll();
    const create_list = order_sn_list
    let shopee_order_list = await shopee_api.getOrderDetail(create_list.join(","))
    try{
      await SvOrder.sync_shopee_orders(shopee_order_list, {})
      console.log("===========sync finished==========")
    }catch(e){
      console.log("===========sync failed==========", e)
    }
  }
}

export const updateProductTags = async () =>{
  const allProds = await Product.findAll();
  for(let i = 0; i < allProds.length; i++){
    await updateIsNewProd(allProds[i])
  }
}

export const updateWebpage = async () => {
  const webpages = await Webpage.findAll({where:{
    path: null,
  }})
  for(let i = 0; i < webpages.length; i++){
    if(webpages[i].type) {
      await frontend.update_webpage_cron_job(webpages[i])
    }
  }
};