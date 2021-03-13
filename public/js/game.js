let html_possible_images = undefined;
let html_button_elem_guess = undefined;

let html_centered_centered_win = undefined;
let html_centered_win = undefined;
let html_win_lost = undefined;
let html_leave = undefined;
let html_play_again = undefined;
// let html_report_btn = undefined;
let animation = false;
let your_turn = false;

let game_name = undefined;
let game_type = undefined;
let game_id = undefined;

let time_of_complete = 0 ;
let time_run_out = false;
let my_game = undefined;
let chat_box = undefined
let guessed_images = {};

document.addEventListener('DOMContentLoaded', function () {
    chat_box = document.getElementById('chat_for_kids');
    console.log(chat_box)
    html_possible_images = document.getElementsByClassName('possible_image');
    html_button_elem_guess = document.getElementById('guess_button_box');
    html_centered_centered_win =  document.getElementById('centered_centered_win');
    html_centered_win = document.getElementById('centered_win');
    html_win_lost = document.getElementById('win_lost');
    html_leave = document.getElementById('leave');
    html_play_again = document.getElementById('again');
    // html_report_btn = document.getElementById('report_btn');
    create_game();
});

function create_game(){
    if (sessionStorage.getItem('type_of_game')){
        game_name = sessionStorage.getItem('game_name');
        game_type = sessionStorage.getItem('type_of_game');
        sessionStorage.setItem('game_id',make_id(5))
        game_id = sessionStorage.getItem('game_id');
        if (game_type === 'pc'){
            socket.emit('create_single_player' , {game_name,game_type,game_id,my_socket_id}, );
        }
        if (game_type === 'kid'){
            socket.emit('luck_to_game_buffer' , {game_name,game_type,my_socket_id}, );
        }
        if (game_type === 'student'){
            socket.emit('luck_to_game_buffer' , {game_name,game_type,my_socket_id}, );
        }
    }else{
        setTimeout(create_game,100);
    }
}

socket.on('answer_to_is_you_picture_pc',({answer}) =>{
    let elem_ask_img = document.getElementsByClassName('undefined')[0];
    if (elem_ask_img.childNodes[0].src === undefined){ // Question type game play
        elem_ask_img.className = elem_ask_img.className.replace('undefined' , answer? 'bg-success':'bg-danger')
    }else{
        if (elem_ask_img.childNodes[0].src.includes(game_name.replaceAll(' ','%20')+'/images') ){
            if ( answer){
                make_win_multiplier("You win");
                socket.emit('leave_game',{game_id});
            }
        }
        elem_ask_img.className = elem_ask_img.className.replace('undefined' , answer? 'bg-success':'bg-danger')
    }
})

socket.on('game_buffer_answer' , ({answer}) =>{
    console.log('BUFFER ANSERR ',answer)
    if (answer === undefined){
        socket.emit('create_single_player' , {game_name,game_type,game_id,my_socket_id} );
    }else{
        console.log('I found a game !!!',answer);
        my_game = answer;
        sessionStorage.setItem('game_id',my_game.id);
        game_id = my_game.id;
        if (my_game.player1 === undefined || my_game.player2 === undefined){
            animation = true;
            make_waiting_box('w8');
        }else{
            let massage = 'connected'
            socket.emit('broadcast_massage',{game_id,my_socket_id,massage});
            create_html_for_game();
        }
    }
})

