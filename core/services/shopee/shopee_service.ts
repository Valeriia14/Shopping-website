const crypto = require("crypto");
import { ServiceProfile } from "@kidztime/models";
import fetch from "node-fetch";

export interface IShopeeConfig {
  partner_id: number;
  partner_key: string;
  is_live: boolean;
  redirect_uri: string;
  shop_id: number;
  code?: string;
  access_token?: string;
  refresh_token?: string;
}
class ShopeeApi {
  config: IShopeeConfig;
  token: any;
  code: string;
  host: string;

  constructor(config: IShopeeConfig){
    if (config === null || config === undefined) {
      throw new Error("config required")
    }
    this.config = config;
    this.code = config.code ?? ""
    if(config.is_live){
      this.host = "https://partner.shopeemobile.com"
    }else{
      this.host = "https://partner.test-stable.shopeemobile.com"
    }
  }
  authorize = async () =>{
    
  }
  getAuthorizeUrl = async () =>{
    const authUrl = this.buildAuthURL();
    const response = await fetch(authUrl, {
      method: 'get',
      headers: {'Content-Type': 'application/json'}
    });
    const data = await response.url
    this.code = data
    return response.url
  }
 
  getBaseUrl = () =>{
    if(this.config.is_live)
      return `https://partner.shopeemobile.com/api/v2`
    else
      return `https://partner.test-stable.shopeemobile.com/api/v2`  
  }
  //0412b30ec9c5a3f93eabc72448bcf50a
  buildAuthURL = (isCancel = false) => {
    const timest = Math.floor(Date.now() / 1000)
    const path = "/api/v2/shop/auth_partner"
    const sign = this.makeSign(path, timest)
    let authUrl = `${this.getBaseUrl()}/shop/`;
    authUrl += isCancel ? "cancel_auth_partner" : "auth_partner";
    authUrl += `?partner_id=${this.config.partner_id}`;
    authUrl += `&sign=${sign}`;
    authUrl += `&timestamp=${timest}`;
    authUrl += `&redirect=${this.config.redirect_uri}`;
    console.log("============auth url=======================", authUrl)
    return authUrl;
  }
  buildCancelAuthUrl() {
    return this.buildAuthURL(true);
  }
  generateAuthorization = (message : string) => {
    return crypto
      .createHmac("sha256", this.config.partner_key)
      .update(message)
      .digest("hex");
  }

//   Get Access_token
// API: https://partner.shopeemobile.com/api/v2/auth/token/get Method: Post
// Description: Use this API and code to get access_token and refresh_token.
  getAccessToken = async () =>{
    const timest = Math.floor(Date.now() / 1000);
    const code = this.code;
    const shop_id = this.config.shop_id;
    const body = {
      code,
      shop_id,
      partner_id: this.config.partner_id
    }
    console.log("===========get access token body===================", body)
    const path = "/api/v2/auth/token/get"
    const sign = this.makeSign(path, timest)
    const url = `${this.host}${path}?partner_id=${this.config.partner_id}&timestamp=${timest}&sign=${sign}`
    console.log("===============get access token url ===============", url)
    const response = await fetch(url, {
      method: 'post',
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'}
    });
    const data = await response.json();  
    this.config.access_token = data['access_token'];
    this.config.refresh_token = data['refresh_token'];
    return data // { access_token, refresh_token }
  }

