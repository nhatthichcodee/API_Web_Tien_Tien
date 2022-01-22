const postService = require('../services/postService');
const userService = require('../services/userService');
const apiFunction = require('../function/function');
const Error = require('../module/error');
const multer = require('multer')
var storage = multer.memoryStorage();

let addPost = async (req, res) => {
    var upload = multer({ storage: storage }).fields([{ name: 'image', maxCount: 10 }, { name: 'video', maxCount: 10 }]);
    upload(req, res, async (err) => {
        if (req.files === undefined || req.files === null || (req.files['video'] === undefined && req.files['image'] === undefined)) {
            Error.code1002(res)
        } else if ((req.files['video'] !== undefined || req.files['video'] != null) && (req.files['image'] !== undefined || req.files['image'] != null)) {
            Error.code1003(res)
        } else {
            var token = req.body.token;
            var described = req.body.described;
            if (token === undefined || described === undefined || token == null || described == null || token === '' || described === '') {
                Error.code1002(res)
            } else {
                var typeMedia = (req.files['video'] !== undefined || req.files['video'] != null) ? 'video' : 'image';
                var Media = (typeMedia === 'image') ? { "image": [] } : { "video": [] };
                if (typeMedia === 'image') {
                    for (let i = 0; i < req.files['image'].length; i++) {
                        Media['image'].push(req.files['image'][i].buffer.toString('base64'));
                    }
                }
                let totalVideo = 0
                if (typeMedia === 'video') {
                    for (let i = 0; i < req.files['video'].length; i++) {
                        Media['video'].push(req.files['video'][i].buffer.toString('base64'));
                        totalVideo += req.files['video'][i].size
                    }
                }
                if (typeMedia === 'image' && Media.image.length > 4) {
                    Error.code1008(res)
                }
                else if (typeMedia === 'video' && totalVideo > 10485760) {
                    Error.code1006(res)
                } else {
                    let date = new Date();
                    let seconds = date.getTime() / 1000 | 0;
                    //console.log(Media)
                    var userCheckToken = await userService.checkUserByToken(token);
                    if (userCheckToken != null) {
                        var url = '/post/' + userCheckToken.phonenumber + '/' + Date.now().toString()
                        var newDataPost = {
                            user_id: userCheckToken.id.toString(),
                            described: described,
                            media: JSON.stringify(Media),
                            created_at: seconds,
                            url: url
                        }
                        var newPost = await postService.addPost(newDataPost);
                        if (newPost.id != null) {
                            res.send(JSON.stringify({
                                code: "1000",
                                message: 'OK',
                                data: {
                                    id: newPost.id + "",
                                    url: url
                                }
                            }))
                        }
                    }
                    else {
                        Error.code9998(res);
                    }
                }
            }
        }
    }
    )
}

let getPost = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        var token = req.body.token;
        var id = req.body.id;
        if (token === undefined || id === undefined || token == null || id == null || token === '' || id === '') {
            Error.code1002(res);
        } else {
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken != null) {
                var postCheckId = await postService.checkPostById(userCheckToken, id, 1);
                if (postCheckId != null) {
                    res.send(JSON.stringify({
                        code: "1000",
                        message: 'OK',
                        data: postCheckId
                    }))
                } else {
                    Error.code9992(res);
                }
            } else {
                Error.code9998(res);
            }
        }
    }
    )
}

let getListPost = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        var token = req.body.token;
        var last_id = parseInt(req.body.last_id);
        var index = parseInt(req.body.index);
        var count = parseInt(req.body.count);
        if (token === undefined || last_id === undefined || index == undefined || count == undefined || token === null || last_id === null || index == null || count == null || token === '' || last_id === '' || index == '' || count == '') {
            Error.code1002(res);
        } else {
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken != null) {
                var dataListPost = [];
                var listId = []
                var countPost = await postService.getCountPost();
                var newPost = countPost - last_id;
                if (newPost > count) {
                    for (let i = last_id + 1; i <= last_id + count; i++) {
                        listId.push(i)
                    }
                } else {
                    for (var i = last_id + 1; i <= countPost; i++) {
                        listId.push(i)
                    }
                    var count2 = count - newPost;
                    var indexToLastPost = last_id - index;
                    if (indexToLastPost >= count2) {
                        for (let i = index; i < index + count2; i++) {
                            listId.push(i)
                        }
                    } else {
                        for (let i = index; i <= last_id; i++) {
                            listId.push(i)
                        }
                        var count3 = count2 - indexToLastPost - 1;
                        if (index - count3 > 0) {
                            for (let i = index - count3; i < index; i++) {
                                listId.push(i)
                            }
                        } else {
                            for (let i = 1; i < index; i++) {
                                listId.push(i)
                            }
                        }
                    }
                }
                for (let i = 0; i < listId.length; i++) {
                    var postCheckId = await postService.checkPostById(userCheckToken, listId[i], 1);
                    dataListPost.push(postCheckId)
                }
                res.send(JSON.stringify({
                    code: "1000",
                    message: 'OK',
                    data: {
                        post: dataListPost,
                        new_items: newPost + "",
                        last_id: countPost + "",
                    },
                }))
            } else {
                Error.code9998(res);
            }
        }
    }
    )
}

