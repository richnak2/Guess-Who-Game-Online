const localStorage = window.localStorage;
let colors = {
    'body_bg_color_def': "#ffffff",
    'card_bg_color_def': "#f8f9fa",
    'button_color_def': "#007bff",
    'text_black_color_def': "#000000",
    'body_bg_color': "#ffffff",
    'card_bg_color': "#f8f9fa",
    'button_color': "#007bff",
    'text_black_color': "#000000"
}

function show_settings(){
    let elem = document.getElementById('centered');
    if (elem.style.display === 'revert'){
        elem.style.display = 'none'
        document.getElementById('centered_centered').style.display = 'none'
    }else{
        elem.style.display = 'revert'
        document.getElementById('centered_centered').style.display = 'revert'
    }
}

function pre_make_colors_them(){
    if (localStorage.getItem('colors')){
        let st_jason_colors = JSON.parse(localStorage.getItem('colors'));
        let el = document.getElementsByClassName('hidden');
        el[0].value = st_jason_colors.body_bg_color;
        el[1].value = st_jason_colors.card_bg_color;
        el[2].value = st_jason_colors.button_color;
        el[3].value = st_jason_colors.text_black_color;
        colors.body_bg_color = st_jason_colors.body_bg_color;
        colors.card_bg_color = st_jason_colors.card_bg_color;
        colors.button_color = st_jason_colors.button_color;
        colors.text_black_color = st_jason_colors.text_black_color;
    }else{
        localStorage.setItem('colors',JSON.stringify(colors));
        let el = document.getElementsByClassName('hidden');
        el[0].value = colors.body_bg_color_def;
        el[1].value = colors.card_bg_color_def;
        el[2].value = colors.button_color_def;
        el[3].value = colors.text_black_color_def;
    }
    apply_color_them();
}
function set_colors_them(witch_elem, targeted_elements){
    colors[targeted_elements] = witch_elem.value;
}
function apply_color_them(){
    let el = document.getElementsByClassName('hidden');
    el[0].value = colors.body_bg_color;
    el[1].value = colors.card_bg_color;
    el[2].value = colors.button_color;
    el[3].value = colors.text_black_color;
    let body = document.getElementsByTagName("BODY")[0];
    body.style.backgroundColor = colors.body_bg_color;

    let all_btn_elem = document.getElementsByClassName('btn-primary');
    for (let index = 0; index < all_btn_elem.length; index++) {
        all_btn_elem[index].style.backgroundColor = colors.button_color;
        all_btn_elem[index].style.borderColor = colors.button_color;
        if (all_btn_elem[index].className.includes('no_btn') === false){
            all_btn_elem[index].onmouseover = function (){
                all_btn_elem[index].style.filter = 'brightness(90%)';
            }
            all_btn_elem[index].onmouseleave = function (){
                all_btn_elem[index].style.filter = 'brightness(100%)';
            }
        }
    }
    let all_light_elem = document.getElementsByClassName('btn-light');
    for (let index = 0; index < all_light_elem.length; index++) {
        if (all_light_elem[index].className.includes('no_btn') === false){
            all_light_elem[index].onmouseover = function (){
                all_light_elem[index].style.filter = 'brightness(90%)';
            }
            all_light_elem[index].onmouseleave = function (){
                all_light_elem[index].style.filter = 'brightness(100%)';
            }
        }
        if (all_light_elem[index].className.includes('create_game') === false) {
            all_light_elem[index].style.background = colors.card_bg_color;
        }
    }
    let all_text_black_elem = document.getElementsByClassName('text_black');
    for (let index = 0; index < all_text_black_elem.length; index++) {
        all_text_black_elem[index].style.color = colors.text_black_color;
    }

}
function change_colors_them(){
    localStorage.setItem('colors',JSON.stringify(colors));
    apply_color_them()
    show_settings()
}
function restart_color_them(){
    colors.body_bg_color = colors.body_bg_color_def;
    colors.card_bg_color = colors.card_bg_color_def;
    colors.button_color = colors.button_color_def;
    colors.text_black_color = colors.text_black_color_def;
    localStorage.setItem('colors',JSON.stringify(colors));
    apply_color_them()
    show_settings()
}