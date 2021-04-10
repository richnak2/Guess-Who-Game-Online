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
    // userJoin,
    // getCurrentUser,
    // setCharacter,
    // buyCharacter,
    // getAll,
    // userLeave,
    // addPoints,
    AllUsers,
    // Users
} = require('./utils/users');
const {format_message,format_error} = require('./utils/messages');

const {create_game,is_existing_game,search_for_free_game,leave_game} = require('./utils/game');
const {look_folders,delete_folder_r} = require('./utils/create_game');
// const {DbService} = require('./utils/dbService')
// DbService.getDbServiceInstance()
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




    ///// CREATE GAME MANAGMET : CGM
    socket.on('exist_dir',({dir_name})=>{
        socket.emit('exist_dir',{exist:look_folders(dir_name)});
    })

    // create_game.js related server error tag => CGM-DG
    socket.on('delete_game' , ({game_id,title,my_socket_id}) =>{
        AllUsers.getUser(my_socket_id,socket.id).then(user => {
            if (user === undefined) {
                console.log("CGM : Something want wrong with user")
            } else {
                delete_folder_r('public/images/' + title).then(removed_massage_server => console.log('CGM-DG : Deleting folders'));

                // delete game from db
                const db = dbService.getDbServiceInstance();
                const result = db.deleteGame(game_id, user.id);
                result.then(data => {
                }).catch(err => console.log(`CGM-DG : ${err}`));
            }
        }).catch(err =>{ console.log(`ALL-FU : ${err}`)})
    })







    //// PLAEYER MANAGMENT
    socket.on('offline', () => {
        AllUsers.push(socket.id, undefined, undefined, undefined, 10000, '#00000000 def.png', '#00000000 def.png');
    });
    // login_page.js related server error tag => L-O
    socket.on('online', ({name_value , password_value}) => {
        AllUsers.LogIn(socket.id,name_value, password_value).then(user =>{
            if (user){
                socket.emit('log_answer', {
                    massage: format_error('You are logged in', 10, 'success')
                });
            }else{
                socket.emit('log_answer', {
                    massage: format_error('<strong>User game name</strong> or <strong>password</strong> is wrong.', 10, 'warning')
                });
            }
        }).catch(err =>{ console.log(`L-O : ${err}`)})
    });

    // login.js related server error tag => L-RNU
    socket.on('register_new_user' , ({name_value, password_value,role_value}) => {
        AllUsers.RegisterNewUser(name_value, password_value,role_value).then(data => {
            if (data) {
                socket.emit('register_new_user', {
                    massage: format_error('User with this name already exist', 10, 'warning')
                });
            } else {
                socket.emit('register_new_user', {
                    massage: format_error(`Thanks for registration <strong>${name_value}</strong> now please log in and enjoy the games`, 10, 'success')
                });
            }
        }).catch(err =>{ console.log(`L-RNU : ${err}`)})
    });

    // main_socket_connection.js related server error tag => MSC-FU
    socket.on('find_user', ({my_socket_id}) => {
        AllUsers.getUser(my_socket_id,socket.id).then(user => {
            socket.emit('user', {user_data : user})
        }).catch(err =>{ console.log(`MSC-FU : ${err}`)})

    });
    socket.on('ping_server', ({my_socket_id}) => {
        let ping_res = AllUsers.ping(my_socket_id)
        if (ping_res){
            socket.emit('ping_server');
        }
    });

    socket.on('remove_player_from_connection',({my_socket_id}) =>{
        AllUsers.userLeave(my_socket_id);
    })




    // menu.js related server error tag => M-GAG
    socket.on('get_all_games' , ({my_socket_id}) => {
        AllUsers.getAllGames(my_socket_id,socket.id).then(data => {
            socket.emit('get_all_games' , {games : data});
        }).catch(err =>{ console.log(`M-GAG : ${err}`)})
    });

    // create_game.js related server error tag => CG-GAGBY
    socket.on('get_all_games_by_you' , ({my_socket_id}) => {
        AllUsers.getAllYourGames(my_socket_id,socket.id).then(data => {
            socket.emit('get_all_games_by_you', {games : data});
        }).catch(err =>{ console.log(`CG-GAGBY : ${err}`)})
    });



    // shop.js related server error tag => S-RCH / S-SCHOR / S-BCHOR
    socket.on('restart_character',({my_socket_id}) => {
        AllUsers.setCharacter(my_socket_id,socket.id,'#00000000 def.png').then(data => {
        }).catch(err =>{ console.log(`S-RCH : ${err}`)})
    });
    socket.on('set_character_or_color',({my_socket_id,character_in_game}) => {
        AllUsers.setCharacter(my_socket_id,character_in_game).then(data => {
        }).catch(err =>{ console.log(`S-SCHOR : ${err}`)})
    });
    socket.on('buy_character_or_color',({my_socket_id,item}) => {
        AllUsers.buyCharacterOrColor(my_socket_iditem).then(data => {
        }).catch(err =>{ console.log(`S-BCHOR : ${err}`)})
    });



    // //GAME : G
    // // zmena udajou pre bezpecnost profilu hraca
    // function remove_player_identity(game){
    //     game.picket_picture_pc = undefined;
    //     game.player1.id_socket = undefined;
    //     if (game.player2 !== undefined){
    //         game.player2.id_socket = undefined;
    //     }
    //     return game
    // }
    // // IRG
    // function is_ready_game(game_id){
    //     let game = is_existing_game(game_id);
    //     if (game){
    //         let game_copy  = remove_player_identity(JSON.parse(JSON.stringify(game))); // Create Deep copy of object
    //         console.log('IRG : ',game_id)
    //         socket.emit('obtain_game', {game:game_copy});
    //     }else{
    //         setTimeout(is_ready_game, 100 , game_id);
    //     }
    // }
    //
    // // LTGB
    // socket.on('luck_to_game_buffer' , ({game_name,game_type,my_socket_id}) => {
    //     const player = getCurrentUser(my_socket_id);
    //     if (player === undefined){
    //         console.log("G-LTGB : Something want wrong with user")
    //     }else {
    //         search_for_free_game(game_name, game_type, player).then(answer => {
    //             if (answer !== undefined){
    //                 let game_copy  = remove_player_identity(JSON.parse(JSON.stringify(answer))); // Create Deep copy of object
    //                 socket.emit('game_buffer_answer', {answer: game_copy});
    //             }else{
    //                 console.log('LUCK TO GAME ERRROR :',answer);
    //                 socket.emit('game_buffer_answer', {answer: answer});
    //             }
    //         })
    //     }
    // })
    //
    // // : CSP
    // socket.on('create_single_player' , ({game_name,game_type,game_id,my_socket_id}) => {
    //     const player = getCurrentUser(my_socket_id);
    //     if (player === undefined){
    //         console.log("G-CSP : Something want wrong with user")
    //     }else {
    //         let game = is_existing_game(game_id);
    //         if (game){
    //             socket.emit('obtain_game', {game:game});
    //         }else{
    //             create_game(game_name,game_type,game_id,player);
    //             is_ready_game(game_id);
    //         }
    //     }
    // });
    // // : ASPG
    // socket.on('ask_single_player_game',({game_id,massage}) =>{
    //     let game = is_existing_game(game_id);
    //     if (game) {
    //         let is_you_picture = game.is_your_picture_question(massage);
    //         if (massage.certain === true && is_you_picture === true){ // spitanie sa na konkretni obrazok
    //             addPoints(1000,game.player1.id_socket,game.ask_counter_player1)
    //             if (game.player1.id !== undefined){
    //                 const db = dbService.getDbServiceInstance();
    //                 db.updateUserPoints(getCurrentUser(game.player1.id_socket)).then();
    //             }
    //
    //         }
    //         socket.emit('answer_to_is_you_picture_pc', {answer: is_you_picture})
    //     }
    // });

    //
    // // spracovanie posielania sprav pre celu hru
    // // : BM
    // socket.on('broadcast_massage',({game_id,my_socket_id,massage}) =>{// posli spravu na hru s id "game_id" od hraca "my_socket_id" a content == "massage"
    //     let broadcast_massage = {}
    //     if (massage === 'block'){// zablokuj druhemu hracovi moznost klikania
    //         broadcast_massage = format_message(game_id,my_socket_id,'unlock_btn');
    //         socket.broadcast.emit('broadcasted_massage', {broadcast_massage:broadcast_massage});
    //     }else if (massage === 'connected'){// pripojenie hraca do hry
    //         broadcast_massage = format_message(game_id,my_socket_id,massage);
    //         socket.broadcast.emit('broadcasted_massage', {broadcast_massage:broadcast_massage});
    //     }else if (massage === true || massage === false ){// otazka na ktora prichadza od hraca na server certain image pod tlacidlom guess
    //         let game = is_existing_game(game_id);
    //         let answer = game.answer_to_question(my_socket_id,massage);
    //         if (answer){ // pokial hrac odpovedat dal na otazku certain image 'button YES' v public/game.html
    //             addPoints(1000,game.player1.id_socket,game.ask_counter_player1+(game.player1.id_socket === my_socket_id ? 10:0))
    //             addPoints(1000,game.player2.id_socket,game.ask_counter_player2+(game.player1.id_socket === my_socket_id ? 0:10))
    //             if (game.player1.id !== undefined){
    //                 const db = dbService.getDbServiceInstance();
    //                 db.updateUserPoints(getCurrentUser(game.player1.id_socket)).then();
    //             }
    //             if (game.player2.id !== undefined){
    //                 const db = dbService.getDbServiceInstance();
    //                 db.updateUserPoints(getCurrentUser(game.player2.id_socket)).then();
    //             }
    //         }
    //         broadcast_massage = format_message(game_id,my_socket_id,massage);
    //         socket.broadcast.emit('broadcasted_massage', {broadcast_massage:broadcast_massage});
    //     }else{// vytvorenie obicajnej otazky
    //         let game = is_existing_game(game_id);
    //         if (game !== undefined){
    //             game.add_question(my_socket_id,massage);
    //             broadcast_massage = format_message(game_id,my_socket_id,massage);
    //             socket.broadcast.emit('broadcasted_massage', {broadcast_massage:broadcast_massage});
    //         }
    //     }
    // })
    // // : GL
    // socket.on('leave_game',({game_id,my_socket_id}) => {
    //     // odpojenie hraca s hry
    //     let game = is_existing_game(game_id);
    //     let answer_if_game_is_multiplayer = leave_game(game_id);
    //     answer_if_game_is_multiplayer.then(data => {
    //         if (data === 'inform_second_player' && game.player2 !== undefined){
    //             // prididelenie bodou ak hrac nahle odide
    //             if (game.player1.id_socket === my_socket_id){
    //                 addPoints(1000,game.player2.id_socket,10);
    //             }else if (game.player2.id_socket === my_socket_id){
    //                 addPoints(1000,game.player1.id_socket,10);
    //             }else{
    //                 console.log('G-GL : error');
    //             }
    //             if (game.player1.id !== undefined){
    //                 const db = dbService.getDbServiceInstance();
    //                 db.updateUserPoints(getCurrentUser(game.player1.id_socket)).then();
    //             }
    //             if (game.player2.id !== undefined){
    //                 const db = dbService.getDbServiceInstance();
    //                 db.updateUserPoints(getCurrentUser(game.player2.id_socket)).then();
    //             }
    //             socket.broadcast.emit('opponent_left', {who_left:game_id});
    //         }
    //     })
    // });
});
