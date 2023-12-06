"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryRoute = void 0;
var express_1 = __importDefault(require("express"));
var controllers_1 = require("../controllers");
var middleware_1 = require("../middleware");
var multer_1 = __importDefault(require("multer"));
var cors_1 = __importDefault(require("cors"));
var router = express_1.default.Router();
exports.DeliveryRoute = router;
router.use(cors_1.default());
var imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '_' + file.originalname);
    }
});
var images = multer_1.default({ storage: imageStorage }).array('images', 10);
/* ------------------- Signup / Create Delivery User --------------------- */
router.post('/signup', controllers_1.DeliverySignUp);
/* ------------------- Login --------------------- */
router.post('/login', controllers_1.DeliveryLogin);
/* ------------------- Authentication --------------------- */
router.use(middleware_1.Authenticate);
/* ------------------- Change Service Status --------------------- */
router.put('/change-status', controllers_1.UpdateDeliveryUserStatus);
/* ------------------- Profile --------------------- */
router.get('/profile', controllers_1.GetDeliveryProfile);
router.patch('/profile', images, controllers_1.EditDeliveryProfile);
/* ------------------- Vehicle Registration --------------------- */
router.get('/otp', controllers_1.GetOTP);
router.put('/otp-validate', controllers_1.VerifyOTP);
router.get('/delivery-request', controllers_1.getAllDeliveryRequest);
router.post('/acceptation-delivery-request', controllers_1.acceptationOfDeliveryRequest);
// cancel delivery request before handover the product to delivery person by vendor
router.put('/cancel-delivery', controllers_1.cancelDeliveryRequest);
//# sourceMappingURL=DeliveryRoute.js.map