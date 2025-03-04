import Product from '../product/product.model.js';

export const validateAndUpdateStockSales = async (invoice, products) => {
    let totalAmount = 0;
    const updatedProducts = [];

    for (let { name, quantity } of products) {
        const product = await Product.findOne({ name });
        if (!product) throw new Error(`Producto no encontrado: ${name}`);

        const previousQuantity = invoice.products.find(p => p.product.toString() === product._id.toString())?.quantity || 0;
        const quantityDifference = quantity - previousQuantity;

        if (quantityDifference > 0 && product.stock < quantityDifference) {
            throw new Error(`Stock insuficiente para ${product.name}`);
        }

        product.stock -= quantityDifference;
        product.sales += quantityDifference;
        await product.save();

        totalAmount += quantity * product.price;

        updatedProducts.push({ product: product._id, quantity, price: product.price });
    }

    return { totalAmount, updatedProducts };
};
