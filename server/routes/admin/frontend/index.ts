import { Router } from "express";

const router = Router();

router.use("/webpage", require("./webpage").default);

export default router;
