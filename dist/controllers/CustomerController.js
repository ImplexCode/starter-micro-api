"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCategoryByID_ = exports.GetCategory_ = exports.CreatePayment = exports.VerifyOffer = exports.DeleteCart = exports.GetCart = exports.AddToCart = exports.GetOrderById = exports.GetOrders = exports.createOderCashOnDelivery = exports.createTransactionInstance = exports.CreateOrder = exports.CreateOrder_ = exports.EditCustomerProfile = exports.GetCustomerProfile = exports.RequestOtp = exports.CustomerVerify = exports.CustomerLogin = exports.CustomerSignUp = void 0;
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var dto_1 = require("../dto");
var models_1 = require("../models");
var Offer_1 = require("../models/Offer");
var Order_1 = require("../models/Order");
var Transaction_1 = require("../models/Transaction");
var utility_1 = require("../utility");
var moment_timezone_1 = __importDefault(require("moment-timezone"));
var uuid_1 = require("uuid");
var signFunction_1 = require("../utility/signFunction");
var category_1 = require("../models/category");
exports.CustomerSignUp = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerInputs, validationError, email, phone, password, salt, userPassword, _a, otp, expiry, existingCustomer, existingCustomerMobile, result, signature;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                customerInputs = class_transformer_1.plainToClass(dto_1.CreateCustomerInput, req.body);
                return [4 /*yield*/, class_validator_1.validate(customerInputs, { validationError: { target: true } })];
            case 1:
                validationError = _b.sent();
                if (validationError.length > 0) {
                    return [2 /*return*/, res.status(400).json(validationError)];
                }
                email = customerInputs.email, phone = customerInputs.phone, password = customerInputs.password;
                return [4 /*yield*/, utility_1.GenerateSalt()];
            case 2:
                salt = _b.sent();
                return [4 /*yield*/, utility_1.GeneratePassword(password, salt)];
            case 3:
                userPassword = _b.sent();
                _a = utility_1.GenerateOtp(), otp = _a.otp, expiry = _a.expiry;
                return [4 /*yield*/, models_1.Customer.find({ email: email })];
            case 4:
                existingCustomer = _b.sent();
                return [4 /*yield*/, models_1.Customer.find({ phone: phone })];
            case 5:
                existingCustomerMobile = _b.sent();
                if (existingCustomer.length !== 0) {
                    return [2 /*return*/, res.status(400).json({ message: 'Email already exist!' })];
                }
                if (existingCustomerMobile.length !== 0) {
                    return [2 /*return*/, res.status(400).json({ message: 'Mobile Number already exist!' })];
                }
                return [4 /*yield*/, models_1.Customer.create({
                        email: email,
                        password: userPassword,
                        salt: salt,
                        phone: phone,
                        otp: otp,
                        otp_expiry: expiry,
                        firstName: '',
                        lastName: '',
                        address: '',
                        verified: false,
                        lat: 0,
                        lng: 0,
                        orders: []
                    })];
            case 6:
                result = _b.sent();
                if (!result) return [3 /*break*/, 9];
                // send OTP to customer
                return [4 /*yield*/, utility_1.onRequestOTP(otp, phone)];
            case 7:
                // send OTP to customer
                _b.sent();
                return [4 /*yield*/, utility_1.GenerateSignature({
                        _id: result._id,
                        email: result.email,
                        verified: result.verified
                    })
                    // Send the result
                ];
            case 8:
                signature = _b.sent();
                // Send the result
                return [2 /*return*/, res.status(201).json({ signature: signature, verified: result.verified, email: result.email })];
            case 9: return [2 /*return*/, res.status(400).json({ msg: 'Error while creating user' })];
        }
    });
}); };
exports.CustomerLogin = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerInputs, validationError, email, password, customer, validation;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customerInputs = class_transformer_1.plainToClass(dto_1.UserLoginInput, req.body);
                return [4 /*yield*/, class_validator_1.validate(customerInputs, { validationError: { target: true } })];
            case 1:
                validationError = _a.sent();
                if (validationError.length > 0) {
                    return [2 /*return*/, res.status(400).json(validationError)];
                }
                email = customerInputs.email, password = customerInputs.password;
                return [4 /*yield*/, models_1.Customer.findOne({ email: email })];
            case 2:
                customer = _a.sent();
                if (!customer) return [3 /*break*/, 4];
                return [4 /*yield*/, utility_1.ValidatePassword(password, customer.password, customer.salt)];
            case 3:
                validation = _a.sent();
                if (validation) {
                    utility_1.GenerateSignature({
                        _id: customer._id,
                        email: customer.email,
                        verified: customer.verified
                    }).then(function (signature) {
                        return res.status(200).json({
                            signature: signature,
                            email: customer.email,
                            verified: customer.verified
                        });
                    })
                        .catch(function (err) {
                        console.log(err);
                        return res.status(400).json({ msg: 'Error With Login' });
                    });
                    return [2 /*return*/, 0];
                }
                _a.label = 4;
            case 4: return [2 /*return*/, res.json({ msg: 'Error With Login' })];
        }
    });
}); };
exports.CustomerVerify = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var otp, customer, profile, updatedCustomerResponse, signature;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                otp = req.body.otp;
                customer = req.user;
                if (!customer) return [3 /*break*/, 4];
                return [4 /*yield*/, models_1.Customer.findById(customer._id)];
            case 1:
                profile = _a.sent();
                if (!profile) return [3 /*break*/, 4];
                if (!(profile.otp === parseInt(otp) && profile.otp_expiry >= new Date())) return [3 /*break*/, 4];
                profile.verified = true;
                return [4 /*yield*/, profile.save()];
            case 2:
                updatedCustomerResponse = _a.sent();
                return [4 /*yield*/, utility_1.GenerateSignature({
                        _id: updatedCustomerResponse._id,
                        email: updatedCustomerResponse.email,
                        verified: updatedCustomerResponse.verified
                    })];
            case 3:
                signature = _a.sent();
                return [2 /*return*/, res.status(200).json({
                        signature: signature,
                        email: updatedCustomerResponse.email,
                        verified: updatedCustomerResponse.verified
                    })];
            case 4: return [2 /*return*/, res.status(400).json({ msg: 'Unable to verify Customer' })];
        }
    });
}); };
exports.RequestOtp = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, profile, _a, otp, expiry, sendCode;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                customer = req.user;
                if (!customer) return [3 /*break*/, 4];
                return [4 /*yield*/, models_1.Customer.findById(customer._id)];
            case 1:
                profile = _b.sent();
                if (!profile) return [3 /*break*/, 4];
                _a = utility_1.GenerateOtp(), otp = _a.otp, expiry = _a.expiry;
                profile.otp = otp;
                profile.otp_expiry = expiry;
                return [4 /*yield*/, profile.save()];
            case 2:
                _b.sent();
                return [4 /*yield*/, utility_1.onRequestOTP(otp, profile.phone)];
            case 3:
                sendCode = _b.sent();
                if (!sendCode) {
                    console.log('Send code log', sendCode);
                    return [2 /*return*/, res.status(400).json({ message: 'Failed to verify your phone number' })];
                }
                return [2 /*return*/, res.status(200).json({ message: 'OTP sent to your registered Mobile Number!' })];
            case 4: return [2 /*return*/, res.status(400).json({ msg: 'Error with Requesting OTP' })];
        }
    });
}); };
exports.GetCustomerProfile = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, profile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customer = req.user;
                if (!customer) return [3 /*break*/, 2];
                return [4 /*yield*/, models_1.Customer.findById(customer._id)];
            case 1:
                profile = _a.sent();
                if (profile) {
                    return [2 /*return*/, res.status(201).json(profile)];
                }
                _a.label = 2;
            case 2: return [2 /*return*/, res.status(400).json({ msg: 'Error while Fetching Profile' })];
        }
    });
}); };
exports.EditCustomerProfile = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, customerInputs, validationError, firstName, lastName, address, profile, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customer = req.user;
                customerInputs = class_transformer_1.plainToClass(dto_1.EditCustomerProfileInput, req.body);
                return [4 /*yield*/, class_validator_1.validate(customerInputs, { validationError: { target: true } })];
            case 1:
                validationError = _a.sent();
                if (validationError.length > 0) {
                    return [2 /*return*/, res.status(400).json(validationError)];
                }
                firstName = customerInputs.firstName, lastName = customerInputs.lastName, address = customerInputs.address;
                if (!customer) return [3 /*break*/, 4];
                return [4 /*yield*/, models_1.Customer.findById(customer._id)];
            case 2:
                profile = _a.sent();
                if (!profile) return [3 /*break*/, 4];
                profile.firstName = firstName;
                profile.lastName = lastName;
                profile.address = address;
                return [4 /*yield*/, profile.save()];
            case 3:
                result = _a.sent();
                return [2 /*return*/, res.status(201).json(result)];
            case 4: return [2 /*return*/, res.status(400).json({ msg: 'Error while Updating Profile' })];
        }
    });
}); };
/* ------------------- Delivery Notification --------------------- */
var assignOrderForDelivery = function (orderId, vendorId) { return __awaiter(void 0, void 0, void 0, function () {
    var vendor, areaCode, vendorLat, vendorLng, deliveryPerson, currentOrder;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, models_1.Vendor.findById(vendorId)];
            case 1:
                vendor = _a.sent();
                if (!vendor) return [3 /*break*/, 8];
                areaCode = vendor.pincode;
                vendorLat = vendor.lat;
                vendorLng = vendor.lng;
                return [4 /*yield*/, models_1.DeliveryUser.find({ pincode: areaCode, verified: true, isAvailable: true })];
            case 2:
                deliveryPerson = _a.sent();
                if (!(deliveryPerson.length > 0)) return [3 /*break*/, 7];
                return [4 /*yield*/, Order_1.Order.findById(orderId)];
            case 3:
                currentOrder = _a.sent();
                if (!currentOrder) return [3 /*break*/, 6];
                //update Delivery ID
                currentOrder.deliveryId = deliveryPerson[0]._id;
                deliveryPerson[0].isAvailable = false;
                return [4 /*yield*/, currentOrder.save()];
            case 4:
                _a.sent();
                return [4 /*yield*/, deliveryPerson[0].save()];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                // Notify to vendor for no delivery person available
                console.log('No delivery person available');
                console.log('No delivery person available');
                console.log('No delivery person available');
                console.log('No delivery person available');
                _a.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}); };
