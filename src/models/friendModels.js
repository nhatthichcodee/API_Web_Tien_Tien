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

Friend.checkIsFriend = (id_user_1, id_user_2) =>{
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`SELECT * FROM friend  WHERE id_user_1 = '${id_user_1}' AND id_user_2 = '${id_user_2}' OR id_user_1 = '${id_user_2}' AND id_user_2 = '${id_user_1}'`, (err, res) => {
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

Friend.setRequest = (data) =>{
    return new Promise((async (resolve, reject) => {
        try {
            db.query("INSERT INTO requested_friend SET ?", data, (err, res) => {
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

Friend.getCountRequest = (user_id) => {
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`SELECT COUNT(id) AS NumberOfRequest FROM requested_friend WHERE id_user_send = '${user_id}'`, (err, res) => {
                if (err) {
                    Error.code1001(res);
                } else {
                    resolve(res[0].NumberOfRequest);
                }
            })
        } catch (e) {
            reject(e);
        }
    }));
}

Friend.getCountSameFriend = (id_user_1,id_user_2) => {
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`SELECT COUNT(id) AS NumberOfSameFriend FROM friend WHERE id_user_1 = '${id_user_1}' AND id_user_2 = '${id_user_2}' OR id_user_1 = '${id_user_2}' AND id_user_2 = '${id_user_1}'`, (err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    resolve(res[0].NumberOfSameFriend);
                }
            })
        } catch (e) {
            reject(e);
        }
    }));
}

module.exports = Friend;