  makeSign = (path: string, timest: number) =>{
    const base_string  = `${this.config.partner_id}${path}${timest}`
    const sign = this.generateAuthorization(base_string)
    return sign
  }
  makeShopSign = (path: string, timest: number, access_token: string, shop_id: number) =>{
    const base_string  = `${this.config.partner_id}${path}${timest}${access_token}${shop_id}`
    const sign = this.generateAuthorization(base_string)
    return sign
  }
  refreshToken = async () =>{
    const shop_id = this.config.shop_id;
    const body = {
      shop_id,
      partner_id: this.config.partner_id,
      refresh_token: this.config.refresh_token
    }
    
    const timest = Math.floor(Date.now() / 1000);
    const path = "/api/v2/auth/access_token/get"
    const sign = this.makeSign(path, timest)
    const url = `${this.host}${path}?partner_id=${this.config.partner_id}&timestamp=${timest}&sign=${sign}`
    
    const response = await fetch(url, {
      method: 'post',
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'}
    });
    const data = await response.json(); 
    const { refresh_token, access_token , error } = data
    if(error){
      console.log("=========refresh token error============", error)
      // throw new GenericError(`"invalid credentials" ${error.toString()}`);
      // throw new GenericError(`"invalid credentials" ${error.toString()}`);
    }else{
      this.config.refresh_token = refresh_token
      this.config.access_token = access_token
      await ServiceProfile.update({
        extra2: access_token,
        extra3: refresh_token
      },{
        where: {
          extra0: this.config.shop_id.toString()
        }
      })
      return { refresh_token, access_token}
    }
  }
  getOrderList = async (status: string) =>{
    let order_list: any = []
    let more = true;
    let next_cursor=""
    let retry = 0
    while(more && retry < 3){
      const timest = Math.floor(Date.now() / 1000);
      const path = "/api/v2/order/get_order_list";
      const sign = this.makeShopSign(path, timest, this.config.access_token!, this.config.shop_id);

      let common_params = `?partner_id=${this.config.partner_id}`
      common_params += `&timestamp=${timest}`
      common_params += `&access_token=${this.config.access_token}`
      common_params += `&shop_id=${this.config.shop_id}`
      common_params += `&sign=${sign}`
  
      let time_params =''
      const time_range_field = "&time_range_field=create_time"
      const time_from = `&time_from=${timest - 30 * 12 * 3600}`
      const time_to = `&time_to=${timest}`
      // const time_from = `&time_from=${1607235072}`
      // const time_to = `&time_to=${1608271872}`
      
      time_params = time_range_field + time_from + time_to
  
      const page_size = `&page_size=100`
      const cursor = `&cursor=${next_cursor}`
      const order_status = `&order_status=${status}`
  
      const response_optional_fields = "&response_optional_fields=order_status"
  
      const final_url = this.host + path + common_params 
                      + time_params + page_size 
                      + order_status
                      + response_optional_fields
                      
      const response = await fetch(final_url, {
        method: 'get',
        headers: {'Content-Type': 'application/json'}
      });
      const resp = await response.json();
      const { error, message } = resp
      const data = resp.response
      if(error){
        if(response.status === 403){
          await this.refreshToken()
          retry ++
          continue
        }
        more = false
        return
      }else{
        more = data.more
        next_cursor = data.next_cursor
        order_list = order_list.concat(data.order_list)
      }            
    }
    return order_list
  }
  getOrderDetail = async ( order_list_sn: string) =>{
      const timest = Math.floor(Date.now() / 1000);
      const path = "/api/v2/order/get_order_detail";
      const sign = this.makeShopSign(path, timest, this.config.access_token!, this.config.shop_id);
      let common_params = `?partner_id=${this.config.partner_id}`
      common_params += `&timestamp=${timest}`
      common_params += `&access_token=${this.config.access_token}`
      common_params += `&shop_id=${this.config.shop_id}`
      common_params += `&sign=${sign}`
      const response_optional_fields = "&response_optional_fields=buyer_user_id,buyer_username,estimated_shipping_fee,recipient_address,actual_shipping_fee ,goods_to_declare,note,note_update_time,item_list,pay_time,dropshipper,credit_card_number ,dropshipper_phone,split_up,buyer_cancel_reason,cancel_by,cancel_reason,actual_shipping_fee_confirmed,buyer_cpf_id,fulfillment_flag,pickup_done_time,package_list,shipping_carrier,payment_method,total_amount,buyer_username,invoice_data, checkout_shipping_carrier, reverse_shipping_fee"
  
      const final_url = this.host + path + common_params 
                      + "&order_sn_list="
                      + order_list_sn
                      + response_optional_fields             
      const response = await fetch(final_url, {
        method: 'get',
        headers: {'Content-Type': 'application/json'}
      });
      const resp = await response.json();
      const { error, message } = resp
      const data = resp.response
      return data.order_list
  }
}

export default ShopeeApi