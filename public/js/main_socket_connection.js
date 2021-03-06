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
    one_time_find()
    waitUntilUserIsLoaded()
});

function waitUntilUserIsLoaded(){
    if (user_account !== undefined){
        typeof setNavigation === 'function' ? setNavigation() : console.log('setNavigation is not defined')
        typeof setShopImage === 'function' ? setShopImage() : console.log('setShopImage is not defined')
        typeof createGame === 'function' ? createGame() : console.log('createGame is not defined')
        typeof findYourGames === 'function' ? findYourGames() : console.log('findYourGames is not defined')
    }else{

        setTimeout(waitUntilUserIsLoaded,100);
    }
}
function one_time_find(){
    socket.emit('find_user' , {my_socket_id});
}

let session_interval = undefined
function holdSession(){
    socket.emit('ping_server' , {my_socket_id});
}
socket.on('ping_server' , () => {
    clearInterval(session_interval);
    reload();
})

socket.on('error_massage' ,({error_massage}) => {
    create_exception(error_massage.massage,error_massage.time,error_massage.type)
})

let user_account = undefined
socket.on('user' , ({user_data}) => {
    if (user_data.game_name !== undefined){
        html_name.innerHTML = user_data.game_name;
        html_coins.innerHTML = user_data.points;

        if (user_data.role === "Teacher"){
            if (document.getElementById('for_teacher')){
                document.getElementById('for_teacher').style.display = 'revert';
            }
        }
        user_account = user_data
        session_interval = setInterval(holdSession,2*60*1000)
    }else{
        reload();
    }
});



function reload(){
    location.assign('index.html');
}