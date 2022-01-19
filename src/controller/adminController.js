const postService = require('../services/postService');
const userService = require('../services/userService');
const chatService = require('../services/chatService');
const adminService = require('../services/adminService');
const commentService = require('../services/commentService');
const apiFunction = require('../function/function');
const Error = require('../module/error');
const multer = require('multer');
const con = require('../config/database');
var storage = multer.memoryStorage();
const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = 'api_webtientien'


let getAdminPermission = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        var token = req.body.token;
        var admin_id = req.body.admin_id;
        var verify_code = req.body.verify_code;
        if (token == undefined || admin_id == undefined || verify_code == undefined || token == null || admin_id == null || verify_code == null || token == '' || admin_id == '' || verify_code == '') {
            Error.code1002(res);
        }else{
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken !== null) {
                if (userCheckToken.role == 1) {
                    if (userCheckToken.id == admin_id) {
                        var verifyData = await adminService.getVerifyCode(admin_id)
                        if(verifyData.code != null){
                            let date = new Date();
                            let seconds = date.getTime()/1000 | 0;
                            if (verifyData.number_error <= 5 ||  verifyData.time_block + 30 * 60 < seconds) {
                                if (verifyData.code == verify_code) {
                                    var role_key = jwt.sign(req.body.admin_id + "admin" + seconds , ACCESS_TOKEN_SECRET)
                                    await adminService.updateErrorVerify(admin_id,0,0)
                                    var updateAdminUser = await userService.updateAdminUser(admin_id,role_key)
                                    if (updateAdminUser == true) {
                                        res.send(JSON.stringify({
                                            code: "1000",
                                            message: 'ok',
                                            data: {
                                                admin_id: admin_id +'',
                                                role: userCheckToken.role +'',
                                                date:seconds+'',
                                                role_key: role_key,
                                                isActive:"1"
                                            }
                                        }))
                                    }else{
                                        Error.code1005(res)
                                    }
                                }else{
                                    var number_error = verifyData.number_error + 1
                                    await adminService.updateErrorVerify(admin_id,number_error,seconds)
                                    Error.code9993(res)
                                }
                            }else{
                                Error.code1009(res)
                            }
                        }else{
                            Error.code1005(res)
                        }
                    }else{
                        Error.code1004(res)
                    }
                }else{
                    Error.code9995(res)
                }
            }else{
                Error.code9998(res)
            }
        }
    })
}


let getUserList = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        var token = req.body.token;
        var index = req.body.index;
        var count = req.body.count;
        if (token == undefined || index == undefined || count == undefined || token == null || index == null || count == null || token == '' || index == '' || count == '') {
            Error.code1002(res);
        }
        else if (token == "" || index == "" || index < 0) {
            Error.code1004(res);
        }
        else {
            if (count == "" || count <= 0) {
                count = 20
            }
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken !== null) {
                if (userCheckToken.role == 0) {
                    Error.code1009(res)
                }else{
                    var dataListUser = await userService.getListUser(parseInt(index), parseInt(count))
                    if (dataListUser != null) {
                        res.send(JSON.stringify({
                            code: "1000",
                            message: 'ok',
                            data: dataListUser
                        }))
                    }else{
                        Error.code9994(res)
                    }
                }
            }else{
                Error.code9998(res)
            }
        }
    })
}

let setRole = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        var token = req.body.token;
        var role = req.body.role;
        var user_id = req.body.user_id;
        if (token == undefined || role == undefined || user_id == undefined || token == null || role == null || user_id == null || token == '' || role == '' || user_id == '') {
            Error.code1002(res);
        }else{
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken !== null) {
                if (userCheckToken.role != 3) {
                    Error.code1009(res)
                }else{
                    var dataUser = await userService.checkUserById(user_id)
                    if (dataUser == null) {
                        Error.code9996(res)
                    }else{
                        var setRoleUser = await userService.setRole(user_id, role)
                        if (setRoleUser != null) {
                            res.send(JSON.stringify({
                                code: "1000",
                                message: 'ok',
                            }))
                        }else{
                            Error.code1005(res)
                        }
                    }
                }
            }else{
                Error.code9998(res)
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
    getAdminPermission:getAdminPermission,
    getUserList:getUserList,
    setRole:setRole
}