import { load_model, parse_query } from "@kidztime/middlewares";
import { Review } from "@kidztime/models/ugc";
import { Router } from "express"

const router = Router();

router.get("/list", parse_query(), require("./search_review").default);
router.put("/:review_id/update", load_model(Review), require("./update").default);
router.delete("/batch_delete", require("./batch_delete").default);

export default router;
