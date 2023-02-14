import { cruder, parse_query } from "@kidztime/middlewares";
import { Category, Webpage } from "@kidztime/models";
import { Router } from "express"

const router = Router();

router.get("/product_list/:character_id", parse_query(), require("./product_list").default);

export default router;
