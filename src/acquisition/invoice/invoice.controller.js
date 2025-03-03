import { response } from "express";
import Invoice from './invoice.model.js'
import Product from '../../product/product.model.js';


export const getInvoicesByUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const invoices = await Invoice.find({ user: userId }).populate('products.product');

        if (!invoices || invoices.length === 0) {
            return res.status(404).json({ success: false, msg: "No se encontraron facturas para este usuario" });
        }

        return res.status(200).json({ success: true, invoices });
    } catch (error) {
        console.error("Error en getInvoicesByUser:", error);
        return res.status(500).json({ success: false, msg: "Error al obtener las facturas" });
    }
};

export const getInvoiceDetails = async (req, res) => {
    try {
        const { invoiceId } = req.params;

        if (!invoiceId) {
            return res.status(400).json({ success: false, msg: "Se requiere el ID de la factura" });
        }

        const invoice = await Invoice.findById(invoiceId).populate('products.product');

        if (!invoice) {
            return res.status(404).json({ success: false, msg: "Factura no encontrada" });
        }

        return res.status(200).json({ success: true, invoice });
    } catch (error) {
        console.error("Error en getInvoiceDetails:", error);
        return res.status(500).json({ success: false, msg: "Error al obtener los detalles de la factura" });
    }
};

export const updateInvoice = async (req, res) => {
    try {
        const { invoiceId } = req.params;
        const { products } = req.body;

        if (!invoiceId) {
            return res.status(400).json({ success: false, msg: "Se requiere el ID de la factura" });
        }

        let invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            return res.status(404).json({ success: false, msg: "Factura no encontrada" });
        }

        const { totalAmount, updatedProducts } = await validateAndUpdateStockSales(invoice, products);

        invoice.products = updatedProducts;
        invoice.total = totalAmount;
        await invoice.save();

        res.status(200).json({ success: true, msg: "Factura actualizada con éxito", invoice });
    } catch (error) {
        console.error("Error en updateInvoice:", error);
        res.status(500).json({ success: false, msg: error.message });
    }
};