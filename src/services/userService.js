
const userModel= require('../models/userModels');
const friendService = require('./friendService');
const apiFunction = require('../function/function');

let getAllUser = () => {
    return new Promise((async (resolve, reject) => {
        try {
            let data = await userModel.getAll();
            if (data != null) {
                resolve(data);
            }
            else {
                resolve(null);
            }
        } catch (e) {
            reject(e);
        }
    }));
}

let getListUser = (index, count) => {
    return new Promise((async (resolve, reject) => {
        try {
            let data = await userModel.getAll();
            if (data != null) {
                var dataListUser = []
                for (let i = index ; i < data.length; i++) {
                    if (i < index + count) {
                        dataListUser.push({
                            user_id:data[i].id+'',
                            username:data[i].username,
                            avatar:data[i].link_avatar,
                            is_avtive: data[i].token == null || data[i].token == "null" ? "0" : "1"
                        })
                    }
                }
                resolve(dataListUser);
            }
            else {
                resolve(null);
            }
        } catch (e) {
            reject(e);
        }
    }));
}

let checkphoneuser = (phonenumber) => {
    return new Promise((async (resolve, reject) => {
        try {
            let data = await userModel.checkPhoneUser(phonenumber);
            if (data != null) {
                if(data.length == 0){
                    resolve(null)
                }
                else{
                    resolve(data[0]);
                }
            }
            else {
                resolve(null);
            }
        } catch (e) {
            reject(e);
        }
    }));
}

let addUser = (dataUser) => {
    return new Promise((async (resolve, reject) => {
        try {
            let user = await userModel.addUser(dataUser);
            if (user.id != 0) {
                resolve(user);
            }
            else {
                resolve(null);
            }
        } catch (e) {
            reject(e);
        }
    }));
}

let checkPassUser = (phoneNumber, passWord) => {
    return new Promise((async (resolve, reject) => {
        try {
            let user = await userModel.checkPassUser(phoneNumber, passWord);
            if (user != null && user != undefined) {
                if (user.length != 0) {
                    resolve(user[0]);
                }
                else {
                    resolve(null);
                }
            }
            else {
                resolve(null)
            }
        } catch (e) {
            reject(e);
        }
    }));
}

