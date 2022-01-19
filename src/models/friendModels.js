const db = require('../config/database')
const Friend = function (friend) {
}


Friend.getListFriend  = (id) =>{
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`SELECT * FROM friend  WHERE id_user_1 = '${id}' OR id_user_2 = '${id}'`, (err, res) => {
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

Friend.dellAllFriend  = (user_id) =>{
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`DELETE FROM friend WHERE id_user_1 = '${user_id}' OR id_user_2 = '${user_id}'`, (err, res) => {
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

Friend.getRquestFriendById = (id_user) =>{
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`SELECT * FROM requested_friend  WHERE id_user_receiver = '${id_user}'`, (err, res) => {
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

Friend.getRequestFriendBy2Id = (id_user_send,id_user_receiver) =>{
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`SELECT * FROM requested_friend  WHERE id_user_receiver = '${id_user_receiver}' AND id_user_send = '${id_user_send}' `, (err, res) => {
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

Friend.addFriend = (data) =>{
    return new Promise((async (resolve, reject) => {
        try {
            db.query("INSERT INTO friend SET ?", data, (err, res) => {
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
}

Friend.deleteRequestById = (id_request) =>{
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`DELETE FROM requested_friend WHERE id = '${id_request}'`, (err, res) => {
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

module.exports = Friend;