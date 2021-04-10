const socket = io();
let sessionStorage = window.sessionStorage;
const my_socket_id = sessionStorage.getItem("socket_id");


let html_img = undefined;
let html_img_bg = undefined;
let html_coins = undefined;
let html_name = undefined;

document.addEventListener('DOMContentLoaded', function () {
    html_img = document.getElementById('image');
    html_img_bg = document.getElementById('background_your_img');
    html_coins = document.getElementById('coins');
    html_name = document.getElementById('name');

    waitUntilUserIsLoaded()
});

function waitUntilUserIsLoaded(){
    if (user_account !== undefined){

        typeof setNavigation === 'function' ? setNavigation() : console.log('setNavigation is not defined')
        typeof setShopImage === 'function' ? setShopImage() : console.log('setShopImage is not defined')
    }else{
        setTimeout(waitUntilUserIsLoaded,100);
    }
}


socket.emit('find_user' , {my_socket_id});
// find correct data for user

let session_interval = undefined
function holdSession(){
    socket.emit('ping_server' , {my_socket_id});
}
socket.on('ping_server' , () => {
    clearInterval(session_interval);
    reload();
})

let user_account = undefined
socket.on('user' , ({user_data}) => {

    if (user_data !== undefined){
        html_name.innerHTML = user_data.game_name;
        html_coins.innerHTML = user_data.points;

        if (user_data.role === "Teacher"){
            if (document.getElementById('for_teacher')){
                document.getElementById('for_teacher').style.display = 'revert';
            }
        }
        user_account = user_data
        session_interval = setInterval(holdSession,120*1000)
    }else{
        reload();
    }

});



function reload(){
    location.assign('index.html');
}