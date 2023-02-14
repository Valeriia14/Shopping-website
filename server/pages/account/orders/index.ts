import { Paths } from "@kidztime/constants";
import { load_model, render_page } from "@kidztime/middlewares";
import { Order } from "@kidztime/models";
import { Router } from "express";

const router = Router();

router.get("/:order_id/summary", load_model(Order), require("./summary").default);
router.get("/", render_page(Paths.Views.Account_Orders));

export default router;
