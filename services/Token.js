import jwt from 'jsonwebtoken';

export default function (userId) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: '30d' });
    return token
}