socket.on('broadcasted_massage', ({broadcast_massage}) => {
    console.log('broadcasted_massage   : ',broadcast_massage,broadcast_massage.massage );
    console.log(broadcast_massage.game_id , game_id)
    if (broadcast_massage.game_id === game_id){
        if (broadcast_massage.massage === 'unlock_btn'){
            console.log('masage lock player vriting success   : ',broadcast_massage);
            w8_until_player_pick_img();
        }else if (broadcast_massage.massage === 'connected'){
            console.log('masage connectition success   : ',broadcast_massage);
            animation = false;
        }else if (broadcast_massage.massage === 'finished'){
            console.log('masage game finished   : ',broadcast_massage);
            my_game.state = true;
            make_win_multiplier("You lost");
        }else if (broadcast_massage.massage === true || broadcast_massage.massage === false){
            console.log('masage aswer to question is : ',broadcast_massage.massage);
            let elem_ask_img = document.getElementsByClassName('undefined')[0];
            console.log('NACHADZA SA TUNA ' , '/'+game_name.replaceAll(' ','%20')+'/images' , elem_ask_img.childNodes[0].src , elem_ask_img.childNodes[0].src.includes('/'+game_name.replaceAll(' ','%20')+'/images'))
            if (elem_ask_img.childNodes[0].src.includes(game_name.replaceAll(' ','%20')+'/images') ){
                if ( broadcast_massage.massage){
                    my_game.state = true;
                    make_win_multiplier("You win");
                }

            }
            elem_ask_img.className = elem_ask_img.className.replace('undefined' , broadcast_massage.massage? 'bg-success':'bg-danger')
        }else{
            console.log('masage make question is : ',broadcast_massage.massage);
            if (broadcast_massage.massage.title !== undefined){
                make_question_for_opponent(broadcast_massage.massage);
            }else{
                make_massage(broadcast_massage.massage,'opponent')
            }
        }
    }else{
        console.log('Massage is not for you  ',broadcast_massage)
    }
})

socket.on('obtain_game' , ({game}) => {
    my_game = game;
    console.log('GAME HAS BEEN OBATINED : ',my_game);
    // console.log('GAME HAS BEEN OBATINED : ',my_socket_id,my_game.player1,my_game.player2,my_game);//, game
    if(my_game.type === 'pc'){
        create_html_for_game();
    }else if (my_game.type === 'kid' || my_game.type === 'student' && (my_game.player1 === undefined || my_game.player2 === undefined)) {
        animation = true;
        make_waiting_box('w8');
    }


});
socket.on('opponent_left', ({who_left}) =>{
    console.log('Opponent left ',my_game.state)
    if (game_id === who_left && my_game.state === false){
        console.log('Opponent left ',my_game.state)
        my_game.state = true;
        game_id = ''; // prestan pocuvat koli tomu ze hra uz bola ukoncena -- prevetion cross scripting
        if (document.getElementById('my_img_guessed_by_opponent').src.includes( '/images/question_mark.png') && time_run_out){
            make_win_multiplier('You lost because you are not playing !')
            //my_game.state = false;
            // TUNA
        }else{
            make_win_multiplier('You win because your opponent is not playing !')
        }
    }
})

function w8_until_player_pick_img(){
    // console.log('cakame na img ktori neni stale');
    if (document.getElementById('my_img_guessed_by_opponent').src.includes( '/images/question_mark.png')){
        setTimeout(w8_until_player_pick_img,200)
    }else{
        console.log('IMG AS NASIEL');
        if (html_name.innerHTML === my_game.player1.game_name && game_type === 'kid'){ // ZLE
            lock_unlock_buttons();
            your_turn = true;
        }

    }
}

function make_waiting_box(option){
    console.log('W8')
    // console.log(option,html_centered_centered_win)
    if (option === 'w8'){
        // console.log('ANIMACIA :',html_centered_centered_win,html_centered_win,html_win_lost)
        html_centered_centered_win.style.display = 'revert';
        html_centered_win.style.display = 'revert';
        html_win_lost.style.display = 'revert';
        html_leave.style.display = 'revert';
        html_play_again.style.display = 'none';
        // html_report_btn.style.display = 'none';
        html_win_lost.innerHTML = 'waiting for other player to join ';
        run_animation_waiting(0);
    }else{
        setTimeout(make_waiting_box,100,option);
    }
}

function run_animation_waiting(count_of_iteration){
    console.log('ANIMATION : ',animation)
    if (animation === true){
        if (count_of_iteration === 3){
            html_win_lost.innerHTML = html_win_lost.innerHTML.replace('. . . ', '');
            count_of_iteration = 0
        }
        html_win_lost.innerHTML += '. ';
        setTimeout(run_animation_waiting,250,count_of_iteration+1);
    }else{
        html_centered_centered_win.style.display = 'none';
        html_centered_win.style.display = 'none';
        html_win_lost.style.display = 'none';
        html_leave.style.display = 'none';
        create_game();
    }
}

