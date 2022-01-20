const userService = require('../services/userService');
const apiFunction = require('../function/function');
const adminService = require('../services/adminService');
const Error = require('../module/error');
const ACCESS_TOKEN_SECRET = 'api_webtientien'
const jwt = require('jsonwebtoken');
const multer = require('multer')
var storage = multer.memoryStorage();
var upload = multer({ storage: storage }).none();

let signUp = async (req, res) => {
    upload(req, res, async (err) => {
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

let signIn = async (req, res) => {
    upload(req, res, async (err) => {
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
                        var userUpdateToken = await userService.updateTokenUser(userCheckPass.phonenumber, jwt.sign(JSON.stringify(req.body) + date.getTime(), ACCESS_TOKEN_SECRET));
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
                                message: 'ok',
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

let signOut = async (req, res) => {
    upload(req, res, async (err) => {
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
                        message: 'ok',
                    }));
                }
            }
            else {
                Error.code9998(res);
            }
        }
    })
}

let setBlockUser = async (req, res) => {
    upload(req, res, async (err) => {
        var token = req.body.token;
        var user_id = req.body.user_id;
        var type = req.body.type;
        if (token == null || token == undefined || token == '' || user_id == null || user_id == undefined || user_id == '' || type == null || type == undefined || type == '') {
            Error.code1002(res);
        }
        else {
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken != null) {
                var user2 = await userService.checkUserById(user_id)
                if (user2 != null) {
                    var dataBlockUser = userCheckToken.block_id
                    var objDataBlockUser = JSON.parse(userCheckToken.block_id)
                    if (type == '0') {
                        if (dataBlockUser.includes(user_id)) { // Nếu đã từng block
                            Error.code1010(res)
                        } else {
                            objDataBlockUser.block.push(user_id)
                            var addBlock = await userService.addBlock(userCheckToken.id, JSON.stringify(objDataBlockUser))
                            if (addBlock != null) {
                                res.send(JSON.stringify({
                                    code: "1000",
                                    message: 'ok',
                                }));
                            } else {
                                Error.code1005(res)
                            }
                        }
                    } else if (type == '1') {
                        if (dataBlockUser.includes(user_id)) { // Nếu đã từng block
                            objDataBlockUser.block.splice(objDataBlockUser.block.indexOf(user_id))
                            var addBlock = await userService.addBlock(userCheckToken.id, JSON.stringify(objDataBlockUser))
                            if (addBlock != null) {
                                res.send(JSON.stringify({
                                    code: "1000",
                                    message: 'ok',
                                }));
                            } else {
                                Error.code1005(res)
                            }
                        } else { // Nếu chưa block
                            Error.code1004(res)
                        }
                    } else {
                        Error.code1004(res)
                    }
                } else {
                    Error.code1004(res)
                }
            } else {
                Error.code9998(res);
            }
        }
    })
}

let setBlockDiary = async (req, res) => {
    upload(req, res, async (err) => {
        var token = req.body.token;
        var user_id = req.body.user_id;
        var type = req.body.type;
        if (token == null || token == undefined || token == '' || user_id == null || user_id == undefined || user_id == '' || type == null || type == undefined || type == '') {
            Error.code1002(res);
        }
        else {
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken != null) {
                var user2 = await userService.checkUserById(user_id)
                if (user2 != null) {
                    var dataBlockDiary = userCheckToken.block_diary_id
                    var objDataBlockDiary = JSON.parse(userCheckToken.block_diary_id)
                    if (type == '0') {
                        if (dataBlockDiary.includes(user_id)) { // Nếu đã từng block
                            Error.code1010(res)
                        } else {
                            objDataBlockDiary.block.push(user_id)
                            var addBlockDiary = await userService.addBlockDiary(userCheckToken.id, JSON.stringify(objDataBlockDiary))
                            if (addBlockDiary != null) {
                                res.send(JSON.stringify({
                                    code: "1000",
                                    message: 'ok',
                                }));
                            } else {
                                Error.code1005(res)
                            }
                        }
                    } else if (type == '1') {
                        if (dataBlockDiary.includes(user_id)) { // Nếu đã từng block
                            objDataBlockDiary.block.splice(objDataBlockDiary.block.indexOf(user_id))
                            var addBlockDiary = await userService.addBlockDiary(userCheckToken.id, JSON.stringify(objDataBlockDiary))
                            if (addBlockDiary != null) {
                                res.send(JSON.stringify({
                                    code: "1000",
                                    message: 'ok',
                                }));
                            } else {
                                Error.code1005(res)
                            }
                        } else { // Nếu chưa block
                            Error.code1004(res)
                        }
                    } else {
                        Error.code1004(res)
                    }
                } else {
                    Error.code1004(res)
                }
            } else {
                Error.code9998(res);
            }
        }
    })
}


let getVerifyCode = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        var phoneNumber = req.body.phonenumber;
        if (phoneNumber == null || phoneNumber == undefined || phoneNumber == '') {
            Error.code1002(res);
        }
        else {
            var userCheckPhonenumber = await userService.checkphoneuser(phoneNumber)
            if (userCheckPhonenumber != null) {
                let date = new Date();
                let seconds = date.getTime() / 1000 | 0;
                var id_user = userCheckPhonenumber.id
                var dataVerify = await adminService.getVerifyCode(id_user)
                if (dataVerify == null) { // Nếu chưa get bao giờ
                    var getVerify = await userService.getVerify(id_user)
                    if (getVerify != null) {
                        res.send(JSON.stringify({
                            code: "1000",
                            message: 'ok',
                        }));
                    } else {
                        Error.code1005(res)
                    }
                } else {
                    if (dataVerify.next_time_request < seconds) {
                        var updateCode = await userService.updateCode(id_user)
                        if (updateCode != null) {
                            res.send(JSON.stringify({
                                code: "1000",
                                message: 'ok',
                            }));
                        } else {
                            Error.code1005(res)
                        }
                    } else {
                        Error.code1010(res)
                    }
                }
            } else {
                Error.code1004(res)
            }
        }
    })
}

