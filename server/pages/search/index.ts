import { load_handle } from "@kidztime/middlewares";
import { Category } from "@kidztime/models";
import { Router } from "express";

const router = Router();

router.get("/", require("./main").default);

export default router;
