"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signFunction = void 0;
var crypto_1 = __importDefault(require("crypto"));
var HMAC_SHA256 = 'sha256';
var SECRET_KEY = 'a380c3f3d4814131903c79a1dd2161216a36ca0bbe864f05ad35fccd9569aebe0ef3a4f42c4e4318b0b9471029a9bb6faa1871278eca4729875239d21466ded0ab72a20ea2ab42cb8ac81b87ecf78bfb0ccdbe6291d34105b3cb9709deb0f8e2d8188b9d13a94e6083b1c9d032e4ef3f4f68a470976b41659815d58566175fb9';
function signFunction(params) {
    var dataToSign = buildDataToSign(params);
    var signature = crypto_1.default.createHmac(HMAC_SHA256, SECRET_KEY).update(dataToSign).digest('base64');
    return signature;
}
exports.signFunction = signFunction;
function buildDataToSign(params) {
    var signedFieldNames = params['signed_field_names'].split(',');
    var dataToSign = [];
    for (var _i = 0, signedFieldNames_1 = signedFieldNames; _i < signedFieldNames_1.length; _i++) {
        var fieldName = signedFieldNames_1[_i];
        dataToSign.push(fieldName + "=" + params[fieldName]);
    }
    return dataToSign.join(',');
}
//# sourceMappingURL=signFunction.js.map