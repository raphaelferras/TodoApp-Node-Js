const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {SHA256} = require('crypto-js');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('Should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });
  it('Should not create a todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err,res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(4);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(3);
      }).end(done);
  })
});

describe('GET /todos/:id', () => {
  it('should get a single todo', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      }).end(done);
  });

  it('should not get a single todo created by another user', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should not find', (done) => {
    request(app)
      .get(`/todos/${(new ObjectID()).toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should be a invalid id', (done) => {
    request(app)
      .get(`/todos/123`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('REMOVE /todos/:id', () => {
  it('should remove a single todo', (done) => {
    var hexId = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      }).end((err, res) => {
          if (err) {
            return done(err);
          }
          Todo.findById(hexId).then((todo) => {
            expect(todo).toNotExist();
            done();
          }).catch((e) => done(e));
      });

  });

  it('should not remove a single todo', (done) => {
    var hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
          if (err) {
            return done(err);
          }
          Todo.findById(hexId).then((todo) => {
            expect(todo).toExist();
            done();
          }).catch((e) => done(e));
      });

  });

  it('should not find', (done) => {
    request(app)
      .delete(`/todos/${(new ObjectID()).toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should be a invalid id', (done) => {
    request(app)
      .delete(`/todos/123`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('Should update our todo', (done) => {
    var todoID = todos[0]._id.toHexString();
    var updatedText = 'text is updated'
    request(app)
      .patch(`/todos/${todoID}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({text: updatedText, completed: true})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(updatedText);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      }).end((err, res) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('Should not update our todo', (done) => {
    var todoID = todos[0]._id.toHexString();
    var updatedText = 'text is updated again'
    request(app)
      .patch(`/todos/${todoID}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({text: updatedText, completed: true})
      .expect(404)
      .end(done);
  });

  it('Should clear completed at', (done) => {
    var todoID = todos[1]._id.toHexString();
    request(app)
      .patch(`/todos/${todoID}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({completed: false})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[1].text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      }).end((err, res) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });
});

describe('GET /users/me', () => {
  it('Should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('Should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});


describe('POST /users', () => {
  it('Should create a user', (done) => {
    var email = 'example@example2.com';
    var password = '123mnb!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.header['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
        expect(res.body.password).toNotExist();
      })
      .end((err) => {
        if(err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          expect(user.password).toBe(SHA256(JSON.stringify(password) + 'saltingthispasswordtomakeitmoresecure_by_raphael').toString());
          done();
        }).catch((e) => {
          done(e);
        })
      });
  });

  it('Should return validation errors if request invalid', (done) => {
    var email = 'example3.com';
    var password = '12!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    var email = 'jen@test.com';
    var password = '123mnb!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('Should log int user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        //console.log(res.headers['x-auth']);
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[1]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => {
          done(e);
        })
      });
  });

  it('Should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[0].password
      })
      .expect(400)
      .expect((res) => {
        //console.log(res.headers['x-auth']);
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((e) => {
          done(e);
        })
      });
  });
});

describe('DELTE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {

    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if(err){
          return done(err);
        }
        var token = users[0].tokens[0].token
        User.findOne({
          '_id':users[0]._id
        }).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }, (e) => {
          return done(e)
        });
      });
  });
})
