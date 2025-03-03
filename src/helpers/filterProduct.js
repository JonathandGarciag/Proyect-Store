import Category from "../category/category.model.js";

export const buildProductQuery = async (search, category) => {
    let query = { status: true };

    if (search) {
        query.name = { $regex: search, $options: "i" }; 
    }

    if (category) {
        const categoryExists = await Category.findOne({ name: category });
        if (!categoryExists) {
            throw new Error("La categoría especificada no existe");
        }
        query.category = categoryExists._id;
    }

    return query;
};
