//Dependencies
var express = require("express");
var app = express();
var bodyParser = require('body-parser');

//FIREBASE Config
var firebase = require('firebase');
var apiKeys = require('./private/api-key.json')
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: apiKeys.apiKey,
  authDomain: "avian-mystery-257322.firebaseapp.com",
  databaseURL: "https://avian-mystery-257322.firebaseio.com",
  projectId: "avian-mystery-257322",
  storageBucket: "avian-mystery-257322.appspot.com",
  messagingSenderId: "194319976758",
  appId: "1:194319976758:web:855b2940f9eb5f67a10b97",
  measurementId: "G-79NE0SKHV1"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var admin = require("firebase-admin");
var serviceAccount = require("./private/orbit-key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://avian-mystery-257322.firebaseio.com"
});



var db = admin.firestore;

//Configs
//make way for some custom css, js and images
app.use(express.static('public'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/images', express.static(__dirname + '/public/images'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//PORT Config
const PORT = process.env.PORT || 8080;
var server = app.listen(PORT, function(){
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});

//Service Types
function static_serve(fileName,res){
  var options = {
    root: __dirname,
    dotfiles: 'deny',
    headers: {
      'x-timestamp':Date.now(),
      'x-sent': true
    }
  }
  res.sendFile('./public/' + fileName,options, function(err){
    if(err){
      console.log(err);
    }else{
      console.log('Sent:',fileName);
    }
  });
}

//ROUTES
app.get('/',function(req, res){
  static_serve('index.html',res);
});

app.get('/login',function(req,res){
  static_serve('login.html',res);
});

app.get('/register',function(req,res){
  static_serve('register.html',res);
});

app.get('/feed',function(req,res){
  static_serve('feed.html',res);
});

app.get('/settings',function(req,res){
  static_serve('setting.html',res);
});

//DEBUG ROUTES

app.post('/action/login', function(req,res){
  if(!req.body.email || !req.body.password){
    res.redirect("/login?error=missing_info");
  }
  firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password).then(function(){
    res.redirect("/feed");
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode + ":" + errorMessage);
    res.redirect("/login?error="+encodeURI(errorCode));
  });
});

app.post('/action/register', function(req,res){
  if(!req.body.email || !req.body.password){
    res.redirect("/register?error=missing_info");
  }
  firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password).then(function(){
    res.redirect("/login?message=account_created");
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode + ":" + errorMessage);
    res.redirect("/register?error="+encodeURI(errorCode));
  });
});

module.exports = app;
