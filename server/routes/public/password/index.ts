import { load_model } from "@kidztime/middlewares";
import { Account, Credential } from "@kidztime/models";
import { Router } from "express";

const router = Router();

router.post("/request", require("./request").default);
router.get("/query", require("./query").default);
router.post("/reset", require("./reset").default);
router.post("/:account_id/change_password", load_model(Account), require("./change_password").default);

export default router;