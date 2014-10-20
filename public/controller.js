$(function()
{
    var socket = io();
    var userName;
    //  Name entry and push to server
    $('#nameForm button').on('click', function(e) {
        e.preventDefault();
        userName = $('#nameIn').val();
        socket.emit('newUser', userName);
        $('button').removeAttr('disabled');
        $('#nameForm').remove();

    });


    socket.on('newUser', function(userName, users, colors) {
        $('style').html('');
        $('#userList').html('');
        for (var i = 0; i < users.length; i++) {
            $('style').append('.' + users[i] + '{background: rgb(' + colors[i] + ');}');
        }
        $.each(users, function(i) {
            $('#userList').append($('<span class="' + users[i] + '">').text(users[i]));
            i++;
        });
    });

//  Message entry and push to server
    $('#msgForm button').on('click', function() {
        var msg = $('#msgIn').val();
        var timeStamp = new Date();
        fullMsg = [timeStamp.toLocaleTimeString(), userName, msg];
        socket.emit('newMsg', fullMsg);
        $('#msgIn').val('');
        return false;
    });

    //Message view
    socket.on('newMsg', function(fullMsg) {
        $('#messages').append($('<span class="' + fullMsg[1] + '">').html('@' + fullMsg[0] + ' <strong>' + fullMsg[1] + '</strong> said:<br>' + fullMsg[2]));
        $("#messages").scrollTop($("#messages")[0].scrollHeight);
    });

//Auto-messages functions
    $('#joke').on('click', function() {
        $('#msgIn').html('');
        var joke = [
            'Today; I saw a baby with a shirt that said, "I\'m what happened in Vegas"',
            'What happens to a frog\'s car when it breaks down? <br> It gets toad away. ',
            'Q: What did the duck say when he bought lipstick? <br> A: "Put it on my bill." '
        ];
        var random = parseInt((Math.random() * 3));
        console.log(random);
        $('#msgIn').val(joke[random]);
    });
  
    $('#proverb').on('click', function() {
        $('#msgIn').html('');
        var proverb = [
            'A bird does not sing because it has an answer. It sings because it has a song.',
            'A bit of fragrance clings to the hand that gives flowers.',
            'A diamond with a flaw is worth more than a pebble without imperfections.'
        ];
        var random = parseInt((Math.random() * 3));
        console.log(random);
        $('#msgIn').val(proverb[random]);
    });

    $('#icebreaker').on('click', function() {
        $('#msgIn').html('');
        var icebreaker = [
            'How y\'all doing',
            'What\'s new?',
            'Lovely weather today'
        ];
        var random = parseInt((Math.random() * 3));
        console.log(random);
        $('#msgIn').val(icebreaker[random]);
    });
//List function
    $(window).load(function() {
        socket.emit('list');
    });

//List View
    socket.on('list', function(users, colors) {
        $('#userList').html('');
        $.each(users, function(i) {
            $('#userList').append($('<span class="' + users[i] + '">').text(users[i]));
            i++;
        });
        for (var i = 0; i < users.length; i++) {
            $('style').append('.' + users[i] + '{background: rgb(' + colors[i] + ');}');
        }
    });

//Chat function 
    $(window).load(function() {
        socket.emit('chat');
    });
//Chat View
    socket.on('chat', function(messages) {
        $('#messages').html('');
        $.each(messages, function(i) {
            $('#messages').append($('<span class="' + messages[i][1] + '">').html('@' + messages[i][0] + ' <strong>' + messages[i][1] + '</strong> said:<br>' + messages[i][2]));
            i++;
        });

    });

//logout function
    window.onbeforeunload = function() {
        socket.emit('logout', userName);
    };
});
