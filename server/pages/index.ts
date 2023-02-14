import { Paths } from "@kidztime/constants";
import { prepare_page, render_page , Request } from "@kidztime/middlewares";
import { SvAuthenticate, SvCart, SvFrontend, SvOrder } from "@kidztime/services";
import { Router } from "express";
import cookie_parser from "cookie-parser";

const PAGES_PATH_REGEX = /^\/(?!_react-ssr\/).*/;

const router = Router();

const middlewares_router = Router();

middlewares_router.use(cookie_parser());
middlewares_router.use(prepare_page());
middlewares_router.use(SvFrontend.set_banners_middleware());
middlewares_router.use(SvAuthenticate.authenticate_page());
middlewares_router.use(SvFrontend.set_objectmeta_middleware());

router.use(PAGES_PATH_REGEX, middlewares_router);

router.get("/", SvCart.load_cart(), require("./landing").default);
router.get("/auth/signup", SvCart.load_cart(), render_page(Paths.Views.Account_SignUp));
router.get("/auth/signin", SvCart.load_cart(), render_page(Paths.Views.Account_SignIn));
router.get("/auth/forgot-password", SvCart.load_cart(), render_page(Paths.Views.Account_ForgotPassword));
router.get("/auth/reset-password", SvCart.load_cart(), render_page(Paths.Views.Account_ResetPassword));

router.get("/account/dashboard", SvCart.load_cart(), render_page(Paths.Views.Account_Dashboard));
router.get("/account/contactus", SvCart.load_cart(), render_page(Paths.Views.Account_Contact));
router.get("/account/points", SvCart.load_cart(),render_page(Paths.Views.Account_Points));
router.get("/account/profile", SvCart.load_cart(),render_page(Paths.Views.Account_Profile));
router.get("/account/addresses", SvCart.load_cart(),render_page(Paths.Views.Account_Addresses));
router.get("/account/payment_methods", SvCart.load_cart(),render_page(Paths.Views.Payment_Methods));
router.get("/account/wishlist", SvCart.load_cart(),render_page(Paths.Views.Account_Wishlist));
router.use("/account", SvCart.load_cart(), require("./account").default);

router.get("/product", SvCart.load_cart(), render_page(Paths.Views.Product_List));
router.get("/product/add", SvCart.load_cart(), render_page(Paths.Views.Cart_Details));
router.get(
  "/product/add/accessories", SvCart.load_cart(),
  render_page(Paths.Views.Cart_Accessories)
);
router.get("/product/add/free-gifts", SvCart.load_cart(), render_page(Paths.Views.Cart_Free_Gifts));

router.use("/character", SvCart.load_cart(), require("./character").default);
router.use("/category", SvCart.load_cart(), require("./category").default);
router.use("/product-type", SvCart.load_cart(), require("./product_type").default);
router.use("/products", SvCart.load_cart(), require("./products").default);
router.use("/cart", SvCart.load_cart(), require("./cart").default);
router.use("/shipping_method", SvCart.load_cart(), require("./shipping_method").default);
router.use("/search", SvCart.load_cart(), require("./search").default);

router.get("/checkout", SvCart.load_cart(), render_page(Paths.Views.Checkout));
router.get("/checkout_payment", SvCart.load_cart(), render_page(Paths.Views.Checkout_Payment));
router.get("/checkout_confirm", SvCart.load_cart(), render_page(Paths.Views.Checkout_Confirm));
router.get("/additional_payment_fee", SvCart.load_cart(), render_page(Paths.Views.Payment));
router.get("/order/:handle/summary", SvCart.load_cart(), require("./order_summary").default);

router.get("/:handle",render_page(Paths.Views.NotFound));

export default router;
