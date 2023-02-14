export default {
  "account/signin": "/public/session/login", // post
  "account/signup": "/public/session/register", //post
  "account/login-social": "/public/session/login-social", // post
  "account/request_reset_password": "/public/password/request", //post
  "account/reset_password": "/public/password/reset", //post

  "order/list": "/public/order/:order_id/order_item/list", //get

  "order/detail": "/public/order/:order_id/detail", //get
  "order/detail_summary": "/public/order/:reference/detail_summary",//get
  "order/item/update": "/public/order/:product_id/update", //post
  "order/item/add": "/public/order/:product_id/add", //post

  "cart/stripeToken": "/tokens", //post
  "public/charges": "/public/payment/charges", //post
  "public/checkout": "/public/order/checkout", //post
  "public/resolve_exchange": "/public/payment/order/resolve_exchange", //post
  "public/order/history" :"/public/order/history", //get
  "auth/checkout": "/account/order/:order_id/payment/checkout", //post
  "points/update": "/account/order/:order_id/points_update", //post
  "account/payment": "/account/payment/list", //get
  "account/payment/create": "/account/payment/create", // post
  "account/payment/delete": "/account/payment/:objectmeta_id/delete", // delete
  "account/payment/update": "/account/payment/:objectmeta_id/update", // update
  "account/address/list": "/account/address/list", // get
  "account/address/create": "/account/address/create", // post
  "account/address/delete": "/account/address/:address_id/delete", // delete
  "account/address/update": "/account/address/:address_id/update", // update
  "public/profile": "/public/profile",//put
  "account/order/list": "/account/order/list", //get
  "account/order/discount": "/account/order/:order_id/discount/apply", //post
  "account/profile" : "/account/profile", //get
  "public/change_password" : "/public/password/:account_id/change_password", //get
  "public/cart/session/update": "/public/cart/session/update", //post
  "account/billing_address/list": "/account/billing_address/list", // get
  "account/billing_address/create": "/account/billing_address/create", // post
  "account/billing_address/delete": "/account/billing_address/:billing_address_id/delete", // delete
  "account/billing_address/update": "/account/billing_address/:billing_address_id/update", // update
  "public/cart/cart_item/add": "/public/cart/cart_item/:product_id/add", //post
  "public/cart/cart_item/list": "/public/cart/cart_item/:session_ids/list", //get
  "public/cart/cart_item/delete": "/public/cart/cart_item/:cart_item_id/delete", //delete

  //Vouchers
  // "vouchers/validate": "/validate?code=:code", //get
  //objectmeta:settings
  "settings_page": "/public/objectmeta/settings_page",

  //Product
  "public/product/list": "/public/product/list", //get
  "public/product/detail": "/public/product/:product_id/detail", //get
  "public/product/detailbyhandle": "/public/product/:handle",  //get

  "public/send_contact_mail": "/public/contact/send_contact_mail", //post
  // Category
  "public/category/product_list": "/public/category/product_list/:category_id", //get
   // character
   "public/character/product_list": "/public/character/product_list/:character_id", //get
   // character
   "public/product_type/product_list": "/public/product_type/product_list/:product_type_id", //get
  // UGC
  "public/review": "/public/review", //post
  "public/question_answer": "/public/question_answer", //post
  "public/review/image": "/public/review/:review_id/image", //post
  "public/review/helpful": "/public/review/:review_id/helpful", //get
  "public/review/dislike": "/public/review/:review_id/dislike", //get

  "public/voucher/detail": "/public/voucher/:ref/detail", //get
  "public/reward_point/available": "/public/reward_point/available", //get
  "public/reward_point/history": "/public/reward_point/history", //get
} as const;
