const db = require('../config/database')
const Post = function (post) {
}

Post.getListPostByUserId = (id_user) =>{
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`SELECT * FROM post WHERE user_id ='${id_user}'`, (err, res) => {
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
                   // Error.code1001(res);
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

Post.updatePost = (id,desPost,mediaPost, timedit) =>{
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`UPDATE post SET media ='${mediaPost}' , described = '${desPost}', modified = '${timedit}'  WHERE id = '${id}'`, (err, res) => {
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

Post.deletePost = (id) =>{
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`DELETE FROM post WHERE id= '${id}'`, (err, res) => {
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

Post.reportPost = (id_post, id_user) => {
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`SELECT * FROM report_post WHERE id_post ='${id_post}' AND id_user ='${id_user}'`, (err, res) => {
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

Post.addReportPost = (dataReport) => {
    return new Promise((async (resolve, reject) => {
        try {
            db.query("INSERT INTO report_post SET ?", dataReport, (err, res) => {
                if (err) {
                    Error.code1001(res);
                } else {
                    resolve({ affectedRows : res.affectedRows, ...dataReport });
                }
            })
        } catch (e) {
            reject(e);
        }
    }));
};

Post.updateCommentPost = (dataCommnetPost,id) => {
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`UPDATE post SET comment_id = '${dataCommnetPost}'  WHERE id = '${id}'`, (err, res) => {
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

Post.addLike = (id,dataLike) => {
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`UPDATE post SET like_id = '${dataLike}'  WHERE id = '${id}'`, (err, res) => {
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

Post.getAll = ()=>{
    return new Promise((async (resolve, reject) => {
        try {
            db.query("SELECT * FROM post", function (err, user) {
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
}

Post.addComment = (id,dataComment) => {
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`UPDATE post SET comment_id = '${dataComment}'  WHERE id = '${id}'`, (err, res) => {
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

Post.delReport = (user_id) => {
    return new Promise((async (resolve, reject) => {
        try {
            db.query(`DELETE FROM report_post WHERE id_user= '${user_id}'`, (err, res) => {
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
module.exports = Post;