import User from '../user/user.model.js';
import Role from '../role/role.model.js'; 
import Category from '../category/category.model.js'
import Product from '../product/product.model.js'

export const esRoleValido = async (role = '') => {
    try {
        const roleExist = await Role.findOne({ role: role });

        if (!roleExist) {

            throw new Error(`El rol ${role} no existe en la base de datos.`);
        }
    } catch (err) {
        throw new Error(`Error al verificar el rol ${role}: ${err.message}`);
    }
};

export const existenteEmail = async (email = '') => {
    
    const existeEmail = await User.findOne({ email });

    if (existeEmail) {
        throw new Error(`El email ${email} ya está registrado`);
    }
};

export const categoryExists = async (name = '') => {
    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
        throw new Error(`La categoría "${name}" ya existe`);
    }
};

export const productExists = async (name = '') => {
    const productExists = await Product.findOne({ name });

    if (productExists) {
        throw new Error(`El producto "${name}" ya existe`);
    }
};

export const existeProductoById = async (id = '') => {
    const productoExistente = await Product.findById(id);

    if (!productoExistente) {
        throw new Error(`El producto con ID ${id} no existe`);
    }
};

export const validateCart = (cart) => {
    if (!cart || !cart.products.length) {
        throw new Error("El carrito está vacío");
    }
};

export const validateProductStock = (product, item) => {
    if (!product) throw new Error(`Producto no encontrado: ${item.product.name}`);
    if (product.stock < item.quantity) throw new Error(`Stock insuficiente para ${product.name}`);
};

