import { cruder, load_model, parse_query } from "@kidztime/middlewares";
import { ProductType } from "@kidztime/models";
import { Router } from "express"

const router = Router();

router.get("/list", cruder.list(ProductType));
router.get("/:producttype_id/detail", parse_query() , require("./detail").default);
router.post("/create", require("./create").default);
router.delete("/unlink",require("./unlinks").default);
router.put("/:product_type_id/save", load_model(ProductType), require("./save").default);
router.delete("/:product_type_id/delete", load_model(ProductType), require("./delete").default);
router.put("/:product_type_id/update", load_model(ProductType), require("./update").default);
router.get("/:product_type_id/list_qa", parse_query() , require("./list_qa").default);

export default router;
