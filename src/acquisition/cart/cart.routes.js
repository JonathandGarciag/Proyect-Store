import { Router } from "express";
import { check } from "express-validator";
import { addToCart, getCart } from "./cart.controller.js";
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


export default router;