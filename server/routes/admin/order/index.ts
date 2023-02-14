import { cruder, load_model, parse_query } from "@kidztime/middlewares";
import { Order } from "@kidztime/models/billing";
import { Router } from "express";

const router = Router();

router.get("/list", parse_query(), require("./list").default);
router.get("/:order_id/detail", parse_query(), require('./detail').default);
router.post("/create", require("./create").default);
router.post("/:order_id/update", cruder.update(Order));
router.post("/order-process", require("./order_process").default);
router.post("/order-ship", require("./order_ship").default);
router.put("/:order_id/order-ship", load_model(Order), require("./order_ship_by_id").default);
router.post("/order-complete", require("./order_complete").default);
router.use("/:order_id/payment", load_model(Order), require("./payment").default);
router.post("/:order_id/force-status", load_model(Order), require("./force_status").default);
export default router;
