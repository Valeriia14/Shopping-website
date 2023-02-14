import { load_model, parse_query } from "@kidztime/middlewares";
import { Router } from "express";

import { Review } from "@kidztime/models/ugc";
import { SvMedia } from "@kidztime/services";

const router = Router();

router.get("/:review_id/detail", load_model(Review), require("./detail").default);
router.get("/:review_id/helpful", load_model(Review), require("./helpful").default);
router.get("/:review_id/dislike", load_model(Review), require("./dislike").default);
router.post("/:review_id/image", load_model(Review), SvMedia.s3_mw_assoc(Review, Review.AssetAssoc.Main, { overwrite: false }));
router.post("/", parse_query(), require("./create").default);

export default router;