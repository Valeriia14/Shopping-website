import { load_handle } from "@kidztime/middlewares";
import { Product } from "@kidztime/models";
import { Router } from "express";

const router = Router();

router.get("/", require("./main").default);
router.get("/:handle", load_handle(Product), require("./detail").default);

export default router;
