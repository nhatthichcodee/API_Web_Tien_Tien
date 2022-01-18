const db = require('../config/database')
const Comment = function (comment) {
}

Comment.checkCommentByid = (id) =>{
    return new Promise((async (resolve, reject) => {
        try {
            db.query('SELECT * FROM comment WHERE id = ?', id, (err, res) => {
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

Comment.addComment = (dataComment) =>{
    return new Promise((async (resolve, reject) => {
        try {
            db.query("INSERT INTO comment SET ?", dataComment , (err, res) => {
                if (err) {
                    Error.code1001(res);
                } else {
                    resolve({id: res.insertId});
                }
            })
        } catch (e) {
            reject(e);
        }
    }));
}

Comment.deleteComment = (id_com) =>{
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`DELETE FROM comment WHERE id = '${id_com}'`, (err, res) => {
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

Comment.editComment = (id_com, comment) =>{
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`UPDATE comment SET comment ='${comment}' WHERE id = '${id_com}'`, (err, res) => {
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

module.exports = Comment;