import { add_crudscope } from "@kidztime/middlewares";
import { SvAuthenticate } from "@kidztime/services";
import { Router } from "express";

const router = Router();
router.use(add_crudscope("public"));

router.use(SvAuthenticate.public_authenticate());
router.post("/init", require("./init").default);
router.use("/banner", require("./banner").default);
router.use("/order", require("./order").default);
router.use("/cart", require("./cart").default);
router.use("/password", require("./password").default);
router.use("/product", require("./product").default);
router.use("/session", require("./session").default);
router.use("/verify", require("./verify").default);
router.use("/objectmeta", require("./objectmeta").default);
router.use("/payment", require("./payment").default);
router.use("/profile", require("./profile").default);
router.use("/contact", require("./contact").default);
router.use("/review", require("./review").default);
router.use("/question_answer", require("./question_answer").default);
router.use("/shopee", require("./shopee").default);
router.use("/category", require("./category").default);
router.use("/character", require("./character").default);
router.use("/product_type", require("./product_type").default);
router.use("/voucher", require("./voucher").default);
router.use("/reward_point", require("./reward_point").default);
export default router;
