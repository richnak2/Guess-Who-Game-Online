let atomicity = [];
function show_same_automatic_descriptor(){
    hide_all_divs();
    display('check_3');
    if (atomicity.length === 1 ){

    }else{
        atomicity.forEach(elem => {
            console.log(elem)
            elem.className += ' bg-warning';
        });
    }
}
function make_atomicity_percentage_counter(atom_elem,class_atom_elem){
    if (status_of_game_check_2 === 3){
        atom_elem.innerHTML = 'Only if game is for Pc / kids the % will be displayed ';
        for (let index_elem = 0; index_elem < class_atom_elem.length; index_elem++) {
            class_atom_elem[index_elem].style.display = 'none';
        }
        atomicity = [];
    }else{
        for (let index_elem = 0; index_elem < class_atom_elem.length; index_elem++) {
            class_atom_elem[index_elem].style.display = 'revert';
        }
        let input_game_images_images = document.getElementsByClassName('game_images_images');
        let row_of_game_of_images = document.getElementsByClassName('row_for_images');
        atomicity = [];
        let worst_case = []
        let counter = 0;
        let index = 0 ;
        game_auto_descriptors.forEach(text => {
            worst_case = []
            counter = 0
            index = 0
            game_auto_descriptors.forEach(text_for_compare => {

                if (text === text_for_compare){
                    // console.log(text,text_for_compare)
                    counter++
                    worst_case.push(row_of_game_of_images[index]);
                }
                index++
            });
            if (worst_case.length > atomicity.length){
                atomicity = worst_case
            }
        });
        let final_counter = (atomicity.length === 1 ) ? 0 : atomicity.length;
        atom_elem.innerHTML = (final_counter/input_game_images_images.length)*100+'%';
    }

}
function create_status(){
    let elem_type_html = document.getElementById('game_is_for');
    let elem_state_html = document.getElementById('game_state');
    let elem_atomicity_html = document.getElementById('game_atomicity');
    let class_elem_atom_html = document.getElementsByClassName('atom');
    make_atomicity_percentage_counter(elem_atomicity_html,class_elem_atom_html);

    if (status_of_game_check_2 === 3){
        elem_type_html.innerHTML = 'Student';
    }else if(status_of_game_check_2 === 1){
        elem_type_html.innerHTML = 'Student / Pc / kids';
    }else if(status_of_game_check_2 === 2){
        elem_type_html.innerHTML = 'Student / Pc ';
    }else{
        create_exception('something want wrong consider clicking on all of check buttons ')
    }
    if (game_images_files.length >= 25){
        elem_state_html.innerHTML = 'created';
    }else{
        elem_state_html.innerHTML = 'in development (you need at least 25 images)';
    }


}