// Inform Delivery Person
var informDeliveryPerson = function (order, vendorId) { return __awaiter(void 0, void 0, void 0, function () {
    var currentOrder;
    return __generator(this, function (_a) {
        currentOrder = order;
        return [2 /*return*/];
    });
}); };
/* ------------------- Order Section --------------------- */
var validateTransaction = function (txnId) { return __awaiter(void 0, void 0, void 0, function () {
    var currentTransaction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Transaction_1.Transaction.findById(txnId)];
            case 1:
                currentTransaction = _a.sent();
                if (currentTransaction) {
                    if (currentTransaction.status.toLowerCase() !== 'failed') {
                        return [2 /*return*/, { status: true, currentTransaction: currentTransaction }];
                    }
                }
                return [2 /*return*/, { status: false, currentTransaction: currentTransaction }];
        }
    });
}); };
exports.CreateOrder_ = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, _a, txnId, amount, items, _b, status_1, currentTransaction, profile, orderId, cart_1, cartItems_1, netAmount_1, vendorId_1, IDs, foods, err_1, currentOrder, profileResponse;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                customer = req.user;
                _a = req.body, txnId = _a.txnId, amount = _a.amount, items = _a.items;
                if (!customer) return [3 /*break*/, 12];
                return [4 /*yield*/, validateTransaction(txnId)];
            case 1:
                _b = _c.sent(), status_1 = _b.status, currentTransaction = _b.currentTransaction;
                if (!status_1) {
                    return [2 /*return*/, res.status(404).json({ message: 'Error while Creating Order!' })];
                }
                return [4 /*yield*/, models_1.Customer.findById(customer._id)];
            case 2:
                profile = _c.sent();
                orderId = "" + (Math.floor(Math.random() * 89999) + 1000);
                cart_1 = req.body.cart;
                cartItems_1 = Array();
                netAmount_1 = 0.0;
                _c.label = 3;
            case 3:
                _c.trys.push([3, 6, , 7]);
                return [4 /*yield*/, cart_1.map(function (item) { return item._id; })];
            case 4:
                IDs = _c.sent();
                return [4 /*yield*/, models_1.Food.find().where('_id').in(IDs).exec()];
            case 5:
                foods = _c.sent();
                foods.map(function (food) {
                    cart_1.map(function (_a) {
                        var _id = _a._id, unit = _a.unit;
                        if (food._id == _id) {
                            vendorId_1 = food.vendorId;
                            netAmount_1 += (food.price * unit);
                            cartItems_1.push({ food: food, unit: unit });
                        }
                    });
                });
                return [3 /*break*/, 7];
            case 6:
                err_1 = _c.sent();
                console.log(err_1);
                return [2 /*return*/, res.status(400).json({ msg: 'Error while Creating Order' })];
            case 7:
                if (!cartItems_1) return [3 /*break*/, 12];
                return [4 /*yield*/, Order_1.Order.create({
                        orderId: orderId,
                        vendorId: vendorId_1,
                        items: cartItems_1,
                        totalAmount: netAmount_1,
                        paidAmount: amount,
                        orderDate: new Date(),
                        orderStatus: 'Waiting',
                        remarks: '',
                        deliveryId: '',
                        readyTime: 45
                    })];
            case 8:
                currentOrder = _c.sent();
                profile.cart = [];
                profile.orders.push(currentOrder);
                currentTransaction.vendorId = vendorId_1;
                currentTransaction.orderId = orderId;
                currentTransaction.status = 'CONFIRMED';
                return [4 /*yield*/, currentTransaction.save()];
            case 9:
                _c.sent();
                // await assignOrderForDelivery(currentOrder._id, vendorId);
                return [4 /*yield*/, informDeliveryPerson(currentOrder, vendorId_1)];
            case 10:
                // await assignOrderForDelivery(currentOrder._id, vendorId);
                _c.sent();
                return [4 /*yield*/, profile.save()];
            case 11:
                profileResponse = _c.sent();
                return [2 /*return*/, res.status(200).json(profileResponse)];
            case 12: return [2 /*return*/, res.status(400).json({ msg: 'Error while Creating Order' })];
        }
    });
}); };
exports.CreateOrder = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var body, req_card_number, req_locale, signature, req_card_type_selection_indicator, auth_trans_ref_no, req_bill_to_surname, req_bill_to_address_city, req_card_expiry_date, req_bill_to_address_postal_code, card_type_name, reason_code, auth_amount, auth_response, bill_trans_ref_no, req_bill_to_forename, req_payment_method, request_token, req_device_fingerprint_id, auth_time, req_amount, req_bill_to_email, transaction_id, req_currency, req_card_type, decision, message, signed_field_names, req_transaction_uuid, auth_avs_code, auth_code, req_bill_to_address_country, req_transaction_type, req_access_key, req_profile_id, req_reference_number, signed_date_time, req_bill_to_address_line1, orderId, transaction_1, updatedTransaction, profile, customer, cart, currentOrder, profileResponse, transaction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = req.body;
                if (!body)
                    return [2 /*return*/, res.status(400).json({ msg: 'Error while Creating Order', reason: 'Body not found' })];
                req_card_number = body.req_card_number, req_locale = body.req_locale, signature = body.signature, req_card_type_selection_indicator = body.req_card_type_selection_indicator, auth_trans_ref_no = body.auth_trans_ref_no, req_bill_to_surname = body.req_bill_to_surname, req_bill_to_address_city = body.req_bill_to_address_city, req_card_expiry_date = body.req_card_expiry_date, req_bill_to_address_postal_code = body.req_bill_to_address_postal_code, card_type_name = body.card_type_name, reason_code = body.reason_code, auth_amount = body.auth_amount, auth_response = body.auth_response, bill_trans_ref_no = body.bill_trans_ref_no, req_bill_to_forename = body.req_bill_to_forename, req_payment_method = body.req_payment_method, request_token = body.request_token, req_device_fingerprint_id = body.req_device_fingerprint_id, auth_time = body.auth_time, req_amount = body.req_amount, req_bill_to_email = body.req_bill_to_email, transaction_id = body.transaction_id, req_currency = body.req_currency, req_card_type = body.req_card_type, decision = body.decision, message = body.message, signed_field_names = body.signed_field_names, req_transaction_uuid = body.req_transaction_uuid, auth_avs_code = body.auth_avs_code, auth_code = body.auth_code, req_bill_to_address_country = body.req_bill_to_address_country, req_transaction_type = body.req_transaction_type, req_access_key = body.req_access_key, req_profile_id = body.req_profile_id, req_reference_number = body.req_reference_number, signed_date_time = body.signed_date_time, req_bill_to_address_line1 = body.req_bill_to_address_line1;
                if (!req_card_number ||
                    !req_locale ||
                    !signature ||
                    !req_card_type_selection_indicator ||
                    !auth_trans_ref_no ||
                    !req_bill_to_surname ||
                    !req_bill_to_address_city ||
                    !req_card_expiry_date ||
                    !req_bill_to_address_postal_code ||
                    !card_type_name ||
                    !reason_code ||
                    !auth_amount ||
                    !auth_response ||
                    !bill_trans_ref_no ||
                    !req_bill_to_forename ||
                    !req_payment_method ||
                    !request_token ||
                    !req_device_fingerprint_id ||
                    !auth_time ||
                    !req_amount ||
                    !req_bill_to_email ||
                    !transaction_id ||
                    !req_currency ||
                    !req_card_type ||
                    !decision ||
                    !message ||
                    !signed_field_names ||
                    !req_transaction_uuid ||
                    !auth_avs_code ||
                    !auth_code ||
                    !req_bill_to_address_country ||
                    !req_transaction_type ||
                    !req_access_key ||
                    !req_profile_id ||
                    !req_reference_number ||
                    !signed_date_time ||
                    !req_bill_to_address_line1)
                    return [2 /*return*/, res.status(400).json({ msg: 'Error while Creating Order', reason: 'Body item not found' })];
                if (!(decision.toLowerCase() === 'accept')) return [3 /*break*/, 8];
                orderId = "" + (Math.floor(Math.random() * 89999) + 1000);
                return [4 /*yield*/, Transaction_1.Transaction.findOne({ reference_number: req_reference_number })];
            case 1:
                transaction_1 = _a.sent();
                if (!transaction_1)
                    return [2 /*return*/, res.status(400).json({ msg: 'Error while Creating Order', reason: 'Transaction not found' })];
                transaction_1.paymentResponse = "payment is successful";
                transaction_1.payedAmount = auth_amount;
                transaction_1.status = 'paid';
                transaction_1.orderId = orderId;
                transaction_1.req_bill_to_forename = req_bill_to_forename;
                transaction_1.req_bill_to_surname = req_bill_to_surname;
                transaction_1.req_bill_to_address_line1 = req_bill_to_address_line1;
                transaction_1.req_bill_to_address_postal_code = req_bill_to_address_postal_code;
                transaction_1.req_bill_to_address_city = req_bill_to_address_city;
                transaction_1.req_bill_to_email = req_bill_to_email;
                transaction_1.auth_time = auth_time;
                transaction_1.req_payment_method = req_payment_method;
                transaction_1.req_currency = req_currency;
                transaction_1.decision = decision;
                transaction_1.req_transaction_uuid = req_transaction_uuid;
                transaction_1.request_token = request_token;
                transaction_1.card_type_name = card_type_name;
                transaction_1.req_card_number = req_card_number;
                transaction_1.req_device_fingerprint_id = req_device_fingerprint_id;
                transaction_1.auth_trans_ref_no = auth_trans_ref_no;
                transaction_1.bill_trans_ref_no = bill_trans_ref_no;
                transaction_1.signature = signature;
                return [4 /*yield*/, transaction_1.save()];
            case 2:
                updatedTransaction = _a.sent();
                return [4 /*yield*/, models_1.Customer.findById(updatedTransaction.customer)];
            case 3:
                profile = _a.sent();
                return [4 /*yield*/, models_1.Customer.findById(updatedTransaction.customer).populate('cart').exec()];
            case 4:
                customer = _a.sent();
                cart = customer.cart;
                if (!updatedTransaction.vendorId ||
                    !updatedTransaction.amountForItems ||
                    !updatedTransaction.orderValue ||
                    !updatedTransaction.payedAmount ||
                    !updatedTransaction.lat ||
                    !updatedTransaction.lng ||
                    !updatedTransaction.addressLineOne ||
                    !updatedTransaction.addressLineTwo ||
                    !updatedTransaction.city ||
                    !updatedTransaction.postalCode) {
                    return [2 /*return*/, res.status(400).json({ msg: 'Error while Creating Order', reason: 'vendorId, updatedTransaction.amountForItems, updatedTransaction.orderValue, updatedTransaction.payedAmount, updatedTransaction.lat, updatedTransaction.lng, updatedTransaction.addressLineOne, updatedTransaction.addressLineTwo, updatedTransaction.city, updatedTransaction.postalCode Fields are not found' })];
                }
                return [4 /*yield*/, Order_1.Order.create({
                        orderId: orderId,
                        vendorId: updatedTransaction.vendorId,
                        items: cart,
                        amountForItems: updatedTransaction.amountForItems,
                        totalAmount: updatedTransaction.orderValue,
                        paidAmount: updatedTransaction.payedAmount,
                        orderType: 'OnlinePayment',
                        deliveryStatus: "",
                        orderDate: new Date(),
                        orderStatus: 'Waiting',
                        remarks: '',
                        deliveryId: '',
                        lat: updatedTransaction.lat,
                        lng: updatedTransaction.lng,
                        addressLineOne: updatedTransaction.addressLineOne,
                        addressLineTwo: updatedTransaction.addressLineTwo,
                        city: updatedTransaction.city,
                        postalCode: updatedTransaction.postalCode,
                        readyTime: 45
                    })];
            case 5:
                currentOrder = _a.sent();
                profile.cart = [];
                profile.orders.push(currentOrder);
                // await assignOrderForDelivery(currentOrder._id, vendorId);
                return [4 /*yield*/, informDeliveryPerson(currentOrder, updatedTransaction.vendorId)];
            case 6:
                // await assignOrderForDelivery(currentOrder._id, vendorId);
                _a.sent();
                return [4 /*yield*/, profile.save()];
            case 7:
                profileResponse = _a.sent();
                return [2 /*return*/, res.status(200).json(profileResponse)];
            case 8: return [4 /*yield*/, Transaction_1.Transaction.findOne({ reference_number: req_reference_number })];
            case 9:
                transaction = _a.sent();
                transaction.status = decision;
                return [4 /*yield*/, transaction.save()];
            case 10:
                _a.sent();
                return [2 /*return*/, res.status(400).json({ msg: 'Error while Creating Order', reason: 'Transaction Failed' })];
        }
    });
}); };
exports.createTransactionInstance = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, _a, vendorId, addressLineOne, addressLineTwo, city, postalCode, amount_for_items, tax, deliveryFee, netAmount, user, IDs, vendorFood, vendorFoodIDs_1, foods_1, err_2, reference_number, transaction, _customer, signData, cyberSourceData, current_transaction, resData;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                customer = req.user;
                _a = req.body, vendorId = _a.vendorId, addressLineOne = _a.addressLineOne, addressLineTwo = _a.addressLineTwo, city = _a.city, postalCode = _a.postalCode;
                if (!customer)
                    return [2 /*return*/, res.status(400).json({ msg: 'Error while Creating Transaction Instance', reason: 'Customer not found' })];
                if (!vendorId || !addressLineOne || !addressLineTwo || !city || !postalCode)
                    return [2 /*return*/, res.status(400).json({ msg: 'Error while Creating Transaction Instance', reason: "vendorId, addressLineOne, addressLineTwo, city, postalCode are Require fields" })];
                amount_for_items = 0.0;
                tax = 0.0;
                deliveryFee = 0.0;
                netAmount = 0.0;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 7, , 8]);
                return [4 /*yield*/, models_1.Customer.findById(customer._id).populate('cart').exec()];
            case 2:
                user = _b.sent();
                if (user.cart.length === 0)
                    return [2 /*return*/, res.status(400).json({ msg: 'Error while Creating Transaction Instance', reason: 'Cart is Empty' })];
                return [4 /*yield*/, user.cart.map(function (item) { return item.food; })];
            case 3:
                IDs = _b.sent();
                return [4 /*yield*/, models_1.Vendor.findById(vendorId).populate('foods').exec()];
            case 4:
                vendorFood = _b.sent();
                return [4 /*yield*/, vendorFood.foods.map(function (item) { return item._id; })];
            case 5:
                vendorFoodIDs_1 = _b.sent();
                // check food available or not in vendor
                IDs.map(function (IDs) {
                    if (!vendorFoodIDs_1.includes(IDs)) {
                        return res.status(400).json({ msg: 'Error while Creating Transaction Instance', reason: 'Food not found in vendor' });
                    }
                });
                return [4 /*yield*/, models_1.Food.find().where('_id').in(IDs).exec()];
            case 6:
                foods_1 = _b.sent();
                // Calculate Food Price
                user.cart.map(function (_a) {
                    var food = _a.food, unit = _a.unit;
                    var price = foods_1.find(function (item) {
                        return food.toString() == item._id.toString();
                    });
                    var item_price = price.price;
                    netAmount += (item_price * unit);
                });
                amount_for_items = netAmount;
                deliveryFee = req.body.deliveryFee;
                netAmount += req.body.deliveryFee;
                netAmount += tax;
                return [3 /*break*/, 8];
            case 7:
                err_2 = _b.sent();
                console.log(err_2);
                return [2 /*return*/, res.status(400).json({ msg: 'Error while Creating Order' })];
            case 8:
                reference_number = "" + (Math.floor(Math.random() * 89999) + 1000);
                return [4 /*yield*/, Transaction_1.Transaction.create({
                        reference_number: reference_number,
                        customer: customer._id,
                        vendorId: vendorId,
                        lat: req.body.lat,
                        lng: req.body.lng,
                        addressLineOne: req.body.addressLineOne,
                        addressLineTwo: req.body.addressLineTwo,
                        city: req.body.city,
                        postalCode: req.body.postalCode,
                        orderId: '',
                        amountForItems: amount_for_items,
                        deliveryFee: deliveryFee,
                        tax: tax,
                        orderValue: netAmount,
                        payedAmount: -999,
                        status: 'OPEN',
                        paymentMode: "ONLINE PAYMENT",
                        paymentResponse: '',
                        req_bill_to_forename: '',
                        req_bill_to_surname: '',
                        req_bill_to_address_line1: '',
                        req_bill_to_address_postal_code: '',
                        req_bill_to_address_city: '',
                        req_bill_to_email: '',
                        auth_time: '',
                        req_payment_method: '',
                        req_currency: '',
                        decision: '',
                        req_transaction_uuid: '',
                        request_token: '',
                        card_type_name: '',
                        req_card_number: '',
                        req_device_fingerprint_id: '',
                        auth_trans_ref_no: '',
                        bill_trans_ref_no: '',
                        signature: ''
                    })];
            case 9:
                transaction = _b.sent();
                req.body.cyberSourceData = {};
                return [4 /*yield*/, models_1.Customer.findById(customer._id)];
            case 10:
                _customer = _b.sent();
                req.body.cyberSourceData.access_key = '26d2d2d38a123aac9f8d6076b99febea';
                req.body.cyberSourceData.profile_id = '305FCC81-2209-4726-AC56-9BD8444EFD99';
                req.body.cyberSourceData.reference_number = transaction.reference_number;
                req.body.cyberSourceData.amount = transaction.orderValue;
                req.body.cyberSourceData.transaction_uuid = uuid_1.v4();
                req.body.cyberSourceData.signed_field_names = 'access_key,profile_id,reference_number,amount,transaction_uuid,signed_field_names,unsigned_field_names,signed_date_time,locale,transaction_type,currency,bill_to_address_city,bill_to_address_country,bill_to_address_line1,bill_to_address_postal_code,bill_to_email,bill_to_forename,bill_to_surname';
                req.body.cyberSourceData.unsigned_field_names = '';
                req.body.cyberSourceData.signed_date_time = moment_timezone_1.default().utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
                req.body.cyberSourceData.locale = 'en';
                req.body.cyberSourceData.transaction_type = 'sale';
                req.body.cyberSourceData.currency = 'USD';
                // need to add as user
                req.body.cyberSourceData.bill_to_address_city = transaction.city;
                req.body.cyberSourceData.bill_to_address_country = 'LK';
                req.body.cyberSourceData.bill_to_address_line1 = transaction.addressLineOne;
                req.body.cyberSourceData.bill_to_address_postal_code = transaction.postalCode;
                req.body.cyberSourceData.bill_to_email = _customer.email;
                req.body.cyberSourceData.bill_to_forename = _customer.firstName;
                req.body.cyberSourceData.bill_to_surname = _customer.lastName;
                signData = signFunction_1.signFunction(req.body.cyberSourceData);
                cyberSourceData = __assign(__assign({}, req.body.cyberSourceData), { signature: signData });
                current_transaction = transaction;
                resData = {
                    cyberSourceData: cyberSourceData,
                    transaction: transaction
                };
                return [2 /*return*/, res.status(200).json(resData)];
        }
    });
}); };
exports.createOderCashOnDelivery = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, _a, vendorId, lat, lng, addressLineOne, addressLineTwo, city, postalCode, amount_for_items, tax, deliveryFee, netAmount, user, IDs, vendorFood, vendorFoodIDs_2, foods_2, err_3, currentOrder, profileResponse;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                customer = req.user;
                _a = req.body, vendorId = _a.vendorId, lat = _a.lat, lng = _a.lng, addressLineOne = _a.addressLineOne, addressLineTwo = _a.addressLineTwo, city = _a.city, postalCode = _a.postalCode;
                if (!customer)
                    return [2 /*return*/, res.status(400).json({ msg: 'Error while Creating Transaction Instance', reason: 'Customer not found' })];
                if (!vendorId || !lat || !lng || !addressLineOne || !addressLineTwo || !city || !postalCode)
                    return [2 /*return*/, res.status(400).json({ msg: 'Error while Creating Transaction Instance', reason: "vendorId, lat, lng, addressLineOne, addressLineTwo, city, postalCode, are Require fields" })];
                amount_for_items = 0.0;
                tax = 0.0;
                deliveryFee = 0.0;
                netAmount = 0.0;
                return [4 /*yield*/, models_1.Customer.findById(customer._id).populate('cart').exec()];
            case 1:
                user = _b.sent();
                _b.label = 2;
            case 2:
                _b.trys.push([2, 7, , 8]);
                if (user.cart.length === 0)
                    return [2 /*return*/, res.status(400).json({ msg: 'Error while Creating Transaction Instance', reason: 'Cart is Empty' })];
                return [4 /*yield*/, user.cart.map(function (item) { return item.food; })];
            case 3:
                IDs = _b.sent();
                return [4 /*yield*/, models_1.Vendor.findById(vendorId).populate('foods').exec()];
            case 4:
                vendorFood = _b.sent();
                return [4 /*yield*/, vendorFood.foods.map(function (item) { return item._id; })];
            case 5:
                vendorFoodIDs_2 = _b.sent();
                // check food available or not in vendor
                IDs.map(function (IDs) {
                    if (!vendorFoodIDs_2.includes(IDs)) {
                        return res.status(400).json({ msg: 'Error while Creating Transaction Instance', reason: 'Food not found in vendor' });
                    }
                });
                return [4 /*yield*/, models_1.Food.find().where('_id').in(IDs).exec()];
            case 6:
                foods_2 = _b.sent();
                // Calculate Food Price
                user.cart.map(function (_a) {
                    var food = _a.food, unit = _a.unit;
                    var price = foods_2.find(function (item) {
                        return food.toString() == item._id.toString();
                    });
                    var item_price = price.price;
                    netAmount += (item_price * unit);
                });
                amount_for_items = netAmount;
                deliveryFee = req.body.deliveryFee;
                netAmount += req.body.deliveryFee;
                netAmount += tax;
                return [3 /*break*/, 8];
            case 7:
                err_3 = _b.sent();
                console.log(err_3);
                return [2 /*return*/, res.status(400).json({ msg: 'Error while Creating Order' })];
            case 8: return [4 /*yield*/, Order_1.Order.create({
                    orderId: "" + (Math.floor(Math.random() * 89999) + 1000),
                    vendorId: vendorId,
                    items: user.cart,
                    amountForItems: amount_for_items,
                    totalAmount: netAmount,
                    paidAmount: -999,
                    orderType: 'COD',
                    orderDate: new Date(),
                    orderStatus: 'Waiting',
                    deliveryStatus: "",
                    remarks: '',
                    deliveryId: '',
                    lat: lat,
                    lng: lng,
                    addressLineOne: addressLineOne,
                    addressLineTwo: addressLineTwo,
                    city: city,
                    postalCode: postalCode,
                    readyTime: 45
                })];
            case 9:
                currentOrder = _b.sent();
                user.cart = [];
                user.orders.push(currentOrder);
                // await assignOrderForDelivery(currentOrder._id, vendorId);
                return [4 /*yield*/, informDeliveryPerson(currentOrder, vendorId)];
            case 10:
                // await assignOrderForDelivery(currentOrder._id, vendorId);
                _b.sent();
                return [4 /*yield*/, user.save()];
            case 11:
                profileResponse = _b.sent();
                return [2 /*return*/, res.status(200).json(profileResponse)];
        }
    });
}); };
exports.GetOrders = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, profile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customer = req.user;
                if (!customer) return [3 /*break*/, 2];
                return [4 /*yield*/, models_1.Customer.findById(customer._id).populate("orders")];
            case 1:
                profile = _a.sent();
                if (profile) {
                    return [2 /*return*/, res.status(200).json(profile.orders)];
                }
                _a.label = 2;
            case 2: return [2 /*return*/, res.status(400).json({ msg: 'Orders not found' })];
        }
    });
}); };
exports.GetOrderById = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, orderId, order, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customer = req.user;
                orderId = req.params.id;
                if (!orderId) return [3 /*break*/, 4];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, models_1.Customer.findById(customer._id).populate({
                        path: 'orders',
                        match: { orderId: orderId }
                    })];
            case 2:
                order = _a.sent();
                if (order) {
                    return [2 /*return*/, res.status(200).json(order)];
                }
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                console.log(err_4);
                return [2 /*return*/, res.status(400).json({ msg: 'Invalid Order Id' })];
            case 4: return [2 /*return*/, res.status(400).json({ msg: 'Order not found' })];
        }
    });
}); };
/* ------------------- Cart Section --------------------- */
exports.AddToCart = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, profile, cartItems, _a, _id_1, unit, food, existFoodItems, index, cartResult;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                customer = req.user;
                if (!customer) return [3 /*break*/, 4];
                return [4 /*yield*/, models_1.Customer.findById(customer._id)];
            case 1:
                profile = _b.sent();
                cartItems = Array();
                _a = req.body, _id_1 = _a._id, unit = _a.unit;
                return [4 /*yield*/, models_1.Food.findById(_id_1)];
            case 2:
                food = _b.sent();
                if (!food) return [3 /*break*/, 4];
                if (!(profile != null)) return [3 /*break*/, 4];
                cartItems = profile.cart;
                if (cartItems.length > 0) {
                    existFoodItems = cartItems.filter(function (item) { return item.food._id.toString() === _id_1; });
                    if (existFoodItems.length > 0) {
                        index = cartItems.indexOf(existFoodItems[0]);
                        if (unit > 0) {
                            cartItems[index] = { food: food, unit: unit };
                        }
                        else {
                            cartItems.splice(index, 1);
                        }
                    }
                    else {
                        cartItems.push({ food: food, unit: unit });
                    }
                }
                else {
                    // add new Item
                    cartItems.push({ food: food, unit: unit });
                }
                if (!cartItems) return [3 /*break*/, 4];
                profile.cart = cartItems;
                return [4 /*yield*/, profile.save()];
            case 3:
                cartResult = _b.sent();
                return [2 /*return*/, res.status(200).json(cartResult.cart)];
            case 4: return [2 /*return*/, res.status(404).json({ msg: 'Unable to add to cart!' })];
        }
    });
}); };
exports.GetCart = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, profile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customer = req.user;
                if (!customer) return [3 /*break*/, 2];
                return [4 /*yield*/, models_1.Customer.findById(customer._id)];
            case 1:
                profile = _a.sent();
                if (profile) {
                    return [2 /*return*/, res.status(200).json(profile.cart)];
                }
                _a.label = 2;
            case 2: return [2 /*return*/, res.status(400).json({ message: 'Cart is Empty!' })];
        }
    });
}); };
exports.DeleteCart = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, profile, cartResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customer = req.user;
                if (!customer) return [3 /*break*/, 3];
                return [4 /*yield*/, models_1.Customer.findById(customer._id).populate('cart.food').exec()];
            case 1:
                profile = _a.sent();
                if (!(profile != null)) return [3 /*break*/, 3];
                profile.cart = [];
                return [4 /*yield*/, profile.save()];
            case 2:
                cartResult = _a.sent();
                return [2 /*return*/, res.status(200).json(cartResult)];
            case 3: return [2 /*return*/, res.status(400).json({ message: 'cart is Already Empty!' })];
        }
    });
}); };
exports.VerifyOffer = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var offerId, customer, appliedOffer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                offerId = req.params.id;
                customer = req.user;
                if (!customer) return [3 /*break*/, 2];
                return [4 /*yield*/, Offer_1.Offer.findById(offerId)];
            case 1:
                appliedOffer = _a.sent();
                if (appliedOffer) {
                    if (appliedOffer.isActive) {
                        return [2 /*return*/, res.status(200).json({ message: 'Offer is Valid', offer: appliedOffer })];
                    }
                }
                _a.label = 2;
            case 2: return [2 /*return*/, res.status(400).json({ msg: 'Offer is Not Valid' })];
        }
    });
}); };
exports.CreatePayment = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, _a, amount, paymentMode, offerId, payableAmount, appliedOffer, err_5, transaction;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                customer = req.user;
                _a = req.body, amount = _a.amount, paymentMode = _a.paymentMode, offerId = _a.offerId;
                payableAmount = Number(amount);
                if (!offerId) return [3 /*break*/, 4];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Offer_1.Offer.findById(offerId)];
            case 2:
                appliedOffer = _b.sent();
                if (appliedOffer.isActive) {
                    payableAmount = (payableAmount - appliedOffer.offerAmount);
                }
                return [3 /*break*/, 4];
            case 3:
                err_5 = _b.sent();
                console.log(err_5);
                return [2 /*return*/, res.status(400).json({ msg: 'Cannot found offer' })];
            case 4: return [4 /*yield*/, Transaction_1.Transaction.create({
                    customer: customer._id,
                    vendorId: '',
                    orderId: '',
                    orderValue: payableAmount,
                    offerUsed: offerId || 'NA',
                    status: 'OPEN',
                    paymentMode: paymentMode,
                    paymentResponse: 'Payment is cash on Delivery'
                })
                //return transaction
            ];
            case 5:
                transaction = _b.sent();
                //return transaction
                return [2 /*return*/, res.status(200).json(transaction)];
        }
    });
}); };
exports.GetCategory_ = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var categories;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, category_1.Category.find()];
            case 1:
                categories = _a.sent();
                if (categories.length > 0) {
                    return [2 /*return*/, res.json(categories)];
                }
                return [2 /*return*/, res.json({ "message": "Category data not available" })];
        }
    });
}); };
exports.GetCategoryByID_ = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var categoryId, category;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                categoryId = req.params.id;
                return [4 /*yield*/, category_1.Category.findById(categoryId)];
            case 1:
                category = _a.sent();
                if (category) {
                    return [2 /*return*/, res.json(category)];
                }
                return [2 /*return*/, res.json({ "message": "Category not available" })];
        }
    });
}); };
//# sourceMappingURL=CustomerController.js.map