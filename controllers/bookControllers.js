import Joi from 'joi';
import Books from '../models/Book.js'

export const getAllBooks = async (req, res) => {
    try {
        const books = await Books
            .find()
            .populate("author", "fullName")
        res.status(200).json(books);
        // console.log(books)
    } catch (error) {
        console.log(error);
    }
}

export const CreateNewBook = async (req, res) => {
    try {
        const { name, year, author, description, price, category, image } = req.body;
        const bookData = { name, year, author, description, price, category, image };
        parseInt(bookData.year);
        parseInt(bookData.price);

        const { error } = validateFunction(bookData);
        if (error) return res.status(400).send(error.details[0].message);

        const newBook = new Books(bookData);
        console.log(newBook)
        await newBook.save();
        res.status(200).json(newBook);
    } catch (error) {
        console.log(error);
    }
}

export const UpdateBook = async (req, res) => {
    try {
        const { error } = validateFunction(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        console.log(req.params.id);
        const updatedBook = await Books.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).send(updatedBook);
    } catch (err) {
        console.log(err);
    }
}

export const DeleteBook = async (req, res) => {
    try {
        const deletedBook = await Books.findByIdAndDelete(req.params.id);
        console.log(deletedBook);
        res.status(200).json(deletedBook);
    } catch (error) {
        console.log(error)
    }
}

const validateFunction = (book) => { // эта функция позволяет проверять каждый объект, пришедший на сервер, на наличие ошибок
    const currentYear = new Date().getFullYear();
    // Validate schema - sxemada obyektni qanday xossalari bo’lishi kerakligi va o’sha xossalarni turlari qanaqa bo’lishi, xossani qiymati eng kamida qancha bo’lishi yoki eng uzog’i bilan qancha bo’lishi ko'rsatib o'tiladi.
    const schema = Joi.object({
        id: Joi.any(),
        name: Joi.string().min(3).required(),
        year: Joi.number().min(0).max(currentYear).required(),
        author: Joi.string().required(),
        description: Joi.string().min(3).required(),
        price: Joi.number().min(0).required(),
        category: Joi.string().required(),
        image: Joi.string().required(),
    })

    // результат валидации передать функции
    return schema.validate(book);
}