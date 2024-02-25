require('dotenv').config()
const { DataBaseService } = require('../../services/db.service');

class AuthService extends DataBaseService{
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

    registerUser = async(payload)=>{
        try{
            let response = await this.db.collection("users").insertOne(payload)
        }catch(exception){
            throw exception
        }
    }
 
    getuserByFilter = async(filter) =>{
        try{
            let userDetail = await this.db.collection('users').findOne(filter)
            return userDetail;
        }catch(exception){
            throw exception
        }
    }
    updateUser = async(filter, data)=>{
        try{
            let response = await this.db.collection('users').updateOne(filter,{
                $set: data
            })
            return response;
        }catch(exception){
            throw exception;
        }
    }

}

const authSvc = new AuthService;
module.exports = authSvc