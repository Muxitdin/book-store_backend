import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export default nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

// const sendEmail = async (email, subject, text) => {
//     try {
//         const transporter = nodemailer.createTransport({
//             host: process.env.HOST,
//             service: process.env.SERVICE,
//             port: 587,
//             secure: true,
//             auth: {
//                 user: process.env.USER,
//                 pass: process.env.PASS,
//             },
//         });

//         await transporter.sendMail({
//             from: process.env.USER,
//             to: email,
//             subject: subject,
//             text: text
//         });

//         console.log("email sent sucessfully");
//     } catch (error) {
//         console.log(error, "email not sent");
//     }
// };

// module.exports = sendEmail;