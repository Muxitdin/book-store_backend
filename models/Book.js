import mongoose from 'mongoose';

const Books = mongoose.Schema({
    name: { type: String, required: true },
    year: { type: Number, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
});

export default mongoose.model('Books', Books); // 'Book' is the name of the collection in the database