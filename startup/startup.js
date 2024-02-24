// startup.js
const thisIsRaspberry = false;
const webappPath      = __dirname + '/../build';
const express         = require('express');
const app             = express();
const ws              = require('ws');
app.listen(8080);
const wss = new ws.WebSocketServer({ port: 8088 })
app.use(express.static(webappPath));
let pushButton;
let gpio;

// const blink = (times, delay) => {
//   if (gpio) for (let i=0; i<times; i++) {
//     setTimeout(gpio.writeSync(i%2), i*delay);
//   };
// }

// startup with some blinking led to check gpio connection
if (thisIsRaspberry) {
  const Gpio = require('onoff').Gpio;
  gpio = new Gpio(4, 'out');
  pushButton = new Gpio(17, 'in', 'both');
  // blink(5, 200);
}

app.use(express.static(webappPath));

wss.on("connection", function(ws) {
  console.log("connection on websocket");
  // blink(2, 400);
  ws.on('message', function message(data) {
    console.log('received: %s', data);
    let gpiovalue = parseInt(JSON.parse(data).gpio);
    if (pushButton) {
      pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton
      if (err) { //if an error
        console.error('There was an error', err); //output error message to console
        return;
      }
      gpiovalue = value;
    })};
    if (gpio) {
      if (gpiovalue !== gpio.readSync()) { //only change GPIO if status has changed
        gpio.writeSync(gpiovalue); //turn GPIO on or off
      }
    };
    ws.send('{"gpio": "' + gpiovalue + '"}'); //send button status to client
  });
});

// turn of gpio on process termination
process.on('SIGTERM', function () {
  if (gpio) gpio.writeSync(0); // Turn GPIO off
  if (gpio) gpio.unexport(); // Unexport GPIO GPIO to free resources
  if (pushButton) pushButton.unexport(); // Unexport Button GPIO to free resources
});