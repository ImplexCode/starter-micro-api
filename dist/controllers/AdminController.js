"use strict";
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
exports.GetNotActivatedDeliveryUsersBy = exports.GetDeliveryUsersBy = exports.GetDeliveryUsersByID = exports.GetNotActivatedDeliveryUsers = exports.GetDeliveryUsers = exports.VerifyDeliveryUser = exports.GetTransactionById = exports.GetTransactionsByCondition = exports.GetTransactions = exports.GetTransactionsByPage = exports.GetVandorByID = exports.GetVanndors = exports.DeleteCategory = exports.UpdateCategory = exports.GetCategoryByID = exports.GetCategory = exports.CreateCategory = exports.CreateVandor = exports.CheckAuth = exports.AdminLogin = exports.AdminRegister = void 0;
var models_1 = require("../models");
var Transaction_1 = require("../models/Transaction");
var utility_1 = require("../utility");
var class_transformer_1 = require("class-transformer");
var Admin_dto_1 = require("../dto/Admin.dto");
var Admin_dto_2 = require("../dto/Admin.dto");
var class_validator_1 = require("class-validator");
var Admin_1 = require("../models/Admin");
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var Vehicle_1 = require("../models/Vehicle");
var category_1 = require("../models/category");
exports.AdminRegister = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var adminInputs, adminError, email, password, firstName, admin;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                adminInputs = class_transformer_1.plainToClass(Admin_dto_2.AdminRegisterInput, req.body);
                return [4 /*yield*/, class_validator_1.validate(Admin_dto_2.AdminRegisterInput, { validationError: { target: true } })];
            case 1:
                adminError = _a.sent();
                if (adminError.length > 0) {
                    return [2 /*return*/, res.json(adminError)];
                }
                email = adminInputs.email, password = adminInputs.password, firstName = adminInputs.firstName;
                if (!email || !password || !firstName) {
                    return [2 /*return*/, res.json({ message: "All fields are required" })];
                }
                return [4 /*yield*/, Admin_1.Admin.findOne({ email: email })];
            case 2:
                admin = _a.sent();
                if (admin) {
                    return [2 /*return*/, res.json({ message: "Admin already registered" })];
                }
                // encrypt the password by bcrypt
                bcryptjs_1.default.genSalt(10, function (err, salt) {
                    if (err)
                        return res.json({ message: "Validation Process Failed" });
                    bcryptjs_1.default.hash(password, salt, function (err, hash) { return __awaiter(void 0, void 0, void 0, function () {
                        var admin, newAdmin;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (err)
                                        return [2 /*return*/, res.json({ message: "Validation Process Failed" })];
                                    admin = new Admin_1.Admin({
                                        email: email,
                                        password: hash,
                                        firstName: firstName,
                                    });
                                    newAdmin = {
                                        email: email,
                                        firstName: firstName,
                                    };
                                    return [4 /*yield*/, admin.save()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/, res.status(201).json({ message: "Admin Created Successfully", admin: newAdmin })];
                            }
                        });
                    }); });
                });
                return [2 /*return*/];
        }
    });
}); };
exports.AdminLogin = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var adminInputs, validationError, email, password, admin;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                adminInputs = class_transformer_1.plainToClass(Admin_dto_1.AdminLoginInput, req.body);
                return [4 /*yield*/, class_validator_1.validate(adminInputs, { validationError: { target: true } })];
            case 1:
                validationError = _a.sent();
                if (validationError.length > 0) {
                    return [2 /*return*/, res.json(validationError)];
                }
                email = adminInputs.email, password = adminInputs.password;
                return [4 /*yield*/, Admin_1.Admin.findOne({ email: email })];
            case 2:
                admin = _a.sent();
                if (admin === null) {
                    return [2 /*return*/, res.json({ message: "Invalid Credentials" })];
                }
                // compare the password
                bcryptjs_1.default.compare(password, admin.password, function (err, isMatch) {
                    if (err)
                        return res.json({ message: "Validation Process Failed" });
                    if (isMatch) {
                        var authPayload = {
                            _id: admin._id,
                            email: admin.email,
                            firstName: admin.firstName,
                        };
                        req.session.user = authPayload;
                        res.statusCode = 200;
                        return res.send(req.session);
                    }
                    return res.json({ message: "Can't admin authenticate" });
                });
                return [2 /*return*/];
        }
    });
}); };
exports.CheckAuth = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.status(200).json(req.session);
        return [2 /*return*/];
    });
}); };
// export const FindVendor = async (id: String | undefined, email?: string) => {
//     if(email){
//         return await Vendor.findOne({ email: email})
//     }else{
//         return await Vendor.findById(id);
//     }
// }
exports.CreateVandor = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, address, pincode, foodType, email, password, ownerName, phone, existingEmail, existingPhone, existingPincode, existingAddress, salt, userPassword, createdVandor;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, address = _a.address, pincode = _a.pincode, foodType = _a.foodType, email = _a.email, password = _a.password, ownerName = _a.ownerName, phone = _a.phone;
                if (!name || !address || !pincode || !foodType || !email || !password || !ownerName || !phone) {
                    return [2 /*return*/, res.json({ "message": "All fields are required" })];
                }
                return [4 /*yield*/, models_1.Vendor.find({ 'email': email })];
            case 1:
                existingEmail = _b.sent();
                return [4 /*yield*/, models_1.Vendor.find({ 'phone': phone })];
            case 2:
                existingPhone = _b.sent();
                return [4 /*yield*/, models_1.Vendor.find({ 'pincode': pincode })];
            case 3:
                existingPincode = _b.sent();
                return [4 /*yield*/, models_1.Vendor.find({ 'address': address })];
            case 4:
                existingAddress = _b.sent();
                if (existingEmail.length > 0)
                    return [2 /*return*/, res.status(400).json({ "message": "A vendor is exist with this email ID" })];
                if (existingPhone.length > 0)
                    return [2 /*return*/, res.status(400).json({ "message": "A vendor is exist with this phone number" })];
                if (existingPincode.length > 0)
                    return [2 /*return*/, res.status(400).json({ "message": "A vendor is exist with this pincode" })];
                if (existingAddress.length > 0)
                    return [2 /*return*/, res.status(400).json({ "message": "A vendor is exist with this address" })];
                return [4 /*yield*/, utility_1.GenerateSalt()];
            case 5:
                salt = _b.sent();
                return [4 /*yield*/, utility_1.GeneratePassword(password, salt)];
            case 6:
                userPassword = _b.sent();
                return [4 /*yield*/, models_1.Vendor.create({
                        name: name,
                        address: address,
                        pincode: pincode,
                        foodType: foodType,
                        email: email,
                        password: userPassword,
                        salt: salt,
                        ownerName: ownerName,
                        phone: phone,
                        rating: 0,
                        serviceAvailable: false,
                        coverImages: [],
                        lat: "",
                        lng: ""
                    })];
            case 7:
                createdVandor = _b.sent();
                return [2 /*return*/, res.status(200).json(createdVandor)];
        }
    });
}); };
exports.CreateCategory = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, description, createdCategory;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, description = _a.description;
                if (!name || !description) {
                    return [2 /*return*/, res.json({ "message": "All fields are required" })];
                }
                return [4 /*yield*/, category_1.Category.create({
                        name: name,
                        description: description
                    })];
            case 1:
                createdCategory = _b.sent();
                if (createdCategory) {
                    return [2 /*return*/, res.status(200).json(createdCategory)];
                }
                return [2 /*return*/, res.json({ "message": "Unable to create category" })];
        }
    });
}); };
exports.GetCategory = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
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
exports.GetCategoryByID = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
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
exports.UpdateCategory = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, name, description, updatedCategory;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, name = _a.name, description = _a.description;
                if (!id || !name || !description) {
                    return [2 /*return*/, res.json({ "message": "All fields are required" })];
                }
                return [4 /*yield*/, category_1.Category.findOneAndUpdate({ _id: id }, { name: name, description: description }, { new: true, useFindAndModify: false })];
            case 1:
                updatedCategory = _b.sent();
                if (updatedCategory) {
                    return [2 /*return*/, res.status(200).json(updatedCategory)];
                }
                return [2 /*return*/, res.json({ "message": "Unable to update category" })];
        }
    });
}); };
exports.DeleteCategory = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, deletedCategory, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.body.id;
                if (!id)
                    return [2 /*return*/, res.json({ "message": "All fields are required" })];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, category_1.Category.findByIdAndDelete(id)];
            case 2:
                deletedCategory = _a.sent();
                if (deletedCategory) {
                    return [2 /*return*/, res.status(200).json(deletedCategory)];
                }
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                return [2 /*return*/, res.json({ "message": "Unable to delete category" })];
            case 4: return [2 /*return*/, res.json({ "message": "Unable to delete category" })];
        }
    });
}); };
exports.GetVanndors = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var vendors;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, models_1.Vendor.find().populate('foodType')];
            case 1:
                vendors = _a.sent();
                if (vendors !== null) {
                    return [2 /*return*/, res.json(vendors)];
                }
                return [2 /*return*/, res.json({ "message": "Vendors data not available" })];
        }
    });
}); };
exports.GetVandorByID = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var vendorId, vendors;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                vendorId = req.params.id;
                return [4 /*yield*/, models_1.Vendor.findById(vendorId).populate('foodType')];
            case 1:
                vendors = _a.sent();
                if (vendors !== null) {
                    return [2 /*return*/, res.json(vendors)];
                }
                return [2 /*return*/, res.json({ "message": "Vendors data not available" })];
        }
    });
}); };
exports.GetTransactionsByPage = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var page, perPage, rowCount, transactions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                page = parseInt(req.params.page);
                perPage = 10;
                rowCount = (page + 1) * perPage;
                return [4 /*yield*/, Transaction_1.Transaction.find()
                        .where('decision').equals("ACCEPT")
                        .sort({ createdAt: -1 }) // Sort in descending order by createdAt field
                        .limit(rowCount)];
            case 1:
                transactions = _a.sent();
                if (transactions) {
                    return [2 /*return*/, res.status(200).json(transactions)];
                }
                return [2 /*return*/, res.json({ "message": "Transactions data not available" })];
        }
    });
}); };
exports.GetTransactions = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var transactions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Transaction_1.Transaction.find()
                    .where('decision').equals("ACCEPT")
                    .sort({ createdAt: -1 })];
            case 1:
                transactions = _a.sent();
                if (transactions) {
                    return [2 /*return*/, res.status(200).json(transactions)];
                }
                return [2 /*return*/, res.json({ "message": "Transactions data not available" })];
        }
    });
}); };
exports.GetTransactionsByCondition = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var page, perPage, rowCount, searchBy, searchValue, transactions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                page = parseInt(req.params.page);
                perPage = 10;
                rowCount = (page + 1) * perPage;
                searchBy = req.params.searchBy;
                searchValue = req.params.searchValue;
                if (!(searchBy === "reference_number")) return [3 /*break*/, 2];
                return [4 /*yield*/, Transaction_1.Transaction.find({
                        decision: "ACCEPT",
                        reference_number: { $regex: searchValue, $options: 'i' } // Using regex for partial matching
                    })
                        .sort({ createdAt: -1 })
                        .limit(rowCount)];
            case 1:
                transactions = _a.sent();
                if (transactions) {
                    return [2 /*return*/, res.status(200).json(transactions)];
                }
                res.status(200).json([]);
                return [3 /*break*/, 3];
            case 2: return [2 /*return*/, res.json({ "message": "Transactions data not available", reason: "Invalid search by" })];
            case 3: return [2 /*return*/, res.json({ "message": "Transactions data not available" })];
        }
    });
}); };
exports.GetTransactionById = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, transaction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4 /*yield*/, Transaction_1.Transaction.findById(id)];
            case 1:
                transaction = _a.sent();
                if (transaction) {
                    return [2 /*return*/, res.status(200).json(transaction)];
                }
                return [2 /*return*/, res.json({ "message": "Transaction data not available" })];
        }
    });
}); };
exports.VerifyDeliveryUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _id, status, vehicle, profile, newVehicle, result, profileDetails;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, _id = _a._id, status = _a.status, vehicle = _a.vehicle;
                if (!(_id && vehicle && status)) return [3 /*break*/, 5];
                return [4 /*yield*/, models_1.DeliveryUser.findById(_id)];
            case 1:
                profile = _b.sent();
                newVehicle = new Vehicle_1.Vehicle({
                    vehicleNumber: vehicle.vehicleNumber,
                });
                return [4 /*yield*/, newVehicle.save()];
            case 2:
                _b.sent();
                if (!(profile && newVehicle)) return [3 /*break*/, 5];
                profile.verified = status;
                profile.vehicle = newVehicle._id;
                return [4 /*yield*/, profile.save()];
            case 3:
                result = _b.sent();
                if (!result) return [3 /*break*/, 5];
                return [4 /*yield*/, models_1.DeliveryUser.findById(_id).populate('vehicle')];
            case 4:
                profileDetails = _b.sent();
                return [2 /*return*/, res.status(200).json(profileDetails)];
            case 5: return [2 /*return*/, res.status(400).json({ message: 'Unable to verify Delivery User' })];
        }
    });
}); };
exports.GetDeliveryUsers = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var selectedValue, deliveryUsers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                selectedValue = req.params.selectedValue;
                deliveryUsers = [];
                if (!(selectedValue === "a")) return [3 /*break*/, 2];
                return [4 /*yield*/, models_1.DeliveryUser.find()];
            case 1:
                deliveryUsers = _a.sent();
                return [3 /*break*/, 7];
            case 2:
                if (!(selectedValue === "b")) return [3 /*break*/, 4];
                return [4 /*yield*/, models_1.DeliveryUser.find({ verified: true })];
            case 3:
                deliveryUsers = _a.sent();
                return [3 /*break*/, 7];
            case 4:
                if (!(selectedValue === "c")) return [3 /*break*/, 6];
                return [4 /*yield*/, models_1.DeliveryUser.find({ verified: false })];
            case 5:
                deliveryUsers = _a.sent();
                return [3 /*break*/, 7];
            case 6: return [2 /*return*/, res.json({ message: 'Unable to get Delivery Users', reason: "Invalid selected value" })];
            case 7:
                if (deliveryUsers) {
                    return [2 /*return*/, res.status(200).json(deliveryUsers)];
                }
                return [2 /*return*/, res.json({ message: 'Unable to get Delivery Users' })];
        }
    });
}); };
exports.GetNotActivatedDeliveryUsers = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var deliveryUsers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, models_1.DeliveryUser.find({ verified: false })];
            case 1:
                deliveryUsers = _a.sent();
                if (deliveryUsers) {
                    return [2 /*return*/, res.status(200).json(deliveryUsers)];
                }
                return [2 /*return*/, res.json({ message: 'Unable to get Delivery Users' })];
        }
    });
}); };
exports.GetDeliveryUsersByID = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, deliveryUsers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4 /*yield*/, models_1.DeliveryUser.findById(id).populate('vehicle')];
            case 1:
                deliveryUsers = _a.sent();
                if (deliveryUsers) {
                    return [2 /*return*/, res.status(200).json(deliveryUsers)];
                }
                return [2 /*return*/, res.json({ message: 'Unable to get Delivery Users' })];
        }
    });
}); };
exports.GetDeliveryUsersBy = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var searchBy, searchValue, selectedValue, verified, deliveryUsers, deliveryUsers, deliveryUsers, deliveryUsers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                searchBy = req.params.searchBy;
                searchValue = req.params.searchValue;
                selectedValue = req.params.selectedValue;
                if (!searchBy || !searchValue || !selectedValue) {
                    return [2 /*return*/, res.json({ message: 'Unable to get Delivery Users', reason: "require params searchBy and searchValue, selectedValue" })];
                }
                if (selectedValue == "a") {
                    verified = { $in: [true, false] };
                }
                else if (selectedValue == "b") {
                    verified = true;
                }
                else if (selectedValue == "c") {
                    verified = false;
                }
                else {
                    return [2 /*return*/, res.json({ message: 'Unable to get Delivery Users', reason: "Invalid selected value" })];
                }
                if (!(searchBy === "pin")) return [3 /*break*/, 2];
                return [4 /*yield*/, models_1.DeliveryUser.find({
                        pincode: { $regex: searchValue, $options: 'i' },
                        verified: verified
                    })
                        .exec()];
            case 1:
                deliveryUsers = _a.sent();
                if (deliveryUsers) {
                    return [2 /*return*/, res.status(200).json(deliveryUsers)];
                }
                return [3 /*break*/, 8];
            case 2:
                if (!(searchBy === "phone")) return [3 /*break*/, 4];
                return [4 /*yield*/, models_1.DeliveryUser.find({
                        phone: { $regex: searchValue, $options: 'i' },
                        verified: verified
                    })
                        .exec()];
            case 3:
                deliveryUsers = _a.sent();
                if (deliveryUsers) {
                    return [2 /*return*/, res.status(200).json(deliveryUsers)];
                }
                return [3 /*break*/, 8];
            case 4:
                if (!(searchBy === "firstName")) return [3 /*break*/, 6];
                return [4 /*yield*/, models_1.DeliveryUser.find({
                        firstName: { $regex: searchValue, $options: 'i' },
                        verified: verified
                    })
                        .exec()];
            case 5:
                deliveryUsers = _a.sent();
                if (deliveryUsers) {
                    return [2 /*return*/, res.status(200).json(deliveryUsers)];
                }
                return [3 /*break*/, 8];
            case 6:
                if (!(searchBy === "lastName")) return [3 /*break*/, 8];
                return [4 /*yield*/, models_1.DeliveryUser.find({
                        lastName: { $regex: searchValue, $options: 'i' },
                        verified: verified
                    })
                        .exec()];
            case 7:
                deliveryUsers = _a.sent();
                if (deliveryUsers) {
                    return [2 /*return*/, res.status(200).json(deliveryUsers)];
                }
                _a.label = 8;
            case 8: return [2 /*return*/, res.json({ message: 'Unable to get Delivery Users' })];
        }
    });
}); };
exports.GetNotActivatedDeliveryUsersBy = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var searchBy, searchValue, deliveryUsers, deliveryUsers, deliveryUsers, deliveryUsers, deliveryUsers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                searchBy = req.params.searchBy;
                searchValue = req.params.searchValue;
                if (!searchBy || !searchValue) {
                    return [2 /*return*/, res.json({ message: 'Unable to get Delivery Users', reason: "require params searchBy and searchValue" })];
                }
                if (!(searchBy === "pin")) return [3 /*break*/, 2];
                return [4 /*yield*/, models_1.DeliveryUser.find({
                        pincode: { $regex: searchValue, $options: 'i' },
                        verified: false
                    })
                        .exec()];
            case 1:
                deliveryUsers = _a.sent();
                if (deliveryUsers) {
                    return [2 /*return*/, res.status(200).json(deliveryUsers)];
                }
                return [3 /*break*/, 10];
            case 2:
                if (!(searchBy === "phone")) return [3 /*break*/, 4];
                return [4 /*yield*/, models_1.DeliveryUser.find({
                        phone: { $regex: searchValue, $options: 'i' },
                        verified: false
                    })
                        .exec()];
            case 3:
                deliveryUsers = _a.sent();
                if (deliveryUsers) {
                    return [2 /*return*/, res.status(200).json(deliveryUsers)];
                }
                return [3 /*break*/, 10];
            case 4:
                if (!(searchBy === "firstName")) return [3 /*break*/, 6];
                return [4 /*yield*/, models_1.DeliveryUser.find({
                        firstName: { $regex: searchValue, $options: 'i' },
                        verified: false
                    })
                        .exec()];
            case 5:
                deliveryUsers = _a.sent();
                if (deliveryUsers) {
                    return [2 /*return*/, res.status(200).json(deliveryUsers)];
                }
                return [3 /*break*/, 10];
            case 6:
                if (!(searchBy === "lastName")) return [3 /*break*/, 8];
                return [4 /*yield*/, models_1.DeliveryUser.find({
                        lastName: { $regex: searchValue, $options: 'i' },
                        verified: false
                    })
                        .exec()];
            case 7:
                deliveryUsers = _a.sent();
                if (deliveryUsers) {
                    return [2 /*return*/, res.status(200).json(deliveryUsers)];
                }
                return [3 /*break*/, 10];
            case 8:
                if (!(searchBy === "_id")) return [3 /*break*/, 10];
                return [4 /*yield*/, models_1.DeliveryUser.find({
                        _id: { $regex: searchValue, $options: 'i' },
                        verified: false
                    })
                        .exec()];
            case 9:
                deliveryUsers = _a.sent();
                if (deliveryUsers) {
                    return [2 /*return*/, res.status(200).json(deliveryUsers)];
                }
                _a.label = 10;
            case 10: return [2 /*return*/, res.json({ message: 'Unable to get Delivery Users' })];
        }
    });
}); };
//# sourceMappingURL=AdminController.js.map