import express from "express"
import { getAuth, createNewUser, loginUser } from "../controllers/authControllers.js"
import authentication from "../middlewares/authentication.js"

const router = express.Router()

router.get("/", authentication, getAuth )

router.post("/register", createNewUser )

router.post("/login", loginUser )

export default router;