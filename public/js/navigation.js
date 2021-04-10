function setNavigation() {
    leave_if_game();
    pre_make_colors_them();
    setImageAndBackground(html_img,html_img_bg);
}


//!!!!
function leave_if_game(){
    if (sessionStorage.getItem('game_id') !== ''){
        let game_id = sessionStorage.getItem('game_id');
        socket.emit('leave_game',{game_id,my_socket_id});
        sessionStorage.setItem('game_id','');
    }
}

function setImageAndBackground(html_img,html_img_bg){
    html_img.src = `./images/Users/${user_account.character}`;
    html_img_bg.style.backgroundColor = user_account.color;
}



function shop(){
    //!!!!
    if (typeof game_id !== 'undefined'){
        socket.emit('leave_game',{game_id,my_socket_id});
    }
    location.assign('shop.html');

}
function menu(){
    location.assign('menu.html');

}
function log_out(){
    //!!!!
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