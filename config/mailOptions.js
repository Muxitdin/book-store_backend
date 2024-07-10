export default function (email) {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Book-Store Registration',
        text: 'You are successfully registered!',
    };

    return mailOptions;
};