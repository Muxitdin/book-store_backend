import mongoose from "mongoose";

const Auth = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, default: "user" },
    },
    {
        timestamps: true
    }
)

export default mongoose.model("Auth", Auth); // Auth is the name of the collection in the database