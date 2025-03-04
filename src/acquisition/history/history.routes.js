import { Router } from "express";
import express from 'express';
import { check } from "express-validator";
import { validarJWT } from "../../middlewares/validar-jwt.js";
import { getPurchaseHistory } from "./history.controller.js";

const router = Router();

router.get(
    '/userRegister', 
    validarJWT, 
    getPurchaseHistory
);

export default router;