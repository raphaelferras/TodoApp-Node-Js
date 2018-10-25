const _ = require('lodash');
const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

var app = express();

var PORT = process.env.PORT || 3000;

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

app.get('/todos', (req,res) =>  {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send();
  })
});

app.get('/todos/:id', (req, res) => {
  //res.send();
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if(!todo){
      return res.status(404).send();

    }
    res.send({todo});
  }, (e) => {
    res.status(400).send();
  })
});


app.delete('/todos/:id', (req, res) => {
  //res.send();
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }, (e) => {
    res.status(400).send();
  })
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text','completed']);

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {
    $set: body
  }, {
    new: true
  }).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.listen(PORT, () => {
  console.log(`Started on port ${PORT}`);
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
