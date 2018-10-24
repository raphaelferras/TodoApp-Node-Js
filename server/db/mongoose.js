var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
var URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp';

mongoose.connect(URL);


module.exports = {
  mongoose
}
