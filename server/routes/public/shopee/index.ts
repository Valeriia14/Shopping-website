import { parse_query } from "@kidztime/middlewares";
import { Router } from "express"

const router = Router();

router.get("/manual-trigger",parse_query(), require("./manual_trigger").default);
export default router;
