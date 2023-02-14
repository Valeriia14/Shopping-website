import { cruder } from "@kidztime/middlewares";
import { Router } from "express";
import { Privilege } from "@kidztime/models";

const router = Router();

router.get("/list", cruder.list(Privilege));

export default router;