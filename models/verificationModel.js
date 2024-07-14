import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
    userId: String,
    uniqueId: String,
    expiresIn: Date,
});

export default mongoose.model("verification", verificationSchema);