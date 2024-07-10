import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
    userId: String,
    uniqueId: String,
    createdAt: Date,
    expiresIn: Date,
});

export default mongoose.model("verification", verificationSchema);