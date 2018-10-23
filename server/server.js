var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });
  todo.save().then(
    (doc) => {
      res.send(doc);
    },
    (e) => {
      res.status(400).send(e);
    }
  )
});



app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {app};

// var newUser = new User({
//   email: 'raphael@test.com'
// });
//
// newUser.save().then(
//   (doc) => {
//     console.log(JSON.stringify(doc  ));
//   },
//   (e) => {
//     console.log('Unable to save the user ', e);
//   }
// )

// var newTodo = new Todo({
//   text: 'Challenge',
//   completed: true,
//   completedAt: 3
// });

// var newTodo = new Todo({
//   text: ' 123'
// });
//
// newTodo.save().then(
//   (doc) => {
//     console.log('Saved: ', doc);
//   },
//   (e) => {
//     console.log('Unable to save the todo', e);
//   }
// );
