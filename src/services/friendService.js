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
            }else{
                resolve(null)
            }
        } catch (e) {
            reject(e);
        }
    }))
}

let getListPostByListIdFriend = (listFriend)=> {
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

let a = () => {
    return new Promise((async (resolve, reject) => {
        try {

        } catch (e) {
            reject(e);
        }
    }))
}

module.exports = {
    getListFriend:getListFriend,
    getListPostByListIdFriend:getListPostByListIdFriend
}