let getNewItem = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        var last_id = req.body.last_id;
        var category_id = req.body.category_id;
        var token = req.body.token;
        var countPost = await postService.getCountPost();
        if (category_id == "" || category_id == undefined) {
            category_id = "0";
        }
        if (last_id == undefined || token == undefined) {
            Error.code1002(res);
        }
        else if (last_id == "" || category_id == "" || token == "" || countPost < last_id || last_id <= 0) {
            Error.code1004(res);
        } else {
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken != null) {
                res.send(JSON.stringify({
                    code: "1000",
                    message: 'ok',
                    data: {
                        new_items: countPost - parseInt(last_id) + ""
                    }
                }))
            }
            else {
                Error.code9998(res);
            }
        }
    })
}

let editPost = async (req, res) => {
    var upload = multer({ storage: storage }).fields([{ name: 'image', maxCount: 10 }, { name: 'video', maxCount: 10 }]);
    upload(req, res, async (err) => {
        var token = req.body.token;
        var id = req.body.id;
        if (token === undefined || id === undefined || token == null || id == null || token === '' || id === '') {
            Error.code1002(res);
        } else {
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken != null) {
                let date = new Date();
                let seconds = date.getTime()/1000 | 0;
                var postCheckId = await postService.checkPostById(userCheckToken, id, 2);
                if (postCheckId.user_id == userCheckToken.id) {
                    var described = req.body.described;
                    if (described != undefined && described != null && described != '') {
                        postCheckId.described = described
                    }
                    var Media = JSON.parse(postCheckId.media);
                    var typeMedia = Media.image == undefined ? 'video' : 'image'
                    if ((req.files['video'] !== undefined || req.files['video'] != null) && (req.files['image'] !== undefined || req.files['image'] != null)) {
                        Error.code1003(res)
                    } else if (typeMedia == 'video') {
                        if ((req.files['video'] !== undefined || req.files['video'] != null)) {
                            Media = { "video": [] };
                            let totalVideo = 0
                            for (let i = 0; i < req.files['video'].length; i++) {
                                Media['video'].push(req.files['video'][i].buffer.toString('base64'));
                                totalVideo += req.files['video'][i].size
                            }
                            if (totalVideo > 10485760) {
                                Error.code1006(res)
                            }
                            var updatePost = await postService.updatePost(id, postCheckId.described, JSON.stringify(Media),seconds)
                            if (updatePost == true) {
                                res.send(JSON.stringify({
                                    code: "1000",
                                    message: 'ok',
                                }))
                            }
                        } else {
                            var updatePost = await postService.updatePost(id, postCheckId.described, postCheckId.media,seconds)
                            if (updatePost == true) {
                                res.send(JSON.stringify({
                                    code: "1000",
                                    message: 'ok',
                                }))
                            }
                        }
                        if ((req.files['image'] !== undefined || req.files['image'] != null)) {
                            Error.code1003(res)
                        }
                    } else if (typeMedia == 'image') {
                        if ((req.files['video'] !== undefined || req.files['video'] != null)) {
                            Error.code1003(res)
                        }
                        var image_del = req.body.image_del;
                        if (image_del != undefined && image_del != null && image_del != '') {
                            Media.image.splice(image_del, 1)
                        }
                        if ((req.files['image'] !== undefined || req.files['image'] != null)) {
                            var image_sort = req.body.image_sort;
                            if (image_sort == undefined && image_sort == null && image_sort == '') {
                                image_sort = 0
                            }
                            for (let i = 0; i < req.files['image'].length; i++) {
                                Media.image.splice(parseInt(image_sort), 0, req.files['image'][i].buffer.toString('base64'));
                            }
                            if (Media.image.length > 4) {
                                Error.code1008(res)
                            } else {
                                var updatePost = await postService.updatePost(id, postCheckId.described, JSON.stringify(Media),seconds)
                                if (updatePost == true) {
                                    res.send(JSON.stringify({
                                        code: "1000",
                                        message: 'ok',
                                    }))
                                }
                            }
                        } else {
                            var updatePost = await postService.updatePost(id, postCheckId.described, JSON.stringify(Media),seconds)
                            if (updatePost == true) {
                                res.send(JSON.stringify({
                                    code: "1000",
                                    message: 'ok',
                                }))
                            }
                        }
                    }
                } else {
                    Error.code9995(res)
                }
            } else {
                Error.code9998(res);
            }
        }
    })
}

