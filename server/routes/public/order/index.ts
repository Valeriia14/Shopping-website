
import { load_model, parse_query } from "@kidztime/middlewares";
import { Product } from "@kidztime/models";
import { SvOrder, SvCart } from "@kidztime/services";
import { Router } from "express";


const router = Router();
// router.use(SvOrder.load_cart(true))

router.get("/:order_id/detail", require("./detail").default);
router.get("/:reference/detail_summary",parse_query(), require("./detail_summary").default);
router.post("/checkout", require("./checkout").default);
// router.post("/discount", SvOrder.extend_cart(), require("./discount").default);
// router.post("/:product_id/update", SvOrder.extend_cart(), load_model(Product), require("./update").default);
// router.post("/:product_id/add", SvOrder.extend_cart(), load_model(Product), require("./add").default);
// router.use("/order_item", SvOrder.extend_cart(), require("./order_item").default);
router.get("/history", parse_query(), require("./history").default);
export default router;
