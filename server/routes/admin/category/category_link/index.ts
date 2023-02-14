import { cruder } from "@kidztime/middlewares";
import { CategoryLink } from "@kidztime/models";
import { Router } from "express";

const router = Router();

router.get("/list", cruder.list(CategoryLink));
router.post("/", require("./create").default);
router.delete("/:category_link_id/delete", cruder.destroy(CategoryLink));

export default router;
