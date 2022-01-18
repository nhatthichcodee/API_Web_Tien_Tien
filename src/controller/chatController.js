const postService = require('../services/postService');
const userService = require('../services/userService');
const chatService = require('../services/chatService');
const commentService = require('../services/commentService');
const apiFunction = require('../function/function');
const Error = require('../module/error');
const multer = require('multer');
const con = require('../config/database');
var storage = multer.memoryStorage();


let getListConversation = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        var token = req.body.token;
        var index = req.body.index;
        var count = req.body.count;
        if (token == undefined || index == undefined || count == undefined || token == null || index == null || count == null || token == '' || index == '' || count == '') {
            Error.code1002(res);
        }
        else if (token == "" || index == "" || index < 0 || count == "" || count <= 0) {
            Error.code1004(res);
        }
        else {
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken !== null) {
                var dataListConversation = await chatService.getListConversationByID(index, count, userCheckToken.id)
                if (dataListConversation != null) {
                    res.send(JSON.stringify({
                        code: "1000",
                        message: 'ok',
                        data: dataListConversation.data,
                        numNewMessage: dataListConversation.numNewMessage + ''
                    }))
                } else {
                    Error.code9997(res);
                }
            }
            else {
                Error.code9998(res);
            }

        }
    })
}

let getConversation = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        var token = req.body.token;
        var index = req.body.index;
        var count = req.body.count;
        var partner_id = req.body.partner_id;
        var conversation_id = req.body.conversation_id;
        if (token == undefined || index == undefined || count == undefined || token == null || index == null || count == null || token == '' || index == '' || count == '') {
            Error.code1002(res)
        } else {
            if ((partner_id == undefined || partner_id == null || partner_id == '') && (conversation_id == undefined || conversation_id == null || conversation_id == '')) {
                Error.code1002(res);
            } else {
                var userCheckToken = await userService.checkUserByToken(token);
                if (userCheckToken !== null) {
                    if (conversation_id == undefined || conversation_id == null || conversation_id == '') {
                        var userPartner = await userService.checkUserById(partner_id)
                        if (userPartner != null) {
                            conversation_id = await chatService.getConversationIdByUser(userCheckToken.id, partner_id)
                            if (conversation_id != null) {
                                var dataChat = await chatService.getChatByConversationId(conversation_id, parseInt(index), parseInt(count), userCheckToken.id, partner_id)
                                if (dataChat != null) {
                                    res.send(JSON.stringify({
                                        code: "1000",
                                        message: 'ok',
                                        data: dataChat,
                                    }))
                                } else {
                                    Error.code9997(res);
                                }
                            } else {
                                Error.code9994(res)
                            }
                        } else {
                            Error.code1004(res)
                        }
                    }
                    if (partner_id == undefined || partner_id == null || partner_id == '') {
                        var userConversation = await chatService.getConversationUserById(conversation_id)
                        if (userConversation.id_user_1 == userCheckToken.id || userConversation.id_user_2 == userCheckToken.id) {
                            var dataChat = await chatService.getChatByConversationId(conversation_id, parseInt(index), parseInt(count), userConversation.id_user_1, userConversation.id_user_2)
                            if (dataChat != null) {
                                res.send(JSON.stringify({
                                    code: "1000",
                                    message: 'ok',
                                    data: dataChat,
                                }))
                            } else {
                                Error.code9997(res);
                            }
                        } else {
                            Error.code1004(res)
                        }
                    }
                } else {
                    Error.code9998(res);
                }
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
    getListConversation: getListConversation,
    getConversation: getConversation
}