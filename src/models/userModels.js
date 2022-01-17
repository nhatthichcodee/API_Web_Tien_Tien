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

module.exports = User;