function make_form_data(){
    let form_data_create_game = new FormData();
    if (my_new_or_edited_game.id){
        form_data_create_game.append('game_id',my_new_or_edited_game.id);
    }

    // ktori user to vlastne vytvara hru
    form_data_create_game.append('my_socket_id',my_socket_id);
    // console.log(my_socket_id)
    // console.log(my_new_or_edited_game.id)


    /// CHECK 1
    // let check_m =  check_main()
    if (check_main(false)){

        if (game_input_main_img_html.files[0] !== undefined) {
            form_data_create_game.append('main_img_file', game_input_main_img_html.files[0]);
        } else {
            let blob = new File([undefined], game_main_img_of_game_html.src.split('/').pop());
            form_data_create_game.append('main_img_file', blob);
        }
        form_data_create_game.append('game_name', my_new_or_edited_game.origin_title ? undefined : my_new_or_edited_game.title );
        form_data_create_game.append('game_name', my_new_or_edited_game.title);
        form_data_create_game.append('game_description', my_new_or_edited_game.description);

        /// CHECK 2

        if (check_attributes(false)) {
            for (let key in my_new_or_edited_game.game_descriptors) {
                form_data_create_game.append('d_img',  my_new_or_edited_game.game_descriptors[key].image);
                form_data_create_game.append('d_type', my_new_or_edited_game.game_descriptors[key].type);
                form_data_create_game.append('d_descriptor_question',  my_new_or_edited_game.game_images[key].description);
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
    console.log('FORM DATA:')
    for (let key of form_data_create_game.entries()) {
        console.log(key, form_data_create_game[key]);
    }
    console.log(form_data_create_game)
    return form_data_create_game
}

function save_game() {
    let form_data_create_game = make_form_data();
    if (form_data_create_game === undefined) {
        create_exception('somthing wand wnog fith formating of request', 10, 'warning')
        return false
    }else{
        console.log(form_data_create_game);
        const response = fetch('https://guess-who-online-game.herokuapp.com/upload_new_game', {
            method: 'POST',
            body: form_data_create_game
        }).catch(err => {
            create_exception('Something want wrong with saving', 10, 'danger');
            // delete_all_html_games();
        })
        const json  = response.json()
        if (json.data === undefined){
            create_exception('Game saved', 10, 'success');
            // delete_all_html_games();
        }
        else{
            create_exception(json.data, json.time_of_exception, json.type_of_exception);
            // delete_all_html_games();
        }
    }
}