import Books from "../models/Book.js";

export const getBooksByFilter = async (req, res) => {
    const filter = req.query;
    try {
        const books = await Books.find(filter).populate("author")
        res.status(200).json(books);
        console.log(`filtered : ${books}`)
    } catch (error) {
        console.log(error);
    }
}