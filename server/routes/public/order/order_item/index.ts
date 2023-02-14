import { load_model } from "@kidztime/middlewares";
import { Router } from "express";
import {  OrderItem } from "@kidztime/models";

const router = Router();

router.delete("/:order_item_id/delete", load_model(OrderItem), require("./delete").default);

export default router;
