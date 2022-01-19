
const userModel= require('../models/userModels');
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
    delUser:delUser
}