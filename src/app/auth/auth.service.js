const dotenv = require('dotenv').config()
class AuthService{
    transport;
    registerEmailMessage=(name, token)=>{
        return  `
        <b> Dear ${name}</b><br/>
        <p>Your account has been successfully registered. Please copy or click the link below to activate your account: </p>
        <a href= "${process.env.FRONTEND_URL}/activate/${token}">
        ${process.env.FRONTEND_URL}/activate/${token}
        </a> <br/>
        <p>
        <b>System Admin <b/>
        </p>
        <p>
            <en><small>Please do not reply to this email.</small></em>
        </p>
    `
    }
}

const authSvc = new AuthService;
module.exports = authSvc