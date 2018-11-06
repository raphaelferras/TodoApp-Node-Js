const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const {SHA256} = require('crypto-js');
const _ = require('lodash');

var UserSchema  = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minLength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token  = jwt.sign({_id: user._id.toHexString(), access}, 'abc123');

  user.tokens = user.tokens.concat([{access, token}]);

  return user.save().then(() => {
    return token;
  });
};

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;
  try {
      decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    return Promise.reject('test');
  }
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.pre('save', function (next) {
  var user = this;

  if(user.isModified('password')) {
    user.password = SHA256(JSON.stringify(user.password) + 'saltingthispasswordtomakeitmoresecure_by_raphael').toString();
    next();
  } else {
    next();
  }
});

var User = mongoose.model('User',UserSchema);

module.exports = {User};
