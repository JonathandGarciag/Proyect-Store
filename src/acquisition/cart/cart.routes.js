import { Router } from "express";
import { check } from "express-validator";
<<<<<<< HEAD
import { addToCart, getCart, removeFromCart, clearCart } from "./cart.controller.js";
=======
import { addToCart, getCart, removeFromCart } from "./cart.controller.js";
>>>>>>> feature/auth
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

<<<<<<< HEAD
router.delete(
    '/clear/:userId', 
    [
        validarJWT,
        validarCampos,
    ],
    clearCart
);

=======
>>>>>>> feature/auth
export default router;