let id_of_descriptor = 0;

function add_next_row(display){
    my_new_or_edited_game.game_descriptors[id_of_descriptor] = {'image' : new File([undefined],"images|create_game.png"),'description':'','type':''}
    add_attribute(display,my_new_or_edited_game.game_descriptors[id_of_descriptor])
}

function add_attribute(display,object_attribute){
    const index_of_attribute = id_of_descriptor;
    id_of_descriptor ++
    let row = document.getElementById('images_of_the_game_descriptors').insertRow();
    row.className = 'row_for_descriptor';
    row.id = `row_attribute_${index_of_attribute}`

    let cell1 = row.insertCell(0);
    cell1.className = 'wd50';
    cell1.style.display = display
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);

    let label = document.createElement('LABEL');
    let input_file = document.createElement("INPUT");
    let image_for_description = document.createElement('IMG');

    input_file.setAttribute("type", 'file');
    input_file.setAttribute("id", 'descriptor_'+index_of_attribute);

    input_file.setAttribute("class", 'descriptor_images_files');
    label.setAttribute("for", 'descriptor_'+index_of_attribute);
    if (object_attribute.id  === undefined){
        check_file_multiple(object_attribute.image,image_for_description)
    }else{
        // if (object_attribute.image !== undefined){
        image_for_description.setAttribute("src", `./images/${decodeURI(my_new_or_edited_game.origin_title)}/${decodeURI(object_attribute.image.name.replace('|','/'))}`) ;
        // }
    }
    image_for_description.setAttribute("class", 'descriptor_images wd40 ht40');
    input_file.accept = ".png, .jpg, .jpeg, .gif";
    input_file.onchange = function (){
        replace_image_attribute(index_of_attribute,input_file.files[0]);
        check_file_multiple(input_file.files[0],image_for_description);
    }
    label.append(image_for_description);
    cell1.append(label,input_file);
    let input_text_type = document.createElement("INPUT");
    input_text_type.setAttribute("type", 'text');
    input_text_type.setAttribute("class", 'descriptor_types');
    input_text_type.maxLength = '15';
    input_text_type.value = object_attribute.type;
    input_text_type.oninput = function () {
        object_attribute.type = input_text_type.value
        if (row.className.includes(' bg-warning') ){
            row.className = row.className.replace(' bg-warning' ,'')
        }
        illegal_characters.forEach(illegal =>{
            if (input_text_type.value.includes(illegal)){
                row.className += ' bg-warning'
                create_exception('not allowed character <span class="font-weight-bold">\"/,?|\'\</span>',5,'warning')
            }
        })
    }

    cell2.append(input_text_type);

    let input_text_description_question = document.createElement("INPUT");
    input_text_description_question.setAttribute("type", 'text');
    input_text_description_question.setAttribute("class", 'descriptor_definers_or_questions');
    input_text_description_question.maxLength = '50';
    input_text_description_question.value = object_attribute.description;
    input_text_description_question.oninput = function () {
        object_attribute.description = input_text_description_question.value
        if (row.className.includes(' bg-warning') ){
            row.className = row.className.replace(' bg-warning' ,'')

        }
        illegal_characters.forEach(illegal =>{
            if (input_text_description_question.value.includes(illegal)){
                row.className += ' bg-warning'
                create_exception('not allowed character <span class="font-weight-bold">\"/,?|\'\</span>',5,'warning')
            }
        })
    }
    cell3.append(input_text_description_question);
    let button = document.createElement('BUTTON');
    button.className = 'btn btn-default bg-danger text-light';
    button.innerHTML = 'delete';
    button.onclick = function (){
        delete my_new_or_edited_game.game_descriptors[index_of_attribute]
        row.remove();
    }
    cell4.append(button);
}

function save_more_attribute_files(elem){
    for(let i  = 0 ; i < elem.files.length; i++){
        my_new_or_edited_game.game_descriptors[id_of_descriptor] = {'image' : elem.files[i],'description':'','type':''}
        add_attribute('revert',my_new_or_edited_game.game_descriptors[id_of_descriptor])
    }
}
function add_more_attribute_images(){
    document.getElementById('more_files_attribute_image').click();
}

function recreate_attributes(path){
    for (let key in my_new_or_edited_game.game_descriptors) {
        let display = my_new_or_edited_game.type === '1 1 1' ? 'revert':'none'
        if (display === "revert"){
            my_new_or_edited_game.game_descriptors[key].image = new File([undefined],decodeURI(my_new_or_edited_game.game_descriptors[key].type)+"|"+decodeURI(my_new_or_edited_game.game_descriptors[key].image))
        }else{
            my_new_or_edited_game.game_descriptors[key].image = new File([undefined],"images|create_game.png")
        }add_attribute(display,my_new_or_edited_game.game_descriptors[key])
    }
    create_define_image(path)
}
function replace_image_attribute(index,file){

    my_new_or_edited_game.game_descriptors[index] = {'image' : file,'description':'','type':''}
}

function delete_all_attributes(){
    id_of_descriptor = 0;
    let rows = document.getElementsByClassName('row_for_descriptor');
    while (rows.length > 0){
        rows[0].remove();
    }
    delete_all_define_images()
}

function check_attributes(switch_page){
    console.log(my_new_or_edited_game.game_descriptors)
    let error = false
    for (let key1 in my_new_or_edited_game.game_descriptors) {
        for (let key2 in my_new_or_edited_game.game_descriptors) {
            if (key1 !== key2) {
                if (my_new_or_edited_game.game_descriptors[key1].image.name === my_new_or_edited_game.game_descriptors[key2].image.name && my_new_or_edited_game.type !== '1 0 1') {
                    document.getElementById(`row_attribute_${key1}`).className += ' bg-warning'
                    document.getElementById(`row_attribute_${key2}`).className += ' bg-warning'
                    error = true
                    create_exception('Same game images are not allowed',20,'warning');
                }else{
                    document.getElementById(`row_attribute_${key1}`).className =  document.getElementById(`row_attribute_${key1}`).className.replace(' bg-warning','')
                    document.getElementById(`row_attribute_${key2}`).className = document.getElementById(`row_attribute_${key1}`).className.replace(' bg-warning','')
                }
                if (my_new_or_edited_game.game_descriptors[key1].description === my_new_or_edited_game.game_descriptors[key2].description  ){
                    document.getElementById(`row_attribute_${key1}`).className += ' bg-warning'
                    document.getElementById(`row_attribute_${key2}`).className += ' bg-warning'
                    error = true
                    create_exception('You must set unique <strong>value/question</strong> for each row',20,'warning');
                }
            }
        }
        if (my_new_or_edited_game.game_descriptors[key1].description === '' || my_new_or_edited_game.game_descriptors[key1].type === ''){
            document.getElementById(`row_attribute_${key1}`).className += ' bg-warning'
            error = true
            create_exception('You must set <strong>attribute</strong> <strong>value/question</strong>',20,'warning');
        }
    }
    if (error){
        config_divs_html.define_images = false
        config_divs_html.save = false
        my_new_or_edited_game.show_user_interface(config_divs_html.main,config_divs_html.images,config_divs_html.attributes,config_divs_html.define_images,false,true,'revert')
        display('attributes')
        return false
    }
    config_divs_html.define_images = true
    config_divs_html.save = true
    my_new_or_edited_game.show_user_interface(config_divs_html.main,config_divs_html.images,config_divs_html.attributes,config_divs_html.define_images,undefined,true,'revert')
    if (switch_page){
        display('define_images')
    }
    return true
}
