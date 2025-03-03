import { Router } from "express";
import { check } from "express-validator";
import { addToCart, getCart, removeFromCart, clearCart } from "./cart.controller.js";
import { validarJWT } from "../../middlewares/validar-jwt.js";
import { validarCampos } from "../../middlewares/validar-campos.js";

const router = Router();
 
router.post(
    '/add',
    [
        validarJWT,
        validarCampos,
    ],
     addToCart
    );

router.get(
    "/viewCart/:id", 
    getCart
);

router.delete(
    '/remove', 
    [
        validarJWT,
        validarCampos,
    ],
    removeFromCart
);

router.delete(
    '/clear/:userId', 
    [
        validarJWT,
        validarCampos,
    ],
    clearCart
);

export default router;