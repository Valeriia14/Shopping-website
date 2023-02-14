
import { load_model, parse_query } from "@kidztime/middlewares";
import { Product } from "@kidztime/models";
import { SvOrder } from "@kidztime/services";
import { Router } from "express";


const router = Router();

router.post("/:product_id/add", require("./add").default);
router.get("/:session_ids/list", require("./list").default);
router.delete("/:cart_item_id/delete", require("./delete").default);

export default router;
