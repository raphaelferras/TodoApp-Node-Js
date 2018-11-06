const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//   console.log(result);
// });
//
//
// Todo.findOneAndRemove({}).then((todo) => {
//   console.log(result);
// });

Todo.findByIdAndRemove("5bd0cf7662154479a2c9a22c").then((todo) => {
  console.log(todo);
});
