import { Order, ServiceProfile } from "@kidztime/models"
import ShopeeApi, { IShopeeConfig } from "./shopee_service"
import config from "@kidztime/config";

interface ISeller {
  partner_id: number;
  partner_key: string;
  is_live: boolean;
  shop_id: number;
  account_id?: number;
  code?: string;
}


export const create_shopee_seller = async ( seller: ISeller) => {
  try{
    const seller_profile = await ServiceProfile.findOne({
      where:{
        extra0: seller.shop_id.toString()
      }
    })
    if(!seller_profile)
      await ServiceProfile.create({
        reference: seller.partner_id,
        service: "shopee",
        key: seller.partner_key,
        extra0: seller.shop_id,
        extra1: seller.is_live,
        account_id: seller.account_id
      })
    const shopee_api = new ShopeeApi({
      partner_id: seller.partner_id,
      partner_key: seller.partner_key,
      is_live: seller.is_live,
      redirect_uri: config.paths.shopee_auth_redirect_url,
      shop_id: seller.shop_id
    })
    const authorization_url = await shopee_api.getAuthorizeUrl()
    return authorization_url
  }catch(e){
    console.log(e)
  }
}
export const assign_shopee_seller_code = async (code: string, shop_id: number) => {
  const updateResult = await ServiceProfile.update({
    secret: code
  }, {
    where: {
      extra0: shop_id.toString()
    }
  })
  const sellerProfile = await ServiceProfile.findOne({
    where: {
      extra0: shop_id.toString()
    }
  })
  const sellerConfig: IShopeeConfig = {
    partner_id: Number(sellerProfile?.reference),
    partner_key: sellerProfile?.key!,
    is_live: (sellerProfile?.extra1 !== "0"),
    redirect_uri: config.paths.shopee_auth_redirect_url,
    shop_id,
    code
  }
  const shopee_api = new ShopeeApi(sellerConfig)
  const token = await shopee_api.getAccessToken()
  await sellerProfile?.update({
    extra2: token["access_token"],
    extra3: token["refresh_token"]
  })
  return token
}

export default {
  create_shopee_seller,
  assign_shopee_seller_code,
  ShopeeApi
};
