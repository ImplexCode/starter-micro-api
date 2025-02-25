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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditOffer = exports.AddOffer = exports.GetOffers = exports.ProcessOrder = exports.GetOrderDetails = exports.GetCurrentOrders = exports.VendorGetCategoryByID = exports.VendorGetCategory = exports.DeleteFood = exports.GetFoods = exports.AddFood = exports.UpdateVendorService = exports.UpdateVendorCoverImage = exports.UpdateVendorProfile = exports.GetVendorProfile = exports.VendorLogin = void 0;
var models_1 = require("../models");
var Offer_1 = require("../models/Offer");
var Order_1 = require("../models/Order");
var utility_1 = require("../utility");
var category_1 = require("../models/category");
exports.VendorLogin = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, existingUser, validation, signature;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                if (!email || !password) {
                    return [2 /*return*/, res.status(400).json({ 'message': 'Email and Password is required' })];
                }
                return [4 /*yield*/, models_1.Vendor.findOne({ 'email': email })];
            case 1:
                existingUser = _b.sent();
                if (!(existingUser !== null)) return [3 /*break*/, 4];
                return [4 /*yield*/, utility_1.ValidatePassword(password, existingUser.password, existingUser.salt)];
            case 2:
                validation = _b.sent();
                if (!validation) return [3 /*break*/, 4];
                return [4 /*yield*/, utility_1.GenerateSignature({
                        _id: existingUser._id,
                        email: existingUser.email,
                        name: existingUser.name
                    })];
            case 3:
                signature = _b.sent();
                return [2 /*return*/, res.json({ key: signature })];
            case 4: return [2 /*return*/, res.json({ 'message': 'Login credential is not valid' })];
        }
    });
}); };
exports.GetVendorProfile = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, existingVendor;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                if (!user) return [3 /*break*/, 2];
                return [4 /*yield*/, models_1.Vendor.findById(user._id).populate('foodType')];
            case 1:
                existingVendor = _a.sent();
                return [2 /*return*/, res.json(existingVendor)];
            case 2: return [2 /*return*/, res.json({ 'message': 'vendor Information Not Found' })];
        }
    });
}); };
exports.UpdateVendorProfile = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, foodType, name, address, phone, lat, lng, existingVendor, saveResult;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = req.user;
                _a = req.body, foodType = _a.foodType, name = _a.name, address = _a.address, phone = _a.phone, lat = _a.lat, lng = _a.lng;
                if (!user) return [3 /*break*/, 3];
                return [4 /*yield*/, models_1.Vendor.findById(user._id)];
            case 1:
                existingVendor = _b.sent();
                if (!(existingVendor !== null)) return [3 /*break*/, 3];
                existingVendor.name = name;
                existingVendor.address = address;
                existingVendor.phone = phone;
                existingVendor.foodType = foodType;
                existingVendor.lat = lat;
                existingVendor.lng = lng;
                return [4 /*yield*/, existingVendor.save()];
            case 2:
                saveResult = _b.sent();
                return [2 /*return*/, res.json(saveResult)];
            case 3: return [2 /*return*/, res.json({ 'message': 'Unable to Update vendor profile ' })];
        }
    });
}); };
exports.UpdateVendorCoverImage = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, vendor, files, images, saveResult;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = req.user;
                if (!user) return [3 /*break*/, 3];
                return [4 /*yield*/, models_1.Vendor.findById(user._id)];
            case 1:
                vendor = _b.sent();
                if (!(vendor !== null)) return [3 /*break*/, 3];
                files = req.files;
                images = files.map(function (file) { return file.filename; });
                (_a = vendor.coverImages).push.apply(_a, images);
                return [4 /*yield*/, vendor.save()];
            case 2:
                saveResult = _b.sent();
                return [2 /*return*/, res.json(saveResult)];
            case 3: return [2 /*return*/, res.json({ 'message': 'Unable to Update vendor profile ' })];
        }
    });
}); };
exports.UpdateVendorService = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, lat, lng, existingVendor, saveResult;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = req.user;
                _a = req.body, lat = _a.lat, lng = _a.lng;
                if (!user) return [3 /*break*/, 3];
                return [4 /*yield*/, models_1.Vendor.findById(user._id)];
            case 1:
                existingVendor = _b.sent();
                if (!(existingVendor !== null)) return [3 /*break*/, 3];
                existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
                if (lat && lng) {
                    existingVendor.lat = lat;
                    existingVendor.lng = lng;
                }
                return [4 /*yield*/, existingVendor.save()];
            case 2:
                saveResult = _b.sent();
                return [2 /*return*/, res.json(saveResult)];
            case 3: return [2 /*return*/, res.json({ 'message': 'Unable to Update vendor profile ' })];
        }
    });
}); };
exports.AddFood = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, name, description, category, foodType, readyTime, price, vendor, files, images, food, result;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = req.user;
                _a = req.body, name = _a.name, description = _a.description, category = _a.category, foodType = _a.foodType, readyTime = _a.readyTime, price = _a.price;
                if (!user) return [3 /*break*/, 4];
                return [4 /*yield*/, models_1.Vendor.findById(user._id)];
            case 1:
                vendor = _b.sent();
                if (!(vendor !== null)) return [3 /*break*/, 4];
                files = req.files;
                if (!files) {
                    return [2 /*return*/, res.json({ 'message': 'Please upload at least one image' })];
                }
                if (!name || !description || !category || !foodType || !readyTime || !price) {
                    return [2 /*return*/, res.json({ 'message': 'Please provide all the information' })];
                }
                images = files.map(function (file) { return file.filename; });
                return [4 /*yield*/, models_1.Food.create({
                        vendorId: vendor._id,
                        name: name,
                        description: description,
                        category: category,
                        price: price,
                        rating: 0,
                        readyTime: readyTime,
                        foodType: foodType,
                        images: images
                    })];
            case 2:
                food = _b.sent();
                vendor.foods.push(food);
                return [4 /*yield*/, vendor.save()];
            case 3:
                result = _b.sent();
                return [2 /*return*/, res.json(result)];
            case 4: return [2 /*return*/, res.json({ 'message': 'Unable to Update vendor profile ' })];
        }
    });
}); };
exports.GetFoods = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, foods;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                if (!user) return [3 /*break*/, 2];
                return [4 /*yield*/, models_1.Vendor.findById(user._id).populate('foods').populate('foodType')];
            case 1:
                foods = _a.sent();
                if (foods.foods !== null) {
                    return [2 /*return*/, res.json(foods.foods)];
                }
                _a.label = 2;
            case 2: return [2 /*return*/, res.json({ 'message': 'Foods not found!' })];
        }
    });
}); };
exports.DeleteFood = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, foodId, food, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                foodId = req.params.id;
                if (!foodId)
                    return [2 /*return*/, res.json({ 'message': 'Food id is required!' })];
                if (!user) return [3 /*break*/, 4];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, models_1.Vendor.updateOne({ _id: user._id }, { $pull: { foods: foodId } })];
            case 2:
                food = _a.sent();
                return [2 /*return*/, res.json(food)];
            case 3:
                err_1 = _a.sent();
                console.log(err_1);
                return [2 /*return*/, res.json({ 'message': 'Unable to delete food!' })];
            case 4: return [2 /*return*/, res.json({ 'message': 'Foods not found!' })];
        }
    });
}); };
exports.VendorGetCategory = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
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
exports.VendorGetCategoryByID = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
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
exports.GetCurrentOrders = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, orders;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                if (!user) return [3 /*break*/, 2];
                return [4 /*yield*/, Order_1.Order.find({ vendorId: user._id }).populate('items.food')];
            case 1:
                orders = _a.sent();
                if (orders != null) {
                    return [2 /*return*/, res.status(200).json(orders)];
                }
                _a.label = 2;
            case 2: return [2 /*return*/, res.json({ message: 'Orders Not found' })];
        }
    });
}); };
exports.GetOrderDetails = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, order;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                orderId = req.params.id;
                if (!orderId) return [3 /*break*/, 2];
                return [4 /*yield*/, Order_1.Order.findById(orderId).populate('items.food')];
            case 1:
                order = _a.sent();
                if (order != null) {
                    return [2 /*return*/, res.status(200).json(order)];
                }
                _a.label = 2;
            case 2: return [2 /*return*/, res.json({ message: 'Order Not found' })];
        }
    });
}); };
exports.ProcessOrder = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, _a, status, remarks, time, order, orderResult;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                orderId = req.params.id;
                _a = req.body, status = _a.status, remarks = _a.remarks, time = _a.time;
                if (!orderId) return [3 /*break*/, 3];
                return [4 /*yield*/, Order_1.Order.findById(orderId).populate('food')];
            case 1:
                order = _b.sent();
                order.orderStatus = status;
                order.remarks = remarks;
                if (time) {
                    order.readyTime = time;
                }
                return [4 /*yield*/, order.save()];
            case 2:
                orderResult = _b.sent();
                if (orderResult != null) {
                    return [2 /*return*/, res.status(200).json(orderResult)];
                }
                _b.label = 3;
            case 3: return [2 /*return*/, res.json({ message: 'Unable to process order' })];
        }
    });
}); };
exports.GetOffers = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, currentOffer_1, offers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                if (!user) return [3 /*break*/, 2];
                currentOffer_1 = Array();
                return [4 /*yield*/, Offer_1.Offer.find().populate('vendors')];
            case 1:
                offers = _a.sent();
                if (offers) {
                    offers.map(function (item) {
                        if (item.vendors) {
                            item.vendors.map(function (vendor) {
                                if (vendor._id.toString() === user._id) {
                                    currentOffer_1.push(item);
                                }
                            });
                        }
                        if (item.offerType === "GENERIC") {
                            currentOffer_1.push(item);
                        }
                    });
                }
                return [2 /*return*/, res.status(200).json(currentOffer_1)];
            case 2: return [2 /*return*/, res.json({ message: 'Offers Not available' })];
        }
    });
}); };
exports.AddOffer = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, title, description, offerType, offerAmount, pincode, promocode, promoType, startValidity, endValidity, bank, bins, minValue, isActive, vendor, offer;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = req.user;
                if (!user) return [3 /*break*/, 3];
                _a = req.body, title = _a.title, description = _a.description, offerType = _a.offerType, offerAmount = _a.offerAmount, pincode = _a.pincode, promocode = _a.promocode, promoType = _a.promoType, startValidity = _a.startValidity, endValidity = _a.endValidity, bank = _a.bank, bins = _a.bins, minValue = _a.minValue, isActive = _a.isActive;
                return [4 /*yield*/, models_1.Vendor.findById(user._id)];
            case 1:
                vendor = _b.sent();
                if (!vendor) return [3 /*break*/, 3];
                return [4 /*yield*/, Offer_1.Offer.create({
                        title: title,
                        description: description,
                        offerType: offerType,
                        offerAmount: offerAmount,
                        pincode: pincode,
                        promoType: promoType,
                        startValidity: startValidity,
                        endValidity: endValidity,
                        bank: bank,
                        isActive: isActive,
                        minValue: minValue,
                        vendors: [vendor]
                    })];
            case 2:
                offer = _b.sent();
                return [2 /*return*/, res.status(200).json(offer)];
            case 3: return [2 /*return*/, res.json({ message: 'Unable to add Offer!' })];
        }
    });
}); };
exports.EditOffer = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, offerId, _a, title, description, offerType, offerAmount, pincode, promocode, promoType, startValidity, endValidity, bank, bins, minValue, isActive, currentOffer, vendor, result;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = req.user;
                offerId = req.params.id;
                if (!user) return [3 /*break*/, 4];
                _a = req.body, title = _a.title, description = _a.description, offerType = _a.offerType, offerAmount = _a.offerAmount, pincode = _a.pincode, promocode = _a.promocode, promoType = _a.promoType, startValidity = _a.startValidity, endValidity = _a.endValidity, bank = _a.bank, bins = _a.bins, minValue = _a.minValue, isActive = _a.isActive;
                return [4 /*yield*/, Offer_1.Offer.findById(offerId)];
            case 1:
                currentOffer = _b.sent();
                if (!currentOffer) return [3 /*break*/, 4];
                return [4 /*yield*/, models_1.Vendor.findById(user._id)];
            case 2:
                vendor = _b.sent();
                if (!vendor) return [3 /*break*/, 4];
                currentOffer.title = title,
                    currentOffer.description = description,
                    currentOffer.offerType = offerType,
                    currentOffer.offerAmount = offerAmount,
                    currentOffer.pincode = pincode,
                    currentOffer.promoType = promoType,
                    currentOffer.startValidity = startValidity,
                    currentOffer.endValidity = endValidity,
                    currentOffer.bank = bank,
                    currentOffer.isActive = isActive,
                    currentOffer.minValue = minValue;
                return [4 /*yield*/, currentOffer.save()];
            case 3:
                result = _b.sent();
                return [2 /*return*/, res.status(200).json(result)];
            case 4: return [2 /*return*/, res.json({ message: 'Unable to add Offer!' })];
        }
    });
}); };
//# sourceMappingURL=VendorController.js.map