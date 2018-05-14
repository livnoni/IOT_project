var express = require('express');
var request = require('request');
var cors = require('cors');
var bodyParser = require("body-parser");
var path = require('path');
var textData;

var config = require("./config.json");

var app = express();
app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var server = app.listen(config.port, function () {
    console.log("app running on port:", server.address().port);
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.post('/data', function(req, res) {
    var text = req.body.text;
    textData += text;
    console.log("got post request: "+text);
    res.send("server got: "+ text);
});

app.get('/getText', function(req, res) {
    res.send(textData);
    textData = "";
});


