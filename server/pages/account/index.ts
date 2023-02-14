import { Router } from "express";

const router = Router();

router.use("/orders", require("./orders").default);

export default router;