function set_session_current_game(to_witch_str,elem){
    localStorage.setItem(to_witch_str,elem);
}

function get_session_current_game(witch_str){
    return localStorage.getItem(witch_str);
}

function create_html_for_game(){
    document.getElementById('title').innerText = my_game['game_name'];
    if (game_type === 'pc'){
        document.getElementById('chat_title').innerHTML = 'Asked';
        document.getElementById('chat_input_box').style.display = 'none';
        document.getElementById('chat_send_btn').style.display = 'none';
    }else if (game_type === 'kid'){
        document.getElementById('chat_title').innerHTML = 'Asked';
        document.getElementById('chat_input_box').style.display = 'none';
        document.getElementById('chat_send_btn').style.display = 'none';
        document.getElementById('your_image').style.display = 'revert';
        make_massage('Please select your picture by clicking on it','disappear');
    }else{
        document.getElementById('your_image').style.display = 'revert';
        make_massage('Please select your picture by clicking on it','disappear');
    }

    for (let index_image_game = 0 ;index_image_game < html_possible_images.length;index_image_game++){
        if (index_image_game >= my_game['list_of_images'].length){//-5
            html_possible_images[index_image_game].parentElement.style.opacity = '0.05';
            html_possible_images[index_image_game].parentElement.style.filter =  'brightness(50%)';
            html_possible_images[index_image_game].style.opacity = '0.3';
            html_possible_images[index_image_game].style.filter =  'brightness(50%)';
        }else{
            html_possible_images[index_image_game].src = my_game['list_of_images'][index_image_game]['image'];
            html_possible_images[index_image_game].title = my_game['list_of_images'][index_image_game]['description_control'];
            html_possible_images[index_image_game].style.filter = 'brightness(100%)';
            html_possible_images[index_image_game].style.opacity = '1';
            html_possible_images[index_image_game].parentElement.style.opacity = '1';
            html_possible_images[index_image_game].parentElement.style.filter = 'brightness(100%)';
        }
    }

    for (let index_image_define = 0 ;index_image_define < my_game['list_of_definers'].length;index_image_define++){
        if (guessed_images[my_game['list_of_definers'][index_image_define]['type']]){
            guessed_images[my_game['list_of_definers'][index_image_define]['type']].push({img : my_game['list_of_definers'][index_image_define]['image'], guessed : false, description : my_game['list_of_definers'][index_image_define]['description']});
        }else{
            guessed_images[my_game['list_of_definers'][index_image_define]['type']] = [{ img : my_game['list_of_definers'][index_image_define]['image'], guessed : false , description : my_game['list_of_definers'][index_image_define]['description']}];
        }
    }
    if (game_type !== 'student'){
        let created_buttons = [];
        for (const [key, value] of Object.entries(guessed_images)) {
            let button = document.createElement('BUTTON');
            button.className = 'btn btn-default bg-primary guess_btn guess_dir text-light';
            button.innerHTML = key;
            created_buttons.push(button);
        }
        for (let index_btn = 0 ; index_btn < created_buttons.length ; index_btn ++){
            created_buttons[index_btn].onclick = function (){
                created_images_form_buttons(created_buttons[index_btn].innerHTML);
            }
            html_button_elem_guess.append(created_buttons[index_btn]);
        }
    }
    document.getElementById('guess_back').style.display = 'none';
    // console.log('MY GAME TYPE HERE IS : ',game_type,my_game.type)
    if (game_type === 'kid' ) {
        lock_unlock_buttons();
    }
    setTimeout(check_counter , 100)
}

function lock_unlock_buttons(){
    let blue_btn = document.getElementsByClassName('guess_dir');
    for (let btn_index = 0; btn_index < blue_btn.length; btn_index++) {
        if (blue_btn[btn_index].className.includes('bg-primary')){
            blue_btn[btn_index].className = blue_btn[btn_index].className.replace('bg-primary','bg-danger');
            blue_btn[btn_index].disabled = true;
        }else if (blue_btn[btn_index].className.includes('bg-danger')){
            blue_btn[btn_index].className = blue_btn[btn_index].className.replace('bg-danger','bg-success');
            blue_btn[btn_index].disabled = false;
        }else{
            blue_btn[btn_index].className = blue_btn[btn_index].className.replace('bg-success','bg-danger');
            blue_btn[btn_index].disabled = true;
        }

    }
}

