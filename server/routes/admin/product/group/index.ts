import { json, Router } from "express";

const router = Router();

router.post("/set", json(), require("./set_groups_to_product").default);
router.get("/list", json(), require("./get_groups_of_product").default);

export default router;
