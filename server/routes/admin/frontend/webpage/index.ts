import { cruder, load_model } from "@kidztime/middlewares";
import { Router } from "express";
import { Webpage } from "@kidztime/models";
import { build_path } from "./middlewares";

const router = Router();

router.get("/list", cruder.list(Webpage));
router.post("/create", cruder.create(Webpage));
router.get("/:webpage_id/detail", cruder.detail(Webpage));
router.post("/:webpage_id/update", build_path(), cruder.update(Webpage));
router.delete("/:webpage_id/delete", cruder.destroy(Webpage));
router.delete("/:webpage_id/delete", load_model(Webpage), require("./delete").default);

router.post("/:webpage_id/element", load_model(Webpage), require("./element_create").default);

router.use("/element", require("./element").default);

export default router;
