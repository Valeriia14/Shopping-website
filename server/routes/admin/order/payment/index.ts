import { Router } from "express";
import { SvAuthenticate } from "@kidztime/services";

const router = Router();
router.use(SvAuthenticate.actor_auth());

router.post("/refund_items", require("./refund_order_items").default);
router.post("/cancel", require("./cancel_order").default);
router.post("/exchange_items", require("./exchange_items").default);
export default router;