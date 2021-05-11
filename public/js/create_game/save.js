function make_form_data(){
    let form_data_create_game = new FormData();
    if (my_new_or_edited_game.id){
        form_data_create_game.append('game_id',my_new_or_edited_game.id);
    }
    form_data_create_game.append('my_socket_id',my_socket_id);
    if (check_main(false)){

        if (game_input_main_img_html.files[0] !== undefined) {
            form_data_create_game.append('main_img_file', game_input_main_img_html.files[0]);
        } else {
            let blob = new File([undefined], game_main_img_of_game_html.src.split('/').pop());
            form_data_create_game.append('main_img_file', blob);
        }
        form_data_create_game.append('game_name', my_new_or_edited_game.origin_title === undefined ? my_new_or_edited_game.title  : my_new_or_edited_game.origin_title);
        form_data_create_game.append('game_name', my_new_or_edited_game.title);
        form_data_create_game.append('game_description', my_new_or_edited_game.description);

        if (check_attributes(false)) {
            for (let key in my_new_or_edited_game.game_descriptors) {
                form_data_create_game.append('d_img',  my_new_or_edited_game.game_descriptors[key].image);
                form_data_create_game.append('d_type', my_new_or_edited_game.game_descriptors[key].type);
                form_data_create_game.append('d_descriptor_question',  my_new_or_edited_game.game_descriptors[key].description);
            }
        }else{
            return undefined
        }
        if ( check_images(false)) {
            for (let key in my_new_or_edited_game.game_images) {
                form_data_create_game.append('game_img', my_new_or_edited_game.game_images[key].image);
                form_data_create_game.append('game_img_auto_descriptor',my_new_or_edited_game.game_images[key].description_control);
                form_data_create_game.append('game_img_question', '');
            }
        }else{
            return undefined
        }
        form_data_create_game.append('category_of_players', my_new_or_edited_game.type);

        let counter = 0
        for (let key1 in my_new_or_edited_game.game_images) {
            counter += 1
        }

        if (counter >= 25) {
            form_data_create_game.append('created', '1');
        } else {
            form_data_create_game.append('created', '0');
        }
    }else{
        return undefined
    }
    return form_data_create_game
}

async function save_game() {
    let form_data_create_game = make_form_data();
    if (form_data_create_game === undefined) {
        create_exception('somthing wand wnog fith formating of request', 10, 'warning')
        return false
    }else{
        create_exception('Please wait game is being uploaded to server.',10,'success')
        const response = await fetch('https://guess-who-online-game.herokuapp.com/upload_new_game', {
            method: 'POST',
            body: form_data_create_game
        }).catch(err => {
            create_exception(`something went wrong ${err} `,10,'success')
        })
        document.getElementById('all_games').style.display = 'contents';
        document.getElementById('menu_for_config_game').style.display = 'none';
        config_divs_html = {'main':true,'images':false,'attributes':false,'define_images':false,'save':false,'status':true};
        display('abstract')
        // create_exception('loading',3,'success')
        delete_all_html_games();
    }
}