function fate_question(elem,time){
    // console.log('timer to fade  : ',time);
    if (time === 0 ){
        elem.style.display = 'none';
    }else if (time <= 3){
        elem.style.opacity = time/10+'';
        setTimeout(fate_question,50,elem,time-0.25);
    }else{
        setTimeout(fate_question,1000,elem,time-1);
    }

}
function check_if_img_is_picket(elem,time){
    console.log('timer to pick img is  : ',time)
    if (time >= 30){
        elem.className = "bg-success";
    }else if (time >= 15 && time < 30){
        elem.className = "bg-warning";
    }else if ( time > 0 && time < 15){
        elem.className = "bg-danger";
    }else{
        make_win_multiplier('You lost because you are not playing !')
        socket.emit('leave_game',{game_id,my_socket_id});
        time_run_out = true
        return;
    }
    if (document.getElementById('my_img_guessed_by_opponent').src.includes( '/images/question_mark.png')){
        setTimeout(check_if_img_is_picket,1000,elem,time-1);
    }else{
        fate_question(elem,3);
    }

}
function send_massage() {
    make_massage(document.getElementById('chat_input_box').value,'you')

    let massage = document.getElementById('chat_input_box').value;
    document.getElementById('chat_input_box').value = ''
    socket.emit('broadcast_massage',{game_id,my_socket_id, massage});
}
function make_massage(text,type){
    if (type === 'disappear'){
        let ask_for_kids = document.getElementById('chat_for_kids');
        let new_task = document.createElement('p');
        new_task.className = "bg-success";
        new_task.innerHTML = text;
        ask_for_kids.append(new_task);
        check_if_img_is_picket(new_task,60);
    }else if (type === 'you'){
        let ask_for_kids = document.getElementById('chat_for_kids');
        let new_task = document.createElement('p');
        new_task.className = "bg-primary text-light";
        new_task.innerHTML = text;
        ask_for_kids.append(new_task);
    }else{
        let ask_for_kids = document.getElementById('chat_for_kids');
        let new_task = document.createElement('p');
        new_task.className = "bg-light ";
        new_task.innerHTML = text;
        ask_for_kids.append(new_task);
    }
    chat_box.scrollBy(0,300);

}

function created_images_form_buttons(witch){
    // tuna bude rozdiel ak obrazok k danej hre nexistuje pre pc a kid musia byt obrzky
    // pokial obrazky niesu musia byt otazky namiesto img  otazky budu formov select boxu a buttonu ask...
    // console.log('created_images_form_buttons   : ',guessed_images[witch]);
    document.getElementById('guess_back').style.display = 'revert';
    document.getElementById('guess_certain').style.display = 'none';
    let elements_button_guess = document.getElementsByClassName('guess_dir');
    for (let index_btn_guess_dir = 0 ;index_btn_guess_dir < elements_button_guess.length;index_btn_guess_dir++){
        elements_button_guess[index_btn_guess_dir].style.display = 'none'
    }
    for (let guess_img_index = 0 ;guess_img_index < guessed_images[witch].length;guess_img_index ++){
        if (guessed_images[witch][guess_img_index]['guessed'] === false){
            let div = document.createElement('div');
            div.className = 'card col possible_image_guess_divs';

            if (guessed_images[witch][guess_img_index]['img'] !== ''){
                let img = document.createElement('IMG');
                img.className = 'possible_image_guess  wd70 hd70'; //possible_image
                img.src = guessed_images[witch][guess_img_index]['img'];
                img.title = guessed_images[witch][guess_img_index]['description'];
                div.append(img);
                div.onclick = function (){
                    add_img_to_asked(img);
                }
            }else{
                div.innerHTML = `Your image ${guessed_images[witch][guess_img_index]['description']} ?`;
                div.onclick = function (){
                    add_img_to_asked_question(div);
                }
            }

            html_button_elem_guess.append(div);
        }
    }
}


