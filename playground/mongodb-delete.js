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

//delete many
// db.collection("Todos").deleteMany({text: "eat lunch"}).then((res) => {
//   console.log(res);
// });
// delete one
// db.collection("Todos").deleteOne({text: "eat lunch"}).then((res) => {
//   console.log(res);
// });
// find One and delete
// db.collection("Todos").findOneAndDelete({completed: false}).then((res) => {
//   console.log(res);
// });


  // db.collection("Users").deleteMany({name: "Raphael Silva"}).then((res) => {
  //   console.log(res);
  // });

  db.collection("Users").findOneAndDelete({_id: "123"}).then((res) => {
    console.log(res);
  });
  client.close();
});
