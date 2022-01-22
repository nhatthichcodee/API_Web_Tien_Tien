const db = require('../config/database')
const Chat = function (chat) {

}

Chat.getListConversationByID = (id) => {
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`SELECT * FROM conversation  WHERE id_user_1 = '${id}' OR id_user_2 = '${id}'`, (err, res) => {
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

Chat.getIdLastMess = (idConversation) => {
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`SELECT MAX(id_message) as idLastMess FROM chat WHERE id_conversation = '${idConversation}'`, (err, res) => {
                if (err) {
                    Error.code1001(res);
                } else {
                    resolve(res[0].idLastMess);
                }
            })
        } catch (e) {
            reject(e);
        }
    }));
};

Chat.getMessById = (id_mess) => {
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`SELECT * FROM chat WHERE id_message = '${id_mess}'`, (err, res) => {
                if (err) {
                    Error.code1001(res);
                } else {
                    resolve(res[0]);
                }
            })
        } catch (e) {
            reject(e);
        }
    }));
};

Chat.getConversationIdByUser = (id_user_1,id_user_2) => {
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`SELECT * FROM conversation WHERE id_user_1 = '${id_user_1}' AND id_user_2 = '${id_user_2}' OR id_user_1 = '${id_user_2}' AND id_user_2 = '${id_user_1}'`, (err, res) => {
                if (err) {
                    Error.code1001(res);
                } else {
                    resolve(res[0]);
                }
            })
        } catch (e) {
            reject(e);
        }
    }));
};

Chat.getConversationUserById = (id) => {
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`SELECT * FROM conversation WHERE id = '${id}' `, (err, res) => {
                if (err) {
                    Error.code1001(res);
                } else {
                    resolve(res[0]);
                }
            })
        } catch (e) {
            reject(e);
        }
    }));
};

Chat.getChatByConversationId = (id) => {
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`SELECT * FROM chat WHERE id_conversation = '${id}' `, (err, res) => {
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

Chat.getChatByMessId = (id_mess) => {
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`SELECT * FROM chat WHERE id_message = '${id_mess}' `, (err, res) => {
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

Chat.deleteChat = (id_mess) => {
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`DELETE FROM chat WHERE id_message = '${id_mess}' `, (err, res) => {
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

Chat.dellAllChat = (conversation_id) => {
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`DELETE FROM chat WHERE id_conversation = '${conversation_id}' `, (err, res) => {
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

Chat.deleteConversation = (conversation_id) => {
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`DELETE FROM conversation WHERE id = '${conversation_id}' `, (err, res) => {
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

Chat.addChat = (data) => {
    return new Promise((async (resolve, reject) => {
        try {
            db.query("INSERT INTO chat SET ?", data, (err, res) => {
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

module.exports = Chat;