let deletePost = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        var token = req.body.token;
        var id = req.body.id;
        if (token === undefined || id === undefined || token == null || id == null || token === '' || id === '') {
            Error.code1002(res);
        } else {
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken != null) {
                var postCheckId = await postService.checkPostById(userCheckToken, id, 2);
                if (postCheckId != null) {
                    if (postCheckId.user_id == userCheckToken.id) {
                        var postDel = await postService.deletePost(id)
                    } else {
                        Error.code9995(res)
                    }
                } else {
                    Error.code9992(res)
                }
            } else {
                Error.code9998(res);
            }
        }
    })
}

let reportPost = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        var token = req.body.token;
        var id_post = req.body.id;
        var subject = req.body.subject;
        var details = req.body.details;
        if (token == undefined || id_post == undefined || subject == undefined || details == undefined) {
            Error.code1002(res);
        }
        else if (token == "" || id_post == "" || id_post <= 0 || subject < 0 || subject == "" || details == "") {
            Error.code1004(res);
        }
        else {
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken !== null) {
                var postCheckId = await postService.checkPostById(userCheckToken, id_post, 1);
                if (postCheckId !== null) {
                    var checkUserReportPost = await postService.reportPost(id_post, userCheckToken.id);
                    if (checkUserReportPost == false) {
                        var dataRepost = {
                            "id_post": id_post,
                            "id_user": userCheckToken.id,
                            "subject": subject,
                            "details": details,
                        }
                        var addReportPost = await postService.addReportPost(dataRepost);
                        if (addReportPost != null) {
                            res.send(JSON.stringify({
                                code: "1000",
                                message: 'ok',
                            }))
                        }
                    } else {
                        if (postCheckId.can_edit != 1) {
                            Error.code1010(res);
                        } else {
                            Error.code9997(res);
                        }
                    }
                }
                else {
                    Error.code9992(res);
                }
            }
            else {
                Error.code9998(res);
            }
        }
    })
}

let addLike = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        var token = req.body.token;
        var id = req.body.id;
        if (token === undefined || id === undefined || token == null || id == null || token === '' || id === '') {
            Error.code1002(res);
        } else {
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken != null) {
                var postCheckId = await postService.checkPostById(userCheckToken, id, 2);
                if (postCheckId == null) {
                    Error.code1004(res)
                } else {
                    var dataLike = postCheckId.like_id == null ? { "like": [] } : JSON.parse(postCheckId.like_id)
                    if (postCheckId != null) {
                        if (!dataLike.like.includes(userCheckToken.id.toString())) {
                            dataLike.like.push(userCheckToken.id.toString())
                            var addLike = await postService.addLike(id, JSON.stringify(dataLike))
                            if (addLike == true) {
                                var postCheckId1 = await postService.checkPostById(userCheckToken, id, 1);
                                res.send(JSON.stringify({
                                    code: "1000",
                                    message: 'ok',
                                    data: {
                                        like: postCheckId1.like
                                    }
                                }))
                            } else {
                                Error.code1010(res);
                            }
                        } else {
                            Error.code9997(res);
                        }
                    } else {
                        Error.code9992(res)
                    }
                }
            } else {
                Error.code9998(res);
            }
        }
    })
}

let search = async (req, res) => {
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) => {
        var token = req.body.token;
        var keyword = req.body.keyword;
        var index = req.body.index;
        var count = req.body.count;
        if (keyword == undefined || token == undefined || index == undefined || count == undefined || keyword == null || token == null || index == null || count == null || keyword == '' || token == '' || index == '' || count == '') {
            Error.code1002(res);
        } else {
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken !== null) {
                var dataListPost = await postService.getAllPost()
                if (dataListPost.length == 0) {
                    Error.code9994(res)
                } else {
                    for (let i = 0; i < dataListPost.length - 1; i++) {
                        for (let j = i + 1; j < dataListPost.length; j++) {
                            if (apiFunction.getScoreSearch(dataListPost[i].described, keyword) < apiFunction.getScoreSearch(dataListPost[j].described, keyword)) {
                                var dataTG = dataListPost[i]
                                dataListPost[i] = dataListPost[j]
                                dataListPost[j] = dataTG
                            }
                        }
                    }
                    var dataRes = []
                    if (index < dataListPost.length) {
                        for (let i = parseInt(index); i < dataListPost.length; i++) {
                            if (i < parseInt(index) + parseInt(count)) {
                                dataRes.push(await postService.checkPostById(userCheckToken, dataListPost[i].id, 1))
                            }
                        }
                        res.send(JSON.stringify({
                            code: "1000",
                            message: 'ok',
                            data: dataRes
                        }))
                    } else {
                        Error.code9994(res)
                    }
                }
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
    addPost: addPost,
    getPost: getPost,
    getListPost: getListPost,
    getNewItem: getNewItem,
    editPost: editPost,
    deletePost: deletePost,
    reportPost: reportPost,
    addLike: addLike,
    search: search
}