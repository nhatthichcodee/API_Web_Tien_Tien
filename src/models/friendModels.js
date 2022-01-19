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


module.exports = Friend;