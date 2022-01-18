const userController= require('../controller/userController');
const postController= require('../controller/postController');
const commentController= require('../controller/commentController');
const chatController= require('../controller/chatController');
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
  // app.post('/chat/deletemessage', chatcontroller.deletemessage);
  // app.post('/chat/deleteconversation', chatcontroller.deleteConversation);
  // app.post('/admin/getAdminPermission', admincontroller.getAdminPermission);
  // app.post('/admin/setrole', admincontroller.setRole);
}
module.exports = {
    initWebRouter: initWebRouter,
  }