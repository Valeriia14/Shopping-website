import { Router } from "express"

const router = Router();

router.post("/update",require("./set_product").default);
router.get("/list",require("./get_products").default);

export default router;
