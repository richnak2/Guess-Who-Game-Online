let html_all_games = undefined;
const possible_extensions = ['image/png','image/jpeg','image/PNG','image/JPEG',"image/jpg","image/JPG"];
const allow_buttons = ['main_button_allow_check1','main_button_allow_check2','main_button_allow_check3','main_button_allow_save','main_button_allow_test','back_to_list_of_games']
const main_config_divs = ['check_1','check_2','check_3','save','status'];
const illegal_characters = ['-', ':', '<', '>','|' ,'.' , '/' , '\\'];
let already_created_game = false;
let currently_edited_game = undefined;


document.addEventListener('DOMContentLoaded', function () {
    html_all_games = document.getElementById('all_games');

});

function back_to_list_of_your_games(){
    let all_games = document.getElementsByClassName('html_game_card');
    while (all_games.length > 0 ){
        all_games[0].remove();
    }
    allow_buttons.forEach(elem_btn => {
        document.getElementById(elem_btn).style.display = 'none';
    })
    document.getElementById('all_games').style.display = 'contents';
    hide_all_divs();
    socket.emit('get_all_games_by_you',{my_socket_id});
}
// find all posible games for users
socket.emit('get_all_games_by_you',{my_socket_id});
socket.on('get_all_games_by_you' , ({games}) => {
    console.log("GAMES   : " ,games);
    for (let index_game = 0; index_game < games.length; index_game++) {
        create_html_games(games[index_game]);
    }
    pre_make_colors_them();
});

function check_for_illegal_characters(val){
    for (let index_illegal_char = 0 ; index_illegal_char <  illegal_characters.length; index_illegal_char++) {
        if (val.includes(illegal_characters[index_illegal_char])){
            return true
        }
    }
    return false
}


function delete_all_html_games(){
    already_created_game = false;
    let cards = document.getElementsByClassName('html_game_card');
    while (cards.length > 0){
        cards[0].remove();
    }
    recreate_html()
    setTimeout(function (){
        socket.emit('get_all_games_by_you',{my_socket_id});
    },3000)

}
function recreate_html(){
    allow_buttons.forEach(elem_btn => {
        let elem_btn_html = document.getElementById(elem_btn);
        elem_btn_html.className = 'btn btn-default bg-success text-light';
        elem_btn_html.style.display = 'none';
        // elem_btn_html.nextElementSibling.style.display = 'none';
    })
    main_config_divs.forEach(elem_div => {
        let elem_div_html = document.getElementById(elem_div);
        elem_div_html.style.display = 'none';
    })
}
// Male karticky na vrchu stranky
function create_html_games(game){
    let div_card = document.createElement('div');
    let div_for_image = document.createElement('div');
    let image_of_card = document.createElement('IMG');
    let div_body_card = document.createElement('div');
    let card_title = document.createElement('p');
    let div_card_buttons = document.createElement('div');

    div_card.className = "card html_game_card btn-light no_btn ";//wd200 ht200
    div_for_image.className = " card-title text-center mb0 ";
    image_of_card.className = " card-title text-center";
    image_of_card.src = '/images/'+game['title']+'/'+game['image'];
    image_of_card.className = "wd80 ht80 mt10";
    div_body_card.className = "card-body";
    card_title.className = " text-center mb0 text_black";

    card_title.innerHTML = (game['title'].slice(0,10) !== game['title'] ? game['title'].slice(0,10)+'...' : game['title']);
    div_card_buttons.className = 'text-center';


    let buttons_edit = document.createElement('BUTTON');
    buttons_edit.className = 'btn btn-default bg-success mb10 text-light'
    buttons_edit.innerHTML = 'edit'
    buttons_edit.onclick = function (){
        create_exception('loading game ...',10,'warning')
        setTimeout(edit_game,1,game)
        // edit_game(game);
    }
    let buttons_delete = document.createElement('BUTTON');
    buttons_delete.className = 'btn btn-default bg-danger ml20 mb10 text-light';
    buttons_delete.innerHTML = 'delete'
    buttons_delete.onclick = function (){
        do_you_wont_to_delete_game(game.id,game.title);
    }
    div_card_buttons.append(buttons_edit,buttons_delete);
    div_for_image.append(image_of_card);
    div_body_card.append(card_title);
    div_card.append(div_for_image,div_body_card,div_card_buttons);
    html_all_games.append(div_card);
}

