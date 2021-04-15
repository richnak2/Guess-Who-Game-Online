const fs = require('fs');
const DB = require('./DbService');
const db = DB.getDbServiceInstance();
// let games = [];

// function all_games(){
//     return games;
// }
class AllGames{
    static games = {};

    static  counter_games = setInterval(() => {console.log(`Interval Games:  ${this.strGetAllLength()}`)},30 * 1000)

    static async push(game_name,game_type,user){
        return await new Promise((resolve, reject) => {
            const game_id = this.makeId(20)
            let game = new NewGame(game_name , game_type, game_id, user);
            const game_info = game.findGameInfoDb()
            game_info.then(game_info_result =>{
                if (typeof game_info_result === 'boolean') {
                    const game_paths = game.makePaths()
                    if (game_paths) {
                        const game_finished = game.shuffleImages()
                        if (game_finished) {
                            this.games[game_id] = game;
                            user.setGameId(game_id)
                            // console.log(game_id)
                            // console.log(this.games)

                            console.log(`Games : ${this.strGetAllLength()}`)
                            resolve(this.games[game_id])

                        }
                    }
                }
            }).catch(err => {return new Error(` game_info => ${err}`)})
        }).catch(err => {return new Error(`AllGames.push => game_info => ${err}`)})

    }
    static async searchForFreeGame(game_name,game_type,user){
        return new Promise((resolve, reject) => {
            for (let certain_game in this.games) {
                if (this.games.hasOwnProperty(certain_game)) {
                    // console.log('loocking',this.games[certain_game].toJSON())
                    if (this.games[certain_game].player2Exist()){
                        if (this.games[certain_game].getGameName() === game_name && this.games[certain_game].getGameType() === game_type ){
                            this.games[certain_game].addUser2(user)
                            return resolve(this.games[certain_game])
                        }
                    }
                }
            }
            resolve(false)
        }).catch(err => {return new Error(`AllGames.searchForFreeGame => ${err}`)})
    }

    static async isYourPictureQuestionFromPlayer(game_id,massage){
        const game = this.isExistingGame(game_id)  === undefined ? false : this.isExistingGame(game_id)
        if (game){
            return game.isYourPickedPictureQuestion(massage)
        }else{
            return new Error('Cannot find your game.')
        }
    }

    static makeId(length) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    static strGetAllLength(){
        return `Games count : ${Object.keys(this.games).length}`;
    }
    static isExistingGame(game_id){
        return this.games[game_id];
    }
    static leaveGame(game_id,id_of_player_socket_who_left){
        if (this.games[game_id].player2Exist() !== undefined){
            this.games[game_id].player1.setGameId(undefined)
            this.games[game_id].player2.setGameId(undefined)
            if (this.games[game_id].player1.id_socket === id_of_player_socket_who_left){
                this.games[game_id].player2.addPoints(100).then(r => {
                    this.deleteGame(game_id)
                }) // pokial sa hrac odpoji s prebiehajucej hri
            }else{
                this.games[game_id].player1.addPoints(100).then(r => {
                    this.deleteGame(game_id)
                }) // pokial sa hrac odpoji s prebiehajucej hri
            }
        }
        this.deleteGame(game_id)
    }

    static deleteGame(game_id){
        delete this.games[game_id];
        console.log(`Leave AllGames : ${this.strGetAllLength()}`)
    }
}
class NewGame{
    constructor(game_name,type,id,player1) {
        this.game_name = game_name;
        this.type = type;
        this.id = id;
        this.list_of_images = undefined;
        this.list_of_definers = undefined;
        this.state = false;
        this.player1 = player1
        this.player2 = undefined;
        this.picket_picture_player1 = undefined;
        this.picket_picture_player2 = undefined;
        this.picket_picture_pc = undefined;
        this.ask_counter_player1 = 0; // koli tomu ze musi nastat aspon 1 otazka zo strani tohto hraca
        this.ask_counter_player2 = 1; // koli tomu ze division by 0
        this.define_end_of_the_game = undefined;
    }

