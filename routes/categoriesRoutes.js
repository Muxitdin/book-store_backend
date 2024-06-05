import { UpdateBook } from "../controllers/bookControllers.js";
import express from "express";
import { getCategories, addCategory, updateCategory, deleteCategory } from "../controllers/categoryControllers.js";
const router = express.Router();

router.get("/", getCategories)
router.post("/add", addCategory)
router.put("/update/:id", updateCategory)
router.delete("/delete/:id", deleteCategory)

export default router;