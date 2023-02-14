import { parse_query } from "@kidztime/middlewares";
import { Router } from "express"

const router = Router();

router.get("/list", parse_query(), require("./list").default);

export default router;
