"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoute = void 0;
var express_1 = __importDefault(require("express"));
var controllers_1 = require("../controllers");
var middleware_1 = require("../middleware");
var express_session_1 = __importDefault(require("express-session"));
var config_1 = require("../config");
var router = express_1.default.Router();
exports.AdminRoute = router;
// const allowedOrigin = 'https://admin.fluentmyenglish.com';
var AllowedOrigin = config_1.allowedOrigin;
router.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', AllowedOrigin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
router.use(express_session_1.default({
    secret: 'SADUJFHO[]-0128QMNBVHJEW75SH05SDWSGF06QPRZ,MNC147541187256',
    resave: false,
    saveUninitialized: false,
    cookie: {
        // secure: true,
        maxAge: 1000 * 60 * 60,
    },
}));
router.options('*', function (req, res) {
    res.status(200).send();
});
router.post('/signup', controllers_1.AdminRegister);
router.post('/login', controllers_1.AdminLogin);
router.use(middleware_1.AdminAuthenticate);
router.get('/checkAuth', controllers_1.CheckAuth);
router.post('/vendor', controllers_1.CreateVandor);
router.get('/vendors', controllers_1.GetVanndors);
router.get('/vendor/:id', controllers_1.GetVandorByID);
router.post('/category', controllers_1.CreateCategory);
router.get('/category', controllers_1.GetCategory);
router.get('/category/:id', controllers_1.GetCategoryByID);
router.put('/category', controllers_1.UpdateCategory);
router.delete('/category', controllers_1.DeleteCategory);
router.get('/transactions', controllers_1.GetTransactions);
router.get('/transactions/:page', controllers_1.GetTransactionsByPage);
router.get('/transactions/:page/:searchBy/:searchValue', controllers_1.GetTransactionsByCondition);
router.get('/transaction/:id', controllers_1.GetTransactionById);
router.get('/delivery/users/:selectedValue', controllers_1.GetDeliveryUsers);
router.get('/delivery/users/not-activated', controllers_1.GetNotActivatedDeliveryUsers);
router.get('/delivery/users/by-id/:id', controllers_1.GetDeliveryUsersByID);
router.get('/delivery/users/:searchBy/:searchValue/:selectedValue', controllers_1.GetDeliveryUsersBy);
router.get('/delivery/users/not-activated/:searchBy/:searchValue', controllers_1.GetNotActivatedDeliveryUsersBy);
router.put('/delivery/verify', controllers_1.VerifyDeliveryUser);
router.get('/', function (req, res, next) {
    res.json({ message: "Hello from  Admin" });
});
//# sourceMappingURL=AdminRoute.js.map