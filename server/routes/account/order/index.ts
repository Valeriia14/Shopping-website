import { cruder, load_model } from "@kidztime/middlewares";
import { Router } from "express";
import { Account, Order, OrderItem } from "@kidztime/models";

const router = Router();

router.get("/list", cruder.list(Order, Account));
router.get("/:order_id/detail", cruder.detail(Order, Account));
router.get("/:order_id/order_item/list", load_model(Order), cruder.list(OrderItem, Order));
router.post("/:order_id/discount/apply", load_model(Order), require("./discount_order").default)

router.use("/order_item", require("./order_item").default);
router.use("/:order_id/payment", load_model(Order), require("./payment").default);
router.post("/:order_id/points_update",load_model(Order), require("./points_update").default);

export default router;
