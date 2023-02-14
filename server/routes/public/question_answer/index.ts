import { load_model, parse_query } from "@kidztime/middlewares";
import { Router } from "express";

import { QuestionAnswer } from "@kidztime/models/ugc";

const router = Router();

router.get("/:question_answer_id/detail", load_model(QuestionAnswer), require("./detail").default);
router.post("/", parse_query(), require("./create").default);

export default router;