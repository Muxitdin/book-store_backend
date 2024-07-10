import bcrypt from "bcrypt";
import Auth from "../models/Auth.js"
import generateAccessToken from "../services/Token.js";
import SendMail from "../config/sendMail.js"

export const getAllUsers = async (req, res) => {
    try {
        const users = await Auth.find();
        res.status(200).json(users);
    } catch (error) {
        console.log(error)
    }
}

export const createNewUser = async (req, res) => {
    const { fullName, email, password, role } = req.body;
    try {
        if (fullName && email && password && role) {
            const HashedPassword = await bcrypt.hash(password, 10);
            const newUser = { fullName, email, password: HashedPassword, role, verified: false };
            const user = await Auth.create(newUser);
            console.log(user)
            const token = generateAccessToken(user._id);
            SendMail(user);
            res.status(201).json({ token, user })
        }
    } catch (error) {
        console.log(error)
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return console.log("email yoki password yo'q");
    }
    const existedUser = await Auth.findOne({ email });
    if (!existedUser) {
        return console.log("Bunday foydalanuvchi mavjud emas")
    }
    const isPassEqual = await bcrypt.compare(password, existedUser.password);
    if (!isPassEqual) {
        return console.log("Parol noto'g'ri")
    }
    const token = generateAccessToken(existedUser._id);
    // res.cookie("token", token, { httpOnly: true, secure: true });
    res.status(201).json({ existedUser, token })
}


export const getAuth = async (req, res) => {
    try {
        const foundAuth = await Auth.findById(req.authId)
            .populate({
                path: "basket.book",
                model: "Books",
                // select: "-_id -__v",
                populate: {
                    path: "author",
                    model: "Auth",
                    select: "-basket -password -_id -__v"
                }
            });
        if (!foundAuth) return res.status(404).json("Foydalanuvchi topilmadi");

        res.status(200).json({ data: foundAuth });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};
