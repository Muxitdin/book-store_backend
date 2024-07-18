import express from "express"
import { getAllUsers, getAuth, createNewUser, loginUser, verificateUser, editUserData} from "../controllers/authControllers.js"
import authentication from "../middlewares/authentication.js"

const router = express.Router()

router.get("/", authentication, getAuth )

router.get("/allusers", getAllUsers )

router.post("/register", createNewUser )

router.post("/login", loginUser )

router.get("/verify/:userId/:uniqueId", verificateUser)

router.put("/edit/:id", editUserData)

export default router;