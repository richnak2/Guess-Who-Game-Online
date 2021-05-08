// let row_index = 0;
// let status_of_game_check_3 = undefined;
// let game_images_files = [];
// let game_auto_descriptors = [];
// let game_question_descriptor = [];
//
// function add_more_guess_images(){
//     document.getElementById('more_files_guess_image').click();
// }
// function save_more_files(elem){
//     console.log('save_more_files', elem.files)
//     let first_index =  add_row_image_to_game();
//     for (let index_file_new = 0; index_file_new < elem.files.length; index_file_new++) {
//         let index = add_row_image_to_game()
//         check_file_multiple(elem.files[index_file_new],document.getElementById('descriptor_file'+index) )
//         replace_at_index(index,elem.files[index_file_new])
//
//     }
//
//
//
//
//     // BECOUSE OF HTML ANOMALI OF FILES
//     remove_item_form_array_files(first_index);
//     document.getElementById(first_index).remove();
//     remake_indexes_because_of_anomaly();
//     remove_all_titles();
//     sort_auto_descriptors();
//     make_titles_for_automatic_descriptors();
// }
//
//
// function remove_item_form_array_files(index) {
//     for (let file_index = 0; file_index < game_images_files.length; file_index++) {
//         if (game_images_files[file_index][0] === index){
//             game_images_files[file_index][1] = 'removed';
//         }
//     }
// }
// function replace_at_index(index,file){
//     for (let file_index = 0; file_index < game_images_files.length; file_index++) {
//         if (game_images_files[file_index][0] === index){
//             game_images_files[file_index][1] = file;
//         }
//     }
// }
// function remake_indexes_because_of_anomaly(){
//     let all_rows_for_images = document.getElementsByClassName('row_counter_for_game_images');
//     // console.log(all_rows_for_images.length);
//     for (let row_in_game_images =  all_rows_for_images.length-1 ;row_in_game_images>0;row_in_game_images--){
//         all_rows_for_images[row_in_game_images].innerHTML = ''+(row_in_game_images+1);
//     }
// }
// function create_automatic_descriptors(image,existing){
//     let box_of_options_descriptors = document.createElement('div');
//     box_of_options_descriptors.setAttribute("class", 'label_options ht100');
//     // console.log(image)
//     // console.log(existing)
//     for (let index_definer = 0 ; index_definer < definers_or_questions.length ; index_definer++){
//         let div_check_box = undefined;
//         if (existing){
//             if (existing.split(',').includes( definers_or_questions[index_definer])){
//                 div_check_box = create_check_able_box(image,types_of_descriptors[index_definer]+' : '+definers_or_questions[index_definer],true)
//             }else{
//                 div_check_box = create_check_able_box(image,types_of_descriptors[index_definer]+' : '+definers_or_questions[index_definer],false)
//             }
//         }else{
//             div_check_box = create_check_able_box(image,types_of_descriptors[index_definer]+' : '+definers_or_questions[index_definer],false)
//         }
//         box_of_options_descriptors.append(div_check_box);
//     }
//
//     return box_of_options_descriptors;
// }
// function add_row_image_to_game(image,path){
//     row_index++;
//     let my_index = row_index;
//     let row = document.getElementById('images_of_the_game').insertRow();
//     row.className = 'row_for_images';
//     row.id = ''+my_index;
//
//     let cell1 = row.insertCell(0);
//     cell1.className = 'row_counter_for_game_images';
//     cell1.innerHTML = row_index+'';
//
//     let cell2 = row.insertCell(1);
//     cell2.className = 'wd50 ';
//     let cell3 = row.insertCell(2);
//     cell3.className = 'text_descriptor';
//     if (status_of_game_check_2 === 2 || status_of_game_check_2 === 1){
//         cell3.style.display = 'none';
//     }
//     let cell4 = row.insertCell(3);
//     cell4.className = 'automatic_descriptor';
//     if (status_of_game_check_2 === 3 ){
//         cell4.style.display = 'none';
//     }
//     let cell5 = row.insertCell(4);
//
//     let label = document.createElement('LABEL');
//     let input_file = document.createElement("INPUT");
//     let image_for_description = document.createElement('IMG');
//
//     input_file.setAttribute("type", 'file');
//     input_file.setAttribute("id", 'images_of_game_'+row_index);
//
//     input_file.accept = ".png, .jpg, .jpeg, .gif";
//     input_file.setAttribute("class", 'images_of_game');
//     label.setAttribute("for", 'images_of_game_'+row_index);
//     if (image){
//         image_for_description.setAttribute("src", path+image.image);
//     }else{
//         image_for_description.setAttribute("src", './images/create_game.png');
//     }
//     image_for_description.setAttribute("class", 'game_images_images wd100 ht100');
//     image_for_description.setAttribute("id", 'descriptor_file'+row_index);
//     input_file.style.visibility = 'hidden';
//     input_file.style.display = 'none';
//     if (image){
//         if (image.image){
//             let blob = new File([undefined],image.image);
//             game_images_files.push([my_index,blob]);
//             input_file.onchange = function (){
//                 check_file_img(input_file,image_for_description);
//                 replace_at_index(my_index,input_file.files[0]);
//             }
//         }else{
//             console.log('CHYBAAAA')
//         }
//     }else{
//         game_images_files.push([my_index,undefined]);
//         console.log(game_images_files);
//         input_file.onchange = function (){
//             check_file_img(input_file,image_for_description);
//             replace_at_index(my_index,input_file.files[0]);
//             console.log(game_images_files);
//         }
//     }
//
//
//     label.append(image_for_description);
//     cell2.append(label,input_file);
//     let input_text_type = document.createElement("INPUT");
//     input_text_type.setAttribute("type", 'text');
//     input_text_type.setAttribute("class", 'descriptor_type_question');
//
//     if (status_of_game_check_2 !== 3){
//         input_text_type.setAttribute("disabled", 'true');
//     }else{
//         if (image){
//             input_text_type.value = image.description_control;
//         }
//     }
//
//     cell3.append(input_text_type);
//     /// TUNA VITVORIME SELECTORI NA ZAKLADE TYPU DEFINERS V DVOJKE v tvare dvoch selectorov prvi definuje button a druhy otazku / image
//     // to je vsetko mozne ak je status PC alebo KID (2 / 1)
//     if (status_of_game_check_2 === 2 || status_of_game_check_2 === 1) {
//         let descriptor_box = undefined;
//         if (image){
//             if (image.description_control){
//                 // console.log(image.description_control)
//                 // console.log(image_for_description,image.description_control)
//                 descriptor_box = create_automatic_descriptors(image_for_description,image.description_control);
//             }else{
//                 descriptor_box = create_automatic_descriptors(image_for_description);
//             }
//         }else{
//             descriptor_box = create_automatic_descriptors(image_for_description);
//         }
//         cell4.append(descriptor_box);
//     }
//
//     let button = document.createElement('BUTTON');
//     button.className = 'btn btn-default bg-danger text-light';
//     button.innerHTML = 'delete';
//     button.onclick = function (){
//         row.remove();
//
//         remove_item_form_array_files(my_index);
//         // console.log(game_images_files);
//         remake_indexes_because_of_anomaly();
//     }
//     cell5.append(button);
//     remake_indexes_because_of_anomaly();
//     if (image === undefined) {
//         make_titles_for_automatic_descriptors();
//     }
//     return my_index
// }
// function remove_all_check_3(){
//     game_images_files = [];
//     game_auto_descriptors = [];
//     game_question_descriptor = [];
//     status_of_game_check_3 = undefined;
//     row_index = 0;
//
//     let rows = document.getElementsByClassName('row_for_images');
//     while (rows.length > 0){
//         rows[0].remove();
//     }
// }
//
// function recreate_check_3(game,path){
//     console.log(path)
//     automatic_config_setter();
//     status_of_game_check_3 = true;
//     for (let existing_image = 0 ; existing_image < game.game_images.length ; existing_image++){
//         add_row_image_to_game(game.game_images[existing_image],path)
//     }
//     if (status_of_game_check_2 === 2 || status_of_game_check_2 === 1 ){
//         let elem_hide = document.getElementsByClassName('text_descriptor');
//         for (let index_elem = 0; index_elem < elem_hide.length; index_elem++) {
//             elem_hide[index_elem].style.display = 'none';
//         }
//     }else{
//         let elem_hide = document.getElementsByClassName('text_descriptor');
//         for (let index_elem = 0; index_elem < elem_hide.length; index_elem++) {
//             elem_hide[index_elem].style.display = 'revert';
//         }
//     }
//     sort_auto_descriptors()
//     make_titles_for_automatic_descriptors()
// // else if (status_of_game_check_2 === 1 ){
// //         let elem_hide = document.getElementsByClassName('automatic_descriptor');
// //         for (let index_elem = 0; index_elem < elem_hide.length; index_elem++) {
// //             elem_hide[index_elem].style.display = 'revert';
// //         }
// //     }
//
//     // console.log('RECREATING IMGAGES FILES',game_images_files)
//     let row_of_game_of_images = document.getElementsByClassName('row_for_images');
//     let input_game_images_images = document.getElementsByClassName('game_images_images');
//     let elem_input_text_description_images_game = document.getElementsByClassName('descriptor_type_question');
//     for (let index_elem = 0 ;index_elem < row_of_game_of_images.length;index_elem++){
//         let split_descriptors = input_game_images_images[index_elem].title.split('\n');
//         let final_descriptor = '';
//         for (let index_descriptor_part = 0 ;index_descriptor_part < split_descriptors.length;index_descriptor_part++ ){
//             if (split_descriptors[index_descriptor_part] !== ''){
//                 if (final_descriptor === ''){
//                     final_descriptor += split_descriptors[index_descriptor_part].split(' : ')[1];
//                 }else{
//                     final_descriptor += ','+split_descriptors[index_descriptor_part].split(' : ')[1];
//                 }
//             }
//         }
//         game_question_descriptor.push(elem_input_text_description_images_game[index_elem].value);
//         game_auto_descriptors.push(final_descriptor);
//     }
//     create_exception('game has been loaded',4,'success');
//     console.log('HOTOVOOO')
// }
// function sort_auto_descriptors(){
//     let all_automatic_descriptor = document.getElementsByClassName("label_options");//selector_definers_divs
//     for (let index_a_d = 0; index_a_d < all_automatic_descriptor.length; index_a_d++) {
//         let child_option = Array.prototype.slice.call(all_automatic_descriptor[index_a_d].childNodes) ;
//         child_option.sort(function (a, b) {
//             if (a.childNodes[1].innerHTML < b.childNodes[1].innerHTML) {
//                 return -1 ;
//             }
//             if (a.childNodes[1].innerHTML > b.childNodes[1].innerHTML) {
//                 return 1 ;
//             }
//             return 0;
//         });
//         while (all_automatic_descriptor[index_a_d].childNodes.length > 0){
//             all_automatic_descriptor[index_a_d].childNodes[0].remove();
//         }
//         child_option.forEach(new_sorted_option => {
//             all_automatic_descriptor[index_a_d].append(new_sorted_option)
//         })
//     }
// }
// function remove_all_titles(){
//
//     let all_titles = document.getElementsByClassName('automatic_descriptors_titles');
//     while (all_titles.length > 0 ){
//         console.log('mazem');
//         all_titles[0].remove();
//     }
//     console.log('Hotovo mazem');
// }
//
// function make_titles_for_automatic_descriptors(){
//     let all_automatic_descriptor = document.getElementsByClassName("label_for_cretin_option");
//     let rows_of_option = document.getElementsByClassName("selector_definers_divs");
//     let title_text = '';
//     for (let index_label = 0; index_label < all_automatic_descriptor.length; index_label++) {
//         let type_of_title_descriptor = all_automatic_descriptor[index_label].innerHTML.split(' : ')[0];
//         if (title_text !== type_of_title_descriptor){
//             let title = document.createElement('p');
//             title.className = 'automatic_descriptors_titles text-center mb0 text-light bg-primary';
//             title.innerHTML = type_of_title_descriptor;
//             rows_of_option[index_label].before(title);
//             title_text = type_of_title_descriptor;
//         }
//
//     }
//
// }
// function check_box_3(){
//     if (status_of_game_check_2 === undefined ){
//         if (status_of_game_check_1 === false){
//             create_exception('Please check in this section <button class="btn btn-default bg-success text-light"  onclick="display(\'check_1\')">main</button>',10,'warning')
//             return;
//         }else{
//             create_exception('Please check in this section <button class="btn btn-default bg-success text-light"  onclick="display(\'check_2\')">main</button>',10,'warning')
//             return;
//         }
//
//     }
//     game_auto_descriptors = [];
//     game_question_descriptor = [];
//     let elem_input_text_description_images_game = document.getElementsByClassName('descriptor_type_question');
//     for (let index_elem = 0 ;index_elem < elem_input_text_description_images_game.length;index_elem++){
//         game_question_descriptor.push(elem_input_text_description_images_game[index_elem].value) ;
//     }
//     let input_game_images_images = document.getElementsByClassName('game_images_images');
//
//     for (let index_elem = 0 ;index_elem < input_game_images_images.length;index_elem++){
//         let split_descriptors = input_game_images_images[index_elem].title.split('\n');
//         let final_descriptor = '';
//         for (let index_descriptor_part = 0 ;index_descriptor_part < split_descriptors.length;index_descriptor_part++ ){
//             if (split_descriptors[index_descriptor_part] !== ''){
//                 if (final_descriptor === ''){
//                     final_descriptor += split_descriptors[index_descriptor_part].split(' : ')[1];
//                 }else{
//                     final_descriptor += ','+split_descriptors[index_descriptor_part].split(' : ')[1];
//                 }
//             }
//         }
//         game_auto_descriptors.push(final_descriptor);
//     }
//     console.log("chcek 3");
//     let founded_empty_image = false;
//     let warning_text = '';
//     let error_same_images = []
//     let descriptor_img_names = []
//     let row_of_game_of_images = document.getElementsByClassName('row_for_images');
//     let is_correct_images_of_game = document.getElementsByClassName('images_of_game');
//     for (let index_image = 0 ; index_image < row_of_game_of_images.length ; index_image++) {
//         if (row_of_game_of_images[index_image].className.includes(' bg-warning')) {
//             row_of_game_of_images[index_image].className = row_of_game_of_images[index_image].className.replace(' bg-warning', '');
//         }
//     }
//     for (let file_index = 0; file_index < game_images_files.length; file_index++) {
//         if (game_images_files[file_index][1] === undefined){
//             founded_empty_image = true;
//             console.log(game_images_files[file_index][0])
//             create_exception('empty filed <strong>"image"</strong> in Create images of the game',10,'warning');
//         }else{
//             if (game_images_files[file_index][1] === 'removed'){
//                 continue
//             }
//             if (descriptor_img_names.includes(game_images_files[file_index][1].name)){ //game_images_files[file_index][0]
//                 error_same_images.push([row_of_game_of_images[descriptor_img_names.indexOf(game_images_files[file_index][1].name)],document.getElementById(game_images_files[file_index][0])]);
//             }
//             descriptor_img_names.push(game_images_files[file_index][1].name)
//         }
//
//     }
//
//     if (founded_empty_image){
//         for (let index_empty = 0; index_empty < row_of_game_of_images.length; index_empty++) {
//             if (input_game_images_images[index_empty].src.includes('create_game.png')){
//                 row_of_game_of_images[index_empty].className += ' bg-warning';
//             }
//         }
//         return
//     }
//     if (error_same_images.length > 0){
//         for (let index_row = 0 ;index_row < error_same_images.length;index_row++){
//             error_same_images[index_row][0].className += ' bg-warning';
//             error_same_images[index_row][1].className += ' bg-warning';
//         }
//         create_exception('Same game images are not allowed',20,'warning');
//         status_of_game_check_3 = undefined;
//         return
//     }
//
//     if (is_correct_images_of_game.length < 25){
//         warning_text += 'Game is eligible for to You <strong>missing images</strong> at lest 25 to be eligible to playable as online<br>';
//     }
//     if (status_of_game_check_2 === 3  ){ /// STUDENTS
//         console.log("chcek 3 FOR STUDENTS");
//         let founded = false;
//         let is_correct_question_student_images_of_game = document.getElementsByClassName('descriptor_type_question');
//         for (let question_index = 0 ; question_index < is_correct_question_student_images_of_game.length ; question_index++){
//             if (is_correct_question_student_images_of_game[question_index].value === ''){
//                 founded = true;
//                 row_of_game_of_images[question_index].className += ' bg-warning';
//                 create_exception('empty filed for definition of picture please file the box <strong>"text descriptor"</strong> in Create images of the game',10,'warning');
//             }else if (is_correct_question_student_images_of_game[question_index].value.includes(',')){
//                 founded = true;
//                 row_of_game_of_images[question_index].className += ' bg-warning';
//                 create_exception('iligal charakter (<strong>,</strong>) in  <strong>"text descriptor"</strong> in Create images of the game',10,'warning');
//             }else{
//                 if ( row_of_game_of_images[question_index].className.includes(' bg-warning')){
//                     row_of_game_of_images[question_index].className = row_of_game_of_images[question_index].className.replace(' bg-warning','');
//                 }
//             }
//         }
//         if (founded){
//             return
//         }
//         if (warning_text !== ''){
//             status_of_game_check_3 = true;
//             create_exception(warning_text+'Please do not forget to <strong>save</strong> your Game.',20,'warning');
//             change_allow_button_primary_success('main_button_allow_check3');
//             // change_allow_button_danger_primary('main_button_allow_save');
//             // change_allow_button_danger_primary('main_button_allow_save');
//             change_allow_button_danger_primary('main_button_allow_test');
//             hide_all_divs();
//         }else{
//             status_of_game_check_3 = true;
//             change_allow_button_primary_success('main_button_allow_check3');
//             change_allow_button_danger_primary('main_button_allow_save');
//             change_allow_button_danger_primary('main_button_allow_test');
//             hide_all_divs();
//             create_exception('Please do not forget to <strong>save</strong> your Game.<br>Your game now is rated as a game <strong>Only for Students</strong>',20,'success');
//         }
//         console.log();
//     }else if (status_of_game_check_2 === 1 || status_of_game_check_2 === 2){
//         console.log("ALLOWD FOR PC and KID");
//         status_of_game_check_3 = true;
//         change_allow_button_primary_success('main_button_allow_check3');
//         change_allow_button_danger_primary('main_button_allow_save');
//         change_allow_button_danger_primary('main_button_allow_test');
//         hide_all_divs();
//     }else{
//         create_exception('Not allowed operation something want wrong .',20,'warning');
//         return ;
//     }
//     // display('save');
//     save_game();
// }
//
// function create_check_able_box(image,inner_text,already_created){
//     let div_check_box = document.createElement('div');
//     div_check_box.setAttribute('class','form-check selector_definers_divs');
//
//     let label = document.createElement('LABEL');
//     label.setAttribute("class", 'label_for_cretin_option');
//     label.innerText = inner_text ;
//
//     let input_checkboxes_type = document.createElement("INPUT");
//     input_checkboxes_type.setAttribute("type", 'checkbox');
//     input_checkboxes_type.setAttribute("class", 'label_for_game_images');
//     input_checkboxes_type.onchange = function (){
//         if (image.title.includes(inner_text+'\n')){
//             image.title = image.title.replace(inner_text+'\n','');
//         }else {
//             image.title += inner_text + '\n';
//         }
//     }
//     if (already_created){
//         image.title+=inner_text+'\n';
//         input_checkboxes_type.checked = true;
//     }
//
//     div_check_box.append(input_checkboxes_type,label);
//     return div_check_box;
// }
//
//
// function automatic_config_setter(){
//     if (status_of_game_check_2 !== undefined){
//         if (status_of_game_check_2 === 3){ // onli for students
//             let elem_hide = document.getElementsByClassName('automatic_descriptor');
//             for (let index_elem = 0; index_elem < elem_hide.length; index_elem++) {
//                 elem_hide[index_elem].style.display = 'none';
//             }
//             elem_hide = document.getElementsByClassName('text_descriptor');
//             for (let index_elem = 0; index_elem < elem_hide.length; index_elem++) {
//                 elem_hide[index_elem].style.display = 'revert';
//             }
//
//             let row_image = document.getElementsByClassName('game_images_images');
//             for (let index_game_image = 0; index_game_image < row_image.length; index_game_image++) {
//                 row_image[index_game_image].title = '';
//             }
//             console.log('GAME ONLI FOR PLAYES SUTENTS')
//             let elem_input_text_description_images_game = document.getElementsByClassName('descriptor_type_question');
//             for (let index_elem = 0 ;index_elem < elem_input_text_description_images_game.length;index_elem++){
//                 elem_input_text_description_images_game[index_elem].disabled = false;
//             }
//             console.log('REMOVING ALLLLL')
//             let compare_if_exists = document.getElementsByClassName('label_options');
//             while (compare_if_exists.length > 0 ){
//                 console.log('aaaa');
//                 compare_if_exists[0].remove();
//             }
//         }else if (status_of_game_check_2 === 2 || status_of_game_check_2 === 1){// onli for PC and kids
//             if (status_of_game_check_2 === 2 ){
//                 let elem_hide = document.getElementsByClassName('text_descriptor');
//                 for (let index_elem = 0; index_elem < elem_hide.length; index_elem++) {
//                     elem_hide[index_elem].style.display = 'none';
//                 }
//             }
//             let elem_hide = document.getElementsByClassName('automatic_descriptor');
//             for (let index_elem = 0; index_elem < elem_hide.length; index_elem++) {
//                 elem_hide[index_elem].style.display = 'revert';
//             }
//
//
//             let elem_input_text_description_images_game = document.getElementsByClassName('descriptor_type_question');
//             for (let index_elem = 0 ;index_elem < elem_input_text_description_images_game.length;index_elem++){
//                 elem_input_text_description_images_game[index_elem].disabled = true;
//                 elem_input_text_description_images_game[index_elem].value = '';
//             }
//
//             /// DOPLNENIE NOVICH SELECTOROV DO CASTI 3
//             let compare_if_exists = document.getElementsByClassName('label_options');
//             let compare_if_row_exists = document.getElementsByClassName('row_for_images');
//             let row_image = document.getElementsByClassName('game_images_images');
//
//
//
//             if (compare_if_row_exists.length !== compare_if_exists.length ){
//                 console.log('NEROVNA SA POCET RIADKOV !!!');
//                 for (let row_index = 0 ; row_index < compare_if_row_exists.length ; row_index++){
//                     if (compare_if_row_exists[row_index].innerHTML.includes('label_options') === false){
//                         let descriptor_box = create_automatic_descriptors(row_image[row_index]);
//                         compare_if_row_exists[row_index].childNodes[3].append(descriptor_box);
//                     }
//                 }
//             }
//             let funded = false;
//             let not_founded_definers = [];
//             let not_found_indexes = [];
//             for (let exist_definer = 0 ; exist_definer < compare_if_exists.length ; exist_definer++){
//                 let childes = compare_if_exists[exist_definer].childNodes
//                 not_founded_definers = [];
//                 not_found_indexes = [];
//                 for (let index_definer = 0 ; index_definer < definers_or_questions.length ; index_definer++){
//                     funded = false;
//                     for (let index_existing_nodes = 0 ; index_existing_nodes < childes.length ; index_existing_nodes++){
//                         if (childes[index_existing_nodes].innerText === types_of_descriptors[index_definer]+' : '+definers_or_questions[index_definer]){
//                             funded = true;
//                         }
//                     }
//                     if (funded === false) {
//                         not_founded_definers.push(types_of_descriptors[index_definer]+' : '+definers_or_questions[index_definer]);
//                         not_found_indexes.push(exist_definer);
//                     }
//                 }
//                 for (let index_not_founded = 0 ;index_not_founded < not_founded_definers.length; index_not_founded++){
//                     let div_check_box = create_check_able_box(row_image[not_found_indexes[index_not_founded]],not_founded_definers[index_not_founded])
//                     compare_if_exists[exist_definer].append(div_check_box);
//                 }
//             }
//             /// ODSTRANENIE SELECKTOROV KTORE UZ NEXISTUJU DO CASTI 3
//             compare_if_exists = document.getElementsByClassName('label_options');
//             funded = false;
//             let definers_witch_should_not_exist = [];
//             for (let exist_definer = 0 ; exist_definer < compare_if_exists.length ; exist_definer++){
//                 let childes = compare_if_exists[exist_definer].childNodes
//                 for (let index_existing_nodes = 0 ; index_existing_nodes < childes.length ; index_existing_nodes++){
//                     funded = false;
//
//                     for (let index_definer = 0 ; index_definer < definers_or_questions.length ; index_definer++){
//                         if (childes[index_existing_nodes].innerText === types_of_descriptors[index_definer]+' : '+definers_or_questions[index_definer]){
//                             funded = true;
//                         }
//                     }
//                     if (funded === false) {
//                         definers_witch_should_not_exist.push(childes[index_existing_nodes]);
//                     }
//                 }
//
//             }
//             for (let index_founded = 0 ;index_founded < definers_witch_should_not_exist.length; index_founded++){
//                 for (let i = 0; i < row_image.length; i++) {
//                     if (row_image[i].title.includes(definers_witch_should_not_exist[index_founded].innerText)){
//                         row_image[i].title = row_image[i].title.replace(definers_witch_should_not_exist[index_founded].innerText+'\n','');
//                     }
//                 }
//
//                 definers_witch_should_not_exist[index_founded].remove();
//             }
//             sort_auto_descriptors()
//             make_titles_for_automatic_descriptors();
//         }else{
//             console.log('ERRRRRRRRORRRR');
//         }
//     }else{
//         let elem_input_text_description_images_game = document.getElementsByClassName('descriptor_type_question');
//         for (let index_elem = 0 ;index_elem < elem_input_text_description_images_game.length;index_elem++){
//             elem_input_text_description_images_game[index_elem].disabled = true;
//         }
//     }
// }
