import Cart from '../cart/cart.model.js';
import Invoice from '../invoice/invoice.model.js';
import Product from '../../product/product.model.js';
import History from '../history/history.model.js';

export const checkout = async (req, res) => {
    try {
        const { paymentMethod } = req.body;
        const userId = req.user._id;

        let cart = await Cart.findOne({ user: userId }).populate("products.product");
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ success: false, msg: "El carrito está vacío" });
        }

        for (let item of cart.products) {
            let product = await Product.findById(item.product._id);
            if (!product) {
                return res.status(400).json({ success: false, msg: `Producto no encontrado: ${item.product.name}` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ success: false, msg: `Stock insuficiente para ${product.name}` });
            }

            await Product.findByIdAndUpdate(
                item.product._id,
                { 
                    $inc: { stock: -item.quantity, sales: item.quantity } 
                },
                { new: true }
            );
        }

        // Crear factura
        const totalAmount = cart.products.reduce((total, item) => total + (item.product.price * item.quantity), 0);
        const invoice = new Invoice({
            user: userId,
            products: cart.products.map(p => ({
                product: p.product._id,
                quantity: p.quantity,
                price: p.product.price 
            })),
            total: totalAmount,  
            paymentMethod,
            status: "paid"
        });

        await invoice.save();

        const history = await History.findOneAndUpdate(
            { user: userId },
            { $push: { purchases: { invoice: invoice._id } } },
            { new: true, upsert: true }
        );
        await history.save();

        cart.products = [];
        await cart.save();

        return res.status(200).json({ success: true, msg: "Compra realizada con éxito", invoice });

    } catch (error) {
        return console.error("Error en checkout:", error);
        res.status(500).json({ success: false, msg: "Error al procesar la compra" });
    }
};

