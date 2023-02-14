import { Router } from "express";

const router = Router();

router.get("/:ref/detail", require("./detail").default);

export default router;
