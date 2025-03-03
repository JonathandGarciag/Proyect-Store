import { Router } from "express";
import { check } from "express-validator";
import { createProduct, deleteProduct, updateProduct, updateProductStock } from "./product.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { tieneRole } from "../middlewares/tiene-role.js";
import { createProducted } from "../middlewares/validator.js";
import { categoryExists, existeProductoById, productExists } from "../helpers/db-validator.js";
import { getOutOfStockProducts, getProductById, getProducts, getProductsFiltered, getTopSellingProducts } from "./product.gets.js";

const router = Router();

router.post(
    "/newProduct", 
    [
        validarJWT, 
        tieneRole("ADMIN_ROLE"),  
    ], 
    createProducted,
    createProduct
);

router.put(
    "/updProduct/:id",
    [
        validarJWT,
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeProductoById),
        validarCampos
    ],
    updateProduct
);

router.patch(
    "/updstock/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("stock", "El stock es obligatorio y debe ser un número").isNumeric(),
        validarCampos
    ],
    updateProductStock
);

router.delete(
    "/deleteProduct/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),  
        validarCampos
    ],
    deleteProduct
);

router.get(
    "/allProduct",
    getProducts
);

router.get(
    "/byId/:id", 
    getProductById
);

router.get(
    "/out-of-stock", 
    getOutOfStockProducts
);

router.get(
    "/top-selling", 
    getTopSellingProducts
);

router.get(
    "/filter", 
    getProductsFiltered
);


export default router;
