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
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

var server = app.listen(config.port, function () {
    console.log("app running on port:", server.address().port);
});

var five = require('johnny-five');

var board = new five.Board();
var led;

board.on('ready', function() {
    console.log("Arduino connected!");
    led = new five.Led(13);
    led.off();
    // led.blink(500);
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.post('/data', function (req, res) {
    var text = req.body.text;
    textData += text;
    console.log("got post request: " + text);
    res.send("server got: " + text);
    analyzeText(text);
});

app.get('/getText', function (req, res) {
    res.send(textData);
    textData = "";
});

app.get('/ledOn', function (req, res) {
    res.send(textData);
    textData = "";
    if(turnOnLed()){
        console.log("set the led on");
        textData = "turning on the led..."
    }else{
        console.error("can't set the led on!");
    }
});

app.get('/ledOff', function (req, res) {
    res.send(textData);
    textData = "";
    if(turnOffLed()){
        console.log("set the led off");
        textData = "turning off the led."
    }else{
        console.error("can't set the led off!");
    }
});

var webdriver = require('selenium-webdriver'),
    until = webdriver.until,
    By = webdriver.By;

var driver;

function analyzeText(text) {
    text = text.toLowerCase();
    if (text.includes("google") && text.includes("open")) {
        console.log("analyzeText found google! start automation...");
        driver = new webdriver.Builder().forBrowser("chrome").build();
        driver.get("https://www.google.com/");
    } else if (text.includes("youtube") && text.includes("open")) {
        console.log("analyzeText found youtube! start automation...");
        driver = new webdriver.Builder().forBrowser("chrome").build();
        driver.get("https://www.youtube.com/");
    } else if (text.includes("weather")) {
        console.log("analyzeText found weather! start automation...");
        driver = new webdriver.Builder().forBrowser("chrome").build();
        driver.get("https://weather.ynet.co.il/");
    } else if (text.includes("taxi") || text.includes("uber")) {
        console.log("analyzeText found taxi || uber! start automation...");
        driver = new webdriver.Builder().forBrowser("chrome").build();
        driver.get("https://m.uber.com/looking/search/pickup");
    } else if (text.includes("news") || text.includes("open")) {
        console.log("analyzeText found news! start automation...");
        driver = new webdriver.Builder().forBrowser("chrome").build();
        driver.get("http://rotter.net/scoopscache.html");
    } else if (text.includes("scroll down")) {
        console.log("analyzeText found scroll down! start automation...");
        if (driver) {
            driver.executeScript("window.scrollBy(0,300)");
        }
    } else if (text.includes("scroll up")) {
        console.log("analyzeText found scroll up! start automation...");
        if (driver) {
            driver.executeScript("window.scrollBy(0,-300)");
        }
    } else if (text.includes("close") || text.includes("shut down") || text.includes("shutdown")) {
        console.log("analyzeText found close || shut down! start automation...");
        if (driver) {
            driver.close();
        }
    } else if (text.includes("turn on") && (text.includes("light") || text.includes("led"))) {
        console.log("analyzeText found turn on light start automation...");
        turnOnLed();
    } else if (text.includes("turn off") && (text.includes("light") || text.includes("led"))) {
        console.log("analyzeText found turn of light start automation...");
        turnOffLed();
    }
}

function turnOnLed(){
    if (board) {
        led.on();
        return true;
    }
    return false;
}

function turnOffLed(){
    if (board) {
        led.off();
        return true;
    }
    return false;
}


