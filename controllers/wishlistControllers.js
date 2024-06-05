import Wish from "../models/Wish.js";

export const createWish = async (req, res) => {
    const { _id , __v , ...others} = req.body;
    console.log(others);
    try {
        const newWishlistItem = await Wish.create(others);
        res.status(201).json(newWishlistItem);
    } catch (error) {
        console.error('Error adding book to wishlist:', error);
        res.status(500).json({ message: 'Error adding book to wishlist', error });
    }
}
