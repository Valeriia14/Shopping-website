import { prepare_request } from "@kidztime/middlewares";
import cookie_parser from "cookie-parser";
import { Router, json } from "express";

const router = Router();
router.use(prepare_request());
router.use(cookie_parser());
router.use(json());

router.use("/public", require("./public").default);
router.use("/account", require("./account").default);
router.use("/admin", require("./admin").default);

export default router;
