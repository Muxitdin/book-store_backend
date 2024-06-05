import mongoose from "mongoose"

const Categories = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
})

export default mongoose.model("Categories", Categories);