function create_new_game(){
    already_created_game = false;
    hide_all_divs();
    remove_all_check_1();
    remove_all_check_2();
    remove_all_check_3();
    document.getElementById('menu_for_config_game').style.display = 'revert';
    document.getElementById('main_button_allow_check1').className = document.getElementById('main_button_allow_check1').className.replace(' bg-success',' bg-primary');

    allow_buttons.forEach(elem_btn => {
        document.getElementById(elem_btn).className = document.getElementById(elem_btn).className.replace(' bg-success',' bg-danger');
        document.getElementById(elem_btn).style.display = 'revert';
    });
    display('check_1');
    document.getElementById('all_games').style.display = 'none';

}
function change_allow_button_danger_primary(id_elem_btn){
    document.getElementById(id_elem_btn).className = document.getElementById(id_elem_btn).className.replace(' bg-danger',' bg-primary');

}
function change_allow_button_primary_success(id_elem_btn){
    document.getElementById(id_elem_btn).className = document.getElementById(id_elem_btn).className.replace(' bg-primary',' bg-success');

}
function hide_all_divs(){
    main_config_divs.forEach(elem_div =>{
        document.getElementById(elem_div).style.display = 'none';
    })
}
function display(witch){
    hide_all_divs();
    if (witch === 'check_1'){
        document.getElementById(witch).style.display = 'revert';
    }else if (witch === 'check_2' ){
        if (status_of_game_check_1){
            document.getElementById(witch).style.display = 'revert';
        }else{
            create_exception('Please check in this section <button class="btn btn-default bg-success "  onclick="display(\'check_1\')">main</button>',10,'warning')
        }

    }else if (witch === 'check_3'){
        if (status_of_game_check_2){
            document.getElementById(witch).style.display = 'revert';
        }else{
            create_exception('Please check in this section <button class="btn btn-default bg-success "  onclick="display(\'check_2\')">descriptors</button>',10,'warning')
        }
    }else if (witch === 'save'){
        if (status_of_game_check_1){
            save_game();
            // document.getElementById(witch).style.display = 'revert';
        }else{
            create_exception('Please check in this section <button class="btn btn-default bg-success "  onclick="display(\'check_3\')">descriptors</button>',10,'warning')
        }

    }else{
        if (status_of_game_check_3){
            document.getElementById(witch).style.display = 'revert';
            create_status();
        }else{
            create_exception('Please check in this section <button class="btn btn-default bg-success "  onclick="display(\'check_3\')">descriptors</button>',10,'warning')
        }
    }
}


