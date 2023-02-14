import { Router } from "express";
import { SvPayment } from "@kidztime/services";
import { ObjectMeta } from "@kidztime/models";
import { load_model } from "@kidztime/middlewares";

const router = Router();

router.get("/list", SvPayment.load_stripe_profile(), require("./list").default);
router.post("/create", SvPayment.load_stripe_profile(), require("./create").default);
router.delete("/:objectmeta_id/delete", load_model(ObjectMeta), require("./delete").default);
router.put("/:objectmeta_id/update", require("./update").default);

export default router;