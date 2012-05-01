// Everyauth config for the app
var aes = require('./aes')
    , config = require('./config')
    , mongoose = require('mongoose')
    , mongoose_auth = require('mongoose-auth')
    , Schema = mongoose.Schema
    ;

var user_schema = new Schema({
  account_level: Number
});

var user;

user_schema.plugin(mongoose_auth, {
  everymodule: {
    everyauth: {
        User: function () {
          return user;
        }
    }
  }
  , password: {
      loginWith: 'email'
    , everyauth: {
          getLoginPath: '/login'
        , postLoginPath: '/login'
        , loginView: 'login.jade'
        , getRegisterPath: '/register'
        , postRegisterPath: '/register'
        , registerView: 'register.jade'
        , loginSuccessRedirect: '/'
        , registerSuccessRedirect: '/'
        , loginLocals: {product:'Poang', page:'Sample node.js / express / everyauth / mongodb app for Strider and Heroku'}
        , registerLocals: {product:'Strider', page:'Sample node.js / express / everyauth / mongodb app for Strider and Heroku', code:''}
        , registerUser: function (newUserAttributes) {
          var promise = this.Promise();
          this.User()().create(newUserAttributes, function (err, createdUser) {
            if (err) {
              console.log(err);
              if (/duplicate key/.test(err)) {
                return promise.fulfill(['Someone has already claimed that login']);
              }
              return promise.fail(err);
            }
            promise.fulfill(createdUser);
          });
          return promise;
        }
     }
 }

});

mongoose.model('user', user_schema);
user = mongoose.model('user');

exports.user = user;