import { Router } from "express";
import { load_model } from "@kidztime/middlewares";
import { Order } from "@kidztime/models";

const router = Router();

router.use("/order/:order_id/order_item", load_model(Order), require("./order").default);
router.post("/order/resolve_exchange", require("./resolve_exchange").default);
router.post("/charges", require("./create_charges").default);

export default router;