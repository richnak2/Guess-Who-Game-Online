const images_define_images_html = document.getElementById('images_define_images')
const attributes_define_images_html = document.getElementById('attributes_define_images')
let see_certain = undefined
let active_unique = false
function create_define_image(){
    delete_all_define_images()
    add_images_to_images_define_images_html()
    add_attributes_to_attributes_define_images_html()
}

function add_images_to_images_define_images_html(){
    for (let key in my_new_or_edited_game.game_images) {

        let div_card_guess = document.createElement('div');
        div_card_guess.className = 'card btn-light card_img_definer create_game mt10'
        div_card_guess.id = `card_img_definer_${key}`

        let image_define = document.createElement('IMG');
        image_define.setAttribute("class", 'wd80 ht80 mt5 mb5 mr5 ml5');

        if (my_new_or_edited_game.game_images[key].id === undefined){
            check_file_multiple(my_new_or_edited_game.game_images[key].image,image_define)
        }else{
            image_define.setAttribute("src", `./images/${my_new_or_edited_game.origin_title}/images/${my_new_or_edited_game.game_images[key].image.name}`);
        }


        div_card_guess.append(image_define)
        div_card_guess.onclick = () => {
            if (see_certain){
                see_certain = undefined
                let card_image_div = document.getElementsByClassName('card_img_definer')
                for (let index_card = 0; index_card < card_image_div.length; index_card++) {
                    card_image_div[index_card].className = card_image_div[index_card].className.replace(' bg-success', '')
                }
                div_card_guess.className = div_card_guess.className .replace(' bg-success' , '')
                // odstran howerri
                let attributes_p_tag = document.getElementsByClassName('certain_attributes')
                for (let index_p = 0; index_p < attributes_p_tag.length; index_p++) {
                    attributes_p_tag[index_p].className = attributes_p_tag[index_p].className.replace(' bg-success', '')
                }
            }else{
                see_certain = my_new_or_edited_game.game_images[key]
                div_card_guess.className += ' bg-success'
                let attributes_p_tag = document.getElementsByClassName('certain_attributes')
                for (let index_p = 0; index_p < attributes_p_tag.length; index_p++) {
                    attributes_p_tag[index_p].className = attributes_p_tag[index_p].className.replace(' bg-success', '')
                }
                let show_attributes_witch_belongs_to_image =  my_new_or_edited_game.game_images[key].description_control.split(',')
                show_attributes_witch_belongs_to_image.forEach(id_attribute =>{
                    if (id_attribute !== ''){
                        document.getElementById(id_attribute).className += ' bg-success'
                    }
                })

            }
        }
        div_card_guess.onmouseenter = () => {
            if (see_certain === undefined){
                let show_attributes_witch_belongs_to_image =  my_new_or_edited_game.game_images[key].description_control.split(',')
                show_attributes_witch_belongs_to_image.forEach(id_attribute =>{
                    console.log(id_attribute)
                    if (id_attribute !== '' && document.getElementById(id_attribute) !== null){
                        document.getElementById(id_attribute).className += ' bg-success'
                    }
                })
            }
        }
        div_card_guess.onmouseleave = () => {
            if (see_certain === undefined){
                // odstran howerri
                let attributes_p_tag = document.getElementsByClassName('certain_attributes')
                for (let index_p = 0; index_p < attributes_p_tag.length; index_p++) {
                    attributes_p_tag[index_p].className = attributes_p_tag[index_p].className.replace(' bg-success', '')
                }
            }
        }
        images_define_images_html.append(div_card_guess);
    }
}

