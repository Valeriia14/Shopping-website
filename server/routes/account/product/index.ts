import { cruder } from "@kidztime/middlewares";
import { Router } from "express";
import { Product } from "@kidztime/models/product";

const router = Router();

router.get("/list", cruder.list(Product));
router.get("/:product_id/detail", cruder.detail(Product));

export default router;