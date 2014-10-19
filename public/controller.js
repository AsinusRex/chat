$(function ()
{
    var socket = io();
    var userName;
    //  Name entry and push to server
    $('#nameForm button').on('click', function () {
        userName = $('#nameIn').val();
        socket.emit('newUser', userName);
        $('button').removeAttr('disabled');
        $('#nameForm').remove();

    });


    socket.on('newUser', function (userName, users, colors) {
        $('style').html('');
        for (var i = 0; i < users.length; i++) {
            $('style').append('.' + users[i] + '{background: rgb(' + colors[i] + ');}');
        }
    });

//  Message entry and push to server
    $('#msgForm button').on('click', function () {
        var msg = $('#msgIn').val();
        var timeStamp = new Date();
        fullMsg = [timeStamp.toLocaleTimeString(), userName, msg];
        socket.emit('newMsg', fullMsg);
        $('#msgIn').val('');
        return false;
    });

    //Message view
    socket.on('newMsg', function (fullMsg) {
        $('#messages').append($('<span class="' + fullMsg[1] + '">').html('@' + fullMsg[0] + ' <strong>' + fullMsg[1] + '</strong> said:<br>' + fullMsg[2]));
        $("#messages").scrollTop($("#messages")[0].scrollHeight);
    });

//Joke function
    $('#joke').on('click', function () {
        $('#msgIn').html('');
        var joke = [
            'Today; I saw a baby with a shirt that said, "I\'m what happened in Vegas"', 
            ' What happens to a frog\'s car when it breaks down? <br> It gets toad away. ', 
            ' Q: What did the duck say when he bought lipstick? <br> A: "Put it on my bill." '
        ];
        var random = parseInt((Math.random() * 3));
        console.log(random);
        $('#msgIn').val(joke[random]);
    });
//List function
    $('#list').on('click', function () {
        socket.emit('list');
    });

//List View
    socket.on('list', function (users) {
        $('#messages').html('');
        $.each(users, function (i) {
            $('#messages').append($('<span class="' + users[i] + '">').text(users[i]));
            i++;
        });
    });

//Chat function
    $('#chat').on('click', function () {
        socket.emit('chat');
    });
//Chat View
    socket.on('chat', function (messages) {
        $('#messages').html('');
        $.each(messages, function (i) {
//            for (j = 0; j <= messages[i].length; j++) {
//                var allMsg = messages[i][j];
            $('#messages').append($('<span class="' + messages[i][1] + '">').html('@' + messages[i][0] + ' <strong>' + messages[i][1] + '</strong> said:<br>' + messages[i][2]));
//            }
            i++;

        });
    });

//logout function
    $('#logout').on('click', function () {
        socket.emit('logout', userName);
    });
    socket.on('logout', function () {
        location.reload(true);
    });
});
