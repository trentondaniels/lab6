var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var url = require('url');
var bodyParser = require('body-parser');
var app = express();
var basicAuth = require('basic-auth-connect');

app.use(bodyParser());

var options = {
    host: '127.0.0.1',
    key: fs.readFileSync('ssl/server.key'),
    cert: fs.readFileSync('ssl/server.crt')
};
var auth = basicAuth(function(user, pass) {
	return((user ==='cs201r')&&(pass === 'test'));
});
http.createServer(app).listen(80);
https.createServer(options, app).listen(443);
app.get('/', function (req, res) {
	res.send("Get Index");
});

app.use('/', express.static('./html', {maxAge: 60*60*1000}));

app.get('/getcity', function (req, res) {
    console.log("In getcity route");
    var myRe = new RegExp("^"+req.query["q"]);
    var jsonresult = [];
    fs.readFile('cities.dat.txt', function(err, data) {
        if (err) throw err;
        cities = data.toString().split("\n");
        for(var i=0; i < cities.length; i++) {
            var result = cities[i].search(myRe);
            if(result != -1) {
                jsonresult.push({city: cities[i]});
            }
        }
    	res.json(jsonresult);
    });
});

app.get('/comment', function (req, res) {
	console.log("In comment route");
	var MongoClient = require('mongodb').MongoClient;
	MongoClient.connect("mongodb://localhost/weather", function(err, db) {
        if(err) throw err;
        db.collection("comments", function(err, comments){
          	if(err) throw err;
        	comments.find(function(err, items){
				items.toArray(function(err, resarray) {
					res.json(resarray);
				});
			});
		});
	});
});
app.post('/comment', auth, function (req, res) {
	console.log("In POST comment route");
	console.log(req.user);
    console.log("Remote User");
    console.log(req.remoteUser);
	console.log(req.body);
	console.log(req.body.Name);
    console.log(req.body.Comment);
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect("mongodb://localhost/weather", function(err, db) {
      	if(err) throw err;
      	db.collection('comments').insert(req.body,function(err, records) {
        	console.log("Record added as "+records[0]._id);
    	});
    });
	res.status(200);
	res.end();
});