let updateTokenUser = (phoneNumberUser, token) => {
    return new Promise((async (resolve, reject) => {
        try {
            let user = await userModel.updateTokenUser(phoneNumberUser, token);
            if (user.changedRows == 1) {
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

let checkUserByToken = (token) => {
    return new Promise((async (resolve, reject) => {
        try {
            let user = await userModel.checkUserByToken(token);
            if (user != null && user != undefined) {
                if (user.length != 0) {
                    resolve(user[0]);
                }
                else {
                    resolve(null);
                }
            }
            else {
                resolve(null)
            }
        } catch (e) {
            reject(e);
        }
    }));
}



let updateAdminUser = (id_admin, token) => {
    return new Promise((async (resolve, reject) => {
        try {
            let user = await userModel.updateAdminUser(id_admin, token);
            if (user.changedRows == 1) {
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

let setRole = (id, role) => {
    return new Promise((async (resolve, reject) => {
        try {
            let user = await userModel.setRoleUser(id, role);
            if (user.changedRows == 1) {
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

let setState = (id, state) => {
    return new Promise((async (resolve, reject) => {
        try {
            let user = await userModel.setState(id, state);
            if (user.changedRows == 1) {
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


let addBlock = (id, dataBlock) => {
    return new Promise((async (resolve, reject) => {
        try {
            let user = await userModel.addBlock(id, dataBlock);
            if (user.affectedRows == 1) {
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

let addBlockDiary = (id, dataBlockDiary) => {
    return new Promise((async (resolve, reject) => {
        try {
            let user = await userModel.addBlockDiary(id, dataBlockDiary);
            if (user.affectedRows == 1) {
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


let delUser = (id_user) => {
    return new Promise((async (resolve, reject) => {
        try {
            let user = await userModel.delUser(id_user);
            if (user.affectedRows == 1) {
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

let getUserInfo = (user_token_id , user_id) =>{
    return new Promise((async (resolve, reject) => {
        try {
            let user = await userModel.checkUserById(user_id);
            if (user.length != 0) {
                user = user[0]
                var numberFriend = await friendService.getListFriend(user.id)
                numberFriend = numberFriend == null ? 0 : numberFriend.length
                var isFriend = await friendService.checkIsFriend(user_token_id,user_id) == true ? 1 : 0
                var isOnl = user.token == null || user.token =='null' ? 0 : 1
                var dataRes = {
                    id:user.id +'',
                    username:user.username,
                    avatar:user.link_avatar,
                    link: 'user/' + user.id+'',
                    listing: numberFriend +'',
                    is_friend:isFriend+'',
                    online:isOnl+''
                }
                resolve(dataRes);
            }
            else {
                resolve(null);
            }
        } catch (e) {
            reject(e);
        }
    }));
}

let getVerify = (id_user) => {
    return new Promise((async (resolve, reject) => {
        try {
            let date = new Date();
            let seconds = date.getTime() / 1000 | 0;
            var verify_code = apiFunction.getRandom(100000,999999)
            var dataVerify = {
                id:id_user,
                code:verify_code,
                number_error:0,
                time_block:0,
                next_time_request: seconds + 120,
            }
            let code = await userModel.getVerify(dataVerify);
            if (code.id != 0) {
                resolve(code);
            }
            else {
                resolve(null);
            }
        } catch (e) {
            reject(e);
        }
    }));
}

let updateCode = (id_user) => {
    return new Promise((async (resolve, reject) => {
        try {
            let date = new Date();
            let seconds = date.getTime() / 1000 | 0;
            var verify_code = apiFunction.getRandom(100000,999999)
            let code = await userModel.updateCode(id_user, verify_code, seconds + 120);
            if (code.affectedRows == 1) {
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

let checkUserById = (Id) =>{ 
    return new Promise((async (resolve, reject) => {
        try {

            let user = await userModel.checkUserById(Id);
            if (user.length != 0) {
                resolve(user[0]);
            }
            else {
                resolve(null);
            }
        } catch (e) {
            reject(e);
        }
    }));
}

let deleteAllSearch = (id_user) => {
    return new Promise((async (resolve, reject) => {
        try {
            let dataDell = await userModel.deleteAllSearch(id_user);
            if (dataDell.affectedRows != 0) {
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

let checkSearchByIdSearch = (id_search) => {
    return new Promise((async (resolve, reject) => {
        try {
            let dataSearch = await userModel.checkSearchByIdSearch(id_search);
            if (dataSearch != null && dataSearch != undefined) {
                if (dataSearch.length != 0) {
                    resolve(dataSearch[0]);
                }
                else {
                    resolve(null);
                }
            }
            else {
                resolve(null)
            }
        } catch (e) {
            reject(e);
        }
    }));
}

let deleteSearchById = (id_search) => {
    return new Promise((async (resolve, reject) => {
        try {
            let dataDell = await userModel.deleteSearchById(id_search);
            if (dataDell.affectedRows != 0) {
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

module.exports={
    getAllUser:getAllUser,
    checkphoneuser:checkphoneuser,
    addUser:addUser,
    checkPassUser:checkPassUser,
    updateTokenUser:updateTokenUser,
    checkUserByToken:checkUserByToken,
    checkUserById:checkUserById,
    updateAdminUser:updateAdminUser,
    getListUser:getListUser,
    setRole:setRole,
    setState:setState,
    addBlock:addBlock,
    delUser:delUser,
    getUserInfo:getUserInfo,
    addBlockDiary:addBlockDiary,
    getVerify:getVerify,
    updateCode:updateCode,
    deleteAllSearch:deleteAllSearch,
    checkSearchByIdSearch:checkSearchByIdSearch,
    deleteSearchById:deleteSearchById
}