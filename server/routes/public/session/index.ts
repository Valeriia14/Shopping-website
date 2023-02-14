import { Router } from "express";

const router = Router();

router.post("/login", require("./login").default);
router.post("/register", require("./register").default);
router.post("/login-social", require("./login_social").default);

export default router;