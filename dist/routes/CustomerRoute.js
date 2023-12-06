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
exports.CustomerRoute = void 0;
var express_1 = __importDefault(require("express"));
var controllers_1 = require("../controllers");
var middleware_1 = require("../middleware");
var models_1 = require("../models");
var cors_1 = __importDefault(require("cors"));
var axios = require('axios');
var router = express_1.default.Router();
exports.CustomerRoute = router;
router.use(cors_1.default());
var checkMobileVerification = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, profile, verified;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customer = req.user;
                return [4 /*yield*/, models_1.Customer.findById(customer._id)];
            case 1:
                profile = _a.sent();
                verified = profile.verified;
                if (verified) {
                    return [2 /*return*/, next()];
                }
                else {
                    return [2 /*return*/, res.status(400).json({ message: "Mobile Number Not Verified" })];
                }
                return [2 /*return*/];
        }
    });
}); };
var calDistanceAndAssignDeliveryFee = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, lat, lng, vendorId, price_per_km, apiKey, baseUrl, vendor, vendorLat, vendorLng;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, lat = _a.lat, lng = _a.lng, vendorId = _a.vendorId;
                if (!lat || !lng || !vendorId)
                    return [2 /*return*/, res.status(400).json({ msg: 'Required fields are not define in request', reason: 'Please provide lat, lng and vendorId' })];
                price_per_km = 10;
                apiKey = 'AIzaSyDKX7fMwb5rQIpETx2R9i3VcFr32D61ysE';
                baseUrl = 'https://maps.googleapis.com/maps/api/distancematrix/json';
                return [4 /*yield*/, models_1.Vendor.findById(vendorId)];
            case 1:
                vendor = _b.sent();
                if (!vendor)
                    return [2 /*return*/, res.status(400).json({ msg: 'Vendor not found', reason: 'Vendor not found' })];
                vendorLat = vendor.lat;
                vendorLng = vendor.lng;
                // Make a request to the Google Maps API
                axios.get(baseUrl + "?units=imperial&origins=" + vendorLat + "," + vendorLng + "&destinations=" + lat + "," + lng + "&key=" + apiKey)
                    .then(function (response) {
                    var distanceMeters = response.data.rows[0].elements[0].distance.value;
                    if (distanceMeters <= 5000) {
                        // assign delivery fee
                        var deliveryFee = price_per_km * (distanceMeters / 1000);
                        req.body.deliveryFee = deliveryFee;
                        req.body.lat = lat;
                        req.body.lng = lng;
                        return next();
                    }
                    return res.status(400).json({ msg: 'Distance is greater than 5km', reason: 'Distance is greater than 5km' });
                })
                    .catch(function (error) {
                    console.error('Error fetching distance:', error);
                    res.status(500).json({ msg: 'Error while Calculating Distance', reason: 'Error while Calculating Distance' });
                });
                return [2 /*return*/];
        }
    });
}); };
router.post('/signup', controllers_1.CustomerSignUp);
router.post('/login', controllers_1.CustomerLogin);
/*
    this is important for transaction completion and create order
*/
router.post('/create-order', controllers_1.CreateOrder);
router.use(middleware_1.Authenticate);
router.patch('/verify', controllers_1.CustomerVerify);
router.get('/otp', controllers_1.RequestOtp);
router.use(checkMobileVerification);
router.get('/profile', controllers_1.GetCustomerProfile);
router.patch('/profile', controllers_1.EditCustomerProfile);
router.post('/cart', controllers_1.AddToCart);
router.get('/cart', controllers_1.GetCart);
router.delete('/cart', controllers_1.DeleteCart);
router.get('/offer/verify/:id', controllers_1.VerifyOffer);
router.post('/create-transaction-instance', calDistanceAndAssignDeliveryFee, controllers_1.createTransactionInstance);
router.post('/create-order-cash-on-delivery', calDistanceAndAssignDeliveryFee, controllers_1.createOderCashOnDelivery);
router.get('/orders', controllers_1.GetOrders);
router.get('/order/:id', controllers_1.GetOrderById);
router.get('/category', controllers_1.GetCategory_);
router.get('/category/:id', controllers_1.GetCategoryByID_);
//# sourceMappingURL=CustomerRoute.js.map