const socket = io();
let sessionStorage = window.sessionStorage;

const my_socket_id = sessionStorage.getItem("socket_id");
// console.log('GET ITEM LOCAL STORIDGE ',localStorage.getItem("socket_id"));


socket.emit('find_user' , {my_socket_id});
// find correct data for user



socket.on('user' , (user_data) => {
    console.log(user_data)
    if (user_data){
        html_name.innerHTML = user_data.name;
        html_coins.innerHTML = user_data.points;
        character_in_game = user_data.character;
        // console.log(character_in_game);
        if (user_data.role === "Teacher"){
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