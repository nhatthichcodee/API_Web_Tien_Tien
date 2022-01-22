const userService = require('../services/userService');
const friendService = require('../services/friendService');
const Error = require('../module/error');
const multer = require('multer');
const con = require('../config/database');
var storage = multer.memoryStorage();
const apiFunction = require('../function/function');

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

let getRquestFriend = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        var token = req.body.token;
        var user_id = req.body.user_id;
        var index = req.body.index;
        var count = req.body.count;
        if (token === undefined || index == undefined || count == undefined || token === null || index == null || count == null || token === '' || index == '' || count == '') {
            Error.code1002(res);
        } else {
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken !== null) {
                var idUserCheck = userCheckToken.id
                if (userCheckToken.role > 0) {
                    if (!(user_id === undefined || user_id == null || user_id == '')) {
                        idUserCheck = user_id
                    }
                }
                var data = await friendService.getRquestFriendById(idUserCheck)
                if (data == null) {
                    Error.code9994(res)
                } else {
                    if (parseInt(index) > data.length || index < 0) {
                        resolve(null)
                    } else {
                        var dataUserRequest = []
                        for (let i = parseInt(index); i < data.length; i++) {
                            if (i < parseInt(index) + parseInt(count)) {
                                var user = await userService.checkUserById(data[i].id_user_send)
                                dataUserRequest.push({
                                    id: user.id + '',
                                    username: user.username,
                                    avatar: user.link_avatar,
                                    created: data[i].created + ''
                                })
                            }
                        }
                    }
                    res.send(JSON.stringify({
                        code: "1000",
                        message: 'ok',
                        data: {
                            friends: dataUserRequest
                        }
                    }))
                }
            } else {
                Error.code9998(res)
            }
        }
    })
}

let setAcceptFriend = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        var token = req.body.token;
        var user_id = req.body.user_id;
        var is_accept = req.body.is_accept;
        if (token === undefined || user_id == undefined || is_accept == undefined || token === null || user_id == null || is_accept == null || token === '' || user_id == '' || is_accept == '') {
            Error.code1002(res);
        } else {
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken !== null) {
                var dataRequest = await friendService.getRequestFriendBy2Id(user_id, userCheckToken.id)
                if (dataRequest == null) {
                    Error.code1004(res)
                } else {
                    if (is_accept == '0' || is_accept == '1') {
                        if (is_accept == '1') {
                            await friendService.addFriend({
                                id_user_1: parseInt(user_id),
                                id_user_2: userCheckToken.id
                            })
                        }
                        var deleteRequest = await friendService.deleteRequestById(dataRequest.id)
                        if (deleteRequest == true) {
                            res.send(JSON.stringify({
                                code: "1000",
                                message: 'ok',
                            }))
                        } else {
                            Error.code1005(res)
                        }
                    } else {
                        Error.code1004(res)
                    }
                }
            } else {
                Error.code9998(res)
            }
        }
    })
}

let setRequestFriend = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        var token = req.body.token;
        var user_id = req.body.user_id;
        if (token === undefined || user_id == undefined || token === null || user_id == null || token === '' || user_id == '') {
            Error.code1002(res);
        } else {
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken !== null) {
                var user2 = await userService.checkUserById(user_id)
                if (user2 == null) {
                    Error.code1004(res)
                } else {
                    // Check xem có phải là bạn bè
                    var isFriend = await friendService.checkIsFriend(userCheckToken.id, user_id)
                    if (isFriend == false) {
                        //Check xem đã request trước đây
                        var isRequest = await friendService.getRequestFriendBy2Id(userCheckToken.id, user_id)
                        if (isRequest == null) {
                            // Check xem bị block
                            if (user2.block_id.includes(userCheckToken.id.toString())) {
                                Error.code1009(res)
                            } else {
                                // Check xem người kia có gửi ngược lại mình
                                var isRequest2 = await friendService.getRequestFriendBy2Id(user_id, userCheckToken.id)
                                if (isRequest2 == null) {
                                    var setRequest = friendService.setRequest(userCheckToken.id, user_id)
                                    if (setRequest != null) {
                                        res.send(JSON.stringify({
                                            code: "1000",
                                            message: 'ok',
                                            data: {
                                                reqiested_friends: await friendService.getCountRequest(userCheckToken.id) + ''
                                            }
                                        }))
                                    } else {
                                        Error.code1005(res);
                                    }
                                } else {
                                    // Nếu có gửi ngược lại
                                    await friendService.addFriend({
                                        id_user_1: parseInt(user_id),
                                        id_user_2: userCheckToken.id
                                    })
                                    var deleteRequest = await friendService.deleteRequestById(isRequest2.id)
                                    if (deleteRequest == true) {
                                        res.send(JSON.stringify({
                                            code: "1000",
                                            message: 'ok',
                                            data: {
                                                reqiested_friends: await friendService.getCountRequest(userCheckToken.id) + ''
                                            }
                                        }))
                                    } else {
                                        Error.code1005(res)
                                    }
                                }
                            }
                        } else {
                            Error.code1010(res)
                        }
                    } else {
                        Error.code1009(res)
                    }
                }
            } else {
                Error.code9998(res)
            }
        }
    })
}

