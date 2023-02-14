import { load_model } from "@kidztime/middlewares";
import { BillingAddress } from "@kidztime/models";
import { Router } from "express";

const router = Router();

router.post("/create", require("./create").default);
router.get("/list", require("./list").default);
router.delete("/:billing_address_id/delete", load_model(BillingAddress) , require("./delete").default);
router.put("/:billing_address_id/update", load_model(BillingAddress) , require("./update").default);

export default router;
