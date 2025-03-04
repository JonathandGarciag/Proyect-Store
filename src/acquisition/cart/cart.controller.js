import { response } from "express";
import Cart from './cart.model.js'
import mongoose from 'mongoose';
import { addProductToCart, removeProductFromCart } from "../../helpers/cart.helper.js";
import { findCartByUserId, findProductByName, findUserByEmail } from "../../helpers/db-validator.js";

export const addToCart = async (req, res) => {
    const { email, productName, quantity } = req.body;

    const result = await addProductToCart(email, productName, quantity);

    if (result.success) {
        return res.status(200).json(result);
    }

    return res.status(400).json(result);
};

export const getCart = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("ID recibido:", id); 

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, msg: "ID de usuario inválido" });
        }

        const objectId = new mongoose.Types.ObjectId(id);

        const cart = await Cart.findOne({ user: objectId }).populate("products.product");

        if (!cart) {
            return res.status(404).json({ 
                success: false, 
                msg: "El usuario no tiene un carrito" 
            });
        }

        return res.status(200).json({ 
            success: true, 
            cart 
        });

    } catch (error) {
        console.error("Error en getCart:", error);
        return res.status(500).json({ 
            success: false, 
            msg: "Error al obtener el carrito" 
        });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { email, productName } = req.body;

        const user = await findUserByEmail(email);
        const cart = await findCartByUserId(user._id);
        const product = await findProductByName(productName);

        const updatedCart = await removeProductFromCart(cart, product._id);

        return res.status(200).json({ 
            success: true, 
            msg: "Producto eliminado del carrito", 
            cart: updatedCart
        });
    } catch (error) {
        return res.status(400).json({ 
            success: false, 
            msg: error.message 
        });
    }
};
