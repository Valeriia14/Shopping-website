import { load_model } from "@kidztime/middlewares";
import { Category } from "@kidztime/models";
import { Router } from "express"

const router = Router();

router.post("/create", require("./create").default);
router.post("/:category_id/update", load_model(Category), require("./update").default);

router.use("/:category_id/product", load_model(Category), require("./product").default);

export default router;
