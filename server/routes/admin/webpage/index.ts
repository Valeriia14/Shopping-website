import { cruder, load_model } from "@kidztime/middlewares";
import { Router } from "express";
import { Webpage } from "@kidztime/models";

const router = Router();

router.post("/create", require("./create").default);

export default router;
