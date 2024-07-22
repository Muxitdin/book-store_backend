import checkTranfporterWork from "./checkTransporterWork.js";
import mailOptions from "./mailOptions.js";
import transporter from "./transporter.js";
import { v4 as uuidv4 } from 'uuid';
import Verification from '../models/verificationModel.js'
import bcrypt from 'bcrypt'

export default async function ({ _id, email }) {
    checkTranfporterWork();

    const userId = _id;
    const serverLink = process.env.SERVER_LINK;
    const uniqueId = uuidv4() + userId;
    const hashedUniqueId = await bcrypt.hash(uniqueId, 15);
    const link = `http://localhost:5173/update-password/${userId}/${uniqueId}`

    const newVerificationData = new Verification({
        userId,
        uniqueId: hashedUniqueId,
        expiresIn: Date.now() + 18000000,
    });
    await newVerificationData.save();

    const mailTitle = 'Setting new password';
    const mailText = `<p>
            In order to set a new password, click to the link provided below: <br />
            <a href=${link}>${link}</a> <br />
            expires in <b>5 hours</b>
        </p>`

    transporter.sendMail(mailOptions(email, mailTitle, mailText), function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};