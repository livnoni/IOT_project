var five = require('johnny-five');

var board = new five.Board();

board.on('ready', function() {
    console.log("start blinking!")
    var led = new five.Led(13);
    led.blink(500);

    setInterval(()=>{
        console.log("close the led")
        led.off();
    },5000)
});

