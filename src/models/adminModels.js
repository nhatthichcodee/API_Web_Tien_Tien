const db = require('../config/database')
const Admin = function (admin) {

}

Admin.getVerifyCode = (id_admin) => {
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`SELECT * FROM verify_code WHERE id = '${id_admin}' `, (err, res) => {
                if (err) {
                    Error.code1001(res);
                } else {
                    resolve(res);
                }
            })
        } catch (e) {
            reject(e);
        }
    }));
}

Admin.updateErrorVerify = (id_admin,number_error,time_block) => {
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`UPDATE verify_code SET number_error ='${number_error}' , time_block = '${time_block}'  WHERE id = '${id_admin}'`, (err, res) => {
                if (err) {
                    Error.code1001(res);
                } else {
                    resolve(res);
                }
            })
        } catch (e) {
            reject(e);
        }
    }));
}



module.exports = Admin;