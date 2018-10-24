const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = "5bcf7da1830b37441936ab3f  "
//
// if(!ObjectID.isValid(id)) {
//   console.log("Invalid ID");
//   return;
// };

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//   if(!todo){
//     console.log('Id not found');
//     return;
//   }
//   console.log('Todo', todo);
// }).catch((e) => console.log(e));

var userID = "5bcdf6d7f232f9203c080c0f";

if(!ObjectID.isValid(userID)) {
  console.log("Invalid ID");
  return;
};
User.findById(userID).then((user) => {
  if(!user) {
    console.log('User not found');
    return;
  }
  console.log('user: ', user);
}).catch((e) => console.log(e));
