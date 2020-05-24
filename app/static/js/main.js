console.log('start');
var socket;
var rooms = {};

$(document).ready(function(){
    var my_id;
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

        let room_node_leave = document.createElement('div');
        room_node_leave.className = 'room-leave';
        room_node_leave.innerText = 'leave room';
        $(room_node_leave).css('display', 'none');
        let room_node_join = document.createElement('div');
        room_node_join.className = 'room-join';
        room_node_join.id = 'join-' + room_id;
        console.log(data['players']);
        if (data['players'].indexOf(my_id) !== -1){
            room_node_join.innerText = 'joined';
            $(room_node_leave).css('display', 'block');
        }
        else{
            room_node_join.innerText = 'join';
        }
        room_node.append(room_node_join);
        room_node.append(room_node_leave);

        let room_node_num_participants = document.createElement('div');
        room_node_num_participants.className = 'room-num-participants';
        room_node_num_participants.innerText = data['room_num_players_str'];
        room_node.append(room_node_num_participants);

        //document.body.append(room_node);
        $('#rooms-list').append(room_node);

        $('.room-join').click(function (event) {
            event.stopPropagation();
            event.stopImmediatePropagation();
            socket.emit('join_room', {room_id: this.id.split('-')[1], id: my_id});
        });

        $('.room-leave').click(function (event) {
            event.stopPropagation();
            event.stopImmediatePropagation();
            socket.emit('leave_room', {id: my_id});
        });
    }

    socket = io.connect('http://' + document.domain + ':' + location.port + '/');

    socket.on('connect', function() {
        console.log('connected');

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
        my_id = data['id'];
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
        id = data['id'];
        room_data = data['room'];
        room_id = room_data['id'];
        console.log(id, room_id);

        if (room_data['ready']){
            window.location.replace("/room/" + room_id);
        }

        $('.room').each(function( index ) {
            console.log($(this).attr('id'));
            if ($(this).attr('id') === room_id){
                if (id === my_id) {
                    $(this).children('.room-join').text('joined');
                    $(this).children('.room-leave').css('display', 'block');
                }
                $(this).children('.room-num-participants').text(room_data['room_num_players_str']);
            }
        });
    });

    socket.on('player_leave_room', function(data) {
        id = data['id'];
        room_id = data['room']['id'];
        console.log('player', id, 'leave room', room_id);
        if (my_id === id) {
            $('#' + room_id).children('.room-leave').css('display', 'none');
            $('#' + room_id).children('.room-join').text('join');
        }
        $('#' + room_id).children('.room-num-participants').text(data['room']['room_num_players_str'])
    });

    $('#add-room').click(function() {
        socket.emit('add_room', {name: 'new room', need_players: 2, id: my_id, m: 30});
    });
});