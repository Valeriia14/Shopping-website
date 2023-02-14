import { Router } from "express";


const router = Router();

router.post("/update", require("./update").default);

export default router;
