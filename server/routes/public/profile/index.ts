import { cruder, load_model, parse_query } from "@kidztime/middlewares";
import { Router } from "express";

const router = Router();

// router.get("/", require("./detail").default);
router.put("/", require("./update").default);

export default router;