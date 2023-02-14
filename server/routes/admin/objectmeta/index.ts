import { Router } from "express";

const router = Router();

router.get("/list/owner", require("./list_by_owner").default);

router.use("/page", require("./page").default);
router.use("/banner", require("./banner").default);
router.use("/settings", require("./settings").default);

export default router;
