import Cart from '../cart/cart.model.js';
import Invoice from '../invoice/invoice.model.js';
import Product from '../../product/product.model.js';
import History from '../history/history.model.js';
import { validateCart, validateProductStock } from '../../helpers/db-validator.js'

export const verifyPayment = async (req, res) => {
    try {
        const { paymentMethod } = req.body;
        const userId = req.user._id;

        let cart = await Cart.findOne({ user: userId }).populate("products.product");

        validateCart(cart);

        const checkStockAndUpdate = cart.products.map(async (item) => {
            const product = await Product.findById(item.product._id);
            validateProductStock(product, item);

            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: -item.quantity, sales: item.quantity }
            });
        });

        await Promise.all(checkStockAndUpdate);

        const totalAmount = cart.products.reduce((total, { product, quantity }) => total + (product.price * quantity), 0);

        const invoice = new Invoice({
            user: userId,
            products: cart.products.map(({ product, quantity }) => ({
                product: product._id,
                quantity,
                price: product.price
            })),
            total: totalAmount,
            paymentMethod,
            status: "paid"
        });

        await invoice.save();

        await History.findOneAndUpdate(
            { user: userId },
            { $push: { purchases: { invoice: invoice._id } } },
            { new: true, upsert: true }
        );

        cart.products = [];
        cart.status = 'active'; 
        await cart.save();

        return res.status(200).json({
            success: true,
            msg: "Compra realizada con éxito",
            invoice
        });
    } catch (error) {
        console.error("Error en checkout:", error);
        return res.status(500).json({
            success: false,
            msg: error.message || "Error al procesar la compra"
        });
    }
};