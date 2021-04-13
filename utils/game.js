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
    static isYourPictureQuestionFromPlayer(game_id,massage){
        const exist = this.isExistingGame(game_id)
        const game = exist === undefined ? false : exist
        if (game){
            return game.is_your_picture_question(massage)
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
        return games[game_id];
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
    toJSON(){
        return {
            game_name : this.game_name ,
            type : this.type ,
            id : this.id ,
            list_of_images : this.list_of_images ,
            list_of_definers : this.list_of_definers
        }
    }
    async findGameInfoDb(){
        return await new Promise((resolve, reject) => {
            let id  = undefined;
            const result = db.getGameId(this.game_name);
            console.log('locking for '+this.game_name)
            result.then(data1 => {
                id = data1[0]['id'];
                console.log('locking for db game id'+id)
                const result2 = db.getGameHelpDescriptor(id);
                result2.then(data2 => {
                    console.log('locking for db getGameHelpDescriptor'+data2)
                    this.list_of_definers = data2;
                    const result3 = db.getGameImage(id);
                    result3.then(data3 => {
                        console.log('locking for db getGameImage'+data3)
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
    is_your_picture_question(game_id, massage ){
        if (massage.certain){
            this.ask_counter_player1 ++;
            let you_found_picture = this.picket_picture_pc.image.split('/').pop() === massage.src.split('/').pop();
            if (you_found_picture){
                leave_game(this.id).then(r => console.log('deleted game id:'+this.id));
                return you_found_picture;
            }

        }else{
            this.ask_counter_player1 ++;
            return this.picket_picture_pc.description_control.includes(massage.title)
        }
    }
    add_question(player_name,massage){
        if (player_name === this.player1.id_socket){
            this.ask_counter_player1 ++;
        }else{
            this.ask_counter_player2 ++;
        }
        if (massage.certain ){
            this.define_end_of_the_game = massage;
        }else{
            this.define_end_of_the_game = undefined;
        }

        console.log('GAME MASSSAGE !!!! : ',massage)
    }
    answer_to_question(player_name,massage){
        if (this.define_end_of_the_game !== undefined){
            if (massage){
                console.log('pytam sa ak uz bola odpoved certain');
                this.state = true;
                leave_game(this.id).then(r => console.log('deleted game id:'+this.id));
                console.log('CERTAIN ACTUAL QUESTION ',this.define_end_of_the_game,player_name,massage,this.ask_counter_player2,this.ask_counter_player1);
                return massage
            }
        }
    }
}


async function search_for_free_game(game_name,game_type,player){ // tuna asi chyba id hry pre zistenie komu patry hra
    for (let index_game = 0; index_game < games.length; index_game++) {
        if (games[index_game].player1.id_socket === player.id_socket ){
            console.log('serach for game : Found New Created Game ');
            return games[index_game];
        }
        if (game_name === games[index_game].game_name && game_type === games[index_game].type && games[index_game].player2 === undefined){//  || games[index_game].player1 === undefined
            console.log('serach for game : Found Game ');
            games[index_game].player2 = player
            return games[index_game];
        }
    }
    console.log('serach for game : Not Found Game  ');
    return undefined;

}
function is_existing_game(game_id){
    console.log('ALL GAMSE : ',games.length,);//all_games()
    for (let index_game = 0 ; index_game < games.length; index_game++){
        if (games[index_game].id === game_id){
            return games[index_game];
        }
    }
    console.log('game does not exist ', game_id );
    return undefined;
}
async function leave_game(game_id){
    console.log('ALL GAMSES : '+games.length)
    console.log('REMOVING GAME : ',game_id)
    for (let index_game = 0; index_game < games.length; index_game++) {
        if (games[index_game].id === game_id && games[index_game].type === 'pc'){
            console.log('LEAVE PC')
            games.splice(index_game, 1)
            return;
        }else if (games[index_game].id === game_id && games[index_game].state === false){//(  games[index_game].type === 'kid' ||  games[index_game].type === 'kid')){
            console.log('LEAVE game id id_game state false')
            games.splice(index_game, 1)
            return 'inform_second_player';

        }else if (games[index_game].id === game_id && games[index_game].state === true){//(  games[index_game].type === 'kid' ||  games[index_game].type === 'kid')){
            console.log('LEAVE game id id_game state true')
            games.splice(index_game, 1)
            return;

        }else if (games[index_game].id === game_id){
            console.log('LEAVE game id id_game just leave becouse other player is not connecting');
            games.splice(index_game, 1);
            return undefined
        }else{
            console.log('Did not find game with id :', game_id,' != ',games[index_game].id);
        }
    }
}
function create_game(game_name,type,id,player1){
    console.log('CREATING GAME : ',game_name,type,id)
    new Game(game_name,type,id,player1);
}
class Game {
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
        this.find_info_game_db();
    }
    find_info_game_db(){
        const db = dbService.getDbServiceInstance();
        let id  = undefined;
        const result = db.getGameId(this.game_name);
        result.then(data1 => {
            // console.log("DB ID : ",data1);
            id = data1[0]['id'];
            const result2 = db.getGameHelpDescriptor(id);
            result2.then(data2 => {
                // console.log("DB DESCRIPTION : ",data2);
                this.list_of_definers = data2;
                const result3 = db.getGameImage(id);
                result3.then(data3 => {
                    // console.log("DB IMAGES : ",data2);
                    this.list_of_images = data3;
                    this.make_paths();

                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }
    make_paths(){
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
        this.finish_creation_of_game();
    }
    finish_creation_of_game() {
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
                games.push(this);

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
                games.push(this);
            }
        }
    }
    is_your_picture_question( massage ){
        if (massage.certain){
            this.ask_counter_player1 ++;
            let you_found_picture = this.picket_picture_pc.image.split('/').pop() === massage.src.split('/').pop();
            if (you_found_picture){
                leave_game(this.id).then(r => console.log('deleted game id:'+this.id));
                return you_found_picture;
            }

        }else{
            this.ask_counter_player1 ++;
            return this.picket_picture_pc.description_control.includes(massage.title)
        }
    }
    add_question(player_name,massage){
        if (player_name === this.player1.id_socket){
            this.ask_counter_player1 ++;
        }else{
            this.ask_counter_player2 ++;
        }
        if (massage.certain ){
            this.define_end_of_the_game = massage;
        }else{
            this.define_end_of_the_game = undefined;
        }

        console.log('GAME MASSSAGE !!!! : ',massage)
    }
    answer_to_question(player_name,massage){
        if (this.define_end_of_the_game !== undefined){
            if (massage){
                console.log('pytam sa ak uz bola odpoved certain');
                this.state = true;
                leave_game(this.id).then(r => console.log('deleted game id:'+this.id));
                console.log('CERTAIN ACTUAL QUESTION ',this.define_end_of_the_game,player_name,massage,this.ask_counter_player2,this.ask_counter_player1);
                return massage
            }
        }
    }
}

module.exports = AllGames