import { json, Router } from "express";

const router = Router();

router.post("/update", json(), require("./update").default);

export default router;
