let types_of_descriptors = [];
let definers_or_questions = [];
let definers_images = [];
let status_of_game_check_2 = undefined;

let id_of_descriptor = 0;
function add_descriptor(existing_img_src,path){
    let row = document.getElementById('images_of_the_game_descriptors').insertRow(1);
    row.className = 'row_for_descriptor';

    let cell1 = row.insertCell(0);
    cell1.className = 'wd50';
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);

    let label = document.createElement('LABEL');
    let input_file = document.createElement("INPUT");
    let image_for_description = document.createElement('IMG');

    input_file.setAttribute("type", 'file');
    input_file.setAttribute("id", 'descriptor_'+id_of_descriptor);

    input_file.setAttribute("class", 'descriptor_images_files');
    label.setAttribute("for", 'descriptor_'+id_of_descriptor);
    if (existing_img_src){
        if (existing_img_src.image !== ''){
            image_for_description.setAttribute("src", path+existing_img_src.type+'/'+existing_img_src.image);


        }else{
            image_for_description.setAttribute("src", './images/create_game.png');
        }
    }else{
        image_for_description.setAttribute("src", './images/create_game.png');
    }
    image_for_description.setAttribute("class", 'descriptor_images wd40 ht40');
    input_file.accept = ".png, .jpg, .jpeg, .gif";
    input_file.onchange = function (){
        check_file_img(input_file,image_for_description);
    }
    label.append(image_for_description);
    cell1.append(label,input_file);
    let input_text_type = document.createElement("INPUT");
    input_text_type.setAttribute("type", 'text');
    input_text_type.setAttribute("class", 'descriptor_types');
    if (existing_img_src){
        if (existing_img_src.type){
            input_text_type.value = existing_img_src.type;
        }
    }
    cell2.append(input_text_type);

    let input_text_description_question = document.createElement("INPUT");
    input_text_description_question.setAttribute("type", 'text');
    input_text_description_question.setAttribute("class", 'descriptor_definers_or_questions');
    if (existing_img_src){
        if (existing_img_src.description){
            input_text_description_question.value = existing_img_src.description;
        }
    }
    input_text_description_question.oninput = function () {
        if (row.className.includes(' bg-warning') ){
            row.className = row.className.replace(' bg-warning' ,'')
        }
        if (input_text_description_question.value.includes(',','?')){
            row.className += ' bg-warning'
            create_exception('not allowed character <span class="font-weight-bold">\"/,?|\'\</span>',5,'warning')
        }

    }
    cell3.append(input_text_description_question);
    let button = document.createElement('BUTTON');
    button.className = 'btn btn-default bg-danger text-light';
    button.innerHTML = 'delete';
    button.onclick = function (){
        row.remove();
    }
    cell4.append(button);

    id_of_descriptor ++;

}
function remove_all_check_2(){
    types_of_descriptors = [];
    definers_or_questions = [];
    definers_images = [];
    status_of_game_check_2 = undefined;
    id_of_descriptor = 0;

    let rows = document.getElementsByClassName('row_for_descriptor');
    while (rows.length > 0){
        rows[0].remove();
    }
}
function recreate_check_2(game,path){
    types_of_descriptors = [];
    definers_or_questions = [];
    definers_images = [];
    if (game.type === '0 0 1'){
        console.log('EDIT only STUDENTS')
        status_of_game_check_2 = 3;
    }else if(game.type === '1 1 1'){
        console.log('ALL')
        status_of_game_check_2 = 1;
    }else if(game.type === '1 0 1'){
        console.log('EDIT only STUDENTS / PC')
        status_of_game_check_2 = 2;
    }

    for (let existing_descriptor = 0 ; existing_descriptor < game.game_descriptors.length ; existing_descriptor++){
        add_descriptor(game.game_descriptors[existing_descriptor],path)
        types_of_descriptors.push(game.game_descriptors[existing_descriptor].type);
        definers_or_questions.push(game.game_descriptors[existing_descriptor].description);
        if (game.game_descriptors[existing_descriptor].image === ''){
            let blob = new File([undefined],"images|create_game.png");
            definers_images.push(blob);
        }else{
            let blob = new File([undefined],game.game_descriptors[existing_descriptor].type+"|"+game.game_descriptors[existing_descriptor].image);
            definers_images.push(blob);
        }
    }
    recreate_check_3(game,path+'images/');

}


