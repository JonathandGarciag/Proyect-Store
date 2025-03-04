import { response } from "express";
import Category from "./category.model.js";
import Product from "../product/product.model.js"; 

export const createCategory = async (req, res = response) => {
    try {
        const { name, description } = req.body;

        const category = new Category({ name: name, description: description });
        await category.save();

        return res.status(201).json({
            success: true,
            msg: "Categoría creada correctamente",
            category,
        });
    } catch (error) {
        console.error("Error en createCategory:", error);
        return res.status(500).json({
            success: false,
            msg: "Error al crear categoría",
        });
    }
};

export const getCategories = async (req, res = response) => {
    try {
        const { limit = 10, desde = 0 } = req.query;
        const query = { status: true };

        const [total, categories] = await Promise.all([
            Category.countDocuments(query),
            Category.find(query)
                .skip(Number(desde))
                .limit(Number(limit))
                .select("name description isDefault status") 
        ]);

        return res.status(200).json({
            success: true,
            total,
            categories,
        });
    } catch (error) {
        console.error("Error en getCategories:", error);
        return res.status(500).json({
            success: false,
            msg: "Error al obtener categorías",
            error: error.message,
        });
    }
};

export const updateCategory = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const category = await Category.findByIdAndUpdate(id, { name: name, description: description }, { new: true });

        await Product.updateMany(
            { category: id },
            { categoryName: name, categoryDescription: description }
        );

        return res.status(200).json({
            success: true,
            
            msg: "Categoría actualizada correctamente en toda la base de datos",
            category,
        });

    } catch (error) {
        console.error("Error en updateCategory:", error);
        return res.status(500).json({ 
            success: false, 
            msg: "Error al actualizar categoría",
            error: error.message 
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                msg: "La categoría no existe o ya fue eliminada.",
            });
        }

        if (category.isDefault) {
            return res.status(400).json({
                success: false,
                msg: "No puedes deshabilitar la categoría por defecto.",
            });
        }

        const defaultCategory = await Category.findOne({ isDefault: true });
        if (!defaultCategory) {
            return res.status(500).json({
                success: false,
                msg: "No se encontró la categoría por defecto.",
            });
        }

        await Product.updateMany(
            { category: id },
            { category: defaultCategory._id, categoryName: defaultCategory.name }
        );

        await Category.findByIdAndUpdate(id, { status: false });

        return res.json({
            success: true,
            msg: `Categoría deshabilitada correctamente. Los productos han sido reasignados a "${defaultCategory.name}".`,
        });

    } catch (error) {
        console.error("Error en deleteCategory:", error);
        return res.status(500).json({
            success: false,
            msg: "Error al deshabilitar la categoría.",
            error: error.message
        });
    }
};