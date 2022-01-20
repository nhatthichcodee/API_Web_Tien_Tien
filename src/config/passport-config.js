const LocalStrategy = require('passport-local').Strategy
const UserService  = require('../services/userService')
const apiFunction = require('../function/function')
function initialize(passport) {
  const authenticateUser = async (phonenumber, password, done) => {
    const user = await UserService.checkphoneuser(phonenumber);
    if (user == null) {
      return done(null, false, { message: 'Người dùng không tồn tại' })
    }
    try {
      if (apiFunction.MD5(password) == user.password) {
          if (user.role > 0) {
            return done(null, user)
          }else{
            return done(null, false, { message: 'Không phải là admin'})
          }
      } else {
        return done(null, false, { message: 'Mật khẩu sai'})
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'phonenumber' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser(async(id, done) => {
    var user= await UserService.checkUserById(id);
    return done(null,user)
  })
}

module.exports = initialize