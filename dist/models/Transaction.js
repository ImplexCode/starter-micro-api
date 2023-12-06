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
exports.Transaction = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var TransactionSchema = new mongoose_1.Schema({
    // customer: String,
    // vendorId: String,
    // orderId: String,
    // orderValue: Number,
    // offerUsed: String,
    // status: String,
    // paymentMode: String,
    // paymentResponse: String
    reference_number: String,
    customer: { type: mongoose_1.Schema.Types.ObjectId, ref: 'customer' },
    vendorId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'vendor' },
    orderId: String,
    orderValue: Number,
    amountForItems: Number,
    deliveryFee: Number,
    lat: { type: String, require: true },
    lng: { type: String, require: true },
    addressLineOne: { type: String, require: true },
    addressLineTwo: String,
    city: { type: String, require: true },
    postalCode: { type: String, require: true },
    tax: Number,
    status: String,
    payedAmount: Number,
    paymentMode: String,
    paymentResponse: String,
    req_bill_to_forename: String,
    req_bill_to_surname: String,
    req_bill_to_address_line1: String,
    req_bill_to_address_postal_code: String,
    req_bill_to_address_city: String,
    req_bill_to_email: String,
    auth_time: String,
    req_payment_method: String,
    req_currency: String,
    decision: String,
    req_transaction_uuid: String,
    request_token: String,
    card_type_name: String,
    req_card_number: String,
    req_device_fingerprint_id: String,
    auth_trans_ref_no: String,
    bill_trans_ref_no: String,
    signature: String,
}, {
    toJSON: {
        transform: function (doc, ret) {
            delete ret.__v;
        }
    },
    timestamps: true
});
var Transaction = mongoose_1.default.model('transaction', TransactionSchema);
exports.Transaction = Transaction;
//# sourceMappingURL=Transaction.js.map