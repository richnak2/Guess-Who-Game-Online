const create_elements = document.getElementsByClassName('create');
const sessionStorage = window.sessionStorage;

const socket = io();


document.addEventListener('DOMContentLoaded', function () {
    html_alert = document.getElementById('alert');
    html_close= document.getElementById('close');
    html_text= document.getElementById('text');
    pre_make_colors_them();
});



socket.on('log_in' , ({massage,time,type}) => {
    if (type === 'success'){
        sessionStorage.setItem("socket_id",socket.id);
        sessionStorage.setItem('game_id','');
        location.assign('menu.html');
    }else{
        create_exception(massage,time,type);
    }
});

socket.on('new_registration' , ({massage,time,type}) => {
    if (type === 'success'){
        create_exception(massage,time,type);
        show_log_in('none');
    }else{
        create_exception(massage,time,type);
    }
});
function open_game(){
    socket.emit('user_join_as');
    sessionStorage.setItem("socket_id",socket.id);
    sessionStorage.setItem('game_id','');
    location.assign('menu.html');//socket_id='+socket.id
}
function log_in(){
    let name = document.getElementById('name');
    let password = document.getElementById('password');
    let name_value = name.value;
    let password_value = password.value;
    if (name_value !== "" && password_value !== "") {
        socket.emit('login_as_user', {name_value, password_value});
    }else{
        create_exception('Please fill empty fields',10,'warning');
        if (name_value === "" ){
            name.style.border = " 2px solid #fff3cd";
        }else{
            name.style.border = " 1px solid #ced4da";
        }
        if (password_value === ""){
            password.style.border = " 2px solid #fff3cd";
        }else{
            password.style.border = " 1px solid #ced4da";
        }
    }
}
function create_user(){
    let name = document.getElementById('name');
    let password = document.getElementById('password');
    let repeat_password = document.getElementById('repeat_password');
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
        create_exception('Please fill empty fields',10,'warning');
        if (name_value === "" ){
            name.style.border = " 2px solid #fff3cd";
        }else{
            name.style.border = " 1px solid #ced4da";
        }
        if (password_value === ""){
            password.style.border = " 2px solid #fff3cd";
        }else{
            password.style.border = " 1px solid #ced4da";
        }
        if (repeat_password_value === ""){
            repeat_password.style.border = " 2px solid #fff3cd";
        }else{
            repeat_password.style.border = " 1px solid #ced4da";
        }
    }
}
function show_log_in(witch){

    for (let elem = 0 ; elem < create_elements.length; elem ++){
        create_elements[elem].style.display = witch;
    }

    document.getElementById('log_in').style.display = 'revert';
    if (witch === 'none'){
        document.getElementById('sign').style.display = 'revert';
    }else{
        document.getElementById('sign').style.display = 'none';
    }
    document.getElementById('main').style.display = 'none';
}
function back_to_main(){
    document.getElementById('log_in').style.display = 'none';
    document.getElementById('main').style.display = 'revert';
}
