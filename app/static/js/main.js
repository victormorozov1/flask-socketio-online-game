console.log('start');
var socket;
var rooms = {};
var have_room = false;

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

        let delete_room = document.createElement('div');
        delete_room.className = "delete-room";
        delete_room.id = "delete-room-" + room_id;
        delete_room.innerText = "delete";
        room_node.append(delete_room);
        if (my_id !== data['creator_id'] || data["room_num_players_str"].split('/')[0] !== "0"){
            $(delete_room).css("display", "none");
        }

        let room_node_num_participants = document.createElement('div');
        room_node_num_participants.className = 'room-num-participants';
        room_node_num_participants.innerText = data['room_num_players_str'];
        room_node.append(room_node_num_participants);

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

    socket = io.connect(window.location.toString());

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
        if (my_id === data['creator_id'])
        {
            have_room = true;
        }
        show_room(data);
    });

    socket.on('new_room_player', function(data) {
        console.log('new_room_participant');
        id = data['id'];

        if (id === my_id){
            have_room = true;
        }

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

        if (id === my_id)
        {
            have_room = false;
        }

        room_id = data['room']['id'];
        console.log('player', id, 'leave room', room_id);
        if (my_id === id) {
            $('#' + room_id).children('.room-leave').css('display', 'none');
            $('#' + room_id).children('.room-join').text('join');
        }
        $('#' + room_id).children('.room-num-participants').text(data['room']['room_num_players_str'])
    });

    $('#add-room').click(function() {
        if (!have_room) {
            $(".second-body").css("display", "block");
        }
        else{
            alert('You already have room');
        }
    });

    $('.delete-room').click(function (event) {
        console.log("click");
        event.stopPropagation();
        event.stopImmediatePropagation();
        socket.emit('join_room', {room_id: this.id.split('-')[1], id: my_id});
    });

    $('#create-room-button').click(function(){
        socket.emit('add_room', {
            name: $('#room-name-input').val(),
            need_players: $('#num-players-input').val(),
            id: my_id,
            n: $('#n').val(),
            m: $('#m').val(),
            actions_per_turn: $('#num-actions-per-turn').val()
        });
        $(".second-body").css("display", "none");
    });

    $('#menu-search-button').click(function(){
        let s = $("#menu-search-input").val();
        console.log(s);
        $('.room').each(function(){
            console.log($(this).children('.room-name').text());
            if (!are_similar($(this).children('.room-name').text(), s)){
                $(this).css("display", "none");
            }
        });
    });
});