function guess_back(){
    document.getElementById('guess_back').style.display = 'none';
    document.getElementById('guess_certain').style.display = 'revert';
    let images_guess_possible = document.getElementsByClassName('possible_image_guess_divs');
    while (images_guess_possible.length > 0){
        images_guess_possible[0].remove();
    }

    let elements_button_guess = document.getElementsByClassName('guess_dir');
    for (let index_btn_guess_dir = 0 ;index_btn_guess_dir < elements_button_guess.length;index_btn_guess_dir++){
        elements_button_guess[index_btn_guess_dir].style.display = 'revert'
    }

}

function add_img_to_asked_question(div){
    let ask_for_kids = document.getElementById('chat_for_kids');
    for (const [key, value] of Object.entries(guessed_images)) {
        for (let guess_img_index = 0 ;guess_img_index < value.length; guess_img_index++){
            if (value[guess_img_index]['description'] === div.innerHTML){
                value[guess_img_index]['guessed'] = true;
                console.log('NAIEL OTAZKU')
            }
        }
    }

    let div_img_guess_kids = document.createElement('p');
    div_img_guess_kids.className = 'asked_img_question undefined';
    div_img_guess_kids.innerHTML = div.innerHTML;
    ask_for_kids.append(div_img_guess_kids);

    chat_box.scrollBy(0,300)
    let massage = {};
    massage.src = '';
    massage.title = div.innerHTML;
    massage.title = massage.title.replace('Your image ' ,'');
    massage.title = massage.title.replace(' ?' ,'');
    socket.emit('ask_single_player_game',{game_id, massage});
    guess_back();

}
function add_img_to_asked(elem_img){
    console.log('add img to asked');
    let ask_for_kids = document.getElementById('chat_for_kids');
    for (const [key, value] of Object.entries(guessed_images)) {
        for (let guess_img_index = 0 ;guess_img_index < value.length; guess_img_index++){
            if (value[guess_img_index]['description'] === elem_img.title){
                value[guess_img_index]['guessed'] = true;
            }
        }
    }

    let guessed_img = document.createElement('IMG');
    guessed_img.className = 'task_img';
    guessed_img.src = elem_img.src;
    guessed_img.title = elem_img.title;
    let div_img_guess_kids = document.createElement('div');
    div_img_guess_kids.className = 'card col card_kid_img undefined';
    div_img_guess_kids.append(guessed_img)
    ask_for_kids.append(div_img_guess_kids);

    console.log('SCROLLLLIIINNNNGGG')
    chat_box.scrollBy(0,300)
    let massage = {};
    massage.src = elem_img.src;
    massage.title = elem_img.title;
    if (game_type !== 'pc'){
        socket.emit('broadcast_massage',{game_id,my_socket_id, massage});
    }else{
        socket.emit('ask_single_player_game',{game_id, massage});
    }

    your_turn = false;
    guess_back();
    if (game_type === 'kid'){
        lock_unlock_buttons();
    }





}
function guess_certain(){
    console.log('GUESS CERTAIN ')
    document.getElementById('guess_back').style.display = 'revert';
    document.getElementById('guess_certain').style.display = 'none';

    let elements_button_guess = document.getElementsByClassName('guess_dir');
    for (let index_btn_guess_dir = 0; index_btn_guess_dir < elements_button_guess.length; index_btn_guess_dir++) {
        elements_button_guess[index_btn_guess_dir].style.display = 'none'
    }
    for (let index_img_for_guess = 0; index_img_for_guess < html_possible_images.length; index_img_for_guess++) {
        if (html_possible_images[index_img_for_guess].style.opacity === '1') {
            let img = document.createElement('IMG');
            img.className = 'possible_image_guess m-auto wd70 ht70';//
            img.src = html_possible_images[index_img_for_guess].src;
            img.title = html_possible_images[index_img_for_guess].title;
            let div = document.createElement('div');
            div.className = 'card col possible_image_guess_divs';
            div.append(img);
            div.onclick = function () {
                add_img_to_asked_certain(img);
            }
            html_button_elem_guess.append(div);
        }
    }

}
function add_img_to_asked_certain(img){
    let massage = {};
    massage.src = img.src;
    massage.title = img.title;
    massage.certain = img.src.includes((game_name.replaceAll(' ','%20')) + '/images');
    if (game_type === 'pc'){
        massage.certain = img.src.includes((game_name.replaceAll(' ','%20')) + '/images');
    }else{
        console.log('certain NOT')
    }
    if (game_type !== 'pc'){
        socket.emit('broadcast_massage',{game_id,my_socket_id, massage});
    }else{
        socket.emit('ask_single_player_game',{game_id, massage});
    }

    let ask_for_kids = document.getElementById('chat_for_kids');

    let guessed_img = document.createElement('IMG');
    guessed_img.className = 'task_img';
    guessed_img.src = img.src;
    guessed_img.title = img.title;
    let div_img_guess_kids = document.createElement('div');
    if (game_type === 'student'){
        div_img_guess_kids.className = 'card col card_kid_img undefined f_all0';
    }else{
        div_img_guess_kids.className = 'card col card_kid_img undefined';
    }

    div_img_guess_kids.append(guessed_img)
    ask_for_kids.append(div_img_guess_kids);
    your_turn = false;

    guess_back();
    if (game_type === 'kid'){
        lock_unlock_buttons();
    }

}
function report_player(){
    let player_name = ((my_game.player1.game_name === html_name.innerHTML)?my_game.player2.game_name:my_game.player1.game_name); // ZLE
    create_exception(`player ${player_name} has been reported`,5,'success');
}
function make_card_win(witch_player_win){
    let opponent_character;
    if (witch_player_win.includes('lost')){
        my_game.state = true
        opponent_character = ((my_game.player1.game_name === html_name.innerHTML) // ZLE
            ?my_game.player2.character+' '+my_game.player2.game_name
            :my_game.player1.character+' '+my_game.player1.game_name).split(' ');
    }else{
        my_game.state = true
        opponent_character = ((my_game.player1.game_name === html_name.innerHTML) // ZLE
            ?my_game.player1.character+' '+my_game.player1.game_name
            :my_game.player2.character+' '+my_game.player2.game_name ).split(' ');
    }

    console.log(opponent_character)
    document.getElementById('opponent_profile_card').style.backgroundColor = opponent_character[0];
    document.getElementById('opponent_profile_img').src = './images/Users/'+opponent_character[1];
    document.getElementById('opponent_name').innerHTML = opponent_character[2];

    if (game_type === 'kid' &&
        (witch_player_win !== 'You win because your opponent is not playing !' &&
            witch_player_win !== 'You lost because you are not playing !')){
       // html_report_btn.style.display = 'revert';
    }else{
        // html_report_btn.style.display = 'none';
    }

}
function make_win_multiplier(text){
    // POZOR !!!
    // if (document.getElementById('my_img_guessed_by_opponent').src.includes( '/images/question_mark.png') && game_type !== 'pc'){
    // }else{
    //     if (text !== 'You lost because you are not playing !'){
    //         if (text === 'You win because your opponent is not playing !'){
    //         }
    //     }
    // }

    console.log('MULTIPLAYER WIN')
    html_centered_win.style.display = 'revert';
    html_centered_centered_win.style.display = 'revert';
    html_win_lost.style.display = 'revert';
    html_win_lost.innerHTML = text;
    html_leave.style.display = 'revert';
    html_play_again.style.display = 'revert';
    html_leave.style.display = 'revert';
    html_play_again.style.display = 'revert';
    document.getElementById('yes').style.display = 'none';
    document.getElementById('no').style.display = 'none';

    document.getElementById('opponent_profile_card').style.display = 'revert';
    make_card_win(text);
    document.getElementById('asked_img_question').style.display = 'none';
    // document.getElementById('report_btn').style.display = 'revert';


    document.getElementById('yes').disable = false;
    document.getElementById('no').disable = false;


}