function check_box_2(){
    if (status_of_game_check_1 === false){
        create_exception('Please check in this section <button class="btn btn-default bg-success text-light"  onclick="display(\'check_1\')">main</button>',10,'warning')
        return
    }

    console.log("chcek 2");

    types_of_descriptors = [];
    definers_or_questions = [];
    definers_images = [];
    let errors = []
    let error_same_descriptor_values = []
    let error_same_images = []
    let descriptor_img_names = []
    let errors_by_illegal_characters = []
    // all const will  be same length
    const elements_types_of_descriptors = document.getElementsByClassName('descriptor_types');
    const elements_definers_or_questions = document.getElementsByClassName('descriptor_definers_or_questions');
    const elements_descriptor_images_file = document.getElementsByClassName('descriptor_images_files');
    const elements_descriptor_images = document.getElementsByClassName('descriptor_images');
    let row_for_descriptor = document.getElementsByClassName('row_for_descriptor');
    let founded = false;
    for (let row_index = 0; row_index < elements_definers_or_questions.length; row_index++) {
        if (elements_definers_or_questions[row_index].value.includes(',','?')){
            row_for_descriptor[row_index].className += ' bg-warning'
            founded = true;
            create_exception('not allowed character <span class="font-weight-bold">\"/,?|\'\</span>',5,'warning')
        }
    }
    if (founded){
        return ;
    }
    let ok_for_kids = false;
    let ok_for_pc = false;
    for (let index = 0 ;index < elements_types_of_descriptors.length; index++){

        if (elements_descriptor_images_file[index].files[0] !== undefined){
            let img_file_name = elements_descriptor_images_file[index].files[0].name;
            if (descriptor_img_names.includes(img_file_name)){
                error_same_images.push([row_for_descriptor[descriptor_img_names.indexOf(img_file_name)],row_for_descriptor[index]]);
            }
            descriptor_img_names.push(img_file_name)
        }else{
            let img_src_name = decodeURI(elements_descriptor_images[index].src.split('/').pop());
            if (descriptor_img_names.includes(img_src_name)){
                error_same_images.push([row_for_descriptor[descriptor_img_names.indexOf(img_src_name)],row_for_descriptor[index]]);
            }
            descriptor_img_names.push(img_src_name)
        }
        if (definers_or_questions.includes(elements_definers_or_questions[index].value)){
            error_same_descriptor_values.push([row_for_descriptor[definers_or_questions.indexOf(elements_definers_or_questions[index].value)],row_for_descriptor[index]]);
        }
        if (check_for_illegal_characters(elements_types_of_descriptors[index].value)){
            errors_by_illegal_characters.push(row_for_descriptor[index]);
        }else{
            types_of_descriptors.push(elements_types_of_descriptors[index].value);
        }
        definers_or_questions.push(elements_definers_or_questions[index].value);
        if (elements_descriptor_images_file[index].files[0]){
            definers_images.push(elements_descriptor_images_file[index].files[0]);
        }else{
            let adress = elements_descriptor_images[index].src.split('/')
            let name = adress.pop()
            let type = adress.pop()
            let blob = new File([undefined],type+"|"+decodeURI(name))
            // console.log(blob.name)
            definers_images.push(blob);
        }

        if (elements_types_of_descriptors[index].value !== '' &&
            elements_definers_or_questions[index].value !== '' &&
            elements_descriptor_images_file[index].files[0] === undefined
            && elements_descriptor_images[index].src.includes('create_game.png')){/// NOVO PRIDANE
            console.log("OK for pc");
            ok_for_pc = true;
        }else if (elements_types_of_descriptors[index].value !== '' &&
            elements_definers_or_questions[index].value !== '' &&
            (elements_descriptor_images_file[index].files[0] !== undefined || elements_descriptor_images[index].src.includes('create_game.png') === false)){ /// NOVO PRIDANE
            console.log("OK for KID");
            ok_for_kids = true;
        }else{
            errors.push(row_for_descriptor[index]);
        }
        if (row_for_descriptor[index].className.includes(' bg-warning')){
            row_for_descriptor[index].className = row_for_descriptor[index].className.replace(' bg-warning','');
        }
    }
    // error handeling
    if (ok_for_pc !== false && ok_for_kids !== false){
        create_exception('No atomic game plese read instructions above check 2 button',20,'warning');
        status_of_game_check_2 = undefined;
        return
    }
    if (errors.length > 0){
        for (let index_row = 0 ;index_row < errors.length;index_row++){
            errors[index_row].className += ' bg-warning';
        }
        create_exception('Missing fileds in table above check 2 button',20,'warning');
        status_of_game_check_2 = undefined;
        return
    }
    if (errors_by_illegal_characters.length > 0){
        for (let index_row = 0 ;index_row < errors_by_illegal_characters.length;index_row++){
            errors_by_illegal_characters[index_row].className += ' bg-warning';
        }
        create_exception(`illegal characters description type <strong>${illegal_characters.join(' ')}</strong>`,20,'warning');
        status_of_game_check_2 = undefined;
        return
    }

    if (error_same_images.length > 0 && ok_for_pc === false){
        for (let index_row = 0 ;index_row < error_same_images.length;index_row++){
            error_same_images[index_row][0].className += ' bg-warning';
            error_same_images[index_row][1].className += ' bg-warning';
        }
        create_exception('Same descriptor images are not allowed',20,'warning');
        status_of_game_check_2 = undefined;
        return
    }
    if (error_same_descriptor_values.length > 0 ){
        for (let index_row = 0 ;index_row < error_same_descriptor_values.length;index_row++){
            error_same_descriptor_values[index_row][0].className += ' bg-warning';
            error_same_descriptor_values[index_row][1].className += ' bg-warning';
        }
        create_exception('Same descriptor values',20,'warning');
        status_of_game_check_2 = undefined;
        return
    }
    // Finding out witch tipe of aplication is this game
    if (types_of_descriptors.length === definers_or_questions.length && definers_images.length === definers_or_questions.length && definers_images.length === 0){
        console.log("ONLY FOR STUDENTS");

        create_exception("ONLY FOR STUDENTS",5,'success');
        status_of_game_check_2 = 3;
        change_allow_button_primary_success('main_button_allow_check2');
        change_allow_button_danger_primary('main_button_allow_check3');
        hide_all_divs();
    }
    if (ok_for_pc ){
        console.log("ONLY FOR PC and STUDENTS");

        create_exception("ONLY FOR PC and STUDENTS",5,'success');
        status_of_game_check_2 = 2;
        change_allow_button_primary_success('main_button_allow_check2');
        change_allow_button_danger_primary('main_button_allow_check3');
        hide_all_divs();
    }
    if (ok_for_kids){
        console.log("FOR ALL TYPES PC/KID/STUDENT");

        create_exception("FOR ALL TYPES PC/KID/STUDENT",5,'success');
        status_of_game_check_2 = 1;
        change_allow_button_primary_success('main_button_allow_check2');
        change_allow_button_danger_primary('main_button_allow_check3');
        hide_all_divs();
    }

    automatic_config_setter();

}