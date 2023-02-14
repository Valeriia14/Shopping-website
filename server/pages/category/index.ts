import { load_handle } from "@kidztime/middlewares";
import { Category } from "@kidztime/models";
import { Router } from "express";

const router = Router();

router.use("/:handle", load_handle(Category), require("./main").default);

export default router;
