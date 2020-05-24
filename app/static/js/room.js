function change_cell_size() {
    let height = document.documentElement.clientHeight;
    let width = document.documentElement.clientWidth;
    let szx = (width) / m - 1;
    let szy = (height) / n - 1;
    console.log(`sc.h = ${height}, sc.w = ${width}, n = ${n}, m = ${m}`)
    let sz = Math.min(szx, szy) - 2;
    $('.row').css('height', sz + 'px');
    $('.cell').each(function( index ) {
        $(this).css('height', sz + 'px');
        $(this).css('width', sz + 'px');
    });
}

change_cell_size();

var socket = io.connect('http://' + document.domain + ':' + location.port + '/room');

socket.emit("join", {room_id: window.location.toString().split('/')[4]});

$("#send-message").click(function () {
    socket.emit('chat_message', {
        chat_message: $("#message-input").val(),
        room_id: window.location.toString().split('/')[4],
        author: getCookie('name')
    })
});

socket.on('chat_message', function(data) {
    let message_node = document.createElement('div');
    message_node.className = 'message-node';

    let message = document.createElement('div');
    message.className = "message";
    message.innerText = data["chat_message"] + ' ' + data["author"] + ' ' + data["time"];
    message_node.append(message);

    $("#message-list").append(message_node);
});