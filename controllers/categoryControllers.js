import Joi from 'joi'
import Categories from '../models/Category.js'

export const getCategories = async (req, res) => {
    try {
        const categories = await Categories.find()
        res.status(200).json(categories)
    } catch (error) {
        console.log(error)
    }
}

export const addCategory = async (req, res) => {
    try {
        const {error} = validateFunction(req.body)
        if(error) return res.status(400).json(error.details[0].message)

        const newCategory = new Categories(req.body)
        await newCategory.save()
        res.status(200).json(newCategory)
    } catch (error) {
        console.log(error)
    }        
}

export const updateCategory = async (req, res) => {
    try {
        const {error} = validateFunction(req.body)
        if(error) return res.status(400).json(error.details[0].message)

        const updatedCategory = await Categories.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.status(200).json(updatedCategory);
    } catch (error) {
        console.log(error)
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await Categories.findByIdAndDelete(req.params.id)
        res.status(200).json(deletedCategory)
    } catch (error) {
        console.log(error)
    }
}

const validateFunction = (category) => {
    const schema = Joi.object({
        name: Joi.string().required()
    })
    return schema.validate(category);
}