import { Router } from "express";
import { check } from "express-validator";
import { validarJWT } from "../../middlewares/validar-jwt.js";
import { getInvoicesByUser, getInvoiceDetails, updateInvoice } from "./invoice.controller.js";

const router = Router();
 
router.get(
    '/all_Invoice', 
    validarJWT, 
    getInvoicesByUser
);

router.get(
    '/:invoiceId', 
    validarJWT,
    getInvoiceDetails
);

router.put(
    '/updInvo/:invoiceId', 
    validarJWT, 
    updateInvoice
);


export default router;