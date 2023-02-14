import { load_model, parse_query } from "@kidztime/middlewares";
import { QuestionAnswer } from "@kidztime/models/ugc";
import { Router } from "express"

const router = Router();

router.get("/list", parse_query(), require("./list").default);
router.put("/:question_answer_id/update", load_model(QuestionAnswer), require("./update").default);
router.delete("/:question_answer_id/delete", load_model(QuestionAnswer), require("./delete").default);
router.delete("/batch_delete", require("./batch_delete").default);

export default router;
