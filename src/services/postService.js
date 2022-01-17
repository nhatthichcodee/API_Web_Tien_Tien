const postModel = require('../models/postModels');
const userService= require('../services/userService');
const apiFunction = require('../function/function');

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

let checkPostById = (userCheckToken,id) => {
    return new Promise((async (resolve, reject) => {
        try {
            let post = await postModel.checkPostById(id);
            if (post.length != 0) {
                var postCheckId = post[0]
                var like = (postCheckId.like_id == null) ? 0 : JSON.parse(postCheckId.like_id).like.length;
                var comment = (postCheckId.comment_id == null) ? 0 : JSON.parse(postCheckId.comment_id).comment.length
                var isliked = 0;
                if (like > 0) {
                    for (let index = 0; index < JSON.parse(postCheckId.like_id).like.length; index++) {
                        if (JSON.parse(postCheckId.like_id).like[index] == userCheckToken.id) {
                            isliked = 1;
                        }
                    }
                }
                var ImageData = null;
                if (JSON.parse(postCheckId.media).image != null) {
                    ImageData = []
                    for (let j = 0; j < JSON.parse(postCheckId.media).image.length; j++) {
                        ImageData.push({
                            id: (j + 1).toString(),
                            data: JSON.parse(postCheckId.media).image[j],
                            url: '/post/image/' + postCheckId.id.toString() + '/' + (j + 1).toString()
                        })
                    }
                }
                var VideoData = null;
                if (JSON.parse(postCheckId.media).video != null) {
                    VideoData = []
                    for (let j = 0; j < JSON.parse(postCheckId.media).video.length; j++) {
                        VideoData.push({
                            id: (j + 1).toString(),
                            data: JSON.parse(postCheckId.media).video[j],
                            url: '/post/video/' + postCheckId.id.toString() + '/' + (j + 1).toString()
                        })
                    }
                }
                var userAuthor = await userService.checkUserById(postCheckId.user_id);
                var isblocked = 0;
                if (JSON.parse(userAuthor.block_id) != null) {
                    for (let index = 0; index < JSON.parse(userAuthor.block_id).block.length; index++) {
                        if (JSON.parse(userAuthor.block_id).block[index] == userCheckToken.id) {
                            isblocked = 1;
                        }
                    }
                }
                var canedit = userCheckToken.id == userAuthor.id ? 1 : 0
                var dataGetPost = {
                    id: postCheckId.id + "",
                    described: postCheckId.described,
                    created: postCheckId.created_at,
                    modified: postCheckId.modified,
                    like: like + "",
                    comment: comment + "",
                    is_liked: isliked + "",
                    image: ImageData,
                    video: VideoData,
                    author: {
                        id: postCheckId.user_id + "",
                        name: userAuthor.username,
                        avatar: userAuthor.link_avatar
                    },
                    is_blocked: isblocked + "",
                    can_edit: canedit + "",
                    can_comment: postCheckId.can_comment + ""
                }
                resolve(dataGetPost);
            }
            else {
                resolve(null);
            }
        } catch (e) {
            reject(e);
        }
    }));
}

let getCountPost = () => {
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

let updatePost = (id, desPost, mediaPost) => {
    return new Promise((async (resolve, reject) => {
        try {
            let post = await postModel.updatePost(id, desPost, mediaPost);
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

module.exports = {
    addPost: addPost,
    checkPostById: checkPostById,
    getCountPost: getCountPost,
    updatePost: updatePost
}