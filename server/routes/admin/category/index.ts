import { Router } from "express";
import { cruder, load_model, parse_query } from "@kidztime/middlewares";
import { Category, Webpage } from "@kidztime/models";
import { SvMedia } from "@kidztime/services";

const router = Router();

router.get("/list", cruder.list(Category));

router.use("/category", require("./category").default);
router.use("/product_type", require("./product_type").default);
router.use("/category_link", require("./category_link").default);

router.post("/:category_id/metadata", load_model(Category), require("./metadata").default);
router.post("/:category_id/icon", load_model(Category), SvMedia.s3_mw_assoc(Category, Category.TYPE.category, { overwrite: true }));

router.put("/:category_id/update", load_model(Category), require("./update").default);
router.post("/set_links",require("./set_links").default);
router.delete("/unlink",require("./unlinks").default);
router.put("/:category_id/save", load_model(Category), require("./save").default);
router.delete("/:category_id/delete", load_model(Category), require("./delete").default);
router.get("/:category_id/detail", parse_query() , require("./detail").default);
router.get("/:category_id/search_qa", parse_query() , require("./search_qa").default);
router.get("/:category_id/list_qa", parse_query() , require("./list_qa").default);
router.get("/filter", parse_query(), require("./filter").default);
router.post("/", require("./create").default);
export default router;