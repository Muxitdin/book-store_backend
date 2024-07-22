import express from "express"
import { getAllUsers, getAuth, createNewUser, loginUser, verificateUser, editUserData, sendVerificationEmail, findUserByEmail, updatePassword} from "../controllers/authControllers.js"
import authentication from "../middlewares/authentication.js"

const router = express.Router()

router.get("/", authentication, getAuth )

router.get("/allusers", getAllUsers )

router.post("/register", createNewUser )

router.post("/login", loginUser )

router.get("/verify/:userId/:uniqueId", verificateUser)

router.get("/user-verify", sendVerificationEmail)

router.put("/edit/:id", editUserData);

router.post("/find-user-by-email", findUserByEmail);

router.put("/update-password/:userId/:uniqueId", updatePassword);

export default router;