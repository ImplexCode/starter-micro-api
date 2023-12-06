const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config()


export const MONGO_URI = "mongodb+srv://Api_implexcode:implex.code2023@cluster0.wxmoy6p.mongodb.net/?retryWrites=true&w=majority";
export const APP_SECRET = '238745623hsdf'

export const OTP_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhZjdlNzI0MC00N2FjLTExZWQtYmNmZi1lOTFiZmFkMTY2YzUiLCJzdWIiOiJTSE9VVE9VVF9BUElfVVNFUiIsImlhdCI6MTY2NTMwNDI1MiwiZXhwIjoxOTgwOTIzNDUyLCJzY29wZXMiOnsiYWN0aXZpdGllcyI6WyJyZWFkIiwid3JpdGUiXSwibWVzc2FnZXMiOlsicmVhZCIsIndyaXRlIl0sImNvbnRhY3RzIjpbInJlYWQiLCJ3cml0ZSJdfSwic29fdXNlcl9pZCI6IjczMTQyIiwic29fdXNlcl9yb2xlIjoidXNlciIsInNvX3Byb2ZpbGUiOiJhbGwiLCJzb191c2VyX25hbWUiOiIiLCJzb19hcGlrZXkiOiJub25lIn0.dVAtkOo2XldojzA2SdzPKoxa4t3mhmRVOSsxZYn3Do0';

export const PORT = process.env.PORT || 7000;


export const EmailConfig = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "uc.chamod.public@gmail.com",
    pass: "jhqwpvtnluihkawp"
  },
});


// Host and not host config
export const allowedOrigin = 'http://localhost:3000';
// export const allowedOrigin = 'https://admin.fluentmyenglish.com';