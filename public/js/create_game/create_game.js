// let main_config_divs_html_btn = {}
let html_all_games = undefined;
const possible_extensions = ['image/png','image/jpeg','image/PNG','image/JPEG',"image/jpg","image/JPG"];
const allow_buttons = ['main_button_allow_check1','main_button_allow_check2','main_button_allow_check3','main_button_allow_save','main_button_allow_test','back_to_list_of_games']
let main_config_divs = {'main':true,'images':true,'attributes':false,'define_images':false,'save':false,'status':true};
const illegal_characters = ['-', ':', '<', '>','|' ,'.' , '/' , '\\' , '?' , "*" , "$" , '#' ,'!' ,'@',','];
let currently_edited_game = undefined;
const my_new_or_edited_game = new NewGame()

document.addEventListener('DOMContentLoaded', function () {
    html_all_games = document.getElementById('all_games');
    // for (let key in main_config_divs) {
    //     if (main_config_divs.hasOwnProperty(key)) {
    //         main_config_divs_html_btn[key] = document.getElementById(`${key}_btn`)
    //     }
    // }
    // w8()
});
function w8(){
    if (user_account !== undefined && typeof findYourGames === 'function' ){
        html_all_games = document.getElementById('all_games');
        // for (let key in main_config_divs) {
        //     if (main_config_divs.hasOwnProperty(key)) {
        //         main_config_divs_html_btn[key] = document.getElementById(`${key}_btn`)
        //     }
        // }
        findYourGames()
        console.log('hladam hry')
    }else{

        console.log('cakam na socket')
        setTimeout(w8,200);
    }

}
function back_to_list_of_your_games(){
    my_new_or_edited_game.to_default()
    document.getElementById('all_games').style.display = 'contents';
    document.getElementById('menu_for_config_game').style.display = 'none';
    delete_all_main()
    main_config_divs = {'main':true,'images':false,'attributes':false,'define_images':false,'save':false,'status':true};
    display('abstract')
    create_exception('loading',3,'success')
}

function findYourGames (){
    if (user_account.role === "Teacher"){
        socket.emit('get_all_games_by_you',{my_socket_id});
    }else{
        location.assign('index.html')
    }
}

socket.on('get_all_games_by_you' , ({games}) => {
    console.log("GAMES   : " ,games);
    for (let index_game = 0; index_game < games.length; index_game++) {
        create_html_games(games[index_game]);
    }
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
    let cards = document.getElementsByClassName('html_game_card');
    while (cards.length > 0){
        cards[0].remove();
    }
    setTimeout(refresh_after,5000);
}
function refresh_after(){
    location.reload()
}


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
        // for (let key in main_config_divs) {
        //     main_config_divs_html_btn[key] = true
        // }
        const list_possible_html = document.getElementById('all_games')
        list_possible_html.style.display =   'none'
        my_new_or_edited_game.load_game(game)
        my_new_or_edited_game.show_user_interface(main_config_divs.main,main_config_divs.images,main_config_divs.attributes,main_config_divs.define_images,true,true,'revert')
        my_new_or_edited_game.show_hide(document.getElementById('menu_for_config_game'))
        my_new_or_edited_game.show_hide_inside('main')
        recreate_main()
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

function create_new_game(type){
    const list_possible_html = document.getElementById('list_of_possible_games')
    list_possible_html.style.display =  (list_possible_html.style.display === 'contents') ?  'none' :  'contents'
    my_new_or_edited_game.setType(type)

    my_new_or_edited_game.show_user_interface(main_config_divs.main,main_config_divs.images,main_config_divs.attributes,main_config_divs.define_images,false,true,'revert')
    my_new_or_edited_game.show_hide(document.getElementById('menu_for_config_game'))
    my_new_or_edited_game.show_hide_inside('main')

}

function display(witch){
    console.log(witch)
    if ( witch === 'status'){
        create_status()
    }
    if (witch === 'define_images' && main_config_divs.define_images){
        console.log('d-vytvaram')
        create_define_image()
    }
    my_new_or_edited_game.show_hide_inside(witch)
}


function do_you_wont_to_delete_game(game_id, title){
   create_exception(`Do you wont to delete this game ${game_id}${title} ? <button class="btn btn-default bg-success text-light" onclick="delete_game(\`${game_id}\`,\`${title}\`)">YES</button>`,30,'warning')
}

function delete_game(game_id, title){
    socket.emit('delete_game' , {game_id,title,my_socket_id})
    delete_all_html_games();
    // create_exception('game has been deleted',5,'success');
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
function list_all_possible_games_for_create(){
    const list_possible_html = document.getElementById('list_of_possible_games')
    list_possible_html.style.display =  (list_possible_html.style.display === 'contents') ?  'none' :  'contents'
    const all_games_html = document.getElementById('all_games')
    all_games_html.style.display =  (all_games_html.style.display === 'none') ?  'contents' : 'none'
}