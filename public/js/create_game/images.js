const all_guess_img_html = document.getElementById('all_guess_img')
let counter_of_img = 0
function create_card_guessed(objet){
    const index_of_img = counter_of_img
    counter_of_img ++

    let div_card_guess = document.createElement('div');
    div_card_guess.className = 'card btn-light no_btn card_img mb10'
    div_card_guess.id = `card_guess_${index_of_img}`
    let div_card_guess_center_btn = document.createElement('div');
    div_card_guess_center_btn.className = "text-center"


    let label = document.createElement('LABEL');
    let input_file = document.createElement("INPUT");
    let image_for_guess = document.createElement('IMG');

    input_file.setAttribute("type", 'file');
    input_file.setAttribute("id", 'guessed_img_file_input_label'+index_of_img);

    input_file.accept = ".png, .jpg, .jpeg, .gif";
    label.setAttribute("for", 'guessed_img_file_input_label'+index_of_img);
    if (objet.id === undefined){
        check_file_multiple(objet,image_for_guess)
    }else{
        image_for_guess.setAttribute("src", `./images/${my_new_or_edited_game.origin_title}/images/${objet.image.name}`);
    }
    image_for_guess.setAttribute("class", 'wd80 ht80 mt10 ml10');
    image_for_guess.setAttribute("id", 'guessed_img_'+index_of_img);
    input_file.style.visibility = 'hidden';
    input_file.style.display = 'none';
    input_file.onchange = function (){
        replace_image_guess(index_of_img,input_file.files[0]);
        check_file_multiple(input_file.files[0],image_for_guess)
    }
    label.append(image_for_guess);

    let buttons_delete_guess_img = document.createElement('BUTTON');
    buttons_delete_guess_img.className = 'btn btn-default bg-danger mb10 ml5 text-light'
    buttons_delete_guess_img.innerHTML = 'delete'
    buttons_delete_guess_img.onclick = function (){
        delete_image_guess(index_of_img)
    }
    div_card_guess_center_btn.append(buttons_delete_guess_img)
    div_card_guess.append(label,input_file, div_card_guess_center_btn)
    all_guess_img_html.append(div_card_guess);
}

function delete_image_guess(index) {
    delete my_new_or_edited_game.game_images[index]
    document.getElementById(`card_guess_${index}`).remove()
}

function replace_image_guess(index , file){
    my_new_or_edited_game.game_images[index] = {'image' : file,'description_control':''}
}

function recreate_images(path){
    for (let key in my_new_or_edited_game.game_images) {

        my_new_or_edited_game.game_images[key].image = new File([undefined], decodeURI(my_new_or_edited_game.game_images[key].image))
        create_card_guessed(my_new_or_edited_game.game_images[key])
    }
    recreate_attributes(path)
}

function add_more_guess_images(){
    document.getElementById('more_files_guess_image').click();
}

function save_more_guess_img_files(elem){
    for(let i  = 0 ; i < elem.files.length; i++){
        my_new_or_edited_game.game_images[counter_of_img] = {'image' : elem.files[i],'description_control':''}
        create_card_guessed(elem.files[i])
    }
}

function check_images(switch_page){
    for (let key1 in my_new_or_edited_game.game_images) {
        for (let key2 in my_new_or_edited_game.game_images) {
            if (key1 !== key2) {
                if (my_new_or_edited_game.game_images[key1].image.name === my_new_or_edited_game.game_images[key2].image.name) {
                    document.getElementById(`card_guess_${key1}`).className = 'card bg-warning no_btn card_img mb10'
                    document.getElementById(`card_guess_${key2}`).className = 'card bg-warning no_btn card_img mb10'
                    create_exception('Same game images are not allowed',20,'warning');
                    config_divs_html.attributes = false
                    config_divs_html.save = false
                    display('images')
                    my_new_or_edited_game.show_user_interface(config_divs_html.main,config_divs_html.images,config_divs_html.attributes,config_divs_html.define_images,false,true,'revert')
                    return false

                }else{
                    document.getElementById(`card_guess_${key1}`).className = 'card btn-light no_btn card_img mb10'
                    document.getElementById(`card_guess_${key2}`).className = 'card btn-light no_btn card_img mb10'
                }
            }
        }
    }
    config_divs_html.attributes = true
    config_divs_html.save = true
    my_new_or_edited_game.show_user_interface(config_divs_html.main,config_divs_html.images,config_divs_html.attributes,config_divs_html.define_images,undefined,true,'revert')
    if (my_new_or_edited_game.type !== '0 0 1' && switch_page ){
        display('attributes')
    }
    return true
}

function delete_all_images(){
    counter_of_img = 0
    let card_images = document.getElementsByClassName('card_img');
    while (card_images.length > 0){
        card_images[0].remove();
    }
    delete_all_attributes()
}