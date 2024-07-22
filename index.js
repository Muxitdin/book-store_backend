import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
// const { create } = require('express-handlebars');
import helmet from 'helmet';
import cors from 'cors';
import books from './routes/bookRoutes.js'
import genres from './routes/genreRoutes.js'
import wish from './routes/wishRoutes.js';
import categories from "./routes/categoriesRoutes.js"
import auth from "./routes/authRoutes.js";
import image from "./routes/imageRoutes.js";
import mongoose from 'mongoose'

dotenv.config();
const app = express();
// const hbs = create({
//     defaultLayout: "main",
//     extname: "hbs",
// });


// Middleware
app.use(express.json());// используется для парсинга JSON-формата в обычный JavaScript объект;
app.use(urlencoded({extended: true})) 

// Built in middleware
app.use(express.static('public')); // funksiyaga berilgan papka manzili o'sha papkani static ravishda o'qish imkonini beradi
// masalan, papka ichida fayllarga so'rov jo'natish orqali ularni o'qib olish mumkin, http://localhost:5000/readme.txt

// Third party middleware
app.use(helmet()); // helmet - express dasturimizni xavfsizligini oshrishga yordam beradigan middleware funksiya
if (app.get('env') === 'development') { // process.env.NODE_ENV
    app.use(cors()); // cors - express dasturimizda client tomondan server resurslarini so'rash imkonini beradi
};



// View engine
// app.set('view engine', 'hbs'); // hbs - handlebars paketi
// app.engine("hbs", hbs.engine);
// app.set("views", "./views");
app.set('view engine', 'ejs');

// Books obyektini router sifatida ishlatish    
app.use('/api/books', books);
app.use('/api/categories', categories);
app.use('/api/books/filter/', genres);
app.use('/api/wishlist', wish);
app.use('/api/auth', auth )
app.use('/api/upload-image', image);

// Asosiy route
app.get('/', (_, res) => {
    res.send("Bosh sahifa");
});


const port = process.env.PORT || 3000;

const runCode = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`http://localhost:${port}/`);
        });
    } catch (error) {
        console.log(error);
    }
}

runCode();