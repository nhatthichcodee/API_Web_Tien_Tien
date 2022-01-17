const postService= require('../services/postService');
const userService= require('../services/userService');
const apiFunction = require('../function/function');
const Error = require('../module/error');
const multer = require('multer')
var storage = multer.memoryStorage();

let addPost = async(req,res)=>{
    var upload = multer({ storage: storage }).fields([{ name: 'image', maxCount: 10 }, { name: 'video', maxCount: 10 }]);
    upload(req, res, async (err) =>{
        if (req.files === undefined || req.files === null || (req.files['video'] === undefined && req.files['image'] === undefined)){
            Error.code1002(res)
        }else if ((req.files['video'] !== undefined || req.files['video'] != null) && (req.files['image'] !== undefined || req.files['image'] != null)){
            Error.code1003(res)
        }else{
            var token = req.body.token;
            var described = req.body.described;
            if (token === undefined || described === undefined || token == null || described == null || token === '' || described === ''){
                Error.code1002(res)
            }else{
                var typeMedia = (req.files['video'] !== undefined || req.files['video'] != null) ? 'video' : 'image';
                var Media = (typeMedia === 'image') ? {"image":[]} : {"video":[]};
                if (typeMedia === 'image'){
                    for (let i = 0; i < req.files['image'].length; i++){
                        Media['image'].push(req.files['image'][i].buffer.toString('base64'));
                    }
                }
                let totalVideo = 0
                if (typeMedia === 'video'){
                    for (let i = 0; i < req.files['video'].length; i++){
                        Media['video'].push(req.files['video'][i].buffer.toString('base64'));
                        totalVideo += req.files['video'][i].size
                    }
                }
                if (typeMedia === 'image' && Media.image.length > 4){
                    Error.code1008(res)
                }
                else if(typeMedia === 'video' && totalVideo > 10485760){
                    Error.code1006(res)
                }else{
                    //console.log(Media)
                    var userCheckToken = await userService.checkUserByToken(token);
                    if (userCheckToken != null) {
                        var url = '/post/' + userCheckToken.phonenumber + '/' + Date.now().toString()
                        var newDataPost = {
                        user_id: userCheckToken.id.toString(),
                        described: described,
                        media: JSON.stringify(Media),
                        created_at: apiFunction.getDate(),
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
)}

let getPost = async(req,res)=>{
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) =>{
        var token = req.body.token;
        var id = req.body.id;
        if (token === undefined || id === undefined || token == null || id == null || token === '' || id === '') {
            Error.code1002(res);
        }else{
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken != null) {
                var postCheckId = await postService.checkPostById(id);
                if (postCheckId != null){
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
                    if (JSON.parse(postCheckId.media).image != null){
                        ImageData = []
                        for (let j = 0; j < JSON.parse(postCheckId.media).image.length; j++) {
                            ImageData.push({
                                id: (j+1).toString(),
                                data: JSON.parse(postCheckId.media).image[j],
                                url: '/post/image/' + postCheckId.id.toString() +'/' + (j+1).toString()
                            })
                        }
                    }
                    var VideoData = null;
                    if (JSON.parse(postCheckId.media).video != null){
                        VideoData = []
                        for (let j = 0; j < JSON.parse(postCheckId.media).video.length; j++) {
                            VideoData.push({
                                id: (j+1).toString(),
                                data: JSON.parse(postCheckId.media).video[j],
                                url: '/post/video/' + postCheckId.id.toString() +'/' + (j+1).toString()
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
                        id: postCheckId.id +"",
                        described: postCheckId.described,
                        created: postCheckId.created_at,
                        modified: postCheckId.modified,
                        like: like +"",
                        comment: comment +"",
                        is_liked:isliked +"",
                        image:ImageData,
                        video:VideoData,
                        author:{
                            id:postCheckId.user_id +"",
                            name:userAuthor.username,
                            avatar:userAuthor.link_avatar
                        },
                        is_blocked:isblocked +"",
                        can_edit:canedit +"",
                        can_comment:postCheckId.can_comment +""
                    }
                    res.send(JSON.stringify({
                        code: "1000",
                        message: 'OK',
                        data: dataGetPost
                    }))
                }else{
                    Error.code9992(res);
                }
            }else{
                Error.code9998(res);
            }
        }
    }
)}

let getListPost = async(req,res)=>{
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) =>{
        var token = req.body.token;
        var last_id = parseInt(req.body.last_id);
        var index = parseInt(req.body.index);
        var count = parseInt(req.body.count);
        if (token === undefined || last_id === undefined || index == undefined || count == undefined || token === null || last_id === null || index == null || count == null || token === '' || last_id === '' || index == '' || count == '') {
            Error.code1002(res);
        }else{
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken != null) {
                var dataListPost = [];
                var listId = []
                var countPost = await postService.getCountPost();
                var newPost = countPost - last_id;
                if (newPost > count) {
                    for (let i = last_id + 1 ; i <= countPost; i++) {
                        listId.push(i)
                    }
                }else{
                    for (var i = last_id + 1; i <= countPost; i++) {
                        listId.push(i)
                    }
                    var count2 = count - newPost;
                    var indexToLastPost = last_id - index;
                    if (indexToLastPost >= count2 ) {
                        for (let i = index; i < index + count2; i++) {
                            listId.push(i)
                        }
                    }else{
                        for (let i = index ; i <= last_id; i++) {
                            listId.push(i)
                        }
                        var count3 = count2 - indexToLastPost - 1;
                        if (index - count3 > 0) {
                            for (let i = index - count3 ; i < index; i++) {
                                listId.push(i)
                            }
                        }else{
                            for (let i = 1 ; i < index; i++) {
                                listId.push(i)
                            }
                        }
                    }
                    for (let i = 0; i < listId.length; i++) {
                        var postCheckId = await postService.checkPostById(listId[i]);
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
                        if (JSON.parse(postCheckId.media).image != null){
                            ImageData = []
                            for (let j = 0; j < JSON.parse(postCheckId.media).image.length; j++) {
                                ImageData.push({
                                    id: (j+1).toString(),
                                    data: JSON.parse(postCheckId.media).image[j],
                                    url: '/post/image/' + postCheckId.id.toString() +'/' + (j+1).toString()
                                })
                            }
                        }
                        var VideoData = null;
                        if (JSON.parse(postCheckId.media).video != null){
                            VideoData = []
                            for (let j = 0; j < JSON.parse(postCheckId.media).video.length; j++) {
                                VideoData.push({
                                    id: (j+1).toString(),
                                    data: JSON.parse(postCheckId.media).video[j],
                                    url: '/post/video/' + postCheckId.id.toString() +'/' + (j+1).toString()
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
                            id: postCheckId.id +"",
                            described: postCheckId.described,
                            created: postCheckId.created_at,
                            modified: postCheckId.modified,
                            like: like +"",
                            comment: comment +"",
                            is_liked:isliked +"",
                            image: ImageData,
                            video: ImageData,
                            author:{
                                id:postCheckId.user_id +"",
                                name:userAuthor.username,
                                avatar:userAuthor.link_avatar
                            },
                            is_blocked:isblocked +"",
                            can_edit:canedit +"",
                            can_comment:postCheckId.can_comment +""
                        }
                        dataListPost.push(dataGetPost)
                    }
                    res.send(JSON.stringify({
                        code: "1000",
                        message: 'OK',
                        data: {
                            post: dataListPost,
                            new_items: newPost +"",
                            last_id : countPost +"",
                        },
                    }))
                }
            }else{
                Error.code9998(res);
            }
        }
    }
)}

let getNewItem = async(req,res)=>{
    var upload = multer({ storage: storage }).none();
    upload(req, res, async (err) =>{
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
        }else{
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken != null) {
                res.send(JSON.stringify({
                    code: "1000",
                    message: 'OK',
                    data:{
                        new_items: countPost - parseInt(last_id) +""
                    }
                }))
            }
            else{
                Error.code9998(res);
            }
        }
    })
}

let editPost = async(req,res)=>{
    var upload = multer({ storage: storage }).fields([{ name: 'image', maxCount: 10 }, { name: 'video', maxCount: 10 }]);
    upload(req, res, async (err) =>{
        var token = req.body.token;
        var id = req.body.id;
        if (token === undefined || id === undefined || token == null || id == null || token === '' || id === '') {
            Error.code1002(res);
        }else{
            var userCheckToken = await userService.checkUserByToken(token);
            if (userCheckToken != null) {
                var postCheckId = await postService.checkPostById(id);
                if ( postCheckId.user_id == userCheckToken.id ) {
                    var described = req.body.described;
                    if ( described != undefined && described != null && described != '' ) {
                        postCheckId.described = described
                    }
                    var Media = JSON.parse(postCheckId.media);
                    var typeMedia = Media.image == undefined ? 'video' : 'image'
                    if ((req.files['video'] !== undefined || req.files['video'] != null) && (req.files['image'] !== undefined || req.files['image'] != null)){
                        Error.code1003(res)
                    }else if(typeMedia == 'video'){
                        if ((req.files['video'] !== undefined || req.files['video'] != null)) {
                            Media = {"video":[]};
                            let totalVideo = 0
                            for (let i = 0; i < req.files['video'].length; i++){
                                Media['video'].push(req.files['video'][i].buffer.toString('base64'));
                                totalVideo += req.files['video'][i].size
                            }
                            if(totalVideo > 10485760){
                                Error.code1006(res)
                            }
                            var updatePost = await postService.updatePost(id,postCheckId.described,JSON.stringify(Media))
                        }else{
                            var updatePost = await postService.updatePost(id,postCheckId.described,postCheckId.media)
                        }
                        if ((req.files['image'] !== undefined || req.files['image'] != null)) {
                            Error.code1003(res)
                        }
                    }else if(typeMedia == 'image'){
                        if ((req.files['video'] !== undefined || req.files['video'] != null)) {
                            Error.code1003(res)
                        }
                        var image_del = req.body.image_del;
                        if(image_del != undefined && image_del != null && image_del != ''){
                            Media.image.splice(image_del,1)
                        }
                        if ((req.files['image'] !== undefined || req.files['image'] != null)) {
                            var image_sort = req.body.image_sort; 
                            if(image_sort == undefined && image_sort == null && image_sort == ''){
                                image_sort = 0
                            }
                            for (let i = 0; i < req.files['image'].length; i++){
                                Media.image.splice(parseInt(image_sort),0,req.files['image'][i].buffer.toString('base64'));
                            }
                            if (Media.image.length > 4) {
                                Error.code1008(res)
                            }else{
                                var updatePost = await postService.updatePost(id,postCheckId.described,JSON.stringify(Media))
                            }
                        }else{
                            var updatePost = await postService.updatePost(id,postCheckId.described,JSON.stringify(Media))
                        }
                    }
                }else{
                    Error.code9995(res)
                }
            }else{
                Error.code9998(res);
            }
        }
    })
}
module.exports={
    addPost:addPost,
    getPost:getPost,
    getListPost:getListPost,
    getNewItem:getNewItem,
    editPost:editPost
}