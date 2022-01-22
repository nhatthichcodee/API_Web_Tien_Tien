const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const initializePassport = require('../config/passport-config')

const userController = require('../controller/userController');
const postController = require('../controller/postController');
const commentController = require('../controller/commentController');
const chatController = require('../controller/chatController');
const adminController = require('../controller/adminController');
const friendsController = require('../controller/friendController');

initializePassport(
  passport
)

let initWebRouter = function (app) {

  var server = require("http").createServer(app);
  const { Server } = require("socket.io")
  const io = new Server(server)
  chatController.initIO(io);

  app.use(flash())
  app.use(session({
    secret: "api_web_tien_tien",
    resave: false,
    saveUninitialized: false
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(methodOverride('_method'))

  // Tuần 1
  app.post('/api/user/sign_up', userController.signUp);
  app.post('/api/user/sign_in', userController.signIn)
  app.post('/api/user/sign_out', userController.signOut);

  // Tuần 2
  app.post('/api/post/add_post', postController.addPost);
  app.post('/api/post/get_post', postController.getPost);
  app.post('/api/post/get_list_posts', postController.getListPost);
  app.post('/api/post/check_new_item', postController.getNewItem);
  app.post('/api/post/edit_post', postController.editPost);
  app.post('/api/post/delete_post', postController.deletePost);

  // Tuần 3
  app.post('/api/post/report_post', postController.reportPost);
  app.post('/api/comment/comment/get_comment', commentController.getComment);
  app.post('/api/comment/add_comment', commentController.addComment);
  app.post('/api/comment/delete_comment', commentController.deleteComment);
  app.post('/api/comment/edit_comment', commentController.editComment)
  app.post('/api/post/like/addlike', postController.addLike);

  // Tuần 4
  app.post('/api/chat/getlistconversation', chatController.getListConversation);
  app.post('/api/chat/getconversation', chatController.getConversation);
  app.post('/api/chat/deletemessage', chatController.deleteMessage);
  app.post('/api/chat/deleteconversation', chatController.deleteConversation);
  app.post('/api/admin/getAdminPermission', adminController.getAdminPermission);
  app.post('/api/admin/getUserList', adminController.getUserList);
  app.post('/api/admin/setrole', adminController.setRole);


  // Tuần 5
  app.post('/api/post/search', postController.search);
  app.post('/api/friend/get_user_friends', friendsController.get_user_friends)
  app.post('/api/admin/set_user_state', adminController.set_user_state)
  app.post('/api/admin/delete_user', adminController.delete_user)
  app.post('/api/admin/get_basic_user_info', adminController.get_basic_user_info)

  // Tuần 6
  app.post('/api/friend/get_requested_friend', friendsController.getRquestFriend);
  app.post('/api/friend/set_accept_friend', friendsController.setAcceptFriend);
  app.post('/api/friend/set_request_friend', friendsController.setRequestFriend);
  app.post('/api/friend/getuserinfo', friendsController.getUserInfo);

  // Tuần 7
  app.post('/api/user/setblockuser', userController.setBlockUser);
  app.post('/api/user/setblockdiary', userController.setBlockDiary);
  app.post('/api/user/getverifycode', userController.getVerifyCode);
  app.post('/api/user/checkverifycode', userController.checkVerifyCode);
  app.post('/api/user/del_saved_search', userController.deleteSavedSearch);

  // tuan 8
  app.post('/api/user/changepassword', userController.changePassword);
  app.post('/api/user/setuserinfo', userController.setUserInfo);
  // app.post('/api/user/get_suggested_list_friends',userController.getSuggestedListFriends)
  app.post('/api/user/getsavedsearch', userController.getSaveSearch);

  // Admin
  app.get('/adminlogin', checkNotAuthenticated, (req, res) => {
    res.render('loginadmin.ejs');
  })

  app.get('/adminpage', checkAuthenticated, (req, res) => {
    if (req.user.role == 0) {
      chatController.toChatPage(req,res)
    }else{
      adminController.dashboardAdmin(req, res);
    }
  })

  app.post('/adminlogin', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/adminpage',
    failureRedirect: '/adminlogin',
    failureFlash: true
  }));

  app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/adminlogin')
  })

  app.get('/tables', checkAuthenticated, (req, res) => {
    adminController.getTableAdmin(req, res);
  })

  // Phần chat 

  app.get('/conversation', checkAuthenticated, (req, res) => {
    chatController.getChat2User(req, res);
  })

  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/adminlogin')
  }

  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/adminpage')
    }
    next()
  }

  var port = 3000;
  server.listen(port, function () {
    console.log("Listening to port " + port);
  });
}

module.exports = {
  initWebRouter: initWebRouter,
}