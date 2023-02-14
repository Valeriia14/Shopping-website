import { cruder, load_model, parse_query } from "@kidztime/middlewares";
import { Category } from "@kidztime/models";
import { Router } from "express"

const router = Router();

router.get("", parse_query(), require("./search").default);
router.post("/create", require("./create").default);
router.post("/:category_id/update", load_model(Category), require("./update").default);

export default router;
