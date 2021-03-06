$(document).ready(function() {
    function change_cell_size() {
        let height = document.documentElement.clientHeight;
        let width = document.documentElement.clientWidth;
        let szx = (width) / m - 1;
        let szy = (height) / n - 1;
        console.log(`sc.h = ${height}, sc.w = ${width}, n = ${n}, m = ${m}`);
        let sz = Math.min(szx, szy) - 2;
        $('.row').css('height', sz + 'px');
        $('.cell').each(function (index) {
            $(this).css('height', sz + 'px');
            $(this).css('width', sz + 'px');
        });
    }

    change_cell_size();

    $('#message-list').scrollTop(1000000);
    var room_id = window.location.toString().split('/')[4];
    var my_id = getCookie('id');
    let location_arr = window.location.toString().split('/');
    location_arr.pop();
    var socket = io.connect(location_arr.join('/'));

    socket.emit("join", {room_id: window.location.toString().split('/')[4]});

    $("#send-message").click(function () {
        socket.emit('chat_message', {
            chat_message: $("#message-input").val(),
            room_id: room_id,
            author: getCookie('name')
        })
    });

    socket.on('chat_message', function (data) {
        let message_node = document.createElement('div');
        message_node.className = 'message-node';

        let message = document.createElement('div');
        let message_text = document.createElement('div');
        let message_author = document.createElement('div');
        let message_time = document.createElement('div');
        message.className = "message";
        message_text.className = "message-text";
        message_author.className = "message-author";
        message_time.className = "message-time";

        message_node.append(message);
        message.append(message_author);
        message.append(message_text);
        message.append(message_time);

        message_text.innerText = data['chat_message'];
        message_author.innerText = data['author'];
        message_time.innerText = data['time'];

        $("#message-list").append(message_node);

        $('#message-list').scrollTop(1000000);
    });

    socket.on('set_cell_value', function (data) {
        if (data['message'] === 'ok') {
            let x = data["x"], y = data["y"], value = data["value"], color = data["color"];
            let id = x + "-" + y;
            let cell_picture = $(`#${id}`).children(".cell-picture");

            if (value === "1") {
                $(cell_picture).addClass("cross");
            } else {
                $(cell_picture).removeClass("cross");
                $(cell_picture).addClass("wall");
            }
            $(cell_picture).css("background-color", color);
        } else {
            alert(data['message']);
        }
    });

    $(".cell").click(function () {
        let arr = this.id.split("-");
        let x = arr[0], y = arr[1];
        socket.emit("field_click", {
            x: x,
            y: y,
            room_id: room_id,
            player_id: my_id
        });
    });
});