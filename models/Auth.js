import mongoose from "mongoose";

const Auth = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: Boolean, default: false },
        basket: 
        [
            {
                book: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Books"
                },
                count: {
                    type: Number,
                    default: 1
                }
            },
        ],
        orders: [
            {
                products: [{type: mongoose.Schema.Types.ObjectId, ref: "Books"}],
                total: Number,
                address: Object,
                status: String,
                createdAt: {type: Date, default: Date.now()}
            }
        ],
        verified: { type: Boolean, default: false },
    },
    {
        timestamps: true
    }
)

export default mongoose.model("Auth", Auth); // Auth is the name of the collection in the database