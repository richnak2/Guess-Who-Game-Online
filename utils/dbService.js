const mysql = require('mysql');
const fs = require('fs');
let instance = null;

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'usbw',
    database : 'guesswho',
    port     : 3307
});

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('db ' + connection.state + ' id '+connection.threadId);
});


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
        // console.log(id_of_game,main_game_name,game_category_of_players,main_game_description,created)
        if (player === undefined){
            return undefined;
        }else{
            try {
                return await new Promise((resolve, reject) => {
                    const query = "UPDATE users SET type_of_character = ? , bought_characters = ?   where id = ? ";

                    connection.query(query, [player.character ,player.bought_characters , player.id], (err, results) => {
                        if (err) reject(new Error(err.message));
                        resolve(results);
                    })
                })

            } catch (error) {
                return new Error(error);
            }
        }
    }



    // create game
    async createGameMain(title, type, image, description, owner_id, is_created) {
        // console.log(title, type, image, description, owner_id, is_created)
        try {
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO games (title,type,image,description,owner_id,state) VALUES (?,?,?,?,?,?);";

                connection.query(query, [title[0],type,image,description,owner_id,is_created] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            return { inserted_id : insertId};
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

    async delete_game(game_id,user_id) {
        try {
            await new Promise((resolve, reject) => {
                const query = "DELETE FROM games where id = ? and owner_id = ?;";

                connection.query(query, [game_id,user_id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                })
            });
            await new Promise((resolve, reject) => {
                const query = "DELETE FROM game_help_descriptors where id_game = ? ;";

                connection.query(query, [game_id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                })
            });
            await new Promise((resolve, reject) => {
                const query = "DELETE FROM game_images where id_game = ? ;";

                connection.query(query, [game_id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                })
            });
            return { is_ok : true};
        } catch (error) {
            return new Error(error)
        }
    }





    // update existing game

    // async getAllData() {
    //     try {
    //         const response = await new Promise((resolve, reject) => {
    //             const query = "SELECT * FROM users;";
    //
    //             connection.query(query, (err, results) => {
    //                 if (err) reject(new Error(err.message));
    //                 resolve(results);
    //             })
    //         });
    //         // console.log(response);
    //         return response;
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }


    // async insertNewName(name) {
    //     try {
    //         const dateAdded = new Date();
    //         const insertId = await new Promise((resolve, reject) => {
    //             const query = "INSERT INTO names (name, date_added) VALUES (?,?);";
    //
    //             connection.query(query, [name, dateAdded] , (err, result) => {
    //                 if (err) reject(new Error(err.message));
    //                 resolve(result.insertId);
    //             })
    //         });
    //         return {
    //             id : insertId,
    //             name : name,
    //             dateAdded : dateAdded
    //         };
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
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

    // async deleteRowById(id) {
    //     try {
    //         id = parseInt(id, 10);
    //         const response = await new Promise((resolve, reject) => {
    //             const query = "DELETE FROM names WHERE id = ?";
    //
    //             connection.query(query, [id] , (err, result) => {
    //                 if (err) reject(new Error(err.message));
    //                 resolve(result.affectedRows);
    //             })
    //         });
    //
    //         return response === 1 ? true : false;
    //     } catch (error) {
    //         console.log(error);
    //         return false;
    //     }
    // }

    // async updateNameById(id, name) {
    //     try {
    //         id = parseInt(id, 10);
    //         const response = await new Promise((resolve, reject) => {
    //             const query = "UPDATE names SET name = ? WHERE id = ?";
    //
    //             connection.query(query, [name, id] , (err, result) => {
    //                 if (err) reject(new Error(err.message));
    //                 resolve(result.affectedRows);
    //             })
    //         });
    //
    //         return response === 1 ? true : false;
    //     } catch (error) {
    //         console.log(error);
    //         return false;
    //     }
    // }

    async find_user(name,password) {
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
    async exist_user(name) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM users WHERE game_name = ? ;";

                connection.query(query, [name], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            //console.log(response[0]);
            return response[0] === undefined ? 1 : 0;
        } catch (error) {
            return new Error(error);
        }
    }
    async register_user(name,password,role) {
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