const sessionStorage = window.sessionStorage;
const socket = io();

document.addEventListener('DOMContentLoaded', function () {
    html_alert = document.getElementById('alert');
    html_close= document.getElementById('close');
    html_text= document.getElementById('text');
    pre_make_colors_them();
});



socket.on('log_answer' , ({massage,time,type}) => {
    if (type === 'success'){
        sessionStorage.setItem("socket_id",socket.id);
        sessionStorage.setItem('game_id','');
        location.assign('menu.html');
    }else{
        create_exception(massage,time,type);
    }
});

socket.on('register_new_user' , (massage) => {
    if (massage.type === 'success'){
        create_exception(massage.massage,massage.time,massage.type);
        show_log_in('none');
    }else{
        create_exception(massage.massage,massage.time,massage.type);
    }
});
function open_game_offline_profile(){
    socket.emit('offline');
    sessionStorage.setItem("socket_id",socket.id);
    sessionStorage.setItem('game_id','');
    location.assign('menu.html');
}
function open_game_online_profile(){
    let name = document.getElementById('name');
    let password = document.getElementById('password');
    let name_value = name.value;
    let password_value = password.value;
    if (name_value !== "" && password_value !== "") {
        socket.emit('online', {name_value, password_value});
    }else{
        make_error_massage([name,password])
    }
}
function create_user(){
    let name = document.getElementById('name_r');
    let password = document.getElementById('password_r');
    let repeat_password = document.getElementById('repeat_password_r');
    let name_value = name.value;
    let password_value = password.value;
    let repeat_password_value = repeat_password.value;
    let role_value = document.getElementById('select_role').value;

    if (name_value !== "" && password_value !== "" && repeat_password_value !== "" ){
        console.log(name_value.length)
        if (name_value.length < 5 || name_value.length > 14 ){
            create_exception('Incorrect length of game name min 5 max 15',10,'warning');
            return ;
        }
        if ((password_value.length < 5 || password_value.length > 99) || (repeat_password_value.length < 5 || repeat_password_value.length > 99 )){
            create_exception('Incorrect length of password min 5 max 99',10,'warning');
            return ;
        }
        if (password_value === repeat_password_value){
            socket.emit('register_new_user', {name_value, password_value,role_value});
        }else{
            create_exception('Passwords are not matching',10,'warning');
        }

    }else{
        make_error_massage([name,password,repeat_password])
    }
}
function make_error_massage(problems){
    for (let problem_index = 0; problem_index < problems.length; problem_index++) {
        create_exception('Please fill empty fields',10,'warning');
        if (problems[problem_index].value === "" ){
            problems[problem_index].style.border = " 2px solid #fff3cd";
        }else{
            problems[problem_index].style.border = " 1px solid #ced4da";
        }
    }
}
function show_log_in(witch){
    if (witch === 'register'){
        document.getElementById('register').style.display = 'revert';
        document.getElementById('login').style.display = 'none';
        document.getElementById('main').style.display = 'none';
    }else{
        document.getElementById('register').style.display = 'none';
        document.getElementById('login').style.display = 'revert';
        document.getElementById('main').style.display = 'none';
    }
}

function back_to_main(){
    document.getElementById('login').style.display = 'none';
    document.getElementById('register').style.display = 'none';
    document.getElementById('main').style.display = 'revert';
}
