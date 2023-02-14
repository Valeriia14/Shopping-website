import { cruder, load_child_model } from "@kidztime/middlewares";
import { Router } from "express";
import { Inventory, InventoryItem } from "@kidztime/models";

const router = Router();

router.get("/list", cruder.list(InventoryItem, Inventory));
router.post("/create", require("./create").default);
router.post("/:inventory_item_id/update", load_child_model(InventoryItem, Inventory), require("./update").default);
router.delete("/:inventory_item_id/delete", load_child_model(InventoryItem, Inventory), require("./delete").default);

export default router;
