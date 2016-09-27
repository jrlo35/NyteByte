var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var url = require('url');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var eventController = require('./events/eventController.js');



var port = process.env.PORT || 8000;
//connect to heroku mongolab
var uri = 'mongodb://testing:testing@ds017248.mlab.com:17248/heroku_pkxn9txr' || 'mongodb://localhost/brachiosaurus';
mongoose.connect(uri);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '../../client'));

app.enable('trust proxy');

// socket.io controls
io.on('connection', function (socket) {
  // parse the event id from the socket headers
  var eventId = url.parse(socket.handshake.headers.referer).path.substr(1);

  // get existing messages from db
  eventController.getMessages(eventId, function (messages) {
    // send exisiting messages on new connection
    socket.emit('init', {
      messages: messages
    });
  });
  socket.on('send:message', function (data) {
    // store message in db
    eventController.postMessage(data);
    // broadcast a user's message to other users
    socket.broadcast.emit('send:message', {
      eventId: data.eventId,
      name: data.name,
      text: data.text
    });
  });
});

app.get('/', function (req, res) {
  res.send(200, '/');
});

http.listen(port, function () {
  console.log('Listening on port ' + port);
});

//access app inside eventRoute and yelpRoutes
module.exports = app;
var eventRoute = require('./events/eventRoutes.js');
var yelpRoutes = require('./yelp/yelpRoutes.js');