function add_attributes_to_attributes_define_images_html(){
    let json_of_keys = {}
    for (let key in my_new_or_edited_game.game_descriptors) {
        if(json_of_keys.hasOwnProperty(my_new_or_edited_game.game_descriptors[key].type)){
            json_of_keys[my_new_or_edited_game.game_descriptors[key].type].push(my_new_or_edited_game.game_descriptors[key].description)
        }else{
            json_of_keys[my_new_or_edited_game.game_descriptors[key].type] = []
            json_of_keys[my_new_or_edited_game.game_descriptors[key].type].push(my_new_or_edited_game.game_descriptors[key].description)
        }
    }

    let json_of_certain_attributes_html = {}
    for (let key in json_of_keys) {
        let certain_div_for_define_attribute = document.createElement('div');
        certain_div_for_define_attribute.className = "justify-content-center certain_attribute_type"
        let tag_p_for_define_attribute = document.createElement('p');
        tag_p_for_define_attribute.className = "automatic_descriptors_titles text-center mb0 text-light bg-primary"
        tag_p_for_define_attribute.innerHTML = key
        certain_div_for_define_attribute.append(tag_p_for_define_attribute)
        json_of_certain_attributes_html[key] = certain_div_for_define_attribute
    }
    for (let key in my_new_or_edited_game.game_descriptors) {
        if (my_new_or_edited_game.game_descriptors[key].image.name.includes('images|create_game.png')){
            let text_define_attribute = document.createElement('p');
            text_define_attribute.innerHTML = my_new_or_edited_game.game_descriptors[key].description
            text_define_attribute.className = "automatic_descriptors_titles text-center mb0 certain_attributes"
            text_define_attribute.id = my_new_or_edited_game.game_descriptors[key].description
            text_define_attribute.onclick = () => {
                if (see_certain){
                    if (text_define_attribute.className.includes(' bg-success')){
                        text_define_attribute.className = text_define_attribute.className.replace(' bg-success', '')
                        see_certain.description_control = see_certain.description_control.replace(my_new_or_edited_game.game_descriptors[key].description+',','')
                    }else {
                        text_define_attribute.className += ' bg-success'
                        see_certain.description_control += my_new_or_edited_game.game_descriptors[key].description+','
                    }

                }
            }
            json_of_certain_attributes_html[my_new_or_edited_game.game_descriptors[key].type].append(text_define_attribute)

        }else{
            let div_card_attribute = document.createElement('div');
            div_card_attribute.className = 'card btn-light no_btn card_img_definer create_game mt10 certain_attributes'
            div_card_attribute.id = my_new_or_edited_game.game_descriptors[key].description
            let image_define = document.createElement('IMG')
            if (my_new_or_edited_game.game_descriptors[key].id === undefined){
                check_file_multiple(my_new_or_edited_game.game_descriptors[key].image,image_define)
            }else{

                image_define.setAttribute("src", `./images/${decodeURI(my_new_or_edited_game.origin_title)}/${decodeURI(my_new_or_edited_game.game_descriptors[key].image.name.replace('|','/'))}`) ;
            }
            image_define.setAttribute("class", 'wd80 ht80 mt5 mb5 mr5 ml5')
            div_card_attribute.append(image_define)
            div_card_attribute.onclick = () => {
                if (see_certain){
                    if (div_card_attribute.className.includes(' bg-success')){
                        div_card_attribute.className = div_card_attribute.className.replace(' bg-success', '')
                        see_certain.description_control = see_certain.description_control.replace(my_new_or_edited_game.game_descriptors[key].description+',','')
                    }else {
                        div_card_attribute.className += ' bg-success'
                        see_certain.description_control += my_new_or_edited_game.game_descriptors[key].description+','
                    }

                }
            }
            json_of_certain_attributes_html[my_new_or_edited_game.game_descriptors[key].type].append(div_card_attribute)
        }
    }

    for (let key in json_of_certain_attributes_html) {
        attributes_define_images_html.append(json_of_certain_attributes_html[key])
    }
}

function check_define_images(){
    let counter = [0,0]
    let same = {};
    for (let key1 in my_new_or_edited_game.game_images) {
        for (let key2 in my_new_or_edited_game.game_images) {
            if (key1 !== key2){
                if (my_new_or_edited_game.game_images[key1].description_control === my_new_or_edited_game.game_images[key2].description_control){
                    counter[1] += 1
                    if (same[my_new_or_edited_game.game_images[key1].description_control] === undefined){
                        same[my_new_or_edited_game.game_images[key1].description_control] = []
                        same[my_new_or_edited_game.game_images[key1].description_control].push(key1)
                        same[my_new_or_edited_game.game_images[key1].description_control].push(key2)
                    }else{
                        same[my_new_or_edited_game.game_images[key1].description_control].includes(key1) ? null : same[my_new_or_edited_game.game_images[key1].description_control].push(key1)
                        same[my_new_or_edited_game.game_images[key1].description_control].includes(key1) ? null : same[my_new_or_edited_game.game_images[key1].description_control].push(key2)
                    }

                }
            }
        }
        counter[0] += 1
    }
    active_unique = !active_unique

    if (active_unique){
        for (let same_d in same) {
            let bg_color = getRandomColor()
            for (let index = 0 ;index <  same[same_d].length;index++){
            for (let same_key in same[same_d]) {
                document.getElementById(`card_img_definer_${same[same_d][index]}`).style.backgroundColor = bg_color
                }
            }
        }
    }else{
        for (let same_d in same) {
            for (let index = 0 ;index <  same[same_d].length;index++)
                for (let same_key in same[same_d]) {
                    document.getElementById(`card_img_definer_${same[same_d][index]}`).style.backgroundColor = "";
                }
        }
    }

    return counter
}

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function delete_all_define_images(){
    let attributes = document.getElementsByClassName('certain_attribute_type')
    while (attributes.length > 0){
        attributes[0].remove()
    }

    let images = document.getElementsByClassName('card_img_definer')
    while (images.length > 0){
        images[0].remove()
    }
}