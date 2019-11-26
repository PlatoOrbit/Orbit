//Dependencies
var express = require("express");
var bodyParser = require('body-parser');
var http = require('http');
var https = require('https');
var fs = require('fs');
var app = express();

//Static Server Settings
app.use(express.static('public'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/images', express.static(__dirname + '/public/images'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//SSL Cert Setting


//Routing Options
app.get('/',function(req, res){
  static_serve('index.html',res);
});

// var server = app.listen(PORT, function(){
//     console.log(`App listening on port ${PORT}`);
//     console.log('Press Ctrl+C to quit.');
// });
module.exports = app;
const PORT = process.env.PORT || 8080;
// //Configure normal Connection
// http_port = 8080;
http.createServer(app).listen(PORT,
  () => {console.log("Listening on localhost:" + PORT)});
//Configure SSL
// var privateKey = fs.readFileSync( './private/yanvolo.key' );
// var certificate = fs.readFileSync( './private/yanvolo_com.crt' );
//
// https.createServer({
//     key: privateKey,
//     cert: certificate
// }, app).listen(PORT, () => {console.log("Listening on localhost:" + PORT);});
