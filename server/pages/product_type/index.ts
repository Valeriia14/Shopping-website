import { load_handle } from "@kidztime/middlewares";
import { ProductType } from "@kidztime/models";
import { Router } from "express";

const router = Router();

router.use("/:handle", load_handle(ProductType), require("./main").default);

export default router;
