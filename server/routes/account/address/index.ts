import { load_model } from "@kidztime/middlewares";
import { Address } from "@kidztime/models";
import { Router } from "express";

const router = Router();

router.post("/create", require("./create").default);
router.get("/list", require("./list").default);
router.delete("/:address_id/delete", load_model(Address) , require("./delete").default);
router.put("/:address_id/update", load_model(Address) , require("./update").default);

export default router;
