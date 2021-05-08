function make_form_data(){
    let form_data_create_game = new FormData();
    if (my_new_or_edited_game.id){
        form_data_create_game.append('game_id',my_new_or_edited_game.id);
    }

    // ktori user to vlastne vytvara hru
    form_data_create_game.append('my_socket_id',my_socket_id);

    /// CHECK 1
    let check_main =  check_main('no_switch')
    if (check_main){

        if (game_input_main_img_html.files[0] !== undefined) {
            form_data_create_game.append('main_img_file', game_input_main_img_html.files[0]);
        } else {
            let blob = new File([undefined], game_main_img_of_game_html.src.split('/').pop());
            form_data_create_game.append('main_img_file', blob);
        }

        form_data_create_game.append('game_name', my_new_or_edited_game.title);
        form_data_create_game.append('game_description', my_new_or_edited_game.description);

        /// CHECK 2
        let check_attributes =  check_attributes(false)
        if (check_attributes) {
            for (let key in main_config_divs.game_descriptors) {
                form_data_create_game.append('d_img',  main_config_divs.game_descriptors[key].image);
                form_data_create_game.append('d_type', main_config_divs.game_descriptors[key].type);
                form_data_create_game.append('d_descriptor_question',  main_config_divs.game_images[key].description);
            }
        }
        let check_image =  check_images(false)
        if (check_image) {
            for (let key in main_config_divs.game_images) {
                form_data_create_game.append('game_img', main_config_divs.game_images[key].image);
                form_data_create_game.append('game_img_auto_descriptor',main_config_divs.game_images[key].description_control);
                form_data_create_game.append('game_img_question', '');
            }
        }
        form_data_create_game.append('category_of_players', main_config_divs.type);

        let check_define_images = check_define_images()

        if (check_define_images[0] >= 25) {
            form_data_create_game.append('created', '1');
        } else {
            form_data_create_game.append('created', '0');
        }
    }
    console.log(form_data_create_game)
    return form_data_create_game
}

async function save_game() {
    let form_data_create_game = make_form_data();
    if (form_data_create_game === undefined) {
        return create_exception('somthing wand wnog fith formating of request', 10, 'warning')
    }
    console.log(form_data_create_game);
    const response = await fetch('https://guess-who-online-game.herokuapp.com/upload_new_game', {
        method: 'POST',
        body: form_data_create_game
    }).catch(err => {
        create_exception('Something want wrong with saving', 10, 'danger');
        delete_all_html_games();
    })
    const json  = await response.json()
    if (json.data === undefined){
        create_exception('Game saved', 10, 'success');
        delete_all_html_games();
    }
    else{
        create_exception(json.data, json.time_of_exception, json.type_of_exception);
        delete_all_html_games();
    }
}