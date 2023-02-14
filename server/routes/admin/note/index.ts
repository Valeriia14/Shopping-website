import { load_model } from "@kidztime/middlewares";
import { Router } from "express";
import { SvMedia } from "@kidztime/services";

const router = Router();

router.post("/create", require('./create_note').default);
router.post("/:order_id/update", require('./update_note').default);

export default router;
