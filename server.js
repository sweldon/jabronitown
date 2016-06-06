// express configurations
var express = require('express');
var path = require('path');
var app = express();
    app.set('port', 8888);
    app.set('views', path.join(__dirname, 'public/views'));
    app.set('view engine', 'pug');
    app.use(express.static(path.join(__dirname, 'public')));


// requrements 
var mongoose = require('mongoose');
var request = require("request")

// Connect to db
mongoose.connect('mongodb://localhost:27017/blacklist', function (error) {
    if (error) {
        console.log(error);
    }
    });



// Mongoose Schemas
var userSchema = mongoose.Schema({
    name: String,
    age: Number,
    rating: Number,
    rank: String,
    steam_id: String
});

var User = mongoose.model('User', userSchema);

app.get('/', function (req, res) {
   var myname = req.param('player');
   // if (typeof myname !== 'undefined') {console.log(myname)};
   if((myname != '') && (typeof myname !== 'undefined'))
   {


    // Resolve input format
      // if(myname.indexOf('steamcommunity.com/profiles')  > -1)
      // {


      // var steam = myname.replace( /^\D+/g, '').replace(/^\/|\/$/g, '');
      // console.log(steam);
      // // query("steam_id", steam);

      // User.find({steam_id: steam}, function (err, docs2) { 
      // docs = docs2;
      // });


      // }
      // else if(myname.indexOf('steamcommunity.com/id')  > -1)
      // {
      // var trimmed = myname.replace(/^\/|\/$/g, '');
      // var chunked = trimmed.split('/');
      // var id = chunked[chunked.length -1];
      // console.log(id)
      // name = id;
      // console.log("by id")
      // User.find({name: id}, function (err, docs2) { 
      // docs = docs2;

      // });

      // // query("name", name);

      // }
      // else
      // {
      // console.log("by original input")
      // User.find({name: myname}, function (err, docs2) { 
      // docs = docs2;
      // });

      // // query("name", myname);
      // }

    // Resolve input format

    // myname = myname.replace(/ /g,"");
    User.find({name: myname}, function (err, docs) {
        // res.json(docs[0].name);
        // res.render('index', { title: 'Hey', message: 'Hello there!'});
        if(docs.length > 0)
        {
          //get avatar & nickname
          var profInfo = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=9E9FA805315870376BABB490E2B92C93&steamids="+docs[0].steam_id
          request({
          url: profInfo,
          json: true
          }, function (error, response, body) {

          var avatar = body["response"]["players"][0]["avatarfull"];
          var nickname = body["response"]["players"][0]["personaname"];
            if(body["response"]["players"][0]["gameextrainfo"])
            {
              docs[0]["gameextrainfo"] = "In-Game";
            }
          docs[0]["nickname"] = nickname;
          docs[0]["avatarfull"] = avatar;
          res.render('index', {results : docs});
          })

          
        }
        else
        {

          var steamID = "http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=9E9FA805315870376BABB490E2B92C93&vanityurl="+myname
            request({
                url: steamID,
                json: true
            }, function (error, response, body) {

                if (!error && response.statusCode === 200) {
                    if(body["response"]["message"] !== "No match")
                    {
                      var proflink = body["response"]["steamid"];

                      // Might still be in the db, make sure before request
                      User.find({steam_id: proflink}, function (err, docs2) { 

                        if(docs2.length > 0)
                        {
                          var profInfo = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=9E9FA805315870376BABB490E2B92C93&steamids="+proflink
                            request({
                            url: profInfo,
                            json: true
                            }, function (error, response, body2) {

                            var avatar = body2["response"]["players"][0]["avatarfull"];
                            var nickname = body2["response"]["players"][0]["personaname"];
                            docs2[0]["nickname"] = nickname;
                            docs2[0]["avatarfull"] = avatar;
                            res.render('index', {results : docs2});
                            })

                        }
                        else
                        {
                            var profInfo = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=9E9FA805315870376BABB490E2B92C93&steamids="+proflink
                            request({
                            url: profInfo,
                            json: true
                            }, function (error, response, body) {

                            // console.log(body);
                            res.render('index', {results : body});
                            })
                            // res.render('index', {results : profInfo});
                        }

                       });




                    } 
                    else
                    {
                      res.render('index', {results : body});
                    }

                }
            })
          // get the steam id from what they typed
          //http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=9E9FA805315870376BABB490E2B92C93&vanityurl=stmyd
          // use steam id for all usr info
          // http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=9E9FA805315870376BABB490E2B92C93&steamids=

        }
    });
   }
   else
   {
    res.render('index');
   }
        
});

// // pages
// app.get('/users', function (req, res) {
//     User.find({}, function (err, docs) {
//         // res.json(docs[0].name);
//         // res.render('index', { title: 'Hey', message: 'Hello there!'});
//         res.render('users', { json: docs});
//     });
    
// });


// Server
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Server listening on port: ' + port);
});

