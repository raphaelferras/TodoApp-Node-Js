const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
  _id: userOneId,
  email: 'raphael@test.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
  }]
}, {
  _id: userTwoId,
  email: 'jen@test.com',
  password: 'userTwoPass'
}];

var todos = [{
    _id: new ObjectID(),
    text: 'first test todo'
},{
  _id: new ObjectID(),
  text: 'second test todo',
  completed: true,
  completedAt: 333
},{
  _id: new ObjectID(),
  text: 'third test todo'
},{
  _id: new ObjectID(),
  text: 'fourth test todo'
}]

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => {
    done();
  });
}

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]);
  }).then(() => {
    done();
  });
}


module.exports = {todos, populateTodos, users, populateUsers};
