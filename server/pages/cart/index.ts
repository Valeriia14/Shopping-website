import { SvOrder } from "@kidztime/services";
import { Router } from "express";

const router = Router();
// router.use(SvOrder.load_cart(true));

router.use("/", require("./main").default);

export default router;
