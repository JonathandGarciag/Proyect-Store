import express from 'express';
import { check } from 'express-validator'
import { verifyPayment } from './checkout.controller.js';
import { validarJWT } from '../../middlewares/validar-jwt.js';
import { validarCampos } from '../../middlewares/validar-campos.js';

const router = express.Router();

router.post(
    '/pay', 
    [
        validarJWT,
        check("paymentMethod", "Ingrese el metodo de pago").notEmpty(),
        validarCampos,
    ],
    verifyPayment
);

export default router;
