//Dependencies
var express = require("express");
var app = express();
var bodyParser = require('body-parser');

app.use(express.static('public'));

//Configs
//make way for some custom css, js and images
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/images', express.static(__dirname + '/public/images'));

const PORT = process.env.PORT || 8080;
var server = app.listen(PORT, function(){
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});

//FIREBASE Config
var admin = require("firebase-admin");

var serviceAccount = require("./private/orbit-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://avian-mystery-257322.firebaseio.com"
});

var db = admin.firestore;

//ROUTES
app.get('/',function(req, res){
  var options = {
    root: __dirname,
    dotfiles: 'deny',
    headers: {
      'x-timestamp':Date.now(),
      'x-sent': true
    }
  }
  var fileName = 'index.html'
  res.sendFile('./public/index.html',options, function(err){
    if(err){
      console.log(err);
    }else{
      console.log('Sent:',fileName);
    }
  });
})

app.get('/login',function(req,res){
  res.sendStatus(200);
})

app.get('/register',function(req,res){
  res.sendStatus(200);
})

app.get('/feed',function(req,res){
  res.sendStatus(200);
})

app.get('/settings',function(req,res){
  res.sendStatus(200);
})




module.exports = app;
