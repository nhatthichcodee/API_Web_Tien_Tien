const postService = require('../services/postService');
const userService = require('../services/userService');
const commentService = require('../services/commentService');
const apiFunction = require('../function/function');
const Error = require('../module/error');
const multer = require('multer');
const con = require('../config/database');
var storage = multer.memoryStorage();

let getComment = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        var id = req.body.id;
        var index = req.body.index;
        var count = req.body.count;
        var token = req.body.token;
        if (id == undefined || index == undefined || count == undefined || token == undefined || id == null || index == null || count == null || token == null || id == '' || index == '' || count == '' || token == '') {
            Error.code1002(res);
        } else {
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken !== null) {
                var postCheckId = await postService.checkPostById(userCheckToken, id, 2);
                if (postCheckId !== null) {
                    var postCheckId1 = await postService.checkPostById(userCheckToken, id, 1);
                    var dataComment = await commentService.getListCommentById(postCheckId, index, count)
                    if (dataComment == null) {
                        Error.code9994(res)
                    } else {
                        res.send(JSON.stringify({
                            code: "1000",
                            message: 'ok',
                            data: dataComment,
                            is_blocked: postCheckId1.is_blocked
                        }))
                    }
                } else {
                    Error.code9992(res);
                }
            } else {
                Error.code9998(res);
            }
        }
    })
}

let addComment = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        var id = req.body.id;
        var index = req.body.index;
        var count = req.body.count;
        var token = req.body.token;
        var comment = req.body.comment;
        if (token == undefined || id == undefined || comment == undefined || index == undefined || count == undefined || id == null || index == null || count == null || token == null || comment == null || id == '' || index == '' || count == '' || token == '' || comment == '') {
            Error.code1002(res);
        } else {
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken !== null) {
                var postCheckId = await postService.checkPostById(userCheckToken, id, 2);
                if (postCheckId !== null) {
                    let date = new Date();
                    let seconds = date.getTime();
                    var newComment = {
                        user_id: userCheckToken.id,
                        comment: comment,
                        created: seconds,
                    }
                    var addComment = await commentService.addComment(userCheckToken, postCheckId, newComment, index, count);
                    if (addComment != null) {
                        var postCheckId1 = await postService.checkPostById(userCheckToken, id, 1);
                        res.send(JSON.stringify({
                            code: "1000",
                            message: 'ok',
                            data: addComment,
                            is_blocked: postCheckId1.is_blocked
                        }))
                    } else {
                        Error.code9997(res)
                    }
                } else {
                    Error.code9992(res);
                }
            } else {
                Error.code9998(res);
            }
        }
    })
}

let deleteComment = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        var id = req.body.id;
        var token = req.body.token;
        var id_com = req.body.id_com;
        if (token == undefined || id == undefined || id_com == undefined || token == null || id == null || id_com == null || token == '' || id == '' || id_com == '') {
            Error.code1002(res);
        } else {
            var canDel = false;
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken !== null) {
                var postCheckId = await postService.checkPostById(userCheckToken, id, 2);
                if (postCheckId !== null) {
                    if (postCheckId.comment_id == null) {
                        Error.code9994(res)
                    } else {
                        let dataComment = await commentService.checkCommentByid(id_com)
                        if(dataComment == null){
                            Error.code9997(res)
                        }else{
                            if (dataComment.user_id == userCheckToken.id) {
                                canDel = true
                            }
                            if (postCheckId.user_id == userCheckToken.id) {
                                canDel = true
                            }
                            if (!JSON.parse(postCheckId.comment_id).comment.includes(dataComment.id.toString())) {
                                canDel = false
                            }
                            if (canDel == true) {
                                var deleteComment = commentService.deleteComment(postCheckId, id_com)
                                if(deleteComment != null){
                                    res.send(JSON.stringify({
                                        code: "1000",
                                        message: 'ok',
                                    }))
                                }else{
                                    Error.code9997(res);
                                }
                            } else {
                                Error.code1009(res);
                            }
                        }
                    }
                } else {
                    Error.code9992(res);
                }
            } else {
                Error.code9998(res);
            }
        }
    })
}

let editComment = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        var id = req.body.id;
        var token = req.body.token;
        var id_com = req.body.id_com;
        var comment = req.body.comment;
        if (comment == undefined || token == undefined || id == undefined || id_com == undefined ||comment == null || token == null || id == null || id_com == null || comment == '' ||token == '' || id == '' || id_com == '') {
            Error.code1002(res);
        } else {
            var canEdit = false;
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken !== null) {
                var postCheckId = await postService.checkPostById(userCheckToken, id, 2);
                if (postCheckId !== null) {
                    var commentCheckId = await commentService.checkCommentByid(id_com);
                    if (commentCheckId !== null) {
                        if (commentCheckId.user_id == userCheckToken.id) {
                            canEdit = true
                        }
                        if (canEdit == true) {
                            var commentEdit = await commentService.editComment(id_com,comment)
                            if (commentEdit == true) {
                                res.send(JSON.stringify({
                                    code: "1000",
                                    message: 'ok',
                                }))
                            }else{
                                Error.code9997(res);
                            }
                        }else{
                            Error.code1009(res);
                        }
                    }else{
                        Error.code9997(res);
                    }
                }else{
                    Error.code9992(res);
                }
            }else{
                Error.code9998(res);
            }
        }
    })
}

let a = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        
    })
}

module.exports = {
    getComment: getComment,
    addComment: addComment,
    deleteComment: deleteComment,
    editComment:editComment
}