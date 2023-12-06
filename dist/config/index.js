"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowedOrigin = exports.EmailConfig = exports.PORT = exports.OTP_KEY = exports.APP_SECRET = exports.MONGO_URI = void 0;
var nodemailer = require("nodemailer");
var dotenv = require("dotenv");
dotenv.config();
exports.MONGO_URI = "mongodb+srv://dbOnlineFoods:" + encodeURIComponent("dbOnlineFoods@123") + "@cluster0.kwwqwrw.mongodb.net/?retryWrites=true&w=majority";
exports.APP_SECRET = '238745623hsdf';
exports.OTP_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhZjdlNzI0MC00N2FjLTExZWQtYmNmZi1lOTFiZmFkMTY2YzUiLCJzdWIiOiJTSE9VVE9VVF9BUElfVVNFUiIsImlhdCI6MTY2NTMwNDI1MiwiZXhwIjoxOTgwOTIzNDUyLCJzY29wZXMiOnsiYWN0aXZpdGllcyI6WyJyZWFkIiwid3JpdGUiXSwibWVzc2FnZXMiOlsicmVhZCIsIndyaXRlIl0sImNvbnRhY3RzIjpbInJlYWQiLCJ3cml0ZSJdfSwic29fdXNlcl9pZCI6IjczMTQyIiwic29fdXNlcl9yb2xlIjoidXNlciIsInNvX3Byb2ZpbGUiOiJhbGwiLCJzb191c2VyX25hbWUiOiIiLCJzb19hcGlrZXkiOiJub25lIn0.dVAtkOo2XldojzA2SdzPKoxa4t3mhmRVOSsxZYn3Do0';
exports.PORT = process.env.PORT || 7000;
exports.EmailConfig = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "uc.chamod.public@gmail.com",
        pass: "jhqwpvtnluihkawp"
    },
});
// Host and not host config
exports.allowedOrigin = 'http://localhost:3000';
// export const allowedOrigin = 'https://admin.fluentmyenglish.com';
//# sourceMappingURL=index.js.map