const db = require('../config/database')
const Post = function (post) {
}

Post.addPost = (data) => {
    return new Promise((async (resolve, reject) => {
        try {
            db.query("INSERT INTO post SET ?", data, (err, res) => {
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

Post.checkPostById = (id) =>{
    return new Promise((async (resolve, reject) => {
        try {
            db.query('SELECT * FROM post WHERE id = ?', id, (err, res) => {
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

Post.getCountPost = () =>{
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`SELECT COUNT(id) AS NumberOfPost FROM post`, (err, res) => {
                if (err) {
                    Error.code1001(res);
                } else {
                    resolve(res[0].NumberOfPost);
                }
            })
        } catch (e) {
            reject(e);
        }
    }));
}

Post.updatePost = (id,desPost,mediaPost) =>{
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`UPDATE post SET media ='${mediaPost}' , described = '${desPost}'  WHERE id = '${id}'`, (err, res) => {
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

module.exports = Post;