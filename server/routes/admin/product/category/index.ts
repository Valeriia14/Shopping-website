import { parse_query } from "@kidztime/middlewares";
import { json, Router } from "express";

const router = Router();

router.get("/list", parse_query(), require("./list").default);
router.post("/update", json(), require("./update").default);

export default router;
