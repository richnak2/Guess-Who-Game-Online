const socket = io();
let sessionStorage = window.sessionStorage;

const my_socket_id = sessionStorage.getItem("socket_id");
// console.log('GET ITEM LOCAL STORIDGE ',localStorage.getItem("socket_id"));


socket.emit('find_user' , {my_socket_id});
// find correct data for user



socket.on('is_user' , ({ allow_data , name , role , points , character , socket }) => {
    if (allow_data){
        html_name.innerHTML = name;
        html_coins.innerHTML = points;
        character_in_game = character;
        // console.log(character_in_game);
        if (role === "Teacher"){
            if (document.getElementById('for_teacher')){
                document.getElementById('for_teacher').style.display = 'revert';
            }

        }
    }else{
        reload();
    }

});

function reload(){
    location.assign('index.html');
}