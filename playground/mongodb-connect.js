//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

var user = {name: 'Raphael', age: ''}

MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (err, client) => {
  if (err) {
    console.log('Unable to connect to MongoDb server');
    return;
  }
  console.log('Connected to MongoDB server');
   const db = client.db('TodoApp');
  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   complete: false
  // },(err, res) => {
  //   if(err){
  //     console.log('Unable to insert todo');
  //     return;
  //   }
  //   console.log(JSON.stringify(res.ops, undefined, 2));
  // });

  // db.collection('Users').insertOne({
  //   name: 'Raphael Silva',
  //   age: 30,
  //   location: 'Mississauga'
  // },(err, res) => {
  //   if(err){
  //     return console.log('unable to insert the user', err);
  //   }
  //   console.log(JSON.stringify(res.ops, undefined, 2));
  //   console.log(res.ops[0]._id.getTimestamp());
  // });
  client.close();
});
