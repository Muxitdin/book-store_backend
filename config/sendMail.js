import checkTranfporterWork from "./checkTransporterWork.js";
import mailOptions from "./mailOptions.js";
import transporter from "./transporter.js";

export default function ({ _id, email }) {
    checkTranfporterWork();

    transporter.sendMail(mailOptions(email), function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};