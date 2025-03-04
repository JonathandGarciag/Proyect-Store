import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema({
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
        },
        price: { 
            type: Number, 
            required: true 
        }
    }],
    total: { 
        type: Number, 
        required: true 
    },
    paymentMethod: { 
        type: String, 
        enum: ['credit_card', 'cash'], 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['paid'], 
        default: 'paid' 
    }, 
},
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model('Invoice', InvoiceSchema);
