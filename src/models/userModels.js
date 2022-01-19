const db = require('../config/database')
const User = function (user) {
}

User.getAll = () => {
    return new Promise((async (resolve, reject) => {
        try {
            db.query("SELECT * FROM user", function (err, user) {
                if (err) {
                    resolve(null);
                } else {
                    resolve(user);
                }
            });
        } catch (e) {
            reject(e);
        }
    }));
};

User.checkPhoneUser = (phonenumber) => {
    return new Promise((async (resolve, reject) => {
        try {// name_user='${username}'
            db.query(`SELECT * FROM user Where phonenumber = '${phonenumber}' `, function (err, user) {
                if (err) {
                    resolve(null);
                } else {
                    resolve(user);
                }
            });
        } catch (e) {
            reject(e);
        }
    }));
};

User.addUser = (data) => {
    return new Promise((async (resolve, reject) => {
        try {
            db.query("INSERT INTO user SET ?", data, (err, res) => {
                if (err) {
                    resolve(null);
                } else {
                    resolve({ id: res.insertId, ...data });
                }
            })
        } catch (e) {
            reject(e);
        }
    }));
};

User.checkPassUser = (phoneNumber, passWord) =>{
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`SELECT * FROM user WHERE password ='${passWord}' AND phonenumber ='${phoneNumber}'`, (err, res) => {
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
};

User.updateTokenUser = (phoneNumberUser, token) => {
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`UPDATE user SET token ='${token}' WHERE phonenumber = '${phoneNumberUser}'`, (err, res) => {
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
};

User.checkUserByToken = (token) => {
    return new Promise((async (resolve, reject) => {
        try {
            db.query('SELECT * FROM user WHERE token = ?', token, (err, res) => {
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
};

User.checkUserById = (Id) =>{
    return new Promise((async (resolve, reject) => {
        try {
            db.query('SELECT * FROM user WHERE id = ?', Id, (err, res) => {
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

User.updateAdminUser = (id_admin,token) =>{
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`UPDATE user SET role_key ='${token}' WHERE id = '${id_admin}'`, (err, res) => {
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

User.setRoleUser = (id,role) =>{
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`UPDATE user SET role ='${role}' WHERE id = '${id}'`, (err, res) => {
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

User.setState = (id,state) =>{
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`UPDATE user SET state ='${state}' WHERE id = '${id}'`, (err, res) => {
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

User.addBlock = (id,dataBlock) =>{
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`UPDATE user SET block_id = '${dataBlock}'  WHERE id = '${id}'`, (err, res) => {
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

User.delUser = (user_id) =>{
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`DELETE FROM user WHERE id= '${user_id}'`, (err, res) => {
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

module.exports = User;