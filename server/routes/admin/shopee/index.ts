import { parse_query } from "@kidztime/middlewares";
import { Router } from "express"

const router = Router();

router.post("/create", parse_query(), require("./create").default);
router.post("/assign_code", require("./assign_code").default);
export default router;
