import { Router } from "express";

const router = Router();

router.post("/refund", require("./refund").default);

export default router;
