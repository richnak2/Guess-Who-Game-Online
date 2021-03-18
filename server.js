// Vytvorenie Express aplikacie
const express = require("express");
const app = express();

// Potrebne kniznice na nastavenie ciest
const http = require('http');
const path = require('path');

// Kniznica na spracovanie requestov
const bodyParser = require("body-parser");

// Include file s DB
const dbService = require('./utils/dbService');


// Vytvorenie a spracovanie socketovej stranky
const socket_io = require('socket.io');
const server = http.createServer(app);
const io = socket_io(server);


// Pripojenie konkretneho usera do aplikacie
const {
    userJoin,
    getCurrentUser,
    set_character,
    buy_character,
    getAll,
    userLeave,
    add_points
} = require('./utils/users');

const {create_game,is_existing_game,all_games,search_for_free_game,leave_game,game} = require('./utils/game');
const {look_folders,delete_folder_r,get_all_files_in_game,remove_dirs} = require('./utils/create_game');
//
// const up = require('express-fileupload')
//
// app.use(up());
const create_game_post_method = require('./utils/routs/poust_method_create_game');
app.use(create_game_post_method);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));



const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

io.on('connection', socket => {



    ///// CREATE GAME MANAGMET
    socket.on('exist_dir',({dir_name})=>{
        socket.emit('exist_dir',{exist:look_folders(dir_name)});
    })
    socket.on('delete_game' , ({game_id,title,my_socket_id}) =>{
        // delete dirs
        const get_current_user = getCurrentUser(my_socket_id);
        // console.log('CURRENT USER ',get_current_user);
        if (get_current_user === undefined){
            // console.log('Canot find user');
        }else{
            delete_folder_r('public/images/'+title);

            // delete game forom db
            const db = dbService.getDbServiceInstance();
            const result = db.delete_game(game_id,get_current_user.id);
            result.then(data => { }).catch(err => console.log(err));
        }

    })







    //// PLAEYER MANAGMENT

    socket.on('user_join_as', () => {
        userJoin(socket.id,undefined,socket.id,undefined,0,'#00000000 def.png','#00000000 def.png');
    });

    socket.on('login_as_user', ({name_value , password_value}) => {
        const db = dbService.getDbServiceInstance();
        const result = db.find_user(name_value,password_value);
        result.then(data => {
            if (data[0] !== undefined){
                // console.log(data[0]['type_of_character'])
                // console.log(decodeURI(data[0]['type_of_character']).split('?'))
                userJoin(socket.id,data[0]['id'],data[0]['game_name'],data[0]['role'],data[0]['points'] ,data[0]['type_of_character'] ,data[0]['bought_characters']);
                socket.emit('log_in',{massage:'You are logged in',time:10,type:'success'});
            }else{
                socket.emit('log_in',{massage:'<strong>User game name</strong> or <strong>password</strong> is wrong.',time:10,type:'warning',undefined});
            }

        }).catch(err => console.log(err));
    });


    socket.on('register_new_user' , ({name_value, password_value,role_value}) => {
        const db = dbService.getDbServiceInstance();
        const exist = db.exist_user(name_value);
        exist.then(data => {
            if (data){
                const result = db.register_user(name_value,password_value,role_value);
                result.then(data => {
                        socket.emit('new_registration',{massage:'Thanks for registration <strong>'+name_value+'</strong> now please log in and enjoy the games',time:10,type:'success'} )})
                    .catch(err => {
                        socket.emit('new_registration',{massage:err,time:10,type:'warning'} )});
            }else{
                socket.emit('new_registration',{massage:'User with this name already exist',time:10,type:'warning'} );
            }
        });
    });

    socket.on('find_user', ({my_socket_id}) => {
        // console.log('Im loocking for  ',my_socket_id );
        // console.log('ALL users ',getAll());
        const get_current_user = getCurrentUser(my_socket_id);
        // console.log('CURRENT USER ',get_current_user);
        if (get_current_user === undefined){
            socket.emit('is_user' , { allow_data : false   });
        }else{
            socket.emit('is_user' , {
                allow_data : true,
                name : get_current_user.game_name,
                role : get_current_user.role,
                points : get_current_user.points,
                character : get_current_user.character,
                socket : get_current_user.id_socket
            });
        }
    });
    socket.on('remove_player_from_connection',({my_socket_id}) =>{
        userLeave(my_socket_id);
    })



    // GAME

    socket.on('get_all_games' , ({my_socket_id}) => {
        // console.log('Getting all games')
        const get_current_user = getCurrentUser(my_socket_id);
        if (get_current_user === undefined){
            // console.log('Canot find user');
        }else{
            const db = dbService.getDbServiceInstance();
            const result = db.getAllGames(get_current_user.id);
            result.then(data => {
                // let data_with_images = get_all_files_in_game(data,game.title);
                socket.emit('get_all_games', {games : data});//data_with_images
            }).catch(err => console.log(err));
        }


    });
    socket.on('get_all_games_by_you' , ({my_socket_id}) => {
        // console.log('Getting all games')
        const get_current_user = getCurrentUser(my_socket_id);
        if (get_current_user === undefined){
            // console.log('Canot find user');
        }else{
            const db = dbService.getDbServiceInstance();
            const result = db.getAllYourGames(get_current_user.id);
            result.then(data => {
                // console.log('CHEM get_all_games_by_you ');
                // let data_with_images = get_all_files_in_game(data,game.title);
                socket.emit('get_all_games_by_you', {games : data});//data_with_images
            }).catch(err => console.log(err));
        }


    });
    socket.on('restart_character',({my_socket_id}) => {
        const player = set_character(my_socket_id,'bg-#00000000 def.png');
        // db
        if (player.id !== undefined){
            const db = dbService.getDbServiceInstance();
            const result = db.updateUserCharacter(player);
        }
    });
    socket.on('set_character_or_color',({my_socket_id,character_in_game}) => {
        const player = set_character(my_socket_id,character_in_game);
        // db
        if (player.id !== undefined){
            const db = dbService.getDbServiceInstance();
            const result = db.updateUserCharacter(player);
        }
    });
    socket.on('buy_character_or_color',({my_socket_id,item}) => {
        const player = buy_character(my_socket_id,item);
        // db
        if (player.id !== undefined){
            const db = dbService.getDbServiceInstance();
            const result = db.updateUserCharacter(player);
        }
    });

    function is_ready_game(game_id){
        // console.log('w8 for game')
        let game = is_existing_game(game_id);
        if (game){
            let game_copy  = JSON.parse(JSON.stringify(game)); // Create Deep copy of object
            // zmena udajou pre bezpecnost profilu
            game_copy.picket_picture_pc = undefined;
            game_copy.player1.id_socket = undefined;
            if (game_copy.player2 !== undefined){
                game_copy.player2.id_socket = undefined;
            }

            console.log('GAME HAS BEEEN OBTAINED')
            socket.emit('obtain_game', {game:game_copy});


            console.log('ALL GAMSE IN PROCES  OBTAIN GAME: ',all_games().length,);//all_games()
        }else{
            setTimeout(is_ready_game, 100 , game_id);
        }

    }



    socket.on('luck_to_game_buffer' , ({game_name,game_type,my_socket_id}) => {
        const player = getCurrentUser(my_socket_id);
        if (player === undefined){
            console.log('LUCK FOR GAME PLAYER UNDEFINED ',my_socket_id);
        }else {
            // console.log('LUCK FOR GAME :',game_name, game_type, player,my_socket_id);
            search_for_free_game(game_name, game_type, player).then(answer => {
                // console.log('ANSWER FOR GAME SUCCESS:',game_name, game_type, player,my_socket_id);
                // socket.emit('game_buffer_answer', {answer: answer});
                if (answer !== undefined){
                    let game_copy  = JSON.parse(JSON.stringify(answer)); // Create Deep copy of object
                    // zmena udajou pre bezpecnost profilu
                    game_copy.picket_picture_pc = undefined;
                    game_copy.player1.id_socket = undefined;
                    if (game_copy.player2 !== undefined){
                        game_copy.player2.id_socket = undefined;
                    }
                    socket.emit('game_buffer_answer', {answer: game_copy});
                }else{
                    console.log('LUCK TO GAME ERRROR :',answer);
                    socket.emit('game_buffer_answer', {answer: answer});
                }



            })
        }
    })


    socket.on('create_single_player' , ({game_name,game_type,game_id,my_socket_id}) => {

        const player = getCurrentUser(my_socket_id);
        if (player === undefined){
        }else {
            let game = is_existing_game(game_id);
            if (game){
                // console.log(all_games().length);
                // all_games().forEach(g => console.log(g.id))
                console.log('ALL GAMSE IN PROCES create singlpayer : ',all_games().length,);//all_games()
                socket.emit('obtain_game', {game:game});
            }else{
                create_game(game_name,game_type,game_id,player);
                is_ready_game(game_id);
                // console.log('ALL GAMSE IN PROCES  : ',all_games().length),all_games();
            }
        }
    });

    socket.on('ask_single_player_game',({game_id,massage}) =>{
        let game = is_existing_game(game_id);
        // console.log('SINGEL ',game.player1);
        // console.log('ask_single_player_game',game)
        if (game) {
            let is_you_picture = game.is_your_picture_question(massage);
            if (massage.certain === true && is_you_picture === true){
                // console.log('SINGEL PRESIEL ',game.player1.id_socket)
                add_points(1000,game.player1.id_socket,game.ask_counter_player1)
                if (game.player1.id !== undefined){
                    const db = dbService.getDbServiceInstance();
                    const result = db.updateUserPoints(getCurrentUser(game.player1.id_socket));
                    // result.then(data =>{
                    //     socket.emit('answer_to_is_you_picture_pc', {answer: is_you_picture})
                    // })
                }

            }
            // console.log('ask_single_player_game', is_you_picture);
            socket.emit('answer_to_is_you_picture_pc', {answer: is_you_picture})
        }
    });
    socket.on('get_character',({my_socket_id}) => {

        const player = getCurrentUser(my_socket_id);
        // console.log(player)
        if (player === undefined){
        }else {
            // console.log('som tuuuu',player.bought_characters,)
            // let bought_character = player.bought_characters;
            socket.emit('bought_characters',{bought_ch:player.bought_characters});
        }
    })
    // socket.on('add_points', ({time_of_complete,my_socket_id,guess_count}) => {
    //
    //     const get_current_user = getCurrentUser(my_socket_id);
    //     if (get_current_user !== undefined){
    //         console.log(time_of_complete,my_socket_id,get_current_user);
    //         let max_length_of_game = 10000;
    //         let points = Math.ceil(((100/(time_of_complete / max_length_of_game))/100)/guess_count);
    //
    //         get_current_user['points'] += points;
    //     }else{
    //         console.log('Neviem pridat body');
    //     }
    //
    // });



    socket.on('broadcast_massage',({game_id,my_socket_id,massage}) =>{
        console.log(game_id,my_socket_id,massage)
        if (massage === 'block'){
            // console.log('ANO POSLAL SOM BLOCK')

            let broadcast_massage = {}
            broadcast_massage.game_id = game_id;
            broadcast_massage.player_name = my_socket_id;
            broadcast_massage.massage = 'unlock_btn';
            socket.broadcast.emit('broadcasted_massage', {broadcast_massage:broadcast_massage});
        }else if (massage === 'connected'){
            // console.log('broadcast_massage',my_socket_id)
            let broadcast_massage = {}
            broadcast_massage.game_id = game_id;
            broadcast_massage.player_name = my_socket_id;
            broadcast_massage.massage = massage;
            socket.broadcast.emit('broadcasted_massage', {broadcast_massage:broadcast_massage});
        }else if (massage === true || massage === false ){
            // console.log('ODPOVED NA SERVERI ')
            let broadcast_massage = {}
            let game = is_existing_game(game_id);
            let answer = game.answer_to_question(my_socket_id,massage);
            // console.log('answer to certain : ',answer)
            if (answer){ // 1000 bude asi parameter max game reword vivod do buducna
                add_points(1000,game.player1.id_socket,game.ask_counter_player1+(game.player1.id_socket === my_socket_id ? 10:0))
                add_points(1000,game.player2.id_socket,game.ask_counter_player2+(game.player1.id_socket === my_socket_id ? 0:10))
                if (game.player1.id !== undefined){
                    const db = dbService.getDbServiceInstance();
                    const result = db.updateUserPoints(getCurrentUser(game.player1.id_socket));
                }
                if (game.player2.id !== undefined){
                    const db = dbService.getDbServiceInstance();
                    const result = db.updateUserPoints(getCurrentUser(game.player2.id_socket));
                }
            }
            broadcast_massage.game_id = game_id;
            broadcast_massage.player_name = my_socket_id;
            broadcast_massage.massage = massage;
            socket.broadcast.emit('broadcasted_massage', {broadcast_massage:broadcast_massage});
        }else{
            console.log('VYTVORENIE OTAZKY ',my_socket_id)
            let game = is_existing_game(game_id);
            if (game !== undefined){
                game.add_question(my_socket_id,massage);
                let broadcast_massage = {}
                broadcast_massage.game_id = game_id;
                broadcast_massage.player_name = my_socket_id;
                broadcast_massage.massage = massage;
                socket.broadcast.emit('broadcasted_massage', {broadcast_massage:broadcast_massage});
            }else{
                console.log('game NO EXIST ',game_id)
            }
        }

    })

    socket.on('leave_game',({game_id,my_socket_id}) => {
        // console.log('LEFT GAME',game_id);
        let game = is_existing_game(game_id);
        let answer_if_game_is_multiplayer = leave_game(game_id)
        // console.log(answer_if_game_is_multiplayer);
        if (answer_if_game_is_multiplayer === 'inform_second_player' && game.player2 !== undefined){
            if (game.player1.id_socket === my_socket_id){
                add_points(1000,game.player2.id_socket,10);
            }else if (game.player2.id_socket === my_socket_id){
                add_points(1000,game.player1.id_socket,10);
            }else{
                console.log('ERROR LEFT GAME');
            }
            // add_points(1000,(game.player1.id_socket === my_socket_id ? game.player2.id_socket:game.player1.id_socket),10);
            if (game.player1.id !== undefined){
                const db = dbService.getDbServiceInstance();
                const result = db.updateUserPoints(getCurrentUser(game.player1.id_socket));
            }
            if (game.player2.id !== undefined){
                const db = dbService.getDbServiceInstance();
                const result = db.updateUserPoints(getCurrentUser(game.player2.id_socket));
            }
            socket.broadcast.emit('opponent_left', {who_left:game_id});
        }
        // all_games().forEach(g => console.log(g.id))
        console.log('ALL GAMSE IN PROCES  leave game : ',all_games().length,);//all_games()

    });



});
