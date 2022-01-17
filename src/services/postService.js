const postModel = require('../models/postModels');

let addPost = (dataPost) => {
    return new Promise((async (resolve, reject) => {
        try {
            let post = await postModel.addPost(dataPost);
            if (post.id != 0) {
                resolve(post);
            }
            else {
                resolve(null);
            }
        } catch (e) {
            reject(e);
        }
    }));
}

let checkPostById = (id) =>{
    return new Promise((async (resolve, reject) => {
        try {
            let post = await postModel.checkPostById(id);
            if (post.length != 0) {
                resolve(post[0]);
            }
            else {
                resolve(null);
            }
        } catch (e) {
            reject(e);
        }
    }));
}

let getCountPost = () =>{
    return new Promise((async (resolve, reject) => {
        try {
            let countpost = await postModel.getCountPost();
            if (countpost != null) {
                resolve(countpost);
            }
            else {
                resolve(null);
            }
        } catch (e) {
            reject(e);
        }
    }));
}

let updatePost = (id,desPost,mediaPost) =>{
    return new Promise((async (resolve, reject) => {
        try {
            let post = await postModel.updatePost(id,desPost,mediaPost);
            console.log(post)
            if (post.changedRows == 1) {
                resolve(true);
            }
            else {
                resolve(null)
            }
        } catch (e) {
            reject(e);
        }
    }));
}

module.exports={
    addPost:addPost,
    checkPostById:checkPostById,
    getCountPost:getCountPost,
    updatePost:updatePost
}