const postService = require('../services/postService');
const userService = require('../services/userService');
const chatService = require('../services/chatService');
const adminService = require('../services/adminService');
const commentService = require('../services/commentService');
const friendService = require('../services/friendService');
const apiFunction = require('../function/function');
const Error = require('../module/error');
const multer = require('multer');
const con = require('../config/database');
var storage = multer.memoryStorage();

let search = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        var token = req.body.token;
        var keyword = req.body.keyword;
        var index = req.body.index;
        var count = req.body.count;
        if (keyword == undefined || token == undefined || index == undefined || count == undefined || keyword == null || token == null || index == null || count == null || keyword == '' || token == '' || index == '' || count == '') {
            Error.code1002(res);
        } else {
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken !== null) {
                var dataListFriend = await friendService.getListFriend(userCheckToken.id)
                if (dataListFriend == null) {
                    Error.code9994(res)
                } else {
                    var dataListPost = await friendService.getListPostByListIdFriend(dataListFriend)
                    if (dataListPost.length == 0) {
                        Error.code9994(res)
                    } else {
                        for (let i = 0; i < dataListPost.length - 1; i++) {
                            for (let j = i + 1; j < dataListPost.length; j++) {
                                if (apiFunction.getScoreSearch(dataListPost[i].described, keyword) < apiFunction.getScoreSearch(dataListPost[j].described, keyword)) {
                                    var dataTG = dataListPost[i]
                                    dataListPost[i] = dataListPost[j]
                                    dataListPost[j] = dataTG
                                }
                            }
                        }
                        var dataRes = []
                        if (index < dataListPost.length) {
                            for (let i = parseInt(index); i < dataListPost.length; i++) {
                                if (i < parseInt(index) + parseInt(count)) {
                                    dataRes.push(await postService.checkPostById(userCheckToken, dataListPost[i].id, 1))
                                }
                            }
                            res.send(JSON.stringify({
                                code: "1000",
                                message: 'ok',
                                data: dataRes
                            }))
                        } else {
                            Error.code9994(res)
                        }
                    }
                }
            } else {
                Error.code9998(res)
            }
        }
    })
}


let get_user_friends = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        var token = req.body.token;
        var index = req.body.index;
        var count = req.body.count;
        if (token == undefined || index == undefined || count == undefined || token == null || index == null || count == null || token == '' || index == '' || count == '') {
            Error.code1002(res);
        } else {
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken !== null) {
                var dataListFriend = await friendService.getListFriend(userCheckToken.id)
                if (dataListFriend == null) {
                    Error.code9994(res)
                } else {
                    var dataFriend = []
                    if (index < dataListFriend.length) {
                        for (let i = parseInt(index); i < dataListFriend.length; i++) {
                            if (i < parseInt(index) + parseInt(count)) {
                                var user = await userService.checkUserById(dataListFriend[i])
                                dataFriend.push({
                                    user_id: user.id + '',
                                    user_name: user.username,
                                    avatar: user.link_avatar,
                                })
                            }
                        }
                        res.send(JSON.stringify({
                            code: "1000",
                            message: 'ok',
                            data: {
                                friend: dataFriend,
                                total: dataListFriend.length + ''
                            }
                        }))
                    } else {
                        Error.code9994(res)
                    }
                }
            } else {
                Error.code9998(res)
            }
        }
    })
}

let set_user_state = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        var token = req.body.token;
        var role_key = req.body.role_key;
        var user_id = req.body.user_id;
        var state = req.body.state;
        if (role_key == undefined || token == undefined || user_id == undefined || state == undefined || role_key == null || token == null || user_id == null || state == null || role_key == '' || token == '' || user_id == '' || state == '') {
            Error.code1002(res);
        } else {
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken !== null) {
                if (userCheckToken.role_key == role_key) {
                    var user2 = await userService.checkUserById(user_id)
                    if (user2 == null) {
                        Error.code1004(res)
                    }else{
                        if ( user2.role >= userCheckToken.role ) {
                            Error.code1009(res)
                        }else{
                            var userSetState = await userService.setState(user_id,state)
                            if (userSetState != null) {
                                res.send(JSON.stringify({
                                    code: "1000",
                                    message: 'ok',
                                }))
                            }else{
                                Error.code9999(res)
                            }
                        }
                    }
                }else{
                    Error.code1004(res)
                }
            } else {
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
    search: search,
    get_user_friends: get_user_friends,
    set_user_state: set_user_state
}