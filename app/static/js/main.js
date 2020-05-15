console.log('start');
var socket;
var rooms = {};

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

$(document).ready(function(){

    socket = io.connect('http://' + document.domain + ':' + location.port + '/');

    socket.on('connect', function() {
        console.log('connected');
        function getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }

        var name = getCookie('name');
        if (!name) {
            var names = ["Harry Potter", "Jolly tomato", "the postman Pechkin", "Kolobok"];
            name = prompt("Please enter your nickname:", names[getRandomInt(names.length)]);
            document.cookie = "name=" + name;
        }
        console.log('name = ', name);
        socket.emit('joined', {name: name});
    });

    socket.on('id', function(data){
        document.cookie = "id=" + data['id'];
    });

    socket.on('new_room', function(data) {
        console.log('new room created');
        console.log('name', data['name']);
        console.log('current players', data['current_players']);
        console.log('need players', data['need_players']);
        var room_name = data['name'], current_players = data['current_players'],
            need_players = data['need_players'], room_id = data['id'];
        let room_node = document.createElement('a');
        room_node.id = room_id;
        room_node.className = 'room';
        room_node.href = '/room/' + room_id;

        let room_node_name = document.createElement('div');
        room_node_name.className = 'room-name';
        room_node_name.innerText = room_name;
        room_node.append(room_node_name);

        let room_node_num_participants = document.createElement('div');
        room_node_num_participants.className = 'room-num-participants';
        room_node_num_participants.innerText = current_players + '/' + need_players;
        room_node.append(room_node_num_participants);

        $('#rooms-list').append(room_node);
    });

    $('#add-room').click(function() {
        socket.emit('add_room', {name: 'new room', need_players: 4, id: getCookie('id')});
    });
});