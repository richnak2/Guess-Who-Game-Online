let html_all_games = undefined;
let html_chat_global = undefined;

document.addEventListener('DOMContentLoaded', function () {
    html_all_games = document.getElementById('all_games');
    html_chat_global = document.getElementById('chat_global');
    html_chat_global_massage = document.getElementById('chat_global_massage');
});

// find all posible games for users
socket.emit('get_all_games', {my_socket_id});
socket.on('get_all_games' , ({games}) => {
    console.log("GAMES   : " ,games, games.length);
    for (let index_game = 0 ;index_game < games.length; index_game++){
        create_html_games(games[index_game]);
    }
    pre_make_colors_them();
});

function create_html_games(game){
    let div_card = document.createElement('div');
    let div_for_image = document.createElement('div');
    let image_of_card = document.createElement('IMG');
    let div_body_card = document.createElement('div');
    let card_title = document.createElement('h5');
    let card_text = document.createElement('p');
    let div_card_buttons = document.createElement('div');

    div_card.className = "card btn-light no_btn game_card";
    div_for_image.className = " card-title text-center mb0";
    image_of_card.src = '/images/'+game['title']+'/'+game['image'];
    image_of_card.className = 'wd100 ht100 mt20'
    div_body_card.className = "card-body";
    card_title.className = "text-center text_black";

    card_title.innerHTML = game['title'];
    card_text.innerHTML = game['description'];
    card_text.className = 'text_black mb0';
    div_card_buttons.className = 'text-center mb10';

    let parse_type = game['type'].split(' ');
    if (parse_type[0] === '1'){
        let buttons_pc = document.createElement('BUTTON');
        buttons_pc.className = 'btn btn-default bg-light wd90 ht90'
        let image_of_game_type = document.createElement('IMG');
        image_of_game_type.src = "./images/game_vs_pc.png";
        image_of_game_type.className = "wd70";
        buttons_pc.append(image_of_game_type);
        buttons_pc.onclick = function (){
            sessionStorage.setItem('game_name',game['title']);
            sessionStorage.setItem('type_of_game','pc');
            sessionStorage.setItem('game_id','');
            location.assign('game.html');
        }
        div_card_buttons.append(buttons_pc);

    }

    if (parse_type[1] === '1'){
        let buttons_pc = document.createElement('BUTTON');
        let image_of_game_type = document.createElement('IMG');
        image_of_game_type.src = "./images/pl_vs_pl_kids.png";
        image_of_game_type.className = "wd70";
        buttons_pc.append(image_of_game_type);

        buttons_pc.className = 'btn btn-default bg-light wd90 ht90 ml10'
        buttons_pc.onclick = function (){
            sessionStorage.setItem('game_name',game['title']);
            sessionStorage.setItem('type_of_game','kid');
            sessionStorage.setItem('game_id','');
            location.assign('game.html');
        }
        div_card_buttons.append(buttons_pc);

    }
    if (parse_type[2] === '1'){
        let buttons_pc = document.createElement('BUTTON');
        buttons_pc.className = 'btn btn-default bg-light wd90 ht90 ml10'
        let image_of_game_type = document.createElement('IMG');
        image_of_game_type.src = "./images/pl_vs_pl_students.png";
        image_of_game_type.className = "wd70";
        buttons_pc.append(image_of_game_type);
        buttons_pc.onclick = function (){
            sessionStorage.setItem('game_name',game['title']);
            sessionStorage.setItem('type_of_game','student');
            sessionStorage.setItem('game_id','');
            location.assign('game.html');
        }
        div_card_buttons.append(buttons_pc);

    }
    div_for_image.append(image_of_card);
    div_body_card.append(card_title,card_text);


    div_card.append(div_for_image,div_body_card,div_card_buttons);
    html_all_games.append(div_card);
}
function show_chat(){
    html_all_games.style.display = html_all_games.style.display === 'flex' ? 'none' : 'flex'
    html_chat_global.style.display = html_chat_global.style.display === 'none' ? 'block' : 'none'
    document.getElementById('sp-online').innerHTML =`${user_account.active_players} online players`
}
function send_massage() {
    let msg_val = document.getElementById('chat_input_box').value
    if (msg_val !== ''){
        let massage = {
            massage : msg_val
        }
        // let massage = {
        //     from : user_account.game_name,
        //     massage : msg_val
        // }
        make_massage(massage.massage,'you')
        // socket.emit('multiplayer_massage',{my_socket_id, massage});
        document.getElementById('chat_input_box').value = ''

    }



}
function make_massage(text,type){
    if (type === 'you'){
        let new_task = document.createElement('p');
        new_task.className = "btn-primary no_btn text-light chat_massage";
        new_task.innerHTML = `YOU : ${text}`;
        html_chat_global_massage.append(new_task);
    }else if(type === 'event'){
        let new_task = document.createElement('p');
        new_task.className = "bg-success text-light chat_massage";
        new_task.innerHTML = text;
        html_chat_global_massage.append(new_task);
    }else{
        let new_task = document.createElement('p');
        new_task.className = "bg-secondary text-light chat_massage";
        new_task.innerHTML = text;
        html_chat_global_massage.append(new_task);
    }
    html_chat_global_massage.scrollBy(0,300);
    apply_color_them();

}