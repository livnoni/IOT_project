var express = require('express');
var request = require('request');
var cors = require('cors');
var bodyParser = require("body-parser");
var path = require('path');
var say = require('say');
var textData;
var config = require("./config.json");
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = config.mongoUrl;



var app = express();
app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

var server = app.listen(config.port, function () {
    console.log("app running on port:", server.address().port);
});

var five = require('johnny-five');
var board = new five.Board();
var controller = process.argv[2] || "GP2Y0A02YK0F";
var led;
var distance = 0;
var button;

var eventGenerator = function (time, data, extraData) {
    var temp = {};

    temp.time = time;
    temp.data = data;
    if(extraData) temp.extraData = extraData;

    return temp;
};

function writeToDB(obj, collectionName){
    MongoClient.connect(mongoUrl, function(err, db) {
        if (err) throw err;
        var dbo = db.db("iot_smart_home");
        dbo.collection(collectionName).insertOne(obj, function(err, res) {
            if (err) throw err;
            console.log(`1 document inserted -> [${JSON.stringify(obj)}]`);
            db.close();
        });
    });
}

board.on('ready', function() {
    console.log("Arduino connected!");
    led = new five.Led(13);
    led.off();
    // led.blink(500);

    var proximity = new five.Proximity({
        controller: controller,
        pin: "A0"
    });

    proximity.on("data", function() {
        // console.log("cm: ", this.cm);
        distance = this.cm;
    });


    // Create a new `button` hardware instance.
    // This example allows the button module to
    // create a completely default instance
    button = new five.Button(2);

    // Inject the `button` hardware into
    // the Repl instance's context;
    // allows direct command line access
    board.repl.inject({
        button: button
    });

    // Button Event API

    // "down" the button is pressed
    button.on("down", function() {
        textData = "button have pressed";
        writeToDB(eventGenerator(new Date,"button clicked", "regular command"), "button");
        console.log("button pressed");
    });

    // "hold" the button is pressed for specified time.
    //        defaults to 500ms (1/2 second)
    //        set
    // button.on("hold", function() {
    //     console.log("hold");
    // });
    //
    // // "up" the button is released
    // button.on("up", function() {
    //     console.log("up");
    // });
});


setInterval(()=>{
    if(distance != 0){
        writeToDB(eventGenerator(new Date,distance + " cm", "regular command"), "distance");
    }
},1000 * 60);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.post('/data', function (req, res) {
    var text = req.body.text;
    try{
        writeToDB(eventGenerator(new Date,text.split("\n")[0], "speech command"), "speechToText");
    }catch (err){
        console.log("can't send speech data to mongo")
    }
    textData += text;
    console.log("got post request: " + text);
    res.send("server got: " + text);
    analyzeText(text);
});

app.get('/getText', function (req, res) {
    var objToSend = {textData: textData, distance: distance};
    res.send(JSON.stringify(objToSend));
    // res.send(textData);
    textData = "";
});

app.get('/ledOn', function (req, res) {
    res.send(textData);
    textData = "";
    if(turnOnLed()){
        console.log("set the led on");
        textData = "turning on the led...";
        writeToDB(eventGenerator(new Date,"led on", "regular command"), "led");
    }else{
        console.error("can't set the led on!");
    }
});

app.get('/ledOff', function (req, res) {
    res.send(textData);
    textData = "";
    if(turnOffLed()){
        console.log("set the led off");
        textData = "turning off the led.";
        writeToDB(eventGenerator(new Date,"led on", "regular command"), "led");
    }else{
        console.error("can't set the led off!");
    }
});

app.get('/sayDistance', function (req, res) {
    console.log("got sayDistance from client...");
    var textToSpeach = `The distance is ${distance | 0} centimeters`;
    writeToDB(eventGenerator(new Date,textToSpeach, "regular command"), "sayDistance");
    say.speak(textToSpeach);
    res.send(`server say: ${textToSpeach}`);
});

var webdriver = require('selenium-webdriver'),
    until = webdriver.until,
    By = webdriver.By;

var driver;

function analyzeText(text) {
    text = text.toLowerCase();
    if (text.includes("google") && text.includes("open")) {
        writeToDB(eventGenerator(new Date,"google", "speech command"), "webdriver");
        console.log("analyzeText found google! start automation...");
        driver = new webdriver.Builder().forBrowser("chrome").build();
        driver.get("https://www.google.com/");
    } else if (text.includes("youtube") && text.includes("open")) {
        writeToDB(eventGenerator(new Date,"youtube", "speech command"), "webdriver");
        console.log("analyzeText found youtube! start automation...");
        driver = new webdriver.Builder().forBrowser("chrome").build();
        driver.get("https://www.youtube.com/");
    } else if (text.includes("weather")) {
        writeToDB(eventGenerator(new Date,"weather", "speech command"), "webdriver");
        console.log("analyzeText found weather! start automation...");
        driver = new webdriver.Builder().forBrowser("chrome").build();
        driver.get("https://weather.ynet.co.il/");
    } else if (text.includes("taxi") || text.includes("uber")) {
        writeToDB(eventGenerator(new Date,"taxi", "speech command"), "webdriver");
        console.log("analyzeText found taxi || uber! start automation...");
        driver = new webdriver.Builder().forBrowser("chrome").build();
        driver.get("https://m.uber.com/looking/search/pickup");
    } else if (text.includes("news") || text.includes("open")) {
        writeToDB(eventGenerator(new Date,"news", "speech command"), "webdriver");
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
        writeToDB(eventGenerator(new Date,"close webdriver", "speech command"), "webdriver");
        console.log("analyzeText found close || shut down! start automation...");
        if (driver) {
            driver.close();
        }
    } else if (text.includes("turn on") && (text.includes("light") || text.includes("led"))) {
        writeToDB(eventGenerator(new Date,"led on", "speech command"), "led");
        console.log("analyzeText found turn on light start automation...");
        turnOnLed();
    } else if (text.includes("turn off") && (text.includes("light") || text.includes("led"))) {
        writeToDB(eventGenerator(new Date,"led off", "speech command"), "led");
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



