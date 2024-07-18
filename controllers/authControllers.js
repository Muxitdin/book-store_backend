import bcrypt from "bcrypt";
import Auth from "../models/Auth.js"
import Verification from "../models/verificationModel.js";
import generateAccessToken from "../services/Token.js";
import SendMail from "../config/sendMail.js"
export const getAllUsers = async (req, res) => {
    try {
        const users = await Auth.find();
        console.log(users)
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
            // const token = generateAccessToken(user._id);
            // todo: Ro'yhatdan o'tgan foydalanuvchi uchun email xabar jo'natish funksiyasi
            SendMail(user);
            // res.status(201).json({ token, user })
            res.status(200).json({ message: "Xabar muvaffaqiyatli jo'natildi" });
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

    if (!existedUser.verified) return res.status(400).send("user didn't pass the verification proccess!");

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


export const verificateUser = async (req, res) => {
    try {
        const { userId, uniqueId } = req.params;
        // todo: Eng avval verification modelidan kelgan so'rov bo'yicha ma'lumot bor yoki yo'qligini tekshirib olish zarur
        const existingVerification = await Verification.findOne({ userId });
        // todo: Agar yo'q bo'lsa mos ravishda html sahifani qaytarish
        if (!existingVerification) return res.render('error', { message: "Verifikatsiyadan o'tishda xatolik yoki allaqachon verifikatsiya qilib bo'lindi" });
        // todo: Agar bor bo'lsa verifikatsiyani muddatini tekshirish
        if (existingVerification.expiresIn < Date.now()) {
            // todo: Agar muddati o'tgan bo'lsa mos ravishda html sahifani qaytarish va verification model ma'lumoti hamda foydalanuvchi ma'lumotlarini database dan o'chirib yuborish
            await Verification.deleteOne({ userId });
            await Auth.findByIdAndDelete(userId);
            res.render('error', { message: "Afsuski amal qilish muddati tugadi, oldinroq kirish kerak edi. Yoki boshqatdan ro'yhatdan o'ting!" });
        }
        else {
            // todo: Aks holda uniqueId yordamida ma'lumotni asl ekanligi tekshiriladi, agar xatolik bo'lsa mos ravishda html sahifa qaytariladi
            const isValid = await bcrypt.compare(uniqueId, existingVerification.uniqueId);
            if (!isValid) return res.render('error', { message: "Verifikatsiya ma'lumotlari yaroqsiz, iltimos qayta tekshirib ko'ring!" });
            // todo: Agar shu yergacham yetib kelsa u holda foydalanuvchi ma'lumotlari o'zgartiriladi qaysiki verified: false => verified: true
            await Auth.findByIdAndUpdate(userId, { verified: true });
            // todo: So'ng verification model ma'lumotlari o'chirilib yuboriladi
            await Verification.deleteMany({ userId });
            res.render('verified', { message: "Verifikatsiya muvaffaqiyatli tugallandi, sahifani yopib, hisobingizga kiring" });
        }
    } catch (error) {
        console.log(error.message);
        res.render('error', { message: error.message });
    }
};

export const editUserData = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)
        const { type, value } = req.body;
        console.log(req.body);

        const existedUser = await Auth.findById(id);
        if (!existedUser) return res.status(404).json("Foydalanuvchi topilmadi");

        // const equalPassword = await bcrypt.compare(password, existedUser.password);
        // if (!equalPassword) return res.status(403).json("Parol xato");


        const updatedAuth = await Auth.findByIdAndUpdate(id, { [type]: value}, { new: true });
        console.log(updatedAuth);
        updatedAuth.save();
        res.status(200).json({ data: updatedAuth, message: "Ma'lumotlar muvaffaqiyatli yangilandi" });
    } catch (error) {
        console.log(error)
    }
}