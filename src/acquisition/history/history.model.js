import mongoose from "mongoose";

const PurchaseHistorySchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    purchases: [
        {
            invoice: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Invoice",
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    status: {
        type: Boolean,
        default: true,
    },
},
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model('PurchaseHistory', PurchaseHistorySchema);