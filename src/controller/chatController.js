const postService = require('../services/postService');
const userService = require('../services/userService');
const chatService = require('../services/chatService');
const commentService = require('../services/commentService');
const apiFunction = require('../function/function');
const Error = require('../module/error');
const multer = require('multer');
const con = require('../config/database');
const { get_user_friends } = require('./friendController');
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
                    }else{
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
                    }
                } else {
                    Error.code9998(res);
                }
            }
        }
    })
}

let deleteMessage = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        var token = req.body.token;
        var message_id = req.body.message_id;
        var conversation_id = req.body.conversation_id;
        if (token == undefined || message_id == undefined || conversation_id == undefined || token == null || message_id == null || conversation_id == null || token == '' || message_id == '' || conversation_id == '') {
            Error.code1002(res);
        } else {
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken !== null) {
                var userConversation = await chatService.getConversationUserById(conversation_id)
                if(userConversation.id_user_1 == userCheckToken.id || userConversation.id_user_2 == userCheckToken.id){
                    var dataChat = await chatService.getChatByMessId(message_id)
                    if (dataChat != null) {
                        if(dataChat.id_sender == userCheckToken.id){
                            var deleteChat = await chatService.deleteChat(message_id)
                            if (deleteChat == true) {
                                res.send(JSON.stringify({
                                    code: "1000",
                                    message: 'ok'
                                }))
                            }else{
                                Error.code1004(res)
                            }
                        }else{
                            Error.code1004(res)
                        }
                    }else{
                        Error.code1004(res)
                    }
                }else{
                    Error.code1004(res)
                }
            } else {
                Error.code9998(res);
            }
        }
    })
}

let deleteConversation = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        var token = req.body.token;
        var partner_id = req.body.partner_id;
        var conversation_id = req.body.conversation_id;
        if (token == undefined || token == null || token == '') {
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
                                var deleteConversation = await chatService.deleteConversation(conversation_id)
                                if (deleteConversation == true) {
                                    res.send(JSON.stringify({
                                        code: "1000",
                                        message: 'ok'
                                    }))
                                }else{
                                    Error.code1004(res)
                                }
                            } else {
                                Error.code9994(res)
                            }
                        } else {
                            Error.code1004(res)
                        }
                    }else{
                        if (partner_id == undefined || partner_id == null || partner_id == '') {
                            var userConversation = await chatService.getConversationUserById(conversation_id)
                            if (userConversation.id_user_1 == userCheckToken.id || userConversation.id_user_2 == userCheckToken.id) {
                                var deleteConversation = await chatService.deleteConversation(conversation_id)
                                if (deleteConversation == true) {
                                    res.send(JSON.stringify({
                                        code: "1000",
                                        message: 'ok'
                                    }))
                                }else{
                                    Error.code1004(res)
                                }
                            } else {
                                Error.code1004(res)
                            }
                        }
                    }
                }else{
                    Error.code9998(res);
                }
            }
        }
    })
}

let toChatPage = async (req, res) => {
    var dataListConversation = await chatService.getListConversationByIDNoIndex(req.user.id) // Lấy ra cuộc trò chuyện có mình
    var listData = []
    for (let i = 0; i < dataListConversation.length; i++) {
        var userData = await userService.checkUserById(dataListConversation[i].partner.id)
        listData.push({
            phonenumber: userData.phonenumber,
            lastmess:dataListConversation[i].lastmessage.message
        })
    }
    res.render('chat.ejs', {
        phonenumber: req.user.phonenumber,
        dataCoversation: listData
    });
}

let getChat2User = async (req, res) => {
    var dataListConversation = await chatService.getListConversationByIDNoIndex(req.user.id) // Lấy ra list conversation
    var listData = []
    var listDataChat = []
    for (let i = 0; i < dataListConversation.length; i++) {
        var userData = await userService.checkUserById(dataListConversation[i].partner.id) // Lấy ra data của người mình nhắn tin
        listData.push({
            phonenumber: userData.phonenumber,
            lastmess:dataListConversation[i].lastmessage.message
        })
    }
    var userFriend = await userService.checkphoneuser(req.query.phonenumber)
    var dataConversation = await chatService.getConversationIdByUser(userFriend.id,req.user.id)
    var dataChat2User = await chatService.getChatByConversationIdNoIndex(dataConversation,req.user.id,userData.id) // Lấy ra chat của 2 người
    for (let i = 0; i < dataChat2User.length; i++) {
        var user_sender = await userService.checkUserById(dataChat2User[i].conversation.sender.id) // Người gửi
        listDataChat.push({
            isSend: user_sender.id == req.user.id ? "sent" : "replies",
            mess: dataChat2User[i].conversation.message,
        })
    } 
    res.render('chat2user.ejs', {
        phonenumber: req.user.phonenumber,
        phonefriend:req.query.phonenumber,
        idroom: dataConversation,
        dataCoversation: listData,
        dataChat:listDataChat
    });
}

let initIO = (io) => {
    io.on("connection", function (socket) {
        socket.on('joinRoom', data => {
        socket.join(data.idroom);
        });
        socket.on('on-chat', async (datareq) => {
            console.log(datareq)
            var dataUserSend = await userService.checkphoneuser(datareq.phoneuser)
            let date = new Date();
            let seconds = date.getTime()/1000 | 0;
            var dataChat = {
                id_conversation:datareq.idroom,
                id_sender:dataUserSend.id,
                message:datareq.message,
                created:seconds,
                unread:1
            }
            await chatService.addChat(dataChat)
            io.to(datareq.idroom).emit('message', datareq);
        })
    });
}


module.exports = {
    getListConversation: getListConversation,
    getConversation: getConversation,
    deleteMessage: deleteMessage,
    deleteConversation:deleteConversation,
    toChatPage:toChatPage,
    getChat2User:getChat2User,
    initIO:initIO
}