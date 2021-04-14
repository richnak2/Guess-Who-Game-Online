function setNavigation() {
    leave_if_game();
    pre_make_colors_them();
    setImageAndBackground(html_img,html_img_bg);
}

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
    typeof createGame === 'function' ? leave_game('shop.html'): null
    location.assign('shop.html');

}
function menu(){
    typeof createGame === 'function' ? leave_game('menu.html') : null
    location.assign('menu.html');

}
function log_out(){
    typeof createGame === 'function' ? leave_game('index.html') : null
    socket.emit('remove_player_from_connection',{my_socket_id});
    location.assign('index.html');
}
function play(){
    typeof createGame === 'function' ? socket.emit('leave_game',{my_socket_id}) : null
    location.assign('menu.html');
}
function create_own_game(){
    typeof createGame === 'function' ? socket.emit('leave_game',{my_socket_id}) : null
    location.assign('create_game.html');
}