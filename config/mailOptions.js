// export default function (email, link) {
//     const mailOptions = {
//         from: process.env.EMAIL,
//         to: email,
//         subject: 'Verify Your Account',
//         html: `<p>
//             In order to verify your auth, click to the link provided below: <br />
//             <a href=${link}>${link}</a> <br />
//             expires in <b>5 hours</b>
//         </p>`,
//     };

//     return mailOptions;
// };

export default function (email, mailTitle, mailText) {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: mailTitle,
        html: mailText
    };

    return mailOptions;
};