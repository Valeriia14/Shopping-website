import { cruder, load_model } from "@kidztime/middlewares";
import { Account } from "@kidztime/models";
import { json, Router } from "express";

const router = Router();

router.get("/list", cruder.list(Account));
router.get("/:account_id/detail", cruder.detail(Account));
router.post("/create", require("./create").default);
router.post("/:account_id/update", cruder.update(Account));
router.delete("/:account_id/delete", cruder.destroy(Account));

router.post("/:account_id/privilege", json(), load_model(Account), require("./privilege").default);
router.get("/:account_id/statistics", load_model(Account), require("./statistics").default);

export default router;
