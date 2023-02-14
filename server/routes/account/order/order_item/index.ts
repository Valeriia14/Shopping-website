import { load_model, parse_query } from "@kidztime/middlewares";
import { Router } from "express";
import { OrderItem } from "@kidztime/models";

const router = Router();

router.get("/list", parse_query(), require("./list").default);
router.post("/create", require("./create").default);
router.delete("/:order_item_id/delete", load_model(OrderItem), require("./delete").default);
router.post("/:order_item_id/update", load_model(OrderItem), require("./update").default);

export default router;
