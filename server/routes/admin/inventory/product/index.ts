import { load_model } from "@kidztime/middlewares";
import { Product } from "@kidztime/models";
import { Router } from "express";

const router = Router();

router.post("/:product_id/update", load_model(Product), require("./update").default);

export default router;
