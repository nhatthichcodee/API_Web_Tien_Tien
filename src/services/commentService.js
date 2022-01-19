const postModel = require('../models/postModels');
const userService = require('../services/userService');
const postService = require('../services/postService');
const commentModel = require('../models/commentModels');
const apiFunction = require('../function/function');

let getListCommentById = (postCheckId, index, count) => {
    return new Promise((async (resolve, reject) => {
        try {
            var jsonComment = JSON.parse(postCheckId.comment_id)
            var numberOfComment = postCheckId.comment_id == null ? 0 : jsonComment.comment.length
            if (numberOfComment == 0 || parseInt(index) > numberOfComment) {
                resolve(null);
            } else {
                var listIdComment = []
                for (let i = index; i < numberOfComment; i++) {
                    if (i < index + count) {
                        listIdComment.push(jsonComment.comment[i])
                    }
                }
                var dataListComment = []
                for (let i = 0; i < listIdComment.length; i++) {
                    let comment = await commentModel.checkCommentByid(listIdComment[i]);
                    if (comment.length != 0) {
                        var dataComment = comment[0]
                        let userAuthor = await userService.checkUserById(dataComment.user_id)
                        if (userAuthor != null) {
                            dataListComment.push({
                                id: dataComment.id + "",
                                comment: dataComment.comment,
                                created: dataComment.created +'',
                                poster: {
                                    id: userAuthor.id + "",
                                    name: userAuthor.username,
                                    avatar: userAuthor.link_avatar
                                }
                            })
                        }
                    }
                }
                resolve(dataListComment)
            }
        } catch (e) {
            reject(e);
        }
    }));
}

let addComment = (userCheckToken, postCheckId, dataComment, index, count) => {
    return new Promise((async (resolve, reject) => {
        try {
            let comment = await commentModel.addComment(dataComment);
            if (comment.id != 0) {
                var dataCommentPost = postCheckId.comment_id == null ? { "comment": [] } : JSON.parse(postCheckId.comment_id)
                dataCommentPost.comment.push(comment.id + '')
                let updateCommentPost = await postModel.updateCommentPost(JSON.stringify(dataCommentPost), postCheckId.id)
                if (updateCommentPost != null) {
                    postCheckId = await postService.checkPostById(userCheckToken, postCheckId.id, 2);
                    let dataComment = getListCommentById(postCheckId, index, count, comment.id)
                    if (dataComment != null) {
                        resolve(dataComment);
                    } else {
                        resolve(null);
                    }
                } else {
                    resolve(null);
                }
            }
            else {
                resolve(null);
            }
        } catch (e) {
            reject(e);
        }
    }))
}

let checkCommentByid = (id) => {
    return new Promise((async (resolve, reject) => {
        try {
            let comment = await commentModel.checkCommentByid(id);
            if (comment.length != 0) { 
                resolve(comment[0]);
            }else{
                resolve(null);
            }
        } catch (e) {
            reject(e);
        }
    }))
}

let deleteComment = (postCheckId,id_com) => {
    return new Promise((async (resolve, reject) => {
        try {
            let comment = await commentModel.deleteComment(id_com);
            if (comment.affectedRows == 1) {
                let deleteCommentPost = postService.deleteCommentPost(postCheckId,id_com)
                if (deleteCommentPost != null) {
                    resolve(deleteCommentPost)
                }else{
                    resolve(null)
                }
            }
            else {
                resolve(null)
            }
        } catch (e) {
            reject(e);
        }
    }))
} 

let editComment = (id_com,comment) => {
    return new Promise((async (resolve, reject) => {
        try {
            let commentEdit = await commentModel.editComment(id_com,comment);
            if (commentEdit.changedRows == 1) { 
                resolve(true)
            }else{
                resolve(null);
            }
        } catch (e) {
            reject(e);
        }
    }))
}

let a = () => {
    return new Promise((async (resolve, reject) => {
        try {

        } catch (e) {
            reject(e);
        }
    }))
}
module.exports = {
    getListCommentById: getListCommentById,
    addComment: addComment,
    checkCommentByid:checkCommentByid,
    deleteComment:deleteComment,
    editComment:editComment
}