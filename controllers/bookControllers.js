import Joi from 'joi';
import Books from '../models/Book.js'
import Auth from "../models/Auth.js"

export const getAllBooks = async (req, res) => {
    const { name } = req.query

    const filter = name ? { name: new RegExp(name, 'i') } : {};
    
    try {
        const books = await Books
            .find(filter)
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

export const addBookToCart = async (req, res) => {
    try {
        const { userId, bookId } = req.params;

        const foundAuth = await Auth.findById(userId);
        if (!foundAuth) return res.status(404).json("user not found")

        const bookInBasket = foundAuth.basket.find((item) => item.book?.toString() === bookId.toString());


        if (bookInBasket) {
            bookInBasket.count += 1;
            console.log(bookInBasket)
        } else {
            console.log("ishlayapti")
            foundAuth.basket.push({ book: bookId, count: 1 });
        }

        await foundAuth.save();
        res.status(200).json({ message: "Successfully added to cart" });
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error);
    }
}

export const removeBookFromCart = async (req, res) => {
    try {
        const { userId, itemId } = req.params;

        const foundAuth = await Auth.findById(userId);
        if (!foundAuth) return res.status(404).json("user not found")

        const bookInBasket = foundAuth.basket.find((item) => item._id?.toString() === itemId.toString());

        if (bookInBasket) {
            bookInBasket.count -= 1;

            res.status(200).json({ message: "successfully removed" })
        } else {
            res.status(404).json({ message: "No book found in cart" })
        }

        if (bookInBasket.count <= 0) {
            foundAuth.basket = foundAuth.basket.filter((item) => item._id?.toString() !== itemId.toString());
        }

        await foundAuth.save();
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error);
    }
}

export const deleteBookFromCart = async (req, res) => {
    try {
        const { userId, itemId } = req.params;

        const foundAuth = await Auth.findById(userId);
        if (!foundAuth) return res.status(404).json("user not found")

        const bookInBasket = foundAuth.basket.find((item) => item._id?.toString() === itemId);

        if (bookInBasket) {
            foundAuth.basket = foundAuth.basket.filter((item) => item._id?.toString() !== itemId.toString());

            await foundAuth.save();
            res.status(200).json({ message: "successfully deleted", foundAuth })
        } else {
            res.status(404).json({ message: "No book found in cart" })
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).send(error);
    }
}

const validateFunction = (book) => { // эта функция позволяет проверять каждый объект, пришедший на сервер, на наличие ошибок
    const currentYear = new Date().getFullYear();
    // Validate schema - sxemada obyektni qanday xossalari bo’lishi kerakligi va o’sha xossalarni turlari qanaqa bo’lishi, xossani qiymati eng kamida qancha bo’lishi yoki eng uzog’i bilan qancha bo’lishi ko'rsatib o'tiladi.
    const schema = Joi.object({
        id: Joi.any(),
        name: Joi.string().min(1).required(),
        year: Joi.number().min(0).max(currentYear).required(),
        author: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(), // The author field is validated to be a string that matches the pattern of a MongoDB ObjectId (24 hex characters).
        description: Joi.string().min(3).required(),
        price: Joi.number().min(0).required(),
        category: Joi.string().required(),
        image: Joi.string().required(),
    })

    // результат валидации передать функции
    return schema.validate(book);
}