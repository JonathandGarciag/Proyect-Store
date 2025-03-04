import { response } from "express";
import Product from "../product/product.model.js"; 
import { buildProductQuery } from "../helpers/filterProduct.js";

export const getProducts = async (req, res) => {
    try {
        const { limit = 10, desde = 0 } = req.query;
        const query = { status: true };

        const [total, products] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
                .skip(Number(desde))
                .limit(Number(limit))
                .select('name username email password role status')
        ]);

        return res.status(200).json({
            success: true,
            total,
            products
        });

    } catch (error) {
        console.error("Error en getProducts:", error);
        return res.status(500).json({
            success: false,
            msg: "Error al obtener productos",
            error: error.message
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate('category', 'name');

        if (!product) {
            return res.status(404).json({
                success: false,
                msg: "Producto no encontrado",
            });
        }

        return res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        console.error("Error en getProductById:", error);
        return res.status(500).json({
            success: false,
            msg: "Error al obtener el producto",
            error: error.message
        });
    }
};

export const getOutOfStockProducts = async (req, res) => {
    try {
        const products = await Product.find({ stock: 0 });

        return res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        console.error("Error en getOutOfStockProducts:", error);
        return res.status(500).json({
            success: false,
            msg: "Error al obtener productos agotados",
            error: error.message
        });
    }
};

export const getTopSellingProducts = async (req, res) => {
    try {
        const products = await Product.find({ status: true })
            .sort({ sales: -1 })
            .limit(10);

        return res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        console.error("Error en getTopSellingProducts:", error);
        return res.status(500).json({
            success: false,
            msg: "Error al obtener productos más vendidos",
            error: error.message
        });
    }
};

export const getProductsFiltered = async (req, res) => {
    try {
        const { search, category } = req.query;

        const query = await buildProductQuery(search, category);

        const products = await Product.find(query).populate("category", "name");

        return res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        console.error("Error en getProductsFiltered:", error);
        return res.status(500).json({
            success: false,
            msg: error.message || "Error al obtener productos filtrados",
        });
    }
};


