"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var OrderSchema = new mongoose_1.Schema({
    orderId: { type: String, require: true },
    vendorId: { type: mongoose_1.Schema.Types.ObjectId, ref: "vendor", require: true },
    items: [
        {
            food: { type: mongoose_1.Schema.Types.ObjectId, ref: "food", require: true },
            unit: { type: Number, require: true }
        }
    ],
    totalAmount: { type: Number, require: true },
    paidAmount: { type: Number, require: true },
    orderDate: { type: Date },
    orderStatus: { type: String },
    orderType: { type: String },
    remarks: { type: String },
    deliveryId: { type: String },
    deliveryStatus: { type: String }, default: "",
    rejectedDeliveryIds: [{ type: Object }],
    readyTime: { type: Number },
    lat: { type: String, require: true },
    lng: { type: String, require: true },
    addressLineOne: { type: String, require: true },
    addressLineTwo: { type: String },
    city: { type: String, require: true },
    postalCode: { type: String, require: true },
}, {
    toJSON: {
        transform: function (doc, ret) {
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },
    timestamps: true
});
var Order = mongoose_1.default.model('order', OrderSchema);
exports.Order = Order;
//# sourceMappingURL=Order.js.map