function answer_to_question(bull){
    // console.log('ANSWER TO QUESTION IS : ',bull)
    socket.emit('broadcast_massage',{game_id,my_socket_id, massage:bull});
    if (document.getElementById('asked_img_question').src.includes(game_name.replace(' ','%20')+'/images') && bull){
        my_game.state = true;
        make_win_multiplier('You lost');
    }else{
        your_turn = true;
        if (game_type === 'kid') {
            lock_unlock_buttons();
        }
        hide_win_lost();
    }

}
function hide_win_lost(){
    html_centered_win.style.display = 'none';
    html_centered_centered_win.style.display = 'none';
}
function make_question_for_opponent(question){

    console.log('THE QUESTION IS : ',question)
    html_centered_win.style.display = 'revert';
    html_centered_centered_win.style.display = 'revert';
    html_win_lost.style.display = 'revert';
    html_win_lost.innerHTML = 'is your image '+(question.title.includes(',')?'':question.title)+' ?';
    html_leave.style.display = 'none';
    // html_report_btn.style.display = 'none';
    html_play_again.style.display = 'none';
    document.getElementById('yes').style.display = 'revert';
    document.getElementById('no').style.display = 'revert';
    document.getElementById('asked_img_question').style.display = 'revert';

    // console.log('KOLI TESTU NA MOBILE !!! LOCAL HOST','.'+question.src.split(':3000')[1] );
    console.log(question.src)
    document.getElementById('asked_img_question').src = '.'+question.src.split('.com')[1];
    document.getElementById('again').disable = false;
    document.getElementById('leave').disable = false;
}


