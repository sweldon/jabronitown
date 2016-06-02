var express = require('express');
var path = require('path');
var app = express();

// Define the port to run on
app.set('port', 8888);

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

var mongoose = require('mongoose');

// Mongoose connection to MongoDB (ted/ted is readonly)
mongoose.connect('mongodb://localhost:27017/blacklist', function (error) {
    if (error) {
        console.log(error);
    }
});


var userSchema = mongoose.Schema({
    name: String,
    age: Number,
    rating: Number,
    rank: String
});

var User = mongoose.model('User', userSchema);

app.get('/', function (req, res) {
    User.find({}, function (err, docs) {
        // res.json(docs[0].name);
        // res.render('index', { title: 'Hey', message: 'Hello there!'});
        res.render('index', { json: docs});
    });
    
});

// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Server listening on port: ' + port);
});