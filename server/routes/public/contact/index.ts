import { add_crudscope } from "@kidztime/middlewares";
import { Router } from "express";

const router = Router();

router.post("/send_contact_mail", require("./contact").default);

export default router;
