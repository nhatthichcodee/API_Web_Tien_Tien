const postModel = require('../models/postModels');
const userService = require('../services/userService');
const postService = require('../services/postService');
const commentModel = require('../models/commentModels');
const apiFunction = require('../function/function');
const chatModel = require('../models/chatModels');
const con = require('../config/database');

let getListConversationByID = (index, count, idUser) => {
    return new Promise((async (resolve, reject) => {
        try {
            var listDataConversation = [];
            let data = await chatModel.getListConversationByID(idUser);
            if (data != 0) {
                var listConversation = []
                var numNewMessage = 0
                if (index > data.length || index < 0) {
                    resolve(null)
                } else {
                    for (let i = index; i < data.length; i++) {
                        if (i < index + count) {
                            listConversation.push(data[i])
                        }
                    }
                    for (let i = 0; i < listConversation.length; i++) {
                        var user = await userService.checkUserById(listConversation[i].id_user_2)
                        var idLastMess = await chatModel.getIdLastMess(listConversation[i].id)
                        var dataLastMess = null
                        if (idLastMess != null) {
                            dataLastMess = await chatModel.getMessById(idLastMess)
                            if (dataLastMess.unread == 1) {
                                numNewMessage++
                            }
                        }
                        listDataConversation.push({
                            id: listConversation[i].id + "",
                            partner: {
                                id: user.id + '',
                                username: user.username,
                                avatar: user.link_avatar
                            },
                            lastmessage: dataLastMess == null ? null : {
                                message: dataLastMess.message,
                                created: dataLastMess.created,
                                uread: dataLastMess.unread + ""
                            }
                        })
                    }
                }
                resolve({ data: listDataConversation, numNewMessage: numNewMessage });
            }
            else {
                resolve(null);
            }
        } catch (e) {
            reject(e);
        }
    }));
}

let getConversationIdByUser = (id_user_1,id_user2) => {
    return new Promise((async (resolve, reject) => {
        try {
            var idConversation = await chatModel.getConversationIdByUser(id_user_1,id_user2)
            if (idConversation != null) {
                resolve(idConversation.id)
            }else{
                resolve(null);
            }
        } catch (e) {
            reject(e);
        }
    }));
}

let getConversationUserById = (id) => {
    return new Promise((async (resolve, reject) => {
        try {
            var user = await chatModel.getConversationUserById(id)
            if (user != null) {
                resolve(user)
            }else{
                resolve(null);
            }
        } catch (e) {
            reject(e);
        }
    }));
}

let getChatByConversationId = (id,index,count,user1,user2) => {
    return new Promise((async (resolve, reject) => {
        try {
            var chat = await chatModel.getChatByConversationId(id)
            if (chat.length != 0) {
                var listChat = []
                var listDataChat = []
                if (index > chat.length || index < 0 || count < 0) {
                    resolve(null)
                } else {
                    for (let i = index; i < chat.length; i++) {
                        if (i < index + count) {
                            listChat.push(chat[i])
                        }
                    }
                    for (let i = 0; i < listChat.length; i++) {
                        var userSenderData = await userService.checkUserById(listChat[i].id_sender)
                        var idPartner = user1 == listChat[i].id_sender ? user2 : user1
                        var userPartnerData = await userService.checkUserById(idPartner)
                        var is_blocked = 0
                        if (userPartnerData.block_id != null) {
                            if(JSON.parse(userPartnerData.block_id).block.includes(listChat[i].id_sender.toString())){
                                is_blocked = 1
                            }
                        }
                        listDataChat.push({
                            conversation:{
                                message_id: listChat[i].id_message +'',
                                message: listChat[i].message,
                                unread: listChat[i].unread,
                                created: listChat[i].created,
                                sender: {
                                    id: userSenderData.id,
                                    username: userSenderData.username,
                                    avatar: userSenderData.link_avatar
                                }
                            },
                            is_blocked : is_blocked
                        })
                    }
                }
                resolve(listDataChat)
            }else{
                resolve(null)
            }
        } catch (e) {
            reject(e);
        }
    }));
}

let a = (index, count, idUser) => {
    return new Promise((async (resolve, reject) => {
        try {


        } catch (e) {
            reject(e);
        }
    }));
}


module.exports = {
    getListConversationByID: getListConversationByID,
    getConversationIdByUser:getConversationIdByUser,
    getConversationUserById:getConversationUserById,
    getChatByConversationId:getChatByConversationId
}