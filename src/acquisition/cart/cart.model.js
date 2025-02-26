import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    products: [{
        product: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product', 
            required: true 
        },
        quantity: { 
            type: Number, 
            required: true 
        }
    }],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Cart', CartSchema);