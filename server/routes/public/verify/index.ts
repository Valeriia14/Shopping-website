import { add_crudscope } from "@kidztime/middlewares";
import { Router } from "express";

const router = Router();

router.get("/email", require("./email").default);

export default router;