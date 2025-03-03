import  { body, param, check  } from "express-validator";
import { validarCampos  } from "./validar-campos.js";
import { categoryExists, existenteEmail, productExists } from "../helpers/db-validator.js";

export const registerValidator = [
    body("name", "The name is required").not().isEmpty(),
    body("username", "The username is required").not().isEmpty(),
    body("email", "You must enter a valid email").isEmail(),
    body("email").custom(existenteEmail),
    body("password", "Password must be at least 8 characters").isLength({ min: 8 }),
    validarCampos
];

export const loginValidator = [
    body("email").isEmail().withMessage("Ingresa una dirección de correo válida"),
    body("password", "La contraseña debe tener mínimo 8 caracteres").isLength({ min: 8 }),
    validarCampos
];

export const updateUserRoleValidator = [
    param("id", "Invalid user ID").isMongoId(), 
    body("role", "Role is required").not().isEmpty(), 
    validarCampos 
];

export const registerCategory = [
    check('name', 'El nombre de la categoría es obligatorio').not().isEmpty(),  
    check('name').custom(categoryExists),  
    validarCampos
];

export const valideleteCategory = [
    check("id", "Este id no es valido").isMongoId(),
    check("id").custom(categoryExists),
    validarCampos
];

export const updateProfileUser = [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("username", "El username es obligatorio").not().isEmpty(),
    check("password", "La contraseña actual es obligatoria").not().isEmpty(),
    validarCampos
];

export const updateCredentialsUser = [
    check("email", "El email no es válido").isEmail(),
    check("password", "La nueva contraseña es obligatoria").not().isEmpty(),
    check("oldPassword", "La contraseña actual es obligatoria").not().isEmpty(),
    validarCampos
];

export const createProducted = [
    check("name", "El nombre es obligatorio").not().isEmpty().custom(productExists),
    check("description", "La descripción es obligatoria").not().isEmpty(),
    check("price", "El precio debe ser un número").isNumeric(),
    check("stock", "El stock debe ser un número").isNumeric(),
    check("category", "La categoría es obligatoria").not().isEmpty(),
    validarCampos
];

