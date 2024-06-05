import express from "express"
import { createWish } from "../controllers/wishlistControllers.js"

const router = express.Router()

router.post("/", createWish);

export default router;