const userService = require('./userService');
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
                                created: dataLastMess.created + '',
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

let getListConversationByIDNoIndex = (idUser) => {
    return new Promise((async (resolve, reject) => {
        try {
            var listDataConversation = [];
            let data = await chatModel.getListConversationByID(idUser);
            if (data != 0) {
                var listConversation = []
                for (let i = 0; i < data.length; i++) {
                    listConversation.push(data[i])
                }
                for (let i = 0; i < listConversation.length; i++) {
                    var user = await userService.checkUserById(listConversation[i].id_user_2 == idUser ? listConversation[i].id_user_1 : listConversation[i].id_user_2)
                    var idLastMess = await chatModel.getIdLastMess(listConversation[i].id)
                    var dataLastMess = null
                    if (idLastMess != null) {
                        dataLastMess = await chatModel.getMessById(idLastMess)
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
                            created: dataLastMess.created + '',
                            uread: dataLastMess.unread + ""
                        }
                    })

                }
                resolve(listDataConversation);
            }
            else {
                resolve(null);
            }
        } catch (e) {
            reject(e);
        }
    }));
}

let getConversationIdByUser = (id_user_1, id_user2) => {
    return new Promise((async (resolve, reject) => {
        try {
            var idConversation = await chatModel.getConversationIdByUser(id_user_1, id_user2)
            if (idConversation != null) {
                resolve(idConversation.id)
            } else {
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
            } else {
                resolve(null);
            }
        } catch (e) {
            reject(e);
        }
    }));
}

let getChatByConversationId = (id, index, count, user1, user2) => {
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
                            if (JSON.parse(userPartnerData.block_id).block.includes(listChat[i].id_sender.toString())) {
                                is_blocked = 1
                            }
                        }
                        listDataChat.push({
                            conversation: {
                                message_id: listChat[i].id_message + '',
                                message: listChat[i].message,
                                unread: listChat[i].unread + '',
                                created: listChat[i].created + '',
                                sender: {
                                    id: userSenderData.id + '',
                                    username: userSenderData.username,
                                    avatar: userSenderData.link_avatar
                                }
                            },
                            is_blocked: is_blocked + ''
                        })
                    }
                }
                resolve(listDataChat)
            } else {
                resolve(null)
            }
        } catch (e) {
            reject(e);
        }
    }));
}

let getChatByConversationIdNoIndex = (id, user1, user2) => {
    return new Promise((async (resolve, reject) => {
        try {
            var chat = await chatModel.getChatByConversationId(id)
            if (chat.length != 0) {
                var listChat = []
                var listDataChat = []
                for (let i = 0; i < chat.length; i++) {
                    listChat.push(chat[i])
                }
                for (let i = 0; i < listChat.length; i++) {
                    var userSenderData = await userService.checkUserById(listChat[i].id_sender)
                    var idPartner = user1 == listChat[i].id_sender ? user2 : user1
                    var userPartnerData = await userService.checkUserById(idPartner)
                    var is_blocked = 0
                    if (userPartnerData.block_id != null) {
                        if (JSON.parse(userPartnerData.block_id).block.includes(listChat[i].id_sender.toString())) {
                            is_blocked = 1
                        }
                    }
                    listDataChat.push({
                        conversation: {
                            message_id: listChat[i].id_message + '',
                            message: listChat[i].message,
                            unread: listChat[i].unread + '',
                            created: listChat[i].created + '',
                            sender: {
                                id: userSenderData.id + '',
                                username: userSenderData.username,
                                avatar: userSenderData.link_avatar
                            }
                        },
                        is_blocked: is_blocked + ''
                    })
                }
                resolve(listDataChat)
            } else {
                resolve(null)
            }
        } catch (e) {
            reject(e);
        }
    }));
}

let getChatByMessId = (id_mess) => {
    return new Promise((async (resolve, reject) => {
        try {
            var chat = await chatModel.getChatByMessId(id_mess)
            if (chat.length != 0) {
                resolve(chat[0])
            } else {
                resolve(null)
            }
        } catch (e) {
            reject(e);
        }
    }));
}

let deleteChat = (id_mess) => {
    return new Promise((async (resolve, reject) => {
        try {
            var delChat = await chatModel.deleteChat(id_mess)
            if (delChat.affectedRows == 1) {
                resolve(true)
            } else {
                resolve(null)
            }
        } catch (e) {
            reject(e);
        }
    }));
}

let deleteConversation = (conversation_id) => {
    return new Promise((async (resolve, reject) => {
        try {
            await chatModel.dellAllChat(conversation_id)
            var deleteConversation = await chatModel.deleteConversation(conversation_id)
            if (deleteConversation.affectedRows == 1) {
                resolve(true)
            } else {
                resolve(null)
            }
        } catch (e) {
            reject(e);
        }
    }));
}

let getListConversationByIDAdmin = (id_user) => {
    return new Promise((async (resolve, reject) => {
        try {
            let data = await chatModel.getListConversationByID(id_user);
            if (data.length != null) {
                resolve(data)
            } else {
                resolve(null)
            }
        } catch (e) {
            reject(e);
        }
    }));
}

let deleteConversationAdmin = (listConversation) => {
    return new Promise((async (resolve, reject) => {
        try {
            for (let i = 0; i < listConversation.length; i++) {
                await deleteConversation(listConversation[i].id)
            }
            resolve(true)
        } catch (e) {
            reject(e);
        }
    }));
}

let addChat = (dataChat) => {
    return new Promise((async (resolve, reject) => {
        try {
            let chat = await chatModel.addChat(dataChat);
            if (chat.id != 0) {
                resolve(chat);
            }
            else {
                resolve(null);
            }
        } catch (e) {
            reject(e);
        }
    }));
}


module.exports = {
    getListConversationByID: getListConversationByID,
    getConversationIdByUser: getConversationIdByUser,
    getConversationUserById: getConversationUserById,
    getChatByConversationId: getChatByConversationId,
    getChatByMessId: getChatByMessId,
    deleteChat: deleteChat,
    deleteConversation: deleteConversation,
    getListConversationByIDAdmin: getListConversationByIDAdmin,
    deleteConversationAdmin: deleteConversationAdmin,
    getListConversationByIDNoIndex: getListConversationByIDNoIndex,
    getChatByConversationIdNoIndex:getChatByConversationIdNoIndex,
    addChat:addChat
}