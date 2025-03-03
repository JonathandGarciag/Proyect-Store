import { Router } from "express";
import { createCategory, getCategories, updateCategory, deleteCategory } from "./category.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { tieneRole } from "../middlewares/tiene-role.js";
import { registerCategory, valideleteCategory } from "../middlewares/validator.js";

const router = Router();
 
router.post(
    '/newCategory', 
    [
        validarJWT, 
        tieneRole("ADMIN_ROLE"),  
    ], 
    registerCategory,
    createCategory  
);

router.get(
    '/viewCategory', 
    getCategories  
);

router.put(
    '/updCategory/:id', 
    [
        validarJWT, 
        tieneRole("ADMIN_ROLE"),
        validarCampos
    ],
    updateCategory
);

router.delete(
    '/deleteCategory/:id', 
    [
        validarJWT, 
        tieneRole("ADMIN_ROLE"),
    ],
    valideleteCategory,
    deleteCategory
);


export default router;