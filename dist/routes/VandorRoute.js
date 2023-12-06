"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VandorRoute = void 0;
var express_1 = __importDefault(require("express"));
var controllers_1 = require("../controllers");
var middleware_1 = require("../middleware");
var multer_1 = __importDefault(require("multer"));
var router = express_1.default.Router();
exports.VandorRoute = router;
var AllowedOrigin = 'http://localhost:3000';
router.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', AllowedOrigin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});
var imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '_' + file.originalname);
    }
});
var images = multer_1.default({ storage: imageStorage }).array('images', 10);
router.post('/login', controllers_1.VendorLogin);
router.use(middleware_1.Authenticate);
router.get('/profile', controllers_1.GetVendorProfile);
router.patch('/profile', controllers_1.UpdateVendorProfile);
router.patch('/coverimage', images, controllers_1.UpdateVendorCoverImage);
router.patch('/service', controllers_1.UpdateVendorService);
router.post('/food', images, controllers_1.AddFood);
router.get('/food', controllers_1.GetFoods);
router.delete('/food/:id', controllers_1.DeleteFood);
router.get('/category', controllers_1.VendorGetCategory);
router.get('/category/:id', controllers_1.VendorGetCategoryByID);
router.get('/orders', controllers_1.GetCurrentOrders);
router.put('/order/:id/process', controllers_1.ProcessOrder);
router.get('/order/:id', controllers_1.GetOrderDetails);
//Offers
router.get('/offers', controllers_1.GetOffers);
router.post('/offer', controllers_1.AddOffer);
router.put('/offer/:id', controllers_1.EditOffer);
router.get('/', function (req, res, next) {
    res.json({ message: "Hello from Vendor" });
});
//# sourceMappingURL=VandorRoute.js.map