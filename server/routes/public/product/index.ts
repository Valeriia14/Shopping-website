import { cruder, load_model, parse_query } from "@kidztime/middlewares";
import { Router } from "express";
import { Product } from "@kidztime/models/product";

const router = Router();

// router.get("/list", cruder.list(Product));
router.get("/list", parse_query(), require("./list").default);
router.get("/:product_id/detail", load_model(Product), require("./detail").default);
router.get("/:product_handle/", require("./handle").default);

export default router;