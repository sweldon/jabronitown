// express configurations
var express = require('express');
var path = require('path');
var app = express();
    // app.set('port', 5000);
    app.set('port', (process.env.PORT || 8888));
    app.set('views', path.join(__dirname, 'public/views'));
    app.set('view engine', 'pug');
    app.use(express.static(path.join(__dirname, 'public')));


// requrements 
var mongoose = require('mongoose');
var request = require("request")

// Connect to db
mongoose.connect('mongodb://admin:adminpass@ds011734.mlab.com:11734/heroku_xc6qf81p', function (error) {
    if (error) {
        //console.log(error);
    }
    });

// mongoose.connect('mongodb://localhost:27017/blacklist', function (error) {
//     if (error) {
//         //console.log(error);
//     }
//     });



// Mongoose Schemas
var userSchema = mongoose.Schema({
    name: String,
    age: Number,
    rating: Number,
    rank: String,
    steam_id: String,
    avatarfull: String,
    avatarmedium: String
});

var User = mongoose.model('User', userSchema);


var voterSchema = mongoose.Schema({
    ip: String,
    votes: []
});

var Voter = mongoose.model('Voter', voterSchema);




app.get('/', function (req, res) {
   var myname = req.param('player');
   var add_player = req.param('add_player')
   var upvote = req.param('upvote')
   // if (typeof myname !== 'undefined') {//console.log(myname)};
   if((myname != '') && (typeof myname !== 'undefined'))
   {


    // Resolve input format
      if(myname.indexOf('steamcommunity.com/profiles')  > -1)
      {


      var steam = myname.replace( /^\D+/g, '').replace(/^\/|\/$/g, '');
      //console.log(steam);
      // query("steam_id", steam);

      User.find({steam_id: steam}, function (err, docs) {
          // res.json(docs[0].name);
          // res.render('index', { title: 'Hey', message: 'Hello there!'});
          query(docs, "steam", myname);
      });

      }
      else if(myname.indexOf('steamcommunity.com/id')  > -1)
      {
      var trimmed = myname.replace(/^\/|\/$/g, '');
      var chunked = trimmed.split('/');
      var id = chunked[chunked.length -1];
      //console.log("GOOD STUFF"+id)
      // name = id;
      // //console.log("by id")
  
          User.find({name: id}, function (err, docs) {
        // res.json(docs[0].name);
        // res.render('index', { title: 'Hey', message: 'Hello there!'});
        query(docs, "name", id);
           });

      // query("name", name);

      }
      else
      {
    User.find({name: myname}, function (err, docs) {
        // res.json(docs[0].name);
        // res.render('index', { title: 'Hey', message: 'Hello there!'});
        query(docs, "id", myname);
    });
      }

    // Resolve input format

    // myname = myname.replace(/ /g,"");

    function query(docs, type, input){
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



          var voterIp = req.header('x-forwarded-for') || req.connection.remoteAddress;


          Voter.find({ip: voterIp}, function (err, docs2) { 

          if(docs2.length > 0)
          {
          //WAIT CHECK FIRST IF IP IS IN THE LIST. IF IT IS DO NOTHING IF IT ISNT, UPDATE RATING

          votesList = docs2[0].votes

          if(votesList.indexOf(docs[0].steam_id) > -1)
          { 
            //console.log("HAS VOTED")
            docs["modified"] = "true"
            res.render('index', {results : docs});
          }
          else
          {
            //console.log("HAS NOT VOTED")
            res.render('index', {results : docs});
          }
          } 
          else
          {
            res.render('index', {results : docs});
          }
          })

          //console.log(docs)
          
          })

          
        }
        else
        {

          if(type == 'steam')
          {

                      User.find({steam_id: input}, function (err, docs2) { 

                        if(docs2.length > 0)
                        {
                          var profInfo = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=9E9FA805315870376BABB490E2B92C93&steamids="+input
                            request({
                            url: profInfo,
                            json: true
                            }, function (error, response, body2) {

                            var avatar = body2["response"]["players"][0]["avatarfull"];
                            var nickname = body2["response"]["players"][0]["personaname"];
                            docs2[0]["nickname"] = nickname;
                            docs2[0]["avatarfull"] = avatar;

                              var voterIp = req.header('x-forwarded-for') || req.connection.remoteAddress;


                              Voter.find({ip: voterIp}, function (err, docs3) { 

                              if(docs3.length > 0)
                              {
                              //WAIT CHECK FIRST IF IP IS IN THE LIST. IF IT IS DO NOTHING IF IT ISNT, UPDATE RATING

                              votesList = docs3[0].votes

                              if(votesList.indexOf(docs3[0].input) > -1)
                              { 
                                //console.log("HAS VOTED")
                                docs2["modified"] = "true"
                                res.render('index', {results : docs2});
                              }
                              else
                              {
                                //console.log("HAS NOT VOTED")
                                res.render('index', {results : docs2});
                              }
                              } 
                              else
                              {
                                res.render('index', {results : docs2});
                              }
                              })

                            })

                        }
                        else
                        {
                            var profInfo = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=9E9FA805315870376BABB490E2B92C93&steamids="+input
                            request({
                            url: profInfo,
                            json: true
                            }, function (error, response, body) {


                              var voterIp = req.header('x-forwarded-for') || req.connection.remoteAddress;


                              Voter.find({ip: voterIp}, function (err, docs2) { 

                              if(docs2.length > 0)
                              {
                              //WAIT CHECK FIRST IF IP IS IN THE LIST. IF IT IS DO NOTHING IF IT ISNT, UPDATE RATING

                              votesList = docs2[0].votes

                              if(votesList.indexOf(docs2[0].input) > -1)
                              { 
                              //console.log("HAS VOTED")
                              docs["modified"] = "true"
                              res.render('index', {results : body});
                              }
                              else
                              {
                              //console.log("HAS NOT VOTED")
                              res.render('index', {results : body});
                              }
                              } 
                              else
                              {
                              res.render('index', {results : body});
                              }
                              })
                            // //console.log(body);
                            })
                            // res.render('index', {results : profInfo});
                        }

                       });




          }
          else {
          var steamID = "http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=9E9FA805315870376BABB490E2B92C93&vanityurl="+input
            //console.log(steamID)
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

                              var voterIp = req.header('x-forwarded-for') || req.connection.remoteAddress;


                              Voter.find({ip: voterIp}, function (err, docs3) { 

                              if(docs3.length > 0)
                              {
                              //WAIT CHECK FIRST IF IP IS IN THE LIST. IF IT IS DO NOTHING IF IT ISNT, UPDATE RATING

                              votesList = docs3[0].votes

                            if(votesList.indexOf(proflink) > -1)
                            { 
                              //console.log("HAS VOTED")
                              docs2["modified"] = "true"
                              res.render('index', {results : docs2});
                            }
                            else
                            {
                              //console.log("HAS NOT VOTED")
                              res.render('index', {results : docs2});
                            }
                              } 
                              else
                              {
                                res.render('index', {results : docs2});
                              }
                              })

                            })

                        }
                        else
                        {
                            var profInfo = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=9E9FA805315870376BABB490E2B92C93&steamids="+proflink
                            request({
                            url: profInfo,
                            json: true
                            }, function (error, response, body) {

                            var voterIp = req.header('x-forwarded-for') || req.connection.remoteAddress;


                            Voter.find({ip: voterIp}, function (err, docs2) { 

                            if(docs2.length > 0)
                            {
                            //WAIT CHECK FIRST IF IP IS IN THE LIST. IF IT IS DO NOTHING IF IT ISNT, UPDATE RATING

                            votesList = docs2[0].votes

                            if(votesList.indexOf(proflink) > -1)
                            { 
                              //console.log("HAS VOTED")
                              body["modified"] = "true"
                              res.render('index', {results : body});
                            }
                            else
                            {
                              //console.log("HAS NOT VOTED")
                              res.render('index', {results : body});
                            }
                            } 
                            else
                            {
                              res.render('index', {results : body});
                            }
                            })
                            // //console.log(body);
                            })
                            // res.render('index', {results : profInfo});
                        }

                       });




                    } 
                    else
                    {
                        // var voterIp = req.header('x-forwarded-for') || req.connection.remoteAddress;


                        // Voter.find({ip: voterIp}, function (err, docs2) { 

                        // if(docs2.length > 0)
                        // {
                        // //WAIT CHECK FIRST IF IP IS IN THE LIST. IF IT IS DO NOTHING IF IT ISNT, UPDATE RATING

                        // votesList = docs2[0].votes

                        // if(votesList.indexOf(docs[0].steam_id) > -1)
                        // { 
                        // docs["modified"] = "true"
                        // }
                        // } 
                        // })
                      res.render('index', {results : body});
                    }

                }
            })
          // get the steam id from what they typed
          //http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=9E9FA805315870376BABB490E2B92C93&vanityurl=stmyd
          // use steam id for all usr info
          // http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=9E9FA805315870376BABB490E2B92C93&steamids=
        }
        }
    }
   }
   else if((add_player != '') && (typeof add_player !== 'undefined'))
   {
    var profInfo = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=9E9FA805315870376BABB490E2B92C93&steamids="+add_player
    request({
    url: profInfo,
    json: true
    }, function (error, response, body2) {

    var avatar_medium = body2["response"]["players"][0]["avatarmedium"];
    var avatar_full = body2["response"]["players"][0]["avatarfull"];
    var nickname = body2["response"]["players"][0]["personaname"];

  User.find({steam_id: add_player}, function (err, docs2) {

    if(docs2.length == 0)
    {
    var newUser = new User({

    name: nickname,
    rating: 1,
    rank:"Typical",
    steam_id: add_player,
    avatarfull: avatar_full,
    avatarmedium: avatar_medium

    })

    newUser.save(function(er, data) {

    //console.log("Saved: ", data);

    });

    var voterIp = req.header('x-forwarded-for') || req.connection.remoteAddress;
    Voter.find({ip: voterIp}, function (err, docs) { 

    if(docs.length > 0)
    {
      var votesList = docs[0].votes;
      votesList.push(add_player);
      Voter.update({ip: voterIp},{votes: votesList}, function(err,affected) { });

    }
    else
    {
        var newVoter = new Voter({

        ip: voterIp,
        votes: [add_player]

        })

        newVoter.save(function(er, data) {

        //console.log("Voter Saved: ", data);

        });

    }

  })

    //console.log(body2);
    res.render('index', {add_results : body2});

    }
    else
    {
      //console.log("Already added, doing nothing.")
      // res.render('index');
      res.render('index', {add_results : body2});
    }

   });


    })
   }
   else if((upvote != '') && (typeof upvote !== 'undefined'))
   {

    var voterIp = req.header('x-forwarded-for') || req.connection.remoteAddress;


    Voter.find({ip: voterIp}, function (err, docs) { 

    if(docs.length > 0)
    {
      //WAIT CHECK FIRST IF IP IS IN THE LIST. IF IT IS DO NOTHING IF IT ISNT, UPDATE RATING

      votesList = docs[0].votes

      if(votesList.indexOf(upvote) > -1)
      {
        //console.log(voterIp+" exists, and has already voted for "+upvote)

          User.find({steam_id: upvote}, function (err, docs) { 

          if(docs.length > 0)
          {
          //console.log(docs[0])

          docs["modified"] = "true"

          res.render('index', {results : docs});

          }
          });

      }
      else
      {
        //console.log("Existing Voter, New vote: "+voterIp+" for "+upvote)
        votesList.push(upvote)
        Voter.update({ip: voterIp},{votes: votesList}, function(err,affected) { });


        User.find({steam_id: upvote}, function (err, docs) { 

        if(docs.length > 0)
        {
        //console.log(docs[0])
        var updatedRating = docs[0]["rating"] + 1
        User.update({steam_id: upvote},{rating: updatedRating}, function(err,affected) {

        });


        docs["modified"] = "true"
        docs[0]["rating"] = updatedRating

        res.render('index', {results : docs});

        }
        });
      }

    }

    else
    {
      //console.log("New Voter, New vote: "+voterIp+" for "+upvote)
      var newVoter = new Voter({

      ip: voterIp,
      votes: [upvote]

      })

      newVoter.save(function(er, data) {

      //console.log("Voter Saved: ", data);

      });

    User.find({steam_id: upvote}, function (err, docs) { 

    if(docs.length > 0)
    {
      //console.log(docs[0])
      var updatedRating = docs[0]["rating"] + 1
      User.update({steam_id: upvote},{rating: updatedRating}, function(err,affected) {
    });

    
      docs["modified"] = "true"
      docs[0]["rating"] = updatedRating

      res.render('index', {results : docs});

      //console.log(docs)

    }
    });

    }

    })



   }
   else
   {

  var sort = {'_id': -1}
// collection.find({}, limit=10).sort(sort)



    User.find({}, function (err, docs2) {

        var ingame = [];
        completed_request = 0;
         for(var j=0;j<docs2.length;j++)
        {
          
     
          request({
          url: "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=9E9FA805315870376BABB490E2B92C93&steamids="+docs2[j].steam_id,
          json: true
          }, function (error, response, body) {


            // if("gameextrainfo" in body["response"]["players"][0])
            // {
            //   ingame.push(body["response"]["players"][0]["personaname"]);
            // }

            completed_request++;
            
            if (completed_request == docs2.length) {

              User.find({
              'steam_id': { $in: [ "76561198002041609", "76561197998181418","76561198000768061", "76561198028841483", "76561197993762951", "76561197974866126", "76561198000586070"
              ]}
              }, function (err, jabronos) {
                
                //console.log(jabronos.length)
                res.render('index', { recentJabronies: docs2 , ingameList: ingame, jabronoList: jabronos});

              })


               
            }
              // ingame.push(body["response"]["players"][0]["personaname"])

              // //console.log(ingame);
            
          })


          
          }
         
        
        // //console.log(online)
          // //console.log(id)


        



        
    }).sort(sort).limit(6);


   
      // var profInfo = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=9E9FA805315870376BABB490E2B92C93&steamids=76561198002041609"
      //   request({
      //   url: profInfo,
      //   json: true
      //   }, function (error, response, body) {

      //   // //console.log(body);
      //   res.render('index', {resultsa : body});
      //   })

    // res.render('index');
    // res.render('index', {results : body});
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
  //console.log('Server listening on port: ' + port);
});

