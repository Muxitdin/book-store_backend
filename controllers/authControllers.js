import bcrypt from "bcrypt"
import Auth from "../models/Auth.js"
import Verification from "../models/verificationModel.js"
import generateAccessToken from "../services/Token.js"
import validatePassword from "../services/validatePassword.js"
import SendMail from "../config/sendMail.js"
import SendMailForPass from "../config/sendMailForPass.js"
import dotenv from 'dotenv'
dotenv.config()
import Stripe from "stripe"
import validateEmail from "../services/validateEmail.js"
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


export const getAllUsers = async (req, res) => {
    try {
        const users = await Auth.find()
        console.log(users)
        res.status(200).json(users)
    } catch (error) {
        console.log(error)
    }
}

export const createNewUser = async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        if (fullName && email && password) {
            const { error: invalidEmail } = validateEmail(email)
            if (invalidEmail) return res.status(400).json({ message: invalidEmail.details[0].message })

            const { error: invalidPassword } = validatePassword(password)
            if (invalidPassword) return res.status(400).json({ message: invalidPassword.details[0].message })
            console.log(invalidEmail, invalidPassword)

            const HashedPassword = await bcrypt.hash(password, 10)

            const existedUser = await Auth.findOne({ email })
            if (existedUser) return res.status(400).json({ message: "User with this email already exists" })
                
            const newUser = { fullName, email, password: HashedPassword, verified: false }
            const user = await Auth.create(newUser)
            console.log(user)

            // todo: Ro'yhatdan o'tgan foydalanuvchi uchun email xabar jo'natish funksiyasi
            SendMail(user)
            // res.status(201).json({ token, user })
            res.status(200).json({ message: "check your email for a verification link" })
        }
    } catch (error) {
        console.log(error)
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "Email or password is missing" })
        }
        const existedUser = await Auth.findOne({ email })
        if (!existedUser) {
            return res.status(400).json({ message: "No user found with this email" })
        }

        if (!existedUser.verified) return res.status(400).send("User hasn't passed verification!")

        const isPassEqual = await bcrypt.compare(password, existedUser.password)
        if (!isPassEqual) {
            return res.status(400).json({ message: "Password is incorrect" })
        }
        const token = generateAccessToken(existedUser._id)
        // res.cookie("token", token, { httpOnly: true, secure: true });
        res.status(201).json({ data: existedUser, token, message: `Welcome back, ${existedUser.fullName}!` })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}


export const getAuth = async (req, res) => {
    try {
        const foundAuth = await Auth.findById(req.authId)
            .populate([
                {
                    path: "basket.book",
                    model: "Books",
                    populate: {
                        path: "author",
                        model: "Auth",
                        select: "-basket -password -__v"
                    }
                },
                {
                    path: "orders.products",
                    model: "Books",
                    populate: [
                        { path: "author", model: "Auth", select: "-basket -password -_id -__v -orders   " },
                    ]
                },
            ])
        if (!foundAuth) return res.status(404).json("Foydalanuvchi topilmadi")

        res.status(200).json({ data: foundAuth })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}


export const verificateUser = async (req, res) => {
    try {
        const { userId, uniqueId } = req.params
        // todo: Eng avval verification modelidan kelgan so'rov bo'yicha ma'lumot bor yoki yo'qligini tekshirib olish zarur
        const existingVerification = await Verification.findOne({ userId })
        // todo: Agar yo'q bo'lsa mos ravishda html sahifani qaytarish
        if (!existingVerification) return res.render('e rror', { message: "Sorry, your verification is not found or already verified!" })
        // todo: Agar bor bo'lsa verifikatsiyani muddatini tekshirish
        if (existingVerification.expiresIn < Date.now()) {
            // todo: Agar muddati o'tgan bo'lsa mos ravishda html sahifani qaytarish va verification model ma'lumoti hamda foydalanuvchi ma'lumotlarini database dan o'chirib yuborish
            await Verification.deleteOne({ userId })
            await Auth.findByIdAndDelete(userId)
            res.render('error', { message: "Sorry, your verification time has expired. Please try again or register again!" })
        }
        else {
            // todo: Aks holda uniqueId yordamida ma'lumotni asl ekanligi tekshiriladi, agar xatolik bo'lsa mos ravishda html sahifa qaytariladi
            const isValid = await bcrypt.compare(uniqueId, existingVerification.uniqueId)
            if (!isValid) return res.render('error', { message: "Your verification data is invalid, please check again!" })
            // todo: Agar shu yergacham yetib kelsa u holda foydalanuvchi ma'lumotlari o'zgartiriladi qaysiki verified: false => verified: true
            await Auth.findByIdAndUpdate(userId, { verified: true })
            // todo: So'ng verification model ma'lumotlari o'chirilib yuboriladi
            await Verification.deleteMany({ userId })
            res.render('verified', { message: "Your account has been verified successfully!" })
        }
    } catch (error) {
        console.log(error.message)
        res.render('error', { message: error.message })
    }
}

export const sendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.query
        console.log(email)
        const existedUser = await Auth.findOne({ email })
        if (!existedUser) return res.status(404).json("Foydalanuvchi topilmadi")
        SendMail(existedUser)
        res.status(200).json("Email has been sent")
    } catch (error) {

    }
}

