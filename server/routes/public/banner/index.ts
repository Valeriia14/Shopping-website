import { Router } from "express";

const router = Router();

router.get("/list", require("./list").default);

export default router;
