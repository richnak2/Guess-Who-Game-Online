// Vytvorenie Express aplikacie
const express = require("express");
const app = express();

// Potrebne kniznice na nastavenie ciest
const http = require('http');
const path = require('path');

// Kniznica na spracovanie requestov
const bodyParser = require("body-parser");

// Include file s DB - database / GB - game builder
const DB = require('./utils/DbService');
const db = DB.getDbServiceInstance();
const FM = require('./utils/FileManager');
const FileManager = FM.getFileManagerInstance()
const AllUsers = require('./utils/users');
const AllGames = require('./utils/game');
// const AllUsers = AL.getAllUsersInstance();


// Vytvorenie a spracovanie socketovej stranky
const socket_io = require('socket.io');
const server = http.createServer(app);
const io = socket_io(server);


// Pripojenie konkretneho usera do aplikacie

const {format_message,format_error} = require('./utils/messages');

// const {create_game,is_existing_game,search_for_free_game,leave_game,AllGames} = require('./utils/game');
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

function printError(err){
    console.log(err)
}

io.on('connection', socket => {

    // FileManager.js related server error tag => FM-DG
    socket.on('exist_dir',({dir_name})=>{
        socket.emit('exist_dir',{exist : FileManager.lookFolders(dir_name)});
    })

    socket.on('delete_game' , ({game_id,title,my_socket_id}) =>{
        AllUsers.getUser(my_socket_id).then(user => {
            if (user.getId()){
                FileManager.deleteFolderServer(title)
                const result = db.deleteGame(game_id, user.getId());
                result.then(removed_massage_db => {
                    printError(`FM-DG => ${removed_massage_db}`)
                    socket.emit('error_massage',{error_massage : format_error('Game has been successfully deleted',10,'success')})
                }).catch(err => {
                    printError(`FM-DG => db.deleteGame.catch => ${err}`)
                    socket.emit('error_massage',{error_massage:format_error('Something want wrong with database, cannot delete this game',20,'danger')})

                });
            }else{
                printError("FM-DG => This user should not be able to delete games")
                socket.emit('error_massage',{error_massage:format_error('You should not be here',100,'danger')})

            }
        }).catch(err =>{
            printError(`FM-DG => ${err}`)
            socket.emit('error_massage',{error_massage:format_error('You are not allowed to delete games',100,'danger')})

        })
    });


    //// PLAEYER MANAGMENT
    socket.on('offline', () => {
        AllUsers.push(socket.id, undefined, undefined, undefined, 10000, '#00000000 def.png', '#00000000 def.png');
    });
    // login_page.js related server error tag => L-O
    socket.on('online', ({name_value , password_value}) => {
        AllUsers.logIn(socket.id,name_value, password_value).then(log_in =>{
            socket.emit('log_answer', {massage: log_in})
        }).catch(err =>{
            printError(`L-O => ${err}`)
        })
    });

    // login.js related server error tag => L-RNU
    socket.on('register_new_user' , ({name_value, password_value,role_value}) => {
        AllUsers.registerNewUser(name_value, password_value,role_value).then(registered => {
            socket.emit('register_new_user', {massage: registered})
        }).catch(err =>{
            printError(`L-RNU => ${err}`)
        })
    });

    // main_socket_connection.js related server error tag => MSC-FU
    socket.on('find_user', ({my_socket_id}) => {
        AllUsers.getUserData(my_socket_id,socket.id).then(user => {
            socket.emit('user', {user_data : user})
        }).catch(err =>{
            socket.emit('error_massage', {error_massage : format_error(`MSC-FU => ${err}` , 30, 'danger')})
            printError(`MSC-FU => ${err}`)
        })
    })

    socket.on('ping_server', ({my_socket_id}) => {
        AllUsers.ping(my_socket_id).then().catch( err => {
            printError(`MSC-PS => ${err}`)
            socket.emit('ping_server')
        })
    })

    socket.on('remove_player_from_connection',({my_socket_id}) =>{
        AllUsers.userLeave(my_socket_id);
    })




    // menu.js related server error tag => M-GAG
    socket.on('get_all_games' , ({my_socket_id}) => {
        AllUsers.getAllGames(my_socket_id).then(data => {
            socket.emit('get_all_games' , {games : data})
        }).catch(err =>{
            printError(`M-GAG => ${err}`)
            socket.emit('error_massage', {error_massage : format_error(`M-GAG => ${err}` , 30, 'danger')})
        })
    })

    // create_game.js related server error tag => CG-GAGBY
    socket.on('get_all_games_by_you' , ({my_socket_id}) => {
        AllUsers.getAllYourGames(my_socket_id).then(data => {
            socket.emit('get_all_games_by_you', {games : data})
        }).catch(err =>{
            printError(`CG-GAGBY => ${err}`)
            socket.emit('error_massage', {error_massage : format_error(`CG-GAGBY => ${err}` , 30, 'danger')})
        })
    })



    // shop.js related server error tag => S-RCH / S-SCHOR / S-BCHOR
    socket.on('restart_character',({my_socket_id}) => {
        AllUsers.setCharacter(my_socket_id,'#00000000 def.png').then(() => {
        }).catch(err => {
            printError(`S-RCH => ${err}`)
            socket.emit('error_massage', {error_massage: format_error(`S-RCH => ${err}`, 30, 'danger')})
        })
    });
    socket.on('set_character_or_color',({my_socket_id,character_in_game}) => {
        AllUsers.setCharacter(my_socket_id,character_in_game).then(() => {
        }).catch(err => {
            printError(`S-RCH => ${err}`)
            socket.emit('error_massage', {error_massage: format_error(`S-SCHOR => ${err}`, 30, 'danger')})
        })
    });
    socket.on('buy_character_or_color',({my_socket_id,item}) => {
        AllUsers.buyCharacterOrColor(my_socket_id,item).then(() => {
        }).catch(err => {
            printError(`S-BCHOR => ${err}`)
            socket.emit('error_massage', {error_massage: format_error(`S-BCHOR => ${err}`, 30, 'danger')})
        })
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
    // LTGB
    socket.on('luck_to_game_buffer' , ({game_name,game_type,my_socket_id}) => {
        AllUsers.getUser(my_socket_id).then(user => {
            const exist = AllGames.searchForFreeGame(game_name,game_type,user)
            exist.then(new_game => {
                if (new_game){
                    socket.join(user.getGameId())
                    io.to(user.getGameId()).emit('obtain_game', {game:new_game.toJSON()});
                }else{
                    const game = AllGames.push(game_name,game_type,user)
                    game.then(new_game => {
                        socket.join(user.getGameId())
                    }).catch(err => {new Error(`luck_to_game_buffer => AllGames.push => ${err}`)})
                }
            }).catch(err => {new Error(`AllGames.searchForFreeGame => ${err}`)})
        }).catch(err =>{
            socket.emit('error_massage',{error_massage:format_error(`Something want wrong.\n ${err}`,100,'danger')})
        });
    });


    socket.on('create_single_player' , ({game_name,game_type,my_socket_id}) => {
        AllUsers.getUser(my_socket_id).then(user => {
            const game = AllGames.push(game_name,game_type,user)
            game.then(new_game => {
                socket.join(user.getGameId())
                socket.emit('obtain_game', {game:new_game.toJSON()});
            })
        }).catch(err =>{
            socket.emit('error_massage',{error_massage:format_error(`Something want wrong.\n ${err}`,100,'danger')})
        });

    });


    // game.js
    socket.on('ask_single_player_game',({my_socket_id,massage}) =>{
        AllUsers.getUser(my_socket_id).then(user => {
            const is_you_picture = AllGames.isYourPictureQuestionFromPlayer(user.getGameId(),massage);
            is_you_picture.then(answer_to_question_form_server => {
                io.to(user.getGameId()).emit('answer_to_is_you_picture_pc', {answer: answer_to_question_form_server})
            })

        }).catch(err =>{
            socket.emit('error_massage',{error_massage:format_error(`Something want wrong.\n ${err}`,100,'danger')})
        });
    });
    socket.on('leave_game',({my_socket_id}) => {
        AllUsers.getUser(my_socket_id).then(user => {
                if (user.getGameId() !== undefined ){
                    AllGames.leaveGame(user.getGameId(),user.getSocketId())
                    socket.broadcast.to(user.getGameId()).emit('opponent_left')
                    user.setGameId(undefined)
                }
            }).catch(err =>{
            socket.emit('error_massage',{error_massage:format_error(`Something want wrong.\n ${err}`,100,'danger')})
        });
    })
    //
    // // spracovanie posielania sprav pre celu hru
    // // : BM
    socket.on('multiplayer_massage',({my_socket_id,massage}) =>{
        if (massage === true || massage === false ){// otazka na ktora prichadza od hraca na server certain image pod tlacidlom guess
            let player = AllUsers.getUser(my_socket_id)
            player.then(user => {
                let game = AllGames.isExistingGame(user.getGameId());
                if (game !== undefined) {
                    const massage_from_server = game.answerToQuestionMultiplayer(user, massage);
                    massage_from_server.then(answer => {
                        socket.broadcast.to(user.getGameId()).emit('multiplayer_massage', {broadcast_massage: massage});
                    })
                }
            }).catch(err => printError(`certain => ${err}`))



            // let game = is_existing_game(game_id);
            // let answer = game.answer_to_question(my_socket_id,massage);
            // if (answer){ // pokial hrac odpovedat dal na otazku certain image 'button YES' v public/game.html
            //     addPoints(1000,game.player1.id_socket,game.ask_counter_player1+(game.player1.id_socket === my_socket_id ? 10:0))
            //     addPoints(1000,game.player2.id_socket,game.ask_counter_player2+(game.player1.id_socket === my_socket_id ? 0:10))
            //     if (game.player1.id !== undefined){
            //         const db = dbService.getDbServiceInstance();
            //         db.updateUserPoints(getCurrentUser(game.player1.id_socket)).then();
            //     }
            //     if (game.player2.id !== undefined){
            //         const db = dbService.getDbServiceInstance();
            //         db.updateUserPoints(getCurrentUser(game.player2.id_socket)).then();
            //     }
            // }
            // socket.broadcast.to(user.getGameId()).emit('multiplayer_massage', {broadcast_massage:massage});
        }else{// vytvorenie obicajnej otazky
            let player = AllUsers.getUser(my_socket_id)
            player.then(user =>{
                let game = AllGames.isExistingGame(user.getGameId());
                if (game !== undefined){
                    game.addQuestionMultiplayer(user,massage);
                    socket.broadcast.to(user.getGameId()).emit('multiplayer_massage', {broadcast_massage:massage});
                }
            }).catch(err => printError(`normal => ${err}`))

        }
    })
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
