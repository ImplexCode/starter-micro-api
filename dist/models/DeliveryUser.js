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
exports.DeliveryUser = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var DeliveryUserSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    email_verified: { type: Boolean, default: false },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    phone: { type: String, required: true },
    verified: { type: Boolean },
    pincode: { type: String, required: true },
    otp: { type: String },
    otp_expires: { type: Date },
    lat: { type: Number },
    lng: { type: Number },
    isAvailable: { type: Boolean, default: false },
    last_updated: { type: Date, default: Date.now },
    profile_pic: { type: String },
    vehicle: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'vehicle'
    }
}, {
    toJSON: {
        transform: function (doc, ret) {
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },
    timestamps: true
});
var DeliveryUser = mongoose_1.default.model('deliveryUser', DeliveryUserSchema);
exports.DeliveryUser = DeliveryUser;
//# sourceMappingURL=DeliveryUser.js.map