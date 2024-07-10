import transporter from "./transporter.js";

export default function () {
    transporter.verify((error, success) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log("Xabar jo'natishga tayyor!");
            console.log(success);
        }
    });
};