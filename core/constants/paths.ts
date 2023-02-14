export namespace Paths {
  export const Views = {
    Landing: "pages/landing",

    Account_SignIn: "pages/account/auth/signin",
    Account_SignUp: "pages/account/auth/signup",
    Account_ForgotPassword: "pages/account/auth/forgotpassword",
    Account_ResetPassword: "pages/account/auth/resetpassword",

    Account_Dashboard: "pages/account/dashboard",
    Account_Contact: "pages/account/contactus",
    Account_Smiles_Reward: "pages/account/smilereward",
    Account_Points: "pages/account/points",
    Account_Orders: "pages/account/orders",
    Account_Order_Summary: "pages/account/ordersummary",
    Account_Profile: "pages/account/profile",
    Account_Addresses: "pages/account/addresses",
    Payment_Methods: "pages/account/payment_methods",

    Account_Wishlist: "pages/account/wishlist",
    
    Category: "pages/category",
    Character: "pages/character",
    Product_Type: "pages/product_type",
    Product_Detail: "pages/product/detail",
    Product_List: "pages/product/list",
    Product_Detail2: "pages/product2/detail",
    Cart: "pages/cart",
    Checkout: "pages/checkout",
    Checkout_Payment: "pages/checkoutpayment",
    Checkout_Confirm: "pages/checkoutconfirm",
    Summary: "pages/checkoutconfirm",
    Search: "pages/search",
    Payment: "pages/payment",
    NotFound: "pages/notfound",
    Shipping_Method: "pages/shipping_method",

    Cart_Details: "pages/product/detail/Components/AddToCart/AddToCart",
    Cart_Accessories: "pages/product/detail/Components/Accessories/Accessories",
    Cart_Free_Gifts: "pages/product/detail/Components/FreeGifts/FreeGifts",
  } as const;
};
