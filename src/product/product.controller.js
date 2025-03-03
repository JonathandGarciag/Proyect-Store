import { response } from "express";
import Product from "../product/product.model.js"; 
import Category from "../category/category.model.js";

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;
        const categoryFound = await Category.findOne({ name: category });

        const product = new Product({ name: name, description: description, price: price, stock: stock, category: categoryFound  });
        await product.save();

        return res.status(201).json({
            success: true,
            msg: "Producto creada correctamente",
            product,
        });
    } catch (error) {
        console.error("Error en createCategory:", error);
        return res.status(500).json({
            success: false,
            msg: "Error al crear Producto",
        });
    }
};

export const updateProduct = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, category } = req.body;

        const product = await Product.findById(id);

        let categoryFound = product.category;
        if (category) {
            const categoryExists = await Category.findOne({ name: category });
            if (!categoryExists) {
                return res.status(400).json({
                    success: false,
                    msg: "La categoría especificada no existe",
                });
            }
            categoryFound = categoryExists;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id, { name: name, description: description, price: price, stock:stock,category: categoryFound },{ new: true } 
        );

        return res.status(200).json({
            success: true,
            msg: "Producto actualizado correctamente",
            product: updatedProduct,
        });

    } catch (error) {
        console.error("Error en updateProduct:", error);
        return res.status(500).json({
            success: false,
            msg: "Error al actualizar producto",
        });
    }
};

export const updateProductStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { stock } = req.body;

        if (typeof stock !== 'number' || stock < 0) {
            return res.status(400).json({
                success: false,
                msg: "El stock debe ser un número válido y mayor o igual a 0."
            });
        }

        const product = await Product.findByIdAndUpdate(id, { stock }, { new: true });
        
        if (!product) {
            return res.status(404).json({
                success: false,
                msg: "Producto no encontrado."
            });
        }

        return res.status(200).json({
            success: true,
            msg: "Stock actualizado correctamente.",
            product
        });
    } catch (error) {
        console.error("Error en updateProductStock:", error);
        return res.status(500).json({
            success: false,
            msg: "Error al actualizar el stock.",
            error: error.message
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        await Product.findByIdAndUpdate(id, { status: false });

        return res.status(200).json({
            success: true,
            msg: "Producto deshabilitado correctamente"
        });
    } catch (error) {
        console.error("Error en deleteProduct:", error);
        return res.status(500).json({
            success: false,
            msg: "Error al deshabilitar producto",
            error: error.message
        });
    }
};