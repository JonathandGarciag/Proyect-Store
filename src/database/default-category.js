import Category from '../category/category.model.js'

const createDefaultCategory = async () => {
    try {
        const existingCategory = await Category.findOne({ name: "General" });

        if (!existingCategory) {
            await Category.create({
                name: "General",
                description: "Categoría predeterminada",
                isDefault: true,
                status: true,
            });

            console.log("--> Categoría por defecto creada correctamente.");
        } else {
            console.log("--> La categoría por defecto ya existe.");
        }
    } catch (error) {
        console.error("--> Error al crear la categoría por defecto:", error);
    }
};

export default createDefaultCategory;

