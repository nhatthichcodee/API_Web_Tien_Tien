const userController= require('../controller/userController');
const postController= require('../controller/postController');

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
  // app.post('/api/post/delete_post', postController.deletePost);
}
module.exports = {
    initWebRouter: initWebRouter,
  }