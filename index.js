var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var users = [];
var messages = [];
var style = '/style.css';
var colors = [];
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile('index.html', {root: '/Users/Uvi/Desktop/napoleon/public'});

});
//New User
io.on('connection', function (socket) {
    socket.on('newUser', function (userName) {
        users.push(userName);
        var color = [];
        for (i = 0; i < 3; i++) {
            var temp = Math.floor((Math.random() * 105) + 150);
            color.push(temp);
        }
        colors.push(color);
        io.emit('newUser', userName, users, colors);
    });

//New Message
    socket.on('newMsg', function (fullMsg) {
        messages.push(fullMsg);
        io.emit('newMsg', fullMsg);
    });

//Message list
    socket.on('chat', function () {
        socket.emit('chat', messages);
    });

//User List
    socket.on('list', function () {
        socket.emit('list', users);
    });
//Log out user
    socket.on('logout', function (userName) {
        console.log(userName);
        users.splice(users.indexOf(userName), 1);
        console.log(users);
        socket.emit('logout');
    });
});


http.listen(8080, function () {
    console.log('listening on *:8080');
});

