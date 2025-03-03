"use strict";

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';

import limiter from '../src/middlewares/validar-cant-peticiones.js';
import createAdmin from '../src/database/default-admin.js'
import createDefaultCategory from '../src/database/default-category.js';
import createRoles from '../src/database/default-role.js'

import userRoutes from '../src/user/user.routes.js';
import authRoutes from '../src/auth/auth.routes.js';
import productRoutes from '../src/product/product.routes.js';
import categoryRoutes from '../src/category/category.routes.js';
import invoiceRoutes from '../src/acquisition/invoice/invoice.routes.js';
import historyRoutes from '../src/acquisition/history/history.routes.js';
import cartRoutes from '../src/acquisition/cart/cart.routes.js'
import checkRoutes from '../src/acquisition/buy/checkout.routes.js'

const middlewares = (app) => {
    app.use(express.urlencoded({extended: false}))
    app.use(cors())
    app.use(express.json())
    app.use(helmet())
    app.use(morgan('dev'))
    app.use(limiter)
} 

const routes = (app) => {
    app.use("/proyect-store/vfinal/user", userRoutes)
    app.use("/proyect-store/vfinal/auth", authRoutes)
    app.use("/proyect-store/vfinal/product", productRoutes)
    app.use("/proyect-store/vfinal/category", categoryRoutes)
    app.use("/proyect-store/vfinal/invoice", invoiceRoutes)
    app.use("/proyect-store/vfinal/history", historyRoutes)
    app.use("/proyect-store/vfinal/cart", cartRoutes)
    app.use("/proyect-store/vfinal/checkout", checkRoutes)
}

const conectarDB = async () =>{
    try {
        await dbConnection();
        console.log("Conexion a la base de datos exitosa");
    } catch (error) {
        console.error('Error conectado ala base de datos', error);
        process.exit(1);
    }
}

export const initServer = async () =>{
    const app = express();
    const port = process.env.PORT || 3000;

    try {
        middlewares(app);
        conectarDB();
        routes(app);
        await createDefaultCategory();  
        await createAdmin();  
        await createRoles(); 
        app.listen(port);
        console.log(`Server running on port ${port}`)
    } catch (err) {
        console.log(`Server init failed ${err}`);
    }
}

