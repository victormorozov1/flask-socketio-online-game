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
    function show_room(data) {
        console.log('showing room');
        var room_name = data['name'], current_players = data['current_players'],
        need_players = data['need_players'], room_id = data['id'];
        let room_node = document.createElement('div');
        room_node.id = room_id;
        room_node.className = 'room';

        let room_node_name = document.createElement('a');
        room_node_name.className = 'room-name';
        room_node_name.innerText = room_name;
        room_node_name.href = '/room/' + room_id;
        room_node.append(room_node_name);

        let room_node_join = document.createElement('div');
        room_node_join.className = 'room-join';
        room_node_join.id = 'join-' + room_id;
        console.log(data['players']);
        if (data['players'].indexOf(getCookie('id')) !== -1){
            room_node_join.innerText = 'joined';
        }
        else{
            room_node_join.innerText = 'join';
        }
        room_node.append(room_node_join);

        let room_node_num_participants = document.createElement('div');
        room_node_num_participants.className = 'room-num-participants';
        room_node_num_participants.innerText = data['room_num_players_str'];
        room_node.append(room_node_num_participants);

        document.body.append(room_node);
        $('#rooms-list').append(room_node);

        $('.room-join').click(function (event) {
            event.stopPropagation();
            event.stopImmediatePropagation();
            socket.emit('join_room', {room_id: this.id.split('-')[1], id: getCookie('id')});
        });

    }

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
        socket.emit('joined', {name: name, id: getCookie('id')});
    });

    socket.on('id', function(data){
        document.cookie = "id=" + data['id'];
    });

    socket.on('all_rooms', function(data){
        console.log('in rooms-list');
        for (let room of data['rooms']){
            console.log(room['name']);
            show_room(room);
        }
    });

    socket.on('new_room', function(data) {
        console.log('new room');
        show_room(data);
    });

    socket.on('new_room_player', function(data) {
        console.log('new_room_participant');
        id = data['id']
        room_id = data['room_id']
        console.log(id, room_id);
        $('.room').each(function( index ) {
            if ($(this).attr('id') === room_id){
                $(this).children('.room-join').text('joined');
                $(this).children('.room-num-participants').text(data['room-num-participants']);
            }
        });
    });

    $('#add-room').click(function() {
        socket.emit('add_room', {name: 'new room', need_players: 4, id: getCookie('id')});
    });
});