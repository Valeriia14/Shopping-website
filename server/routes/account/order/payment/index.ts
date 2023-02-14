import { cruder } from "@kidztime/middlewares";
import { Router } from "express";
import { Order, Payment } from "@kidztime/models";

const router = Router();

router.get("/list", cruder.list(Payment, Order));
router.get("/:payment_id/detail", cruder.detail(Payment, Order));
router.post("/checkout", require("./checkout").default);

export default router;