function edit_game(witch_game){
    console.log('ODSTRANUJEM EXISTUJUCE ')

    remove_all_check_1();
    remove_all_check_2();
    remove_all_check_3();
    already_created_game = true;
    currently_edited_game = witch_game;
    allow_buttons.forEach(elem_btn => {
        document.getElementById(elem_btn).className = 'btn btn-default bg-success text-light';
        document.getElementById(elem_btn).style.display = 'revert';
    })
    document.getElementById('menu_for_config_game').style.display = 'revert';
    recreate_check_1(witch_game);
    display('check_1');
    document.getElementById('all_games').style.display = 'none';
}
function do_you_wont_to_delete_game(game_id, title){

   create_exception(`Do you wont to delete this game ${game_id}${title} ? <button class="btn btn-default bg-success text-light" onclick="delete_game(\`${game_id}\`,\`${title}\`)">YES</button>`,30,'warning')
}
function delete_game(game_id, title){
    socket.emit('delete_game' , {game_id,title,my_socket_id})
    delete_all_html_games();
}
function make_form_data(){
    let form_data_create_game = new FormData();
    if (already_created_game){
        form_data_create_game.append('game_id',currently_edited_game.id);
    }

    // ktori user to vlastne vytvara hru
    form_data_create_game.append('my_socket_id',my_socket_id);

    /// CHECK 1
    let game_name_value = document.getElementById('game_name');
    let game_description_value = document.getElementById('game_description');
    let main_img_file = document.getElementById('input_main_img');
    let main_game_img = document.getElementById('main_img_of_game');

    if (status_of_game_check_1 === false ){//|| status_of_game_check_2 === undefined || status_of_game_check_3 === undefined)
        // if (game_name_value.value === "" ) {
        //     create_exception('You must set game title in "main" button',5,'danger');
        //     status_of_game_check_1 = false;
        // }
        return undefined;
    }else {
        if (main_img_file.files[0] !== undefined) {
            form_data_create_game.append('main_img_file', main_img_file.files[0]);
        } else {
            let blob = new File([undefined], main_game_img.src.split('/').pop());
            form_data_create_game.append('main_img_file', blob);
        }

        if (already_created_game){
            form_data_create_game.append('game_name', currently_edited_game.title);
        }else{
            form_data_create_game.append('game_name', game_name_value.value);
        }
        form_data_create_game.append('game_name', game_name_value.value);
        form_data_create_game.append('game_description', game_description_value.value);

        /// CHECK 2
        for (let index_descriptor = 0; index_descriptor < types_of_descriptors.length; index_descriptor++) {
            form_data_create_game.append('d_img', definers_images[index_descriptor]);
            form_data_create_game.append('d_type', types_of_descriptors[index_descriptor]);
            form_data_create_game.append('d_descriptor_question', definers_or_questions[index_descriptor]);
        }
        form_data_create_game.append('category_of_players', status_of_game_check_2);

        /// CHECK 3
        for (let index_descriptor = 0; index_descriptor < game_auto_descriptors.length; index_descriptor++) {
            form_data_create_game.append('game_img_auto_descriptor', game_auto_descriptors[index_descriptor]);
            form_data_create_game.append('game_img_question', game_question_descriptor[index_descriptor]);
        }
        for (let file_index = 0; file_index < game_images_files.length; file_index++) {
            if (game_images_files[file_index][1] !== undefined || game_images_files[file_index][1] !== 'removed'){
                form_data_create_game.append('game_img', game_images_files[file_index][1]);
            }
        }

        if (game_images_files.length >= 25) {
            form_data_create_game.append('created', '1');
        } else {
            form_data_create_game.append('created', '0');
        }
    }
    return form_data_create_game
}
async function save_game() {
    let form_data_create_game = make_form_data();
    if (form_data_create_game === undefined) {
        return create_exception('somthing wand wnog fith formating of request', 10, 'warning')
    }
    if (already_created_game) {
        const response = await fetch('https://guess-who-online-game.herokuapp.com/upload_game', {
            method: 'POST',
            body: form_data_create_game
        }).then(response => response.json())
            .then(data => {
                if (data) {
                    create_exception(data.data, data.time_of_exception, data.type_of_exception);
                    delete_all_html_games();
                }
            }).catch(err => console.log(err));
        console.log(response)
    } else {
        const response = await fetch('https://guess-who-online-game.herokuapp.com/upload_new_game', {
            method: 'POST',
            body: form_data_create_game
        }).then(response => response.json())
            .then(data => {
                if (data) {
                    create_exception(data.data, data.time_of_exception, data.type_of_exception);
                    delete_all_html_games();

                }
            }).catch(err => console.log(err));
        console.log(response)
    }

}

function check_file_img(which,add_to_this_elem){
    const reader = new FileReader()
    reader.onload = function (){
        add_to_this_elem.src = reader.result
    }
    reader.readAsDataURL(which.files[0]);
    return true;
}

function check_file_multiple(file,add_to_this_elem){
    const reader = new FileReader()
    reader.onload = function (){
        add_to_this_elem.src = reader.result
    }
    reader.readAsDataURL(file);
}