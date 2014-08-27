$(function() {
    var $window = $(window),    
        $usernameInput = $('.usernameInput[name=username]'),
        $messages = $('.messages'),
        $inputMessage = $('.inputMessage'),
        $loginPage = $('.login.page'),
        $chatPage = $('.chat.page');

    var username;           

    $usernameInput.focus();
    /*
    $.ajax({
      type: "POST",
      url: url,
      data: data,
      success: success,
      dataType: dataType
    });
    */

    function startPusher() {
        var pusher = new Pusher('34aa11fe3c091ec2372b'),
            testChannel = pusher.subscribe('test_channel'),
            broadcast = pusher.subscribe('br');

        broadcast.bind('new_message', function(data) {
            addChatMessage(data);
        });

        broadcast.bind('user_joined', function(data) {
            log(data.username + ' joined');
        });
    }
    

    function addChatMessage(data) {
        var $usernameDiv = $('<span class="username"></span>');
        $usernameDiv.css("color", getUsernameColor(data.username));
        $usernameDiv.text(data.username);

        var $messageBodyDiv = $('<span class="messageBody"></span>');
        $messageBodyDiv.text(data.message);

        var typingClass = data.typing ? 'typing' : '';
        var $messageDiv = $('<li class="message ' + typingClass + '"></li>');
        $messageDiv.append($usernameDiv)
            .append($messageBodyDiv)
            .data('username', data.username);

        addMessageElement($messageDiv);
    }

    function addMessageElement(el) {
        var $el = $(el);
        $messages.append($el);

        $messages[0].scrollTop = $messages[0].scrollHeight;
    }

    function getUsernameColor(username) {
        // Compute hash code
        var hash = 7;
        for (var i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + (hash << 5) - hash;
        }
        // Calculate color
        var index = Math.abs(hash % 360);
        return "hsl(" + index + ", 77%, 60%)";
    }

    function sendMessage () {
        var message = $inputMessage.val().trim();

        // if there is a non-empty message
        if (message) {
            $inputMessage.val('');
            $.post('/api/call/new_message', {
                "message": message,
                "username": username
            });
        }
    }

    function setUsername() {
        var __username = $usernameInput.val().trim();

        // If the username is valid
        if (__username) {
            username = __username;
            $loginPage.fadeOut();
            $chatPage.show();
            $inputMessage.focus();
        }
    }

    function log(message, options) {
        var el = '<li class="log">' + message + '</li>';
        addMessageElement(el, options);
    }

    $window.keydown(function(event) {
        // When the client hits ENTER on their keyboard
        if (event.which === 13) {
            if (username) {
                sendMessage();
            } else {
                setUsername();
                $usernameInput.blur();
            }
            
        }
    });
});