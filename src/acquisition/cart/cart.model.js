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
            required: true,
            min: 1
        }
    }],
    status: { 
        type: String, 
        enum: ['active', 'processed'], 
        default: 'active' 
    },
},
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model('Cart', CartSchema);