const mysql = require('mysql');
// const fs = require('fs');
let instance = null;

const db_config  = {
    host     : 'eu-cdbr-west-03.cleardb.net',
    user     : 'b6ad123aa3cdad',
    password : '67d10f64',
    database : 'heroku_3f4e76140d45542',
    port     : 3306
};

let connection;
function handleDisconnect() {
    connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                    // the old one cannot be reused.

    connection.connect(function(err) {              // The server is either down
        if(err) {                                     // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 500); // We introduce a delay before attempting to reconnect,  -original je 2000
        }                                     // to avoid a hot loop, and to allow our node script to
        else{
            console.log('db ' + connection.state + ' id '+connection.threadId);
        }
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
        //console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            console.log('db error', err);
            throw err;                                  // server variable configures this)
        }
    });
}

handleDisconnect();

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }
    // user managment
    async updateUserPoints(player){
        // console.log(id_of_game,main_game_name,game_category_of_players,main_game_description,created)
        if (player === undefined){
            return undefined;
        }else{
            try {
                return await new Promise((resolve, reject) => {
                    const query = "UPDATE users SET points = ?  where id = ? ";

                    connection.query(query, [player.points,player.id], (err, results) => {
                        if (err) reject(new Error(err.message));
                        resolve(results);
                    })
                })

            } catch (error) {
                return new Error(error);
            }
        }
    }
    async updateUserCharacter(player){
        try {
            return await new Promise((resolve, reject) => {
                const query = "UPDATE users SET type_of_character = ? , bought_characters = ?  , points = ?  where id = ? ";

                connection.query(query, [`${player.color} ${player.character}` ,player.bought_characters , player.points ,player.id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

        } catch (error) {
            return new Error(error);
        }
    }



    // create game
    async createGameMain(title, type, image, description, owner_id, is_created) {
        // console.log(title, type, image, description, owner_id, is_created)
        try {
            return await new Promise((resolve, reject) => {
                const query = "INSERT INTO games (title,type,image,description,owner_id,state) VALUES (?,?,?,?,?,?);";

                connection.query(query, [title,type,image,description,owner_id,is_created] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            }).catch(err => { return new Error(`db.createGameMain => ${err}`)});
            // return { inserted_id : insertId};
        } catch (error) {
            return new Error(error)
        }
    }
    async createGameDescriptors(game_id, description_type_button, description, img) {
        try {
            await new Promise((resolve, reject) => {
                const query = "INSERT INTO game_help_descriptors ( id_game, type, description, image) VALUES (?,?,?,?);";

                connection.query(query, [game_id,description_type_button,description,img] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                })
            });
            return { is_ok : true};
        } catch (error) {
            return new Error(error)
        }
    }
    async createGameImages(game_id, img, description) {
        // console.log('NEW IMG OF THE GAME IS BEING ADDED ',game_id,img,description)
        if (description === undefined){
            description = '';
        }
        try {
            await new Promise((resolve, reject) => {
                const query = "INSERT INTO game_images( id_game, image,description_control) VALUES (?,?,?);";

                connection.query(query, [game_id,img,description] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                })
            });
            return { is_ok : true};
        } catch (error) {
            return new Error(error)
        }
    }


    // remove existing game
    removeGame(game_id,user_id){
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM games where id = ? and owner_id = ?;";

            connection.query(query, [game_id,user_id] , (err, result) => {
                if (err) reject(new Error(err.message));
                resolve(result);
            })
        }).catch(err => {return new Error(`removeGame => ${err}`)})
    }
    removeGameHelpDescriptors(game_id){
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM game_help_descriptors where id_game = ? ;";

            connection.query(query, [game_id] , (err, result) => {
                if (err) reject(new Error(err.message));
                resolve(result);
            })
        }).catch(err => {return new Error(`removeGameHelpDescriptors => ${err}`)})
    }
    removeGameImages(game_id){
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM game_images where id_game = ? ;";

            connection.query(query, [game_id] , (err, result) => {
                if (err) reject(new Error(err.message));
                resolve(result);
            })
        }).catch(err => {return new Error(`removeGameImages => ${err}`)})
    }
    async deleteGame(game_id, user_id) {
        try {
            return await new Promise((resolve, reject) => {
                this.removeGame(game_id,user_id).then(res =>{
                    this.removeGameHelpDescriptors(game_id).then(res =>{
                        this.removeGameImages(game_id).then(res => {
                            resolve('db.deleteGame : Success')
                        }).catch(err => { reject(`deleteGame =>  ${err}`)})
                    }).catch(err => { reject(`deleteGame =>  ${err}`)})
                }).catch(err => { reject(`deleteGame =>  ${err}`)})
            }).catch(err => { new Error(`deleteGame.promise => ${err}`)})
        } catch (error) {
            console.log('just error promis problem')
            return new Error(error)
        }
    }

    async getGameId(game_name){
        try {
            // console.log("GAMESSSs : ",response);
            return await new Promise((resolve, reject) => {
                const query = "SELECT id FROM games  where title = ?";

                connection.query(query, [game_name], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            }) ;
        } catch (error) {
            return new Error(error)
        }
    }
    async getGameHelpDescriptor(id){
        try {
            return await new Promise((resolve, reject) => {
                const query = "SELECT * FROM game_help_descriptors  where id_game = ?";

                connection.query(query, [id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            }) ;
        } catch (error) {
            return new Error(error);
        }
    }
    async getGameImage(id){
        try {
            return await new Promise((resolve, reject) => {
                const query = "SELECT * FROM game_images  where id_game = ?";

                connection.query(query, [id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            }) ;
        } catch (error) {
            return new Error(error);
        }
    }

    async getAllGames(owner_id){
        try {
            return await new Promise((resolve, reject) => {
                const query = "SELECT * FROM games where state = 1 or owner_id = ? ";

                connection.query(query, [owner_id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            }) ;
        } catch (error) {
            return new Error(error);
        }
    }


    // Update existing games
    async updateYourGameMain(id_of_game,main_game_name,game_category_of_players,main_game_description,created){
        // console.log(id_of_game,main_game_name,game_category_of_players,main_game_description,created)
        try {
            return await new Promise((resolve, reject) => {
                const query = "UPDATE games SET title = ? , type = ? , description = ? , state = ? where id = ? ";

                connection.query(query, [main_game_name[1], game_category_of_players, main_game_description, created, id_of_game], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

        } catch (error) {
            return new Error(error);
        }
    }
    async removeAllGameDirectories(id_of_game){
        try {
            return await new Promise((resolve, reject) => {
                const query = "DELETE FROM game_help_descriptors WHERE id_game = ?";

                connection.query(query, [id_of_game], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

        } catch (error) {
            return new Error(error);
        }
    }
    async removeAllGameImages(id_of_game){
        try {
            return await new Promise((resolve, reject) => {
                const query = "DELETE FROM game_images WHERE id_game = ?";

                connection.query(query, [id_of_game], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

        } catch (error) {
            return new Error(error);
        }
    }

    async getAllYourGames(id_owner){
        try {
            let return_object = {};
            return await new Promise((resolve, reject) => {
                const query = "SELECT * FROM games where owner_id = ? ";

                connection.query(query, [id_owner], (err, results) => {
                    if (err) reject(new Error(err.message));

                    return_object = results;
                    for (let index_game = 0; index_game < results.length; index_game++) {
                        let res1 = this.getGameHelpDescriptor(results[index_game].id);
                        res1.then(data => {

                            return_object[index_game]['game_descriptors'] = data;

                        })
                        let res2 = this.getGameImage(results[index_game].id);
                        res2.then(data => {

                            return_object[index_game]['game_images'] = data;
                            if (index_game === results.length - 1) {

                                console.log('UZ KONCIM');
                                resolve(return_object);
                            }
                        })
                    }
                })
            })

        } catch (error) {
            return new Error(error);
        }
    }

    async findUser(name, password) {
        try {
            console.log("DB LOGIN : ",name,password);
            // console.log("FIND USER DB : ",response);
            return await new Promise((resolve, reject) => {
                const query = "SELECT * FROM users WHERE game_name = ? AND password = ?;";

                connection.query(query, [name, password], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
        } catch (error) {
            return new Error(error);
        }
    }
    async userExist(name) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM users WHERE game_name = ? ;";

                connection.query(query, [name], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // inverzna odpoved ze nexistuje existuje
            return response[0] === undefined ? 1 : 0;
        } catch (error) {
            return new Error(error);
        }
    }
    async registerUser(name, password, role) {
        console.log(name,password,role);
        try {
            // console.log('RESPONSE OF REGISTER ',response);
            return await new Promise((resolve, reject) => {
                const query = "INSERT INTO users (game_name, password,role) VALUES (?,?,?);";

                connection.query(query, [name, password, role], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
        } catch (error) {
            return new Error(error);
        }
    }

}

module.exports = DbService;