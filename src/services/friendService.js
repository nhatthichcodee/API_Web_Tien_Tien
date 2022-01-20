const postModel = require('../models/postModels');
const userService = require('../services/userService');
const postService = require('../services/postService');
const commentModel = require('../models/commentModels');
const friendModel = require('../models/friendModels');
const apiFunction = require('../function/function');


let getListFriend = (id) => {
    return new Promise((async (resolve, reject) => {
        try {
            var dataListFriend = await friendModel.getListFriend(id)
            if (dataListFriend.length != 0) {
                var listIdFriend = []
                for (let i = 0; i < dataListFriend.length; i++) {
                    listIdFriend.push(dataListFriend[i].id_user_1 == id ? dataListFriend[i].id_user_2 : dataListFriend[i].id_user_1)
                }
                resolve(listIdFriend)
            } else {
                resolve(null)
            }
        } catch (e) {
            reject(e);
        }
    }))
}

let getListPostByListIdFriend = (listFriend) => {
    return new Promise((async (resolve, reject) => {
        try {
            var dataListPost = []
            for (let i = 0; i < listFriend.length; i++) {
                var dataPostById = await postModel.getListPostByIdUser(listFriend[i])
                if (dataPostById.length != 0) {
                    for (let j = 0; j < dataPostById.length; j++) {
                        dataListPost.push(dataPostById[j])
                    }
                }
            }
            resolve(dataListPost)
        } catch (e) {
            reject(e);
        }
    }))
}

let delAllFriend = (user_id) => {
    return new Promise((async (resolve, reject) => {
        try {
            let friend = await friendModel.dellAllFriend(user_id);
            if (friend.affectedRows == 1) {
                resolve(true);
            }
            else {
                resolve(null)
            }
        } catch (e) {
            reject(e);
        }
    }));
}


let getRquestFriendById = (id_user, index = null, count = null) => {
    return new Promise((async (resolve, reject) => {
        try {
            var data = await friendModel.getRquestFriendById(id_user)
            if (data.length != 0) {
                if (index > data.length || index < 0) {
                    resolve(null)
                } else {
                    var dataUserRequest = []
                    for (let i = index; i < data.length; i++) {
                        if (i < index + count) {
                            var user = await userService.checkUserById(data[i].id_user_send)
                            dataUserRequest.push({
                                id: user.id + '',
                                username: user.username,
                                avatar: user.link_avatar,
                                created: data[i].created + ''
                            })
                        }
                    }
                    resolve(dataUserRequest)
                }
            } else {
                resolve(null)
            }
        } catch (e) {
            reject(e);
        }
    }))
}

let getRequestFriendBy2Id = (id_user_send,id_user_receiver) => {
    return new Promise((async (resolve, reject) => {
        try {
            var data = await friendModel.getRequestFriendBy2Id(id_user_send,id_user_receiver)
            if (data.length != 0) {
                resolve(data[0])
            } else {
                resolve(null)
            }
        } catch (e) {
            reject(e);
        }
    }))
}

let addFriend = (data) => {
    return new Promise((async (resolve, reject) => {
        try {
            let friend = await friendModel.addFriend(data);
            if (friend.id != 0) {
                resolve(friend);
            }
            else {
                resolve(null);
            }
        } catch (e) {
            reject(e);
        }
    }));
}

let deleteRequestById = (id_request) => {
    return new Promise((async (resolve, reject) => {
        try {
            let requestFriend = await friendModel.deleteRequestById(id_request);
            if (requestFriend.affectedRows == 1) {
                resolve(true);
            }
            else {
                resolve(null)
            }
        } catch (e) {
            reject(e);
        }
    }));
}

let checkIsFriend = (id_user_1, id_user_2) => {
    return new Promise((async (resolve, reject) => {
        try {
            if (id_user_1 +'' == id_user_2 +'') {
                resolve(false)
            }else{
                var dataFriend = await friendModel.checkIsFriend(id_user_1,id_user_2)
                if (dataFriend.length != 0) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }
        } catch (e) {
            reject(e);
        }
    }))
}

let setRequest = (id_user_send,id_user_receiver) => {
    return new Promise((async (resolve, reject) => {
        try {
            let date = new Date();
            let seconds = date.getTime()/1000 | 0;
            var data = {
                id_user_send:id_user_send,
                id_user_receiver:id_user_receiver,
                created:seconds+''
            }
            let friend = await friendModel.setRequest(data);
            if (friend.id != 0) {
                resolve(friend);
            }
            else {
                resolve(null);
            }
        } catch (e) {
            reject(e);
        }
    }));
}

let getCountRequest = (user_id) => {
    return new Promise((async (resolve, reject) => {
        try {
            let countRequest = await friendModel.getCountRequest(user_id);
            if (countRequest != null) {
                resolve(countRequest);
            }
            else {
                resolve(null);
            }
        } catch (e) {
            reject(e);
        }
    }));
}


let a = () => {
    return new Promise((async (resolve, reject) => {
        try {

        } catch (e) {
            reject(e);
        }
    }))
}


module.exports = {
    getListFriend: getListFriend,
    getListPostByListIdFriend: getListPostByListIdFriend,
    delAllFriend: delAllFriend,
    getRquestFriendById: getRquestFriendById,
    getRequestFriendBy2Id:getRequestFriendBy2Id,
    addFriend:addFriend,
    deleteRequestById:deleteRequestById,
    checkIsFriend:checkIsFriend,
    setRequest:setRequest,
    getCountRequest:getCountRequest,
}