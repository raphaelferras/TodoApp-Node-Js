//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var user = {name: 'Raphael', age: ''}

MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (err, client) => {
  if (err) {
    console.log('Unable to connect to MongoDb server');
    return;
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');

  // db.collection('Todos').find().toArray().then((docs) => {
  //   console.log('Todo');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to fetch the data', err);
  // });

  // db.collection('Todos').find({completed: false}).toArray().then((docs) => {
  //   console.log('Todo');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to fetch the data', err);
  // });

  // db.collection('Todos').find({_id: new ObjectID("5bc8baa05878014448681dbf")}).toArray().then((docs) => {
  //   console.log('Todo');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to fetch the data', err);
  // });

  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`TODOS count: ${count}`);
  // }, (err) => {
  //   console.log('Unable to fetch the data', err);
  // });

  db.collection('Users').find({name: 'Raphael'}).toArray().then((docs) => {
    console.log('Users');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Unable to fetch the data', err);
  });

  client.close();
});