    getId(){
        return this.id;
    }
    getGameName(){
        return this.game_name
    }
    getGameType(){
        return this.type
    }
    addUser2(player2){
        player2.setGameId(this.player1.getGameId())
        this.player2 = player2;
        return true
    }
    player2Exist(){
        return this.player2 === undefined
    }
    toJSON(){
        return {
            game_name : this.game_name ,
            type : this.type ,
            list_of_images : this.list_of_images ,
            list_of_definers : this.list_of_definers,
            player1 : this.player1.getDataForGame(),
            player2 : this.player2 !== undefined ? this.player2.getDataForGame() : undefined
        }
    }
    async findGameInfoDb(){
        return await new Promise((resolve, reject) => {
            let id  = undefined;
            const result = db.getGameId(this.game_name);
            result.then(data1 => {
                id = data1[0]['id'];
                const result2 = db.getGameHelpDescriptor(id);
                result2.then(data2 => {
                    this.list_of_definers = data2;
                    const result3 = db.getGameImage(id);
                    result3.then(data3 => {
                        this.list_of_images = data3;
                        resolve(true);

                    }).catch(err => { new Error(`db.getGameImage => ${err}`)});
                }).catch(err => { new Error(`db.getGameHelpDescriptor => ${err}`)});
            }).catch(err => { new Error(`db.getGameId => ${err}`)});
        }).catch(err => {return new Error(`findGameInfoDb ${err}`)})

    }
    makePaths(){
        let files = fs.readdirSync('./public/images/'+this.game_name);
        for (let file_index = 0 ; file_index < files.length ; file_index++){
            if (files[file_index].includes('.') === false && files[file_index] === 'images'){
                let path = './public/images/'+this.game_name+'/'+files[file_index];
                let dirs = fs.readdirSync(path);
                for (let image_index = 0 ;image_index < dirs.length;image_index++){
                    for (let game_image_index = 0 ;game_image_index < this.list_of_images.length;game_image_index++){
                        if (dirs[image_index] === this.list_of_images[game_image_index]['image']){
                            this.list_of_images[game_image_index]['image'] = path.replace('./public','.')+'/'+dirs[image_index];
                            this.list_of_images[game_image_index]['description_control'] = this.list_of_images[game_image_index]['description_control'].split(',');// tuna musi byt ciarka ,
                            break;
                        }
                    }
                }
            }else if (files[file_index].includes('.') === false && files[file_index] !== 'images'){
                let path = './public/images/'+this.game_name+'/'+files[file_index];
                let dirs = fs.readdirSync(path);
                for (let image_index = 0 ;image_index < dirs.length;image_index++){
                    for (let game_image_index = 0 ;game_image_index < this.list_of_definers.length;game_image_index++){
                        if (dirs[image_index] === this.list_of_definers[game_image_index]['image']){
                            this.list_of_definers[game_image_index]['image'] =  path.replace('./public','.')+'/'+dirs[image_index];
                            break;
                        }
                    }
                }
            }
        }
        return true
    }
    shuffleImages() {
        if (this.type === 'pc'){
            let max_length = (this.list_of_images.length >= 30) ? 30 : 25;
            if (this.list_of_images.length < 25){
                max_length = this.list_of_images.length;
            }
            if (this.list_of_images.length >= max_length){
                let new_array_for_this_game = []
                let index = undefined;
                for (let max_images_in_game = 0 ; max_images_in_game < max_length; max_images_in_game++){
                    index = Math.floor(Math.random() * this.list_of_images.length)
                    new_array_for_this_game.push(this.list_of_images[index]);
                    this.list_of_images.splice(index,1);
                }
                this.list_of_images = new_array_for_this_game;
                index = Math.floor(Math.random() * this.list_of_images.length)
                this.picket_picture_pc = this.list_of_images[index];
                return true
            }
        }else{
            let max_length = (this.list_of_images.length >= 30) ? 30 : 25;
            if (this.list_of_images.length < 25){
                max_length = this.list_of_images.length;
            }
            if (this.list_of_images.length >= max_length) {
                let new_array_for_this_game = []
                let index = undefined;
                for (let max_images_in_game = 0; max_images_in_game < max_length; max_images_in_game++) {
                    index = Math.floor(Math.random() * this.list_of_images.length)
                    new_array_for_this_game.push(this.list_of_images[index]);
                    this.list_of_images.splice(index, 1);
                }
                this.list_of_images = new_array_for_this_game;
                this.picket_picture_pc = undefined;//this.list_of_images[index];
                return true
            }
        }
    }
    async isYourPickedPictureQuestion(massage ){
        return await new Promise((resolve, reject) => {
            this.ask_counter_player1 ++;
            if (massage.certain){
                let you_found_picture = this.picket_picture_pc.image.split('/').pop() === massage.src.split('/').pop();
                if (you_found_picture){
                    const points_add = this.player1.addPoints(1000/this.ask_counter_player1)
                    points_add.then(res => {
                        this.player1.setGameId(undefined)
                        AllGames.leaveGame(this.id)
                        resolve(you_found_picture);
                    })
                }else{
                    resolve(you_found_picture);
                }
            }else{
                resolve(this.picket_picture_pc.description_control.includes(massage.title));
            }
        }).catch(err => {return new Error(`isYourPickedPictureQuestion => ${err}`)})

    }
    addQuestionMultiplayer(player, massage){
        if (player.id_socket === this.player1.id_socket){
            this.ask_counter_player1 ++;
        }else{
            this.ask_counter_player2 ++;
        }
        if (massage.certain ){
            this.define_end_of_the_game = massage;
        }else{
            this.define_end_of_the_game = undefined;
        }

        // console.log('GAME MASSSAGE !!!! : ',massage)
    }
    async answerToQuestionMultiplayer(player, massage){
        return await new Promise((resolve, reject) => {
            if (this.define_end_of_the_game !== undefined){
                console.log('masage if certain ',massage)
                if (massage.certain){
                    const points_add_player1 = this.player1.addPoints(1000/ ((this.player1.id_socket !== player.id_socket ? 10:0 )+ this.ask_counter_player1))
                    points_add_player1.then(res => {
                        this.player1.setGameId(undefined)

                    }).then(() => {
                        const points_add_player2 = this.player2.addPoints(1000/((this.player2.id_socket !== player.id_socket ? 10:0 )+ this.ask_counter_player2))
                        points_add_player2.then(res => {
                            this.player2.setGameId(undefined)
                            return resolve(massage.certain)
                        })
                    }).catch(err => new Error(`answerToQuestionMultiplayer => certain image => ${err}`))
                }else{
                    return resolve(massage.certain)
                }
            }else{
                console.log('masage if NOT certain ',massage)
                return resolve(massage)
            }
        }).catch(err => {return new Error(`answerToQuestionMultiplayer => ${err}`)})

    }
}


module.exports = AllGames