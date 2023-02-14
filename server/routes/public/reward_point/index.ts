import { Router } from "express";

const router = Router();

router.get("/available", require("./available").default);
router.get("/history", require("./history").default);

export default router;
