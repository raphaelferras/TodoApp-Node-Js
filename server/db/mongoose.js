var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
var URL = process.env.MONGODB_URI;

mongoose.connect(URL);


module.exports = {
  mongoose
}