export const editUserData = async (req, res) => {
    try {
        const { id } = req.params
        console.log(id)
        const { type, value } = req.body
        console.log(req.body)

        const existedUser = await Auth.findById(id)
        if (!existedUser) return res.status(404).json("Foydalanuvchi topilmadi")

        // const equalPassword = await bcrypt.compare(password, existedUser.password);
        // if (!equalPassword) return res.status(403).json("Parol xato");


        const updatedAuth = await Auth.findByIdAndUpdate(id, { [type]: value }, { new: true })
        if (type === "email") {
            updatedAuth.verified = false
        }
        console.log(updatedAuth)
        updatedAuth.save()
        res.status(200).json({ data: updatedAuth, message: "Ma'lumotlar muvaffaqiyatli yangilandi" })
    } catch (error) {
        console.log(error)
    }
}

export const findUserByEmail = async (req, res) => {
    try {
        const { email } = req.body
        console.log(email)
        const foundAuth = await Auth.findOne({ email })
        if (!foundAuth) return res.status(404).json({ message: "No User Found" })
        SendMailForPass(foundAuth)
        res.status(200).json({ message: "Email has been sent" })
    } catch (error) {
        console.log(error.message)
        res.render("error", { message: error.message })
    }
}

export const updatePassword = async (req, res) => {
    try {
        const { userId, uniqueId } = req.params
        console.log("🚀 ~ updatePassword ~ uniqueId:", uniqueId)
        console.log("🚀 ~ updatePassword ~ req.params:", req.params)
        const { newPassword, confirmPassword } = req.body
        const existingVerification = await Verification.findOne({ userId })
        if (!existingVerification) return res.status(400).json({ message: "There was a problem resetting your password or the link is invalid." })
        if (existingVerification.expiresIn < Date.now()) {
            await Verification.deleteOne({ userId })
            res.status(400).json({ message: "Sorry, your request has expired. Please try again or request a new one." })
        }
        else {
            const hashedUniqueId = await bcrypt.hash(uniqueId, 15)
            if (!hashedUniqueId === existingVerification.uniqueId) return res.status(400).json({ message: "The link is invalid, please check again!" })
            const foundAuth = await Auth.findById(userId)
            if (!foundAuth) return res.status(404).json({ message: "No user found" })
            const isMatch = newPassword === confirmPassword
            if (!isMatch) return res.status(400).json({ message: "Passwords do not match" })
            const hashedPassword = await bcrypt.hash(newPassword, 10)
            foundAuth.password = hashedPassword
            await Promise.all([
                foundAuth.save(),
                Verification.deleteMany({ userId })
            ])
            res.status(200).json({ message: "Password has been successfully updated" })
        }
    } catch (error) {
        console.log(error.message)
        res.render('error', { message: error.message })
    }
}

export const payment = async (req, res) => {
    try {
        const { totalAmount, currency, source, products } = req.body
        const charges = await stripe.charges.create({
            amount: totalAmount * 100,
            currency,
            source
        })
        const foundAuth = await Auth.findById(req.authId)
        if (!foundAuth) return res.status(404).json({ message: "No user found" })
        foundAuth.orders.push({
            products,
            total: totalAmount,
            address: charges.billing_details.address,
            status: "pending"
        })
        foundAuth.basket = []
        await foundAuth.save()
        res.status(200).json({ data: foundAuth, message: "order accepted" })
    } catch (error) {
        console.log(error.message)
        res.render('error', { message: error.message })
    }
}