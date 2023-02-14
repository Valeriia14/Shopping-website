import { cruder, load_model } from "@kidztime/middlewares";
import { Router } from "express";
import { Inventory } from "@kidztime/models/inventory";

const router = Router();

router.get("/list", cruder.list(Inventory));
router.get("/:inventory_id/detail", cruder.detail(Inventory));
router.post("/create", require("./create").default);
router.post("/:inventory_id/update", load_model(Inventory), require("./update").default);
router.delete("/:inventory_id/delete", load_model(Inventory), require("./delete").default);
router.post("/list/filter", require("./filter").default);

router.use("/:inventory_id/inventory_item", load_model(Inventory), require("./inventory_item").default);
router.use("/:inventory_id/product", load_model(Inventory), require("./product").default);


export default router;