let checkVerifyCode = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        var phoneNumber = req.body.phonenumber;
        var verify_code = req.body.code_verify
        if (phoneNumber == null || phoneNumber == undefined || phoneNumber == '' || verify_code == null || verify_code == undefined || verify_code == '') {
            Error.code1002(res);
        }
        else {
            var userCheckPhonenumber = await userService.checkphoneuser(phoneNumber)
            if (userCheckPhonenumber != null) {
                var id_user = userCheckPhonenumber.id
                var dataVerify = await adminService.getVerifyCode(id_user)
                if (dataVerify == null) { // Nếu chưa get bao giờ
                    Error.code1004(res)
                } else {
                    if (dataVerify.code + '' == verify_code) {
                        var date = new Date();
                        var userUpdateToken = await userService.updateTokenUser(phoneNumber, jwt.sign(JSON.stringify(req.body) + date.getTime(), ACCESS_TOKEN_SECRET));
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
                                message: 'ok',
                                data: userdata,
                            }));
                        }
                    } else {
                        Error.code9993(res)
                    }
                }
            } else {
                Error.code1004(res)
            }
        }
    })
}

let deleteSavedSearch = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        var token = req.body.token;
        var search_id = req.body.search_id;
        var all = req.body.all
        if (token == null || token == undefined || token == '' || search_id == null || search_id == undefined || search_id == '' || all == null || all == undefined || all == '') {
            Error.code1002(res);
        }
        else {
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken != null) {
                if (all == '1') { // Xóa tất cả
                    var deleteAllSearch = await userService.deleteAllSearch(userCheckToken.id)
                    if (deleteAllSearch == true) {
                        res.send(JSON.stringify({
                            code: "1000",
                            message: 'ok',
                        }));
                    } else {
                        Error.code9999(res)
                    }
                } else if (all == '0') {
                    var dataSearch = await userService.checkSearchByIdSearch(search_id)
                    if (dataSearch.user_id == userCheckToken.id) {
                        var deleteSearch = await userService.deleteSearchById(search_id)
                        if (deleteSearch == true) {
                            res.send(JSON.stringify({
                                code: "1000",
                                message: 'ok',
                            }));
                        } else {
                            Error.code1005(res)
                        }
                    } else {
                        Error.code1009(res)
                    }
                } else {
                    Error.code1004(res)
                }
            } else {
                Error.code9998(res)
            }
        }
    })
}

let changePassword = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        var token = req.body.token;
        var password = req.body.password;
        var new_password = req.body.new_password
        if (token == null || token == undefined || token == '' || password == null || password == undefined || password == '' || new_password == null || new_password == undefined || new_password == '') {
            Error.code1002(res);
        }
        else {
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken != null) {
                if (userCheckToken.password == apiFunction.MD5(password)) {
                    var updatePass = await userService.updatePass(userCheckToken.id, apiFunction.MD5(new_password))
                    if (updatePass == true) {
                        res.send(JSON.stringify({
                            code: "1000",
                            message: 'ok',
                        }));
                    } else {
                        Error.code1005(res)
                    }
                } else {
                    Error.code1004(res)
                }
            } else {
                Error.code9998(res)
            }
        }
    })
}

let setUserInfo = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        var token = req.body.token;
        var username = req.body.username;
        var avatar = req.body.avatar;
        if (token == undefined || username == undefined || avatar == undefined || token == '' || username == '' || avatar == '' || token == null || username == null || avatar == null) {
            Error.code1002(res);
        }
        else {
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken !== null) {
                var userUpdateInformation = await userService.updateInformationUser(userCheckToken.id, username, avatar);
                if (userUpdateInformation !== null) {
                    var outPut = {
                        "username": username,
                        "avatar": avatar,
                    }
                    res.send(JSON.stringify({
                        code: "1000",
                        message: "ok",
                        data: outPut,
                    }));
                } else {
                    Error.code1005(res);
                }
            }
            else {
                Error.code9998(res);
            }
        }
    })
}

let getSaveSearch = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        var count = req.body.count;
        var token = req.body.token;
        var index = req.body.index;
        if (count == undefined || token == undefined || index == undefined | count == '' || token == '' || index == '' ||count == null || token == null || index == null) {
            Error.code1002(res);
        }
        else if ( index < 0) {
            Error.code1004(res);
        }
        else {
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken !== null) {
                var checkHistorySearch = await userService.getSaveSearch(userCheckToken.id, index, count);
                if (checkHistorySearch.length == 0) {
                    Error.code9994(res)
                }else{
                    res.send(JSON.stringify({
                        code: "1000",
                        message: 'OK',
                        data: checkHistorySearch,
                    }))
                }
            }
            else {
                Error.code9998(res);
            }
        }
    })
}

let a = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
    })
}
module.exports = {
    signUp: signUp,
    signIn: signIn,
    signOut: signOut,
    setBlockUser: setBlockUser,
    setBlockDiary: setBlockDiary,
    getVerifyCode: getVerifyCode,
    checkVerifyCode: checkVerifyCode,
    deleteSavedSearch: deleteSavedSearch,
    changePassword: changePassword,
    setUserInfo: setUserInfo,
    getSaveSearch: getSaveSearch
}