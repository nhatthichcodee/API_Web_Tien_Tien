const adminModel = require('../models/adminModels');
const con = require('../config/database');



let getVerifyCode = (id_admin) => {
    return new Promise((async (resolve, reject) => {
        try {
            var code = await adminModel.getVerifyCode(id_admin)
            if (code != null) {
                resolve(code[0])
            }else{
                resolve(null)
            }
        } catch (e) {
            reject(e);
        }
    }));
}

let updateErrorVerify = (id_admin,number_error,time_block) => {
    return new Promise((async (resolve, reject) => {
        try {
            var dataUpdate = await adminModel.updateErrorVerify(id_admin,number_error,time_block)
            if (dataUpdate.affectedRows == 1) {
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

let a = (index, count, idUser) => {
    return new Promise((async (resolve, reject) => {
        try {

        } catch (e) {
            reject(e);
        }
    }));
}


module.exports = {
    getVerifyCode:getVerifyCode,
    updateErrorVerify:updateErrorVerify,
}