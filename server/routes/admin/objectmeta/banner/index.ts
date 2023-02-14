import { cruder, load_model } from "@kidztime/middlewares";
import { ObjectMeta } from "@kidztime/models";
import { Router } from "express";

const router = Router();

router.get("/list", require("./list").default);
router.post("/create", require("./create").default);
router.post("/:objectmeta_id/update", load_model(ObjectMeta), require("./update").default);
router.delete("/:objectmeta_id/delete", cruder.destroy(ObjectMeta));

export default router;
