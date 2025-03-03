import Product from '../product/product.model.js';

export const validateAndUpdateStockSales = async (invoice, products) => {
    let totalAmount = 0;
    let updatedProducts = [];

    for (let item of products) {
        let product = await Product.findOne({ name: item.name });
        if (!product) {
            throw new Error(`Producto no encontrado: ${item.name}`);
        }

        let previousProduct = invoice.products.find(p => p.product.toString() === product._id.toString());
        let previousQuantity = previousProduct ? previousProduct.quantity : 0;
        let quantityDifference = item.quantity - previousQuantity;

        if (quantityDifference > 0 && product.stock < quantityDifference) {
            throw new Error(`Stock insuficiente para ${product.name}`);
        }

        product.stock -= quantityDifference;
        product.sales += quantityDifference;
        await product.save();

        totalAmount += item.quantity * product.price;

        updatedProducts.push({
            product: product._id,
            quantity: item.quantity,
            price: product.price
        });
    }

    return { totalAmount, updatedProducts };
};
