let html_img = undefined;
let html_img_bg = undefined;
let html_coins = undefined;
let html_name = undefined;
let character_in_game = undefined;

document.addEventListener('DOMContentLoaded', function () {
    html_img = document.getElementById('image');
    html_img_bg = document.getElementById('background_your_img');
    html_coins = document.getElementById('coins');
    html_name = document.getElementById('name');

    leave_if_game();
    pre_make_colors_them();
    set_main_img();
});



function leave_if_game(){
    if (sessionStorage.getItem('game_id') !== ''){
        let game_id = sessionStorage.getItem('game_id');
        socket.emit('leave_game',{game_id,my_socket_id});
        sessionStorage.setItem('game_id','');
    }
}

function set_main_img(){
    if (character_in_game){
        // console.log('set_main_img',character_in_game.split(' '));
        let splinted_character = character_in_game.split(' ');
        // console.log('set_main_img',splinted_character);
        html_img.src = './images/Users/'+splinted_character[1];
        html_img_bg.style.backgroundColor = splinted_character[0];
    }else{
        setTimeout(set_main_img , 100);
    }
}



function shop(){
    if (typeof game_id !== 'undefined'){
        socket.emit('leave_game',{game_id,my_socket_id});
    }
    location.assign('shop.html');

}
function menu(){
    location.assign('menu.html');

}
function log_out(){
    if (typeof game_id !== 'undefined'){
        socket.emit('leave_game',{game_id,my_socket_id});
    }
    socket.emit('remove_player_from_connection',{my_socket_id});
    location.assign('index.html');
}
function play(){
    location.assign('menu.html');
}
function create_own_game(){
    location.assign('create_game.html');
}