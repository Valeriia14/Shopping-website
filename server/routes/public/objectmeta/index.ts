import { ObjectMeta } from "@kidztime/models"
import { Router } from "express"
// import { cruder, parse_query } from '@kidztime/middlewares'
import list from "./list"

const router = Router()

router.get("/settings_page", list)

export default router
