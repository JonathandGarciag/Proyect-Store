import User from "../user/user.model.js";
import Product from "../product/product.model.js";
import Cart from "../acquisition/cart/cart.model.js";

export const addProductToCart = async (email, productName, quantity) => {
    try {
        const [user, product] = await Promise.all([
            User.findOne({ email }),
            Product.findOne({ name: productName })
        ]);

        if (!user || !product) {
            throw new Error(!user ? "Usuario no encontrado" : "Producto no encontrado");
        }

        const cart = await Cart.findOneAndUpdate(
            { user: user._id },
            { $setOnInsert: { user: user._id, products: [] } },
            { new: true, upsert: true }
        );

        const existingProduct = cart.products.find(p => p.product.toString() === product._id.toString());

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: product._id, quantity });
        }

        await cart.save();

        return { success: true, msg: "Producto agregado al carrito", cart };

    } catch (error) {
        return { success: false, msg: error.message };
    }
};

export const removeProductFromCart = async (cart, productId) => {
    cart.products = cart.products.filter(p => p.product.toString() !== productId.toString());
    await cart.save();
    return cart;
};