let getUserInfo = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        var token = req.body.token;
        var user_id = req.body.user_id;
        if (token === undefined || token === '' || token === null) {
            Error.code1002(res);
        } else {
            var userCheckToken = await userService.checkUserByToken(token);
            var isRes = false;
            if (userCheckToken !== null) {
                var idGetInfo = userCheckToken.id
                if (!(user_id === undefined || user_id === '' || user_id === null)) {
                    var user2 = await userService.checkUserById(user_id);
                    if (user2 == null) {
                        Error.code1004(res)
                    } else {
                        var isFriend = await friendService.checkIsFriend(userCheckToken.id, user_id)
                        if (isFriend == true || userCheckToken.role > user2.role) {
                            idGetInfo = user2.id
                        } else {
                            isRes = true
                            Error.code1009(res)
                        }
                    }
                }
                if (isRes == false) {
                    var dataUser = await userService.getUserInfo(userCheckToken.id, idGetInfo)
                    if (dataUser == null) {
                        Error.code1005(res)
                    } else {
                        res.send(JSON.stringify({
                            code: "1000",
                            message: 'ok',
                            data: dataUser
                        }))
                    }
                }
            } else {
                Error.code9998(res)
            }
        }
    })
}

let getSuggestedListFriends = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        var token = req.body.token;
        var index = parseInt(req.body.index);
        var count = parseInt(req.body.count);
        if (token === undefined || index == undefined || count == undefined || token === null || index == null || count == null ) {
            Error.code1002(res);
        } else {
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken !== null) {
                var listFriend = await friendService.getListFriend(userCheckToken.id)
                if (listFriend.length != 0 && listFriend != null) {
                    var listFOF = []
                    for (let i = 0; i < listFriend.length; i++) {
                        var listFriendFOF = await friendService.getListFriend(listFriend[i])
                        for (let j = 0; j < listFriendFOF.length; j++) {
                            if (!(listFriend.includes(listFriendFOF[j]) || listFOF.includes(listFriendFOF[j]) || userCheckToken.id == listFriendFOF[j])) {
                                listFOF.push(listFriendFOF[j])
                            }
                        }
                    }
                    for (let i = 0; i < listFOF.length - 1; i++) {
                        for (let j = 1; j < listFOF.length; j++) {
                            var friendi = await friendService.getListFriend(listFOF[i])
                            var friendj = await friendService.getListFriend(listFOF[j])
                            if (apiFunction.getSame(listFriend, friendi) < apiFunction.getSame(listFriend, friendj)) {
                                var friendTG = listFOF[i]
                                listFOF[i] = listFOF[j]
                                listFOF[j] = friendTG
                            }
                        }
                    }
                    var data = []
                    for (let i = index; i < listFOF.length; i++) {
                        if (i < index + count) {
                            var userData = await userService.checkUserById(listFOF[i])
                            var friendi = await friendService.getListFriend(listFOF[i])
                            data.push({
                                user_id: listFOF[i] + '',
                                username: userData.username,
                                avatar: userData.link_avatar,
                                same_friends: apiFunction.getSame(listFriend, friendi) + ''
                            })
                        }
                    }
                    res.send(JSON.stringify({
                        code: "1000",
                        message: 'ok',
                        data: data
                    }))
                }else{
                    Error.code9994(res)
                }
            } else {
                Error.code9998(res)
            }
        }
    })
}

module.exports = {
    get_user_friends: get_user_friends,
    getRquestFriend: getRquestFriend,
    setAcceptFriend: setAcceptFriend,
    setRequestFriend: setRequestFriend,
    getUserInfo: getUserInfo,
    getSuggestedListFriends: getSuggestedListFriends
}