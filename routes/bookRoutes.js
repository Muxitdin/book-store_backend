import express from 'express';
import { getAllBooks, CreateNewBook, UpdateBook, DeleteBook } from '../controllers/bookControllers.js';
const router = express.Router();

router.get('/', getAllBooks); // read

router.post('/', CreateNewBook); // create

router.put('/:id', UpdateBook); //update

router.delete('/:id', DeleteBook); // delete


export default router;


// const express = require('express');
// const Joi = require('joi'); //для валидации (проверки) с помощью схем;
// const router = express.Router();

// const books = [
//     {
//         id: 1,
//         name: "Clean Code",
//         year: "2008",
//         author: "Robert Cecil Martin",
//     },
//     {
//         id: 2,
//         name: "Code Complete",
//         year: "1993",
//         author: "Steve McConnell",
//     },
//     {
//         id: 3,
//         name: "The art of Thinking Clearly",
//         year: "2013",
//         author: "Rolf Dobelli",
//     },
// ];

// // Barcha kitoblarni olishga mo'ljallangan route
// router.get('/', (req, res) => {
//     res.send(books).status(200);
// });

// // Bitta kitobni olishga mo'ljallangan route
// router.get('/:id', (req, res) => {
//     const book = books.find(book => book.id === parseInt(req.params.id));
//     if (!book) res.status(404).send("Afsuski kitob topilmadi!");
//     res.send(book);
// });

// // Yangi kitob qo'shish
// router.post("/", (req, res) => {
//     // console.log(currentYear);
//     // if(!req.body.name || req.body.name === "") return res.status(400).send("name is required!");
//     // if(req.body.name.length < 3) return res.status(400).send("Name should be at least 3 characters long!");
//     // if(req.body.year > currentYear || req.body.year < 0) return res.status(400).send("Year must be valid!");
//     // if(!req.body.author || req.body.author === "") return res.status(400).send("Author is required!");
//     // const newBook = {
//     //     id: books.length + 1,
//     //     name: req.body.name,
//     //     year: req.body.year,
//     //     author: req.body.author,
//     // }
//     // books.push(newBook);
//     // res.send(newBook);

//     const { error } = validateFunction(req.body) // эта функция возвращает объект, содержащий ошибку, если она есть
//     if (error) return res.status(400).send(error.details[0].message);

//     const newBook = {
//         id: books.length + 1,
//         name: req.body.name,
//         year: req.body.year,
//         author: req.body.author,
//     }

//     books.push(newBook);
//     res.send(newBook).status(201);
// });

// // Kitobni yangilash
// router.put("/:id", (req, res) => {
//     const book = books.find(book => {
//         return book.id === parseInt(req.params.id /*приходит в виде String поэтому нужно пропарсить в число*/)
//     })
//     if(!book) return res.send("no book found").status(404);
//     const {error} = validateFunction(req.body);
//     if(error) return res.send(error.details[0].message).status(400);

//     const { name, year, author } = req.body;
//     book.name = name;
//     book.year = year;
//     book.author = author;

//     res.send(book).status(200);
// });

// // Kitobni o'chirish
// router.delete("/:id", (req, res) => {
//     const deletingBook = books.find(book => book.id === parseInt(req.params.id)) //находит книгу,что нужно удалить
//     if(!deletingBook) return res.send("book not found").status(404); 
    
//     const index = books.indexOf(deletingBook) // определяет индекс книги в массиве
//     books.splice(index, 1);

//     res.status(200).send(deletingBook)
// })

// // функция валидации
// const validateFunction = (book) => { // эта функция позволяет проверять каждый объект, пришедший на сервер, на наличие ошибок
//     const currentYear = new Date().getFullYear();
//     // Validate schema - sxemada obyektni qanday xossalari bo’lishi kerakligi va o’sha xossalarni turlari qanaqa bo’lishi, xossani qiymati eng kamida qancha bo’lishi yoki eng uzog’i bilan qancha bo’lishi ko'rsatib o'tiladi.
//     const schema = Joi.object({
//         id: Joi.any(),
//         name: Joi.string().min(3).required(),
//         year: Joi.number().min(0).max(currentYear).required(),
//         author: Joi.string().required()
//     })

//     // результат валидации передать функции
//     return schema.validate(book);
// }

// module.exports = router;