import { add_crudscope } from "@kidztime/middlewares";
import { Router } from "express";
import { SvAuthenticate } from "@kidztime/services";

const router = Router();
router.use(add_crudscope("admin"));

router.use(SvAuthenticate.authenticate());
router.use(SvAuthenticate.update_last_seen());

router.use("/account", require("./account").default);
router.use("/asset", require("./asset").default);
router.use("/category", require("./category").default);
router.use("/character", require("./character").default);
router.use("/product_type", require("./product_type").default);
router.use("/order", require("./order").default);
router.use("/privilege", require("./privilege").default);
router.use("/product", require("./product").default);
router.use("/inventory", require("./inventory").default);
router.use("/frontend", require("./frontend").default);
router.use("/webpage", require("./webpage").default);
router.use("/objectmeta", require("./objectmeta").default);
router.use("/group", require("./group").default);
router.use("/review", require("./review").default);
router.use("/question_answer", require("./question_answer").default);
router.use("/note", require("./note").default);
router.use("/shopee", require("./shopee").default);
export default router;
