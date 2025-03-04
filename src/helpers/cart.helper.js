import User from "../user/user.model.js";
import Product from "../product/product.model.js";
import Cart from "../acquisition/cart/cart.model.js";

export const addProductToCart = async (user, productName, quantity) => {
    try {
        const product = await Product.findOne({ name: productName });
        if (!product) throw new Error("Producto no encontrado");

        const cart = await Cart.findOneAndUpdate(
            { user: user._id },
            { $setOnInsert: { user: user._id, products: [] } },
            { new: true, upsert: true }
        );

        const existingProduct = cart.products.find(p => p.product.toString() === product._id.toString());
        existingProduct ? existingProduct.quantity += quantity : cart.products.push({ product: product._id, quantity });

        await cart.save();

        return { success: true, msg: "Producto agregado al carrito", cart };
    } catch (error) {
        return { success: false, msg: error.message };
    }
};
