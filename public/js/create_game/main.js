const game_name_html = document.getElementById('game_name')
const game_description_html = document.getElementById('game_description')
const game_input_main_img_html = document.getElementById('input_main_img')
const game_main_img_of_game_html = document.getElementById('main_img_of_game')
let switch_page_main = true

game_name_html.onchange =  () =>{
    my_new_or_edited_game.title = game_name_html.value
    let game_name_val = game_name_html.value
    socket.emit('exist_dir',{game_name_val});
    switch_page_main = false
}
game_description_html.onchange =  () =>{
    my_new_or_edited_game.description = game_description_html.value;
}
socket.on('exist_dir',({exist})=>{
    if (exist){
        if (my_new_or_edited_game.id ) {
            if (my_new_or_edited_game.origin_title === game_name_html.value) {
                config_divs_html.images = true
                config_divs_html.save = true // asi

                my_new_or_edited_game.show_user_interface(config_divs_html.main,config_divs_html.images,config_divs_html.attributes,config_divs_html.define_images,undefined,true,'revert')
                if (switch_page_main){
                    display('images');
                }

            } else {
                config_divs_html.images = false
                config_divs_html.save = false
                if (switch_page_main) {
                    display('main');
                }
                my_new_or_edited_game.show_user_interface(config_divs_html.main,config_divs_html.images,config_divs_html.attributes,config_divs_html.define_images,true,true,'revert')

                create_exception('Game title already exist', 5, 'warning');
            }
        }else{
            config_divs_html.images = false
            config_divs_html.save = false
            if (switch_page_main) {
                display('main');
            }
            my_new_or_edited_game.show_user_interface(config_divs_html.main,config_divs_html.images,config_divs_html.attributes,config_divs_html.define_images,false,true,'revert')

            create_exception('Game title already exist',5,'warning');
        }
    }else{
        config_divs_html.images = true
        config_divs_html.save = true // asi
        my_new_or_edited_game.show_user_interface(config_divs_html.main,config_divs_html.images,config_divs_html.attributes,config_divs_html.define_images,undefined,true,'revert')
        if (switch_page_main){
            display('images');
        }
    }
})

function check_file_img(which,add_to_this_elem){
    const reader = new FileReader()
    reader.onload = function (){
        add_to_this_elem.src = reader.result
    }
    reader.readAsDataURL(which.files[0]);
}

function recreate_main(){
    switch_page_main = true
    game_name_html.value = my_new_or_edited_game.origin_title;
    game_description_html.value = my_new_or_edited_game.description;
    let path = `./images/${decodeURI(my_new_or_edited_game.origin_title)}/`;
    game_main_img_of_game_html.src = path+'default.png';
    console.log(path)
    recreate_images(path);
}


function delete_all_main(){
    game_name_html.value = '';
    game_description_html.value = '';
    game_input_main_img_html.value = '';
    game_main_img_of_game_html.src = './images/create_game.png';
    delete_all_images()
}

function check_main(page_switch_allowed){
    switch_page_main = page_switch_allowed
    let game_name_val = game_name_html.value;

    if (game_name_val && (game_name_val.length < 30 && game_name_val.length >= 5)) {
        if (check_for_illegal_characters(game_name_val)) {
            create_exception(`illegal characters in title of the game <strong>${illegal_characters.join(' ')}</strong>`,5,'warning');
            game_name_html.style.border = " 2px solid #fff3cd";
            config_divs_html.save = false
            my_new_or_edited_game.show_user_interface(config_divs_html.main,config_divs_html.images,config_divs_html.attributes,config_divs_html.define_images,undefined,true,'revert')
            display('main');
            return false
        }
        game_name_html.style.border = " 2px solid #ced4da";
        socket.emit('exist_dir',{game_name_val});

    }else{
        create_exception('You must set game title min length 5 and max is 30',5,'danger');
        if (game_name_val.value === "" || game_name_val.length > 30 || game_name_val.length < 5 ){
            game_name_html.style.border = " 5px solid #fff3cd";
        }else{
            game_name_html.style.border = " 2px solid #ced4da";
        }
        config_divs_html.save = false
        my_new_or_edited_game.show_user_interface(config_divs_html.main,config_divs_html.images,config_divs_html.attributes,config_divs_html.define_images,undefined,true,'revert')
        display('main');
        return false
    }
    return true
}


