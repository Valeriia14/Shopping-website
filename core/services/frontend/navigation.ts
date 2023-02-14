import { make_page_middleware } from "@kidztime/middlewares";
import { Asset, Category, ObjectMeta, MainMenu , ProductType, ProductType} from "@kidztime/models";
import { GenericOpts } from "../types";

export interface Banner {
  label: string;
  categories: Category[];
}

export const retrieve_banners = async (opts?: GenericOpts) => {
  const objectmetas = await ObjectMeta.findAll({
    where: {
      key: ObjectMeta.KEY.banner,
    },
    order: [
      'extra0',
    ],
  });

  const category_map: { [index: string]: Banner[] } = {};
  const banners = objectmetas.reduce((accum, objectmeta) => {
    if (!objectmeta.extra1) return accum;

    const category_ids = JSON.parse(objectmeta.extra1) as number[];
    const banner = {
      label: objectmeta.value ?? "",
      categories: [],
    };
    category_ids.forEach(id => {
      if (!category_map[id])
        category_map[id] = [];
      category_map[id].push(banner);
    });

    accum.push(banner);

    return accum;
  }, [] as Banner[]);

  const categories = await Category.findAll({
    include: [{
      model: Asset,
      as: 'assets'
    }],
    where: {
      id: Object.keys(category_map),
    },
    transaction: opts?.transaction,
  });

  for (const category of categories) {
    category_map[category.id]?.forEach(banner => banner.categories.push(category));
  }

  return banners;
}

export const retrieve_menu = async (opts?: GenericOpts) => {
  let mainMenu = await MainMenu.findAll();
  const data = await Promise.all(mainMenu.filter(menu => menu.customer_segment).map(async menu =>{
    // menu.sub_menu = await ProductType.findAll({
    //   where:{
    //     customer_segment: menu.customer_segment
    //   },
    //   attributes: ['name', 'description','id'],
    //   group: ['name', 'description','id']
    // })
    menu.sub_menu = await Category.findAll({
      include: [{
        model: ProductType,
        where: {
          customer_segment: menu.customer_segment,
          published: true
        },
      }],
      where: {
        published: true,
      },
    })
    return menu
  }))
  return data.map(menu=>{
    let sub_menu = {};
    menu.sub_menu.forEach(sub=>{
      sub_menu[sub.name] = {
        sub_header : {
          label: sub.name,
          handle : sub.handle,
          description: sub.description,
          id: sub.id ,
          sub_body : sub.product_types
        }
      }
    })
    return {
      customer_segment: menu.customer_segment, 
      customer_segment_dtl: menu.customer_segment_dtl,
      sub_menu : Object.values(sub_menu)
    }
  })
}

export const getTrending = async (opts?: GenericOpts) => {
  return await Asset.findAll({
    where: {
      owner_type: 'menu',
    },
    order:[['updated_at', 'DESC']]
  })
}

export const set_banners_middleware = () => {
  return make_page_middleware(async (req, res) => {
    const banners = await retrieve_banners();
    res.page_data.menu = await retrieve_menu();
    res.page_data.banners = banners;
    res.page_data.trending = await getTrending();
  });
};
