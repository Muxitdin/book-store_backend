import express from 'express';
import { getBooksByFilter } from "../controllers/genreControllers.js"

const router = express.Router();

router.get('/', getBooksByFilter); // read

export default router;