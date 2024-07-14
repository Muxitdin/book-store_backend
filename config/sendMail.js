import checkTranfporterWork from "./checkTransporterWork.js";
import mailOptions from "./mailOptions.js";
import transporter from "./transporter.js";
import { v4 as uuidv4 } from 'uuid';
import Verification from '../models/verificationModel.js'
import bcrypt from 'bcrypt'

export default async function ({ _id, email }) {
    checkTranfporterWork();

    const userId = _id;
    // todo: Backend link aniqlash
    const serverLink = process.env.SERVER_LINK;
    // todo: Unique Id aniqlash
    const uniqueId = uuidv4() + userId;
    const hashedUniqueId = await bcrypt.hash(uniqueId, 15);
    // todo: Ular yordamida foydalanuvchiga jo'natiladigan linkni hosil qilish
    const link = `${serverLink}/api/auth/verify/${userId}/${uniqueId}`

    // todo: Ma'lumotlar omborida yangi verification modelini hosil qilish
    const newVerificationData = new Verification({
        userId,
        uniqueId: hashedUniqueId,
        expiresIn: Date.now() + 18000000,
    });
    await newVerificationData.save();

    transporter.sendMail(mailOptions(email, link), function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};