import express from 'express';
import { checkout } from './checkout.controller.js';
import { validarJWT } from '../../middlewares/validar-jwt.js';
import { validarCampos } from '../../middlewares/validar-campos.js';

const router = express.Router();

router.post(
    '/pay', 
    [
        validarJWT,
        validarCampos,
    ],
    checkout
);

export default router;
