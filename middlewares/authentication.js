import jwt from "jsonwebtoken";

const authentication = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) return res.status(401).send("Token mavjud emas!");

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.authId = decoded?.userId;
        // console.log("middleware token :", token)
        // console.log(decoded)
        // console.log(req.authId)
        next();
    } catch (error) {
        res.status(403).send("Yaroqsiz token!");
    }
}

export default authentication;