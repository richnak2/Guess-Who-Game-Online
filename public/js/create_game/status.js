function create_status(){
    let elem_type_html = document.getElementById('game_is_for');
    let elem_state_html = document.getElementById('game_state');
    let elem_atomicity_html = document.getElementById('game_atomicity');
    let elem_percentage_html = document.getElementById('percentage');



    const result_status =  check_define_images()
    if (result_status[0] >= 25){
        elem_state_html.innerHTML = 'created';
    }else{
        elem_state_html.innerHTML = 'in development (you need at least 25 images)';
    }
    if (my_new_or_edited_game.type === '0 0 1'){
        elem_type_html.innerHTML = 'For : Student | None attribute type';
        elem_atomicity_html.innerHTML = 'Your targeted group does not have attributes. ';
        elem_percentage_html.style.display = 'none'
    }else if(my_new_or_edited_game.type === '1 1 1'){
        elem_type_html.innerHTML = 'For : Student / Pc / kids | Image attribute type';
        elem_atomicity_html.innerHTML = (result_status[1]/result_status[0])*100+'%';
        elem_percentage_html.style.display = 'revert'
    }else if(my_new_or_edited_game.type === '1 0 1'){
        elem_type_html.innerHTML = 'For : Student / Pc | Question attribute type';
        elem_atomicity_html.innerHTML = (result_status[1]/result_status[0])*100+'%';
        elem_percentage_html.style.display = 'revert'
    }else{
        create_exception('something want wrong consider clicking on all of check buttons ')
    }
}