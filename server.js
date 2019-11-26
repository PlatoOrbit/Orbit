//Dependencies
var express = require("express");
var app = express();
var bodyParser = require('body-parser');

//FIREBASE Config
var firebase = require('firebase');
// Your web app's Firebase configuration
var firebaseConfig = require('./private/api-key.json');
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var admin = require("firebase-admin");
var serviceAccount = require("./private/orbit-key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://avian-mystery-257322.firebaseio.com"
});



var db = firebase.firestore();


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

app.get('/test',function(req,res){
  static_serve('demo.html',res);
});

app.get('/feed',function(req,res){
  var user = firebase.auth().currentUser;
  if (user) {
    static_serve('feed.html',res);
  } else {
    res.redirect("/login?error=need_to_login")
  }
});

app.get('/profile',function(req,res){
  var user = firebase.auth().currentUser;
  if (user) {
    static_serve('profile.html',res);
  } else {
    res.redirect("/login?error=need_to_login")
  }
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
    res.redirect("/feed?message=loggedin");
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

app.get('/action/user', function(req,res){
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(403);
  }
  });
});

app.get('/action/user_token',function(req,res){
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    res.json(user.getToken());
  } else {
    res.sendStatus(403);
  }
  });
});

app.get('/action/signout',function(){
  firebase.auth().signOut().then(function() {
    res.redirect("/login?message=logged_out_successfully");
  }).catch(function(error) {
    res.sendStatus(500);
  });
});

app.get('/action/test_db',function(req,res){
  const rssRef = db.collection('rss-feeds');
  let querryRef = rssRef.where('feedURL','==',true).get()
  .then(snapshot => {
    if (snapshot.empty) {
      console.log('No matching documents.');
      res.sendStatus(200);
    }

    snapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
      res.sendStatus(200);
    });
  })
  .catch(err => {
    console.log('Error getting documents', err);
    res.sendStatus(400);
  });
});
module.exports = app;
