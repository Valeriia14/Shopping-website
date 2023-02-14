import { cruder, load_model } from "@kidztime/middlewares";
import { Group } from "@kidztime/models";
import { Router } from "express"

const router = Router();

router.get("/list", cruder.list(Group));
router.get("/:group_id/detail", cruder.detail(Group));
router.post("/create", require("./create").default);
router.put("/:group_id/update", load_model(Group), require("./update").default);
router.delete("/:group_id/delete", load_model(Group), require("./delete").default);
router.use("/:group_id/product", load_model(Group), require("./product").default);

export default router;
