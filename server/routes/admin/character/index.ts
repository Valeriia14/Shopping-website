import { cruder, load_model, parse_query } from "@kidztime/middlewares";
import { Character } from "@kidztime/models";
import { SvMedia } from "@kidztime/services";
import { Router } from "express"

const router = Router();

router.get("/list", cruder.list(Character));
router.get("/:character_id/detail", parse_query() , require("./detail").default);
router.post("/:character_id/icon", load_model(Character), SvMedia.s3_mw_assoc(Character, Character.TYPE, { overwrite: true }));
router.delete("/:character_id/delete", load_model(Character), require("./delete").default);
router.post("/create", require("./create").default);
router.put("/:character_id/save", load_model(Character), require("./save").default);
router.put("/:character_id/update", load_model(Character), require("./update").default);

export default router;