function leave(){
    socket.emit('leave_game',{game_id,my_socket_id});
    location.assign('menu.html');
}
function leave_game(){
    if (game_type === 'pc'){
        leave()
    }
    else{
        console.log(my_game.state)
        if (my_game.state){
            leave()
        }else if (my_game.state === false && my_game.player2 !== undefined){
            create_exception('Are u sure tou want to leave the game ? If you leave unfinished game your score will be affected <button class="bg-success text-light" onclick="leave()"> YES </button>',5,'danger')
        }else{
            leave()
        }
        console.log("game type ",game_type)
    }
}

function play_again(){
    socket.emit('leave_game',{game_id,my_socket_id});
    let new_game_id = make_id(5);
    sessionStorage.setItem('game_id',new_game_id);
    console.log('play again ',new_game_id)
    location.reload();
}


function make_id(length) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function hide(elem){
    if ((game_type === 'kid' || game_type === 'student') && document.getElementById('my_img_guessed_by_opponent').src.includes( '/images/question_mark.png')){
        document.getElementById('my_img_guessed_by_opponent').src = elem.childNodes[1].src;
        document.getElementById('my_img_guessed_by_opponent').title = elem.childNodes[1].title;
        console.log('posielam spravu s usera',my_socket_id)
        let massage = 'block';
        socket.emit('broadcast_massage',{game_id,my_socket_id,massage});
        return;
    }

    if ( elem.childNodes[1].src.includes('error.png')  ){

    }else if ( elem.childNodes[1].style.opacity === '0.3' ){
        elem.style.filter =  'brightness(100%)';
        elem.childNodes[1].style.opacity = '1';
        elem.childNodes[1].style.filter =  'brightness(100%)';
    }else{
        elem.style.filter =  'brightness(50%)';
        elem.childNodes[1].style.opacity = '0.3';
        elem.childNodes[1].style.filter =  'brightness(50%)';
    }

}
function count_how_many_images_left(){
    let count = 0 ;
    for (let index_img_for_guess = 0 ;index_img_for_guess < html_possible_images.length; index_img_for_guess++){
        if (html_possible_images[index_img_for_guess].style.opacity === '1'){
            count+=1;
        }
    }
    return count;
}
function check_counter(){
    time_of_complete+=1;
    if (document.getElementById('guess_back').style.display === 'none'){
        let count = count_how_many_images_left();
        if (count <= 5 && ((your_turn && (game_type==='kid' )) || game_type==='pc' || game_type==='student') ){//|| game_type==='student'
            document.getElementById('guess_certain').disabled = false;
            document.getElementById('guess_certain').className = document.getElementById('guess_certain').className.replace(' bg-danger ' , ' bg-success ')
        }else{
            document.getElementById('guess_certain').disabled = true;
            document.getElementById('guess_certain').className = document.getElementById('guess_certain').className.replace( ' bg-success ',' bg-danger ' )
        }
    }
    setTimeout(check_counter,500);
}

