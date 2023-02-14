import { load_handle } from "@kidztime/middlewares";
import { Character } from "@kidztime/models";
import { Router } from "express";

const router = Router();

router.use("/:handle", load_handle(Character), require("./main").default);

export default router;
