var http = require('http'); //.createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var GPIO = new Gpio(4, 'out'); //use GPIO pin 4 as output
var pushButton = new Gpio(17, 'in', 'both'); //use GPIO pin 17 as input, and 'both' button presses, and releases should be handGPIO

// http.listen(8080); //listen to port 8080
// function handler (req, res) { //create server
//   fs.readFile(__dirname + '/public/index.html', function(err, data) { //read file index.html in public folder
//     if (err) {
//       res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
//       return res.end("404 Not Found");
//     }
//     res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
//     res.write(data); //write data from index.html
//     return res.end();
//   });
// }

io.sockets.on('connection', function (socket) {// WebSocket Connection
  var gpiovalue = 0; //static variable for current status
  pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton
    if (err) { //if an error
      console.error('There was an error', err); //output error message to console
      return;
    }
    gpiovalue = value;
    socket.emit('gpio', gpiovalue); //send button status to client
  });
  socket.on('gpio', function(data) { //get gpio switch status from client
    gpiovalue = data;
    if (gpiovalue != GPIO.readSync()) { //only change GPIO if status has changed
      GPIO.writeSync(gpiovalue); //turn GPIO on or off
    }
  });
});

process.on('SIGINT', function () { //on ctrl+c
  GPIO.writeSync(0); // Turn GPIO off
  GPIO.unexport(); // Unexport GPIO GPIO to free resources
  pushButton.unexport(); // Unexport Button GPIO to free resources
  process.exit(); //exit completely
});