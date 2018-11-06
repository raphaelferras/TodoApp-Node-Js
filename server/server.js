require('./config/config');

const _ = require('lodash');
const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate.js');

var app = express();

var PORT = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
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

app.get('/todos', authenticate, (req,res) =>  {
  Todo.find({_creator:req.user._id}).then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send();
  })
});

app.get('/todos/:id', authenticate, (req, res) => {
  //res.send();
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findOne({_id:id, _creator:req.user._id}).then((todo) => {
    if(!todo){
      return res.status(404).send();

    }
    res.send({todo});
  }, (e) => {
    res.status(400).send();
  })
});


app.delete('/todos/:id', authenticate, (req, res) => {
  //res.send();
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findOneAndRemove({_id:id, _creator:req.user._id}).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }, (e) => {
    res.status(400).send();
  })
});

app.patch('/todos/:id', authenticate, (req, res) => {
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

  Todo.findOneAndUpdate({_id:id, _creator:req.user._id}, {
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



app.post('/users', (req, res) => {
  var user = new User(_.pick(req.body, ['email','password','tokens.access','tokens.token']));
  user.save().then(
    () => {
      return user.generateAuthToken();
    }
  ).then((token) => {
      res.header('x-auth', token).send(user);
    }
  ).catch((e) => {
    res.status(400).send(e);
  });
});

app.get('/users/me',authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login' , (req, res) => {
  var body = _.pick(req.body, ['email','password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  })

});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
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
