import { load_model } from "@kidztime/middlewares";
import { Router } from "express";
import { SvMedia } from "@kidztime/services";

const router = Router();

router.post("/create", SvMedia.s3_mw_assoc());

export default router;
