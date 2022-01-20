const userController= require('../controller/userController');
const postController= require('../controller/postController');
const commentController= require('../controller/commentController');
const chatController= require('../controller/chatController');
const adminController= require('../controller/adminController');
const friendsController = require('../controller/friendController');

let initWebRouter = function (app) {

  // Tuần 1
  app.post('/api/user/sign_up', userController.signUp); 
  app.post('/api/user/sign_in',userController.signIn)
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
  app.get('/api/admin/login', adminController.loginAdmin);
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
  app.post('/api/user/del_saved_search',userController.deleteSavedSearch);
}
module.exports = {
    initWebRouter: initWebRouter,
}