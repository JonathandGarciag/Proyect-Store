import { response } from "express";
import PurchaseHistory from './history.model.js'

<<<<<<< HEAD

=======
>>>>>>> feature/auth
export const getPurchaseHistory = async (req, res) => {
    try {
        const userId = req.user._id;

        const history = await PurchaseHistory.findOne({ user: userId }).populate("purchases.invoice");

        if (!history || history.purchases.length === 0) {
            return res.status(404).json({ success: false, msg: "No se encontraron compras en el historial" });
        }

        const purchaseSummary = history.purchases.map(purchase => ({
            invoiceId: purchase.invoice._id,
            date: purchase.date,
            total: purchase.invoice.total,
            paymentMethod: purchase.invoice.paymentMethod
        }));

<<<<<<< HEAD
        return res.status(200).json({ success: true, purchases: purchaseSummary });

    } catch (error) {
        console.error("Error en getPurchaseHistory:", error);
        return res.status(500).json({ success: false, msg: "Error al obtener el historial de compras" });
=======
        return res.status(200).json({ 
            success: true, 
            purchases: purchaseSummary 
        });

    } catch (error) {
        console.error("Error en getPurchaseHistory:", error);
        return res.status(500).json({ 
            success: false, 
            msg: "Error al obtener el historial de compras" 
        });
>>>>>>> feature/auth
    }
};