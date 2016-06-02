// express configurations
var express = require('express');
var path = require('path');
var app = express();
    app.set('port', 8888);

    app.set('views', path.join(__dirname, 'public/views'));
    app.set('view engine', 'pug');

    app.use(express.static(path.join(__dirname, 'public')));


// mongoose configurations
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/blacklist', function (error) {
    if (error) {
        console.log(error);
    }
    });

// users
var userSchema = mongoose.Schema({
    name: String,
    age: Number,
    rating: Number,
    rank: String
});

var User = mongoose.model('User', userSchema);

// pages
app.get('/users', function (req, res) {
    User.find({}, function (err, docs) {
        // res.json(docs[0].name);
        // res.render('index', { title: 'Hey', message: 'Hello there!'});
        res.render('users', { json: docs});
    });
    
});

app.get('/', function (req, res) {
   
    User.find({}, function (err, docs) {
        // res.json(docs[0].name);
        // res.render('index', { title: 'Hey', message: 'Hello there!'});
        res.render('index', { players: docs});
    });
});


// server
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Server listening on port: ' + port);
});

