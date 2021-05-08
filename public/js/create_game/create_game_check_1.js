// let status_of_game_check_1 = false;
//
// socket.on('exist_dir',({exist})=>{
//     if (exist){
//         if (currently_edited_game){
//             if (currently_edited_game.title === document.getElementById('game_name').value){
//                 status_of_game_check_1 = true;
//                 change_allow_button_primary_success('main_button_allow_check1');
//                 // change_allow_button_danger_primary('main_button_allow_save');
//                 // change_allow_button_primary_success('main_button_allow_save');
//                 change_allow_button_danger_primary('main_button_allow_check2');
//                 hide_all_divs();
//                 display('check_2');
//             }else {
//                 status_of_game_check_1 = false;
//                 create_exception('Game title already exist',5,'warning');
//             }
//
//         }else{
//             status_of_game_check_1 = false;
//             create_exception('Game title already exist',5,'warning');
//         }
//
//     }else{
//         status_of_game_check_1 = true;
//         // console.log('no existing folder')
//         // status_of_game_check_1 = true;
//         change_allow_button_primary_success('main_button_allow_check1');
//         change_allow_button_danger_primary('main_button_allow_check2');
//         // change_allow_button_danger_primary('main_button_allow_save');
//         // change_allow_button_primary_success('main_button_allow_save');
//         hide_all_divs();
//         display('check_2');
//     }
// })
// function recreate_check_1(game){
//     status_of_game_check_1 = true;
//     let game_name = document.getElementById('game_name');
//     game_name.value = game.title;
//     let game_description = document.getElementById('game_description');
//     game_description.value = game.description;
//     let main_img = document.getElementById('main_img_of_game');
//     let path = './images/'+game.title+'/';
//     main_img.src = path+'default.png';
//     console.log(path)
//     change_allow_button_primary_success('main_button_allow_check1');
//
//     recreate_check_2(game,path);
//
// }
// function remove_all_check_1(){
//     status_of_game_check_1 = false;
//
//     document.getElementById('game_name').value = '';
//     document.getElementById('game_description').value = '';
//     document.getElementById('input_main_img').value = '';
//     document.getElementById('main_img_of_game').src = './images/create_game.png';
// }
// function check_box_1(){
//     let game_name = document.getElementById('game_name');
//     let game_name_val = game_name.value;
//
//     if (game_name_val!== "" && (game_name_val.length < 30 && game_name_val.length >= 5)) {
//         if (check_for_illegal_characters(game_name_val)) {
//             create_exception(`illegal characters in title of the game <strong>${illegal_characters.join(' ')}</strong>`,5,'warning');
//             game_name.style.border = " 2px solid #fff3cd";
//             return
//         }
//         game_name.style.border = " 2px solid #ced4da";
//             socket.emit('exist_dir',{game_name_val});
//
//     }else{
//         create_exception('You must set game title min length 5 and max is 30',5,'danger');
//         status_of_game_check_1 = false;
//         if (game_name.value === "" || game_name_val.length > 30 || game_name_val.length < 5 ){
//             game_name.style.border = " 5px solid #fff3cd";
//         }else{
//             game_name.style.border = " 2px solid #ced4da";
//         }
//     }
// }
//
//
