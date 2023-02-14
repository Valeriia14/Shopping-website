import { cruder, load_child_model, load_model, parse_query } from "@kidztime/middlewares";
import { Router } from "express";
import { Product } from "@kidztime/models/product";
import { SvMedia } from "@kidztime/services";
import { Asset } from "@kidztime/models";

const router = Router();

router.get("/list", parse_query(), require("./list").default);
router.get("/:product_id/detail", load_model(Product), require("./detail").default);
router.post("/create", require("./create").default);
router.post("/:product_id/update", load_model(Product), require("./update").default);
router.delete("/:product_id/delete", cruder.destroy(Product))

router.use("/:product_id/classification", load_model(Product), require("./classification").default)
router.post("/:product_id/metadata", load_model(Product), require("./metadata").default);

router.post("/:product_id/images/preview", load_model(Product), SvMedia.s3_mw_assoc(Product, Product.AssetPreviewImage, { overwrite: true }));
router.post("/:product_id/images/gallery/create", load_model(Product), SvMedia.s3_mw_assoc(Product, Product.AssetGalleryImages));
router.delete("/:product_id/images/gallery/:asset_id/delete", load_model(Product), load_child_model(Asset, Product, { foreign_key: "owner_id" }), cruder.destroy(Asset));

router.use("/:product_id/group", load_model(Product), require("./group").default);

export default router;
