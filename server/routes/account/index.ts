import { add_crudscope } from "@kidztime/middlewares";
import { Router } from "express";
import { SvAuthenticate } from "@kidztime/services";

const router = Router();
router.use(add_crudscope("account"));

router.use(SvAuthenticate.authenticate());
router.use(SvAuthenticate.update_last_seen());

router.get("/profile", require("./profile").default);

router.use("/order", require("./order").default);
router.use("/payment", require("./payment").default);
router.use("/product", require("./product").default);
router.use("/address", require("./address").default);
router.use("/billing_address", require("./billing_address").default);

export default router;
