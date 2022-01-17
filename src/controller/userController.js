const userService= require('../services/userService');
const apiFunction = require('../function/function');
const Error = require('../module/error');
const ACCESS_TOKEN_SECRET = 'api_webtientien'
const jwt = require('jsonwebtoken');
const multer = require('multer')
var storage = multer.memoryStorage();
var upload = multer({ storage: storage }).none();

let signUp=async(req,res)=>{
    upload(req, res, async (err) =>{
        var phoneNumber = req.body.phonenumber;
        var passWord = req.body.password;
        if (phoneNumber === undefined || passWord === undefined) {
            Error.code1002(res);
        }
        else if (phoneNumber.length !== 10 || phoneNumber[0] !== '0' || phoneNumber === passWord || passWord.length > 10 || passWord.length < 6 || phoneNumber === '' || passWord === '') {
            Error.code1004(res);
        } else {
            var user = await userService.checkphoneuser(phoneNumber);
            if (user == null) {
                var newDataUser = {
                    "username": null,
                    "phonenumber": phoneNumber,
                    "password": apiFunction.MD5(passWord),
                    //"link_user": phoneNumber + "/url"
                }
                var newUser = await userService.addUser(newDataUser);
                if (newUser.phonenumber != null) {
                    res.send(JSON.stringify({
                        code: "1000",
                        message: 'OK',
                        data: newUser
                    }))
                }
            }
            else {
                if (user.phonenumber == phoneNumber) {
                    Error.code9996(res);
                }
            }
    
        }
    })  
}

let signIn=async(req,res)=>{
    upload(req, res, async (err) =>{
        var phoneNumber = req.body.phonenumber;
        var passWord = req.body.password;
        if (phoneNumber === undefined || passWord === undefined) {
            Error.code1002(res);
        }
        else if (phoneNumber.length !== 10 || phoneNumber[0] !== '0' || phoneNumber === passWord || passWord.length > 10 || passWord.length < 6 || phoneNumber === '' || passWord === '') {
            Error.code1004(res);
        } else {
            var user = await userService.checkphoneuser(phoneNumber);
            if (user !== null) {
                if (user.phonenumber == phoneNumber) {
                    var userCheckPass = await userService.checkPassUser(phoneNumber, apiFunction.MD5(passWord));
                    if (userCheckPass !== null) {
                        var date = new Date();
                        var userUpdateToken = await userService.updateTokenUser(userCheckPass.phonenumber, jwt.sign(JSON.stringify(req.body + date.getTime()), ACCESS_TOKEN_SECRET));
                        if (userUpdateToken != null) {
                            var userUpdate = await userService.checkphoneuser(phoneNumber);
                            var userdata = {
                                "id": userUpdate.id + "",
                                "phonenumber": userUpdate.phonenumber + "",
                                "username": userUpdate.username,
                                "token": userUpdate.token,
                                "avatar": userUpdate.link_avatar,
                                "active": "1",
                            }
                            res.send(JSON.stringify({
                                code: "1000",
                                message: 'OK',
                                data: userdata,
                            }));
                        }

                    } else {
                        Error.code1004(res);
                    }

                }
            }
            else {
                Error.code9995(res);
            }
        }
    })
}

let signOut = async(req,res)=>{
    upload(req, res, async (err) =>{
        var token = req.body.token;
        if (token == null || token == undefined) {
            Error.code1002(res);
        }
        else if (token == "") {
            Error.code1004(res);
        }
        else {
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken != null) {
                var userUpdateToken = await userService.updateTokenUser(userCheckToken.phonenumber, null);
                if (userUpdateToken != null) {
                    res.send(JSON.stringify({
                        code: "1000",
                        message: 'OK',
                    }));
                }
            }
            else {
                Error.code9998(res);
            }
        }
    })
}

module.exports={
    signUp:signUp,
    signIn:signIn,
    signOut:signOut,
}