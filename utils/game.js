const fs = require('fs');
const dbService = require('./dbService');
let games = [];

function all_games(){
    return games;
}

async function search_for_free_game(game_name,game_type,player){ // tuna asi chyba id hry pre zistenie komu patry hra
    for (let index_game = 0; index_game < games.length; index_game++) {
        // console.log('Game title : ', game_name , games[index_game].game_name)
        // console.log('Game type : ', game_type , games[index_game].type )
        // console.log('Game player 2 : ', games[index_game].picket_picture_player2)
        if (games[index_game].player1 === player || games[index_game].player2 === player){ //.id_socket
            console.log('SAME PLayer reconnecting')
            return games[index_game];
        }
        if (game_name === games[index_game].game_name && game_type === games[index_game].type && games[index_game].player2 === undefined){//  || games[index_game].player1 === undefined
            console.log('I FOND A GAME !!!!!!');
            // mozno  nutna uprava player odstranenie urcitich parametrov
            games[index_game].player2 = player//{...player}
            // games[index_game].player2.id_socket = undefined;
            return games[index_game];
        }
    }
    // games.forEach(game =>{
    //
    // });
    return undefined;

}
function is_existing_game(game_id){
    // console.log(games);

    for (let index_game = 0 ; index_game < games.length; index_game++){
        // console.log('GAME IM LOOKING FOR : ',games[index_game].id, game_id );
        if (games[index_game].id === game_id){

            return games[index_game];
        }
    }
}
function leave_game(game_id){
    console.log('ALL GAMSES : '+games.length)
    for (let index_game = 0; index_game < games.length; index_game++) {
        if (games[index_game].id === game_id && games[index_game].type === 'pc'){
            console.log('LEAVE PC')
            games.splice(index_game, 1)
        }else if (games[index_game].id === game_id && games[index_game].state === false){//(  games[index_game].type === 'kid' ||  games[index_game].type === 'kid')){
            console.log('LEAVE game id id_game state false')
            games.splice(index_game, 1)
            return 'inform_second_player';

        }else if (games[index_game].id === game_id && games[index_game].state === true){//(  games[index_game].type === 'kid' ||  games[index_game].type === 'kid')){
            console.log('LEAVE game id id_game state true')
            games.splice(index_game, 1)

        }else if (games[index_game].id === game_id){
            console.log('LEAVE game id id_game just leave becouse other player is not connecting');
            games.splice(index_game, 1);
            return undefined
        }else{
            console.log('LEAVE game id id_game state undefined')
            return undefined
        }

        // if (games[index_game].id === game_id){
        //     console.log('removing game !!!');
        //     games.splice(index_game, 1)
        // }
    }
}
function create_game(game,type,id,player1){
    console.log('CREATING GAME : ',game,type,id,player1)
    new Game(game,type,id,player1);
    // try {
    //     const response = await new Promise((resolve, reject) => {
    //         let return_elem = new Game(game,type,id);
    //             resolve(return_elem);
    //         })
    //     console.log("RESPONS : ",response);
    //     return response ;
    // } catch (error) {
    //     console.log(error);
    //     return false;
    // }


}
class Game {
    constructor(game,type,id,player1) {
        this.game_name = game;
        this.type = type;
        this.id = id;
        this.list_of_images = undefined;
        this.list_of_definers = undefined;
        this.state = false;
        this.player1 = player1 //{...player1};
        // this.player1.id_socket = undefined;
        this.player2 = undefined;
        this.picket_picture_player1 = undefined;
        this.picket_picture_player2 = undefined;
        this.picket_picture_pc = undefined;
        this.ask_counter_player1 = 0; // koli tomu ze musi nastat aspon 1 otazka zo strani tohto hraca
        this.ask_counter_player2 = 1; // koli tomu ze division by 0
        this.define_end_of_the_game = undefined;
        this.find_info_game_db();
        // games.push(this);
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



        // let dirs = fs.readdir('public/images/'+this.game_name);
        // console.log(dirs);
        // const db = dbService.getDbServiceInstance();
        // const result = db.get_game_images(this.game_name);
    }
    make_paths(){
        // console.log("GAME ID : ",id);
        // console.log("GAME DESCRIPTORS : ",this.list_of_definers);
        // console.log("GAME IMAGES : ",this.list_of_images);

        let files = fs.readdirSync('./public/images/'+this.game_name);
        // console.log(files);
        for (let file_index = 0 ; file_index < files.length ; file_index++){
            if (files[file_index].includes('.') === false && files[file_index] === 'images'){
                let path = './public/images/'+this.game_name+'/'+files[file_index];
                let dirs = fs.readdirSync(path);
                for (let image_index = 0 ;image_index < dirs.length;image_index++){
                    for (let game_image_index = 0 ;game_image_index < this.list_of_images.length;game_image_index++){
                        // console.log(dirs[image_index] , this.list_of_images[game_image_index]['image'])
                        if (dirs[image_index] === this.list_of_images[game_image_index]['image']){
                            // console.log("NASIEL")
                            this.list_of_images[game_image_index]['image'] = path.replace('./public','.')+'/'+dirs[image_index];
                            this.list_of_images[game_image_index]['description_control'] = this.list_of_images[game_image_index]['description_control'].split(',');// tuna musi byt ciarka ,
                            break;
                        }
                    }
                }
                // console.log(files[file_index] , ' = ', dirs);
            }else if (files[file_index].includes('.') === false && files[file_index] !== 'images'){
                let path = './public/images/'+this.game_name+'/'+files[file_index];
                let dirs = fs.readdirSync(path);
                for (let image_index = 0 ;image_index < dirs.length;image_index++){
                    for (let game_image_index = 0 ;game_image_index < this.list_of_definers.length;game_image_index++){
                        // console.log(dirs[image_index] , this.list_of_images[game_image_index]['image'])
                        if (dirs[image_index] === this.list_of_definers[game_image_index]['image']){
                            // console.log("NASIEL")
                            this.list_of_definers[game_image_index]['image'] =  path.replace('./public','.')+'/'+dirs[image_index];
                            break;
                        }
                    }
                }
                // console.log(files[file_index] , ' = ', dirs);
            }
        }
        this.finish_creation_of_game();

        // console.log("GAME IMAGES : ",this.list_of_images);
        // console.log("GAME IMAGES : ",this.list_of_definers);

    }
    finish_creation_of_game() {
        if (this.type === 'pc'){
            let max_length = (this.list_of_images.length >= 30) ? 30 : 25;
            if (this.list_of_images.length < 25){
                console.log("GAME HAS LESS IMAGES !!!");
                max_length = this.list_of_images.length;
            }
            // console.log('MAX LENGTH : ',max_length);
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
                console.log("POKIAL HRA PC SELECTED PICTURE : ",this.picket_picture_pc , this.list_of_images.length);

                // this.picket_picture_pc = this.list_of_images[Math.floor(Math.random() * this.list_of_images.length)];
                games.push(this);

            }
        }else{
            let max_length = (this.list_of_images.length >= 30) ? 30 : 25;
            if (this.list_of_images.length < 25){
                console.log("GAME HAS LESS IMAGES !!!");
                max_length = this.list_of_images.length;
            }
            // console.log('MAX LENGTH : ',max_length);
            if (this.list_of_images.length >= max_length) {
                let new_array_for_this_game = []
                let index = undefined;
                for (let max_images_in_game = 0; max_images_in_game < max_length; max_images_in_game++) {
                    index = Math.floor(Math.random() * this.list_of_images.length)
                    new_array_for_this_game.push(this.list_of_images[index]);
                    this.list_of_images.splice(index, 1);
                }
                this.list_of_images = new_array_for_this_game;

                index = Math.floor(Math.random() * this.list_of_images.length)
                this.picket_picture_pc = undefined;//this.list_of_images[index];
                // console.log("POKIAL HRA PC SELECTED PICTURE : ", this.picket_picture_pc, this.list_of_images.length);

                // this.picket_picture_pc = this.list_of_images[Math.floor(Math.random() * this.list_of_images.length)];
                games.push(this);
                console.log("POKIAL HRA MEDZI HRACMI  ??? KOLKO JE HIER : ",games.length);
            }
            // return 'player';
        }
    }
    is_your_picture_question( massage ){
        if (massage.certain){
            this.ask_counter_player1 ++;
            console.log('SG IS YOUR P CERTAIN ',this.picket_picture_pc.image.split('/').pop() === massage.src.split('/').pop(), this.picket_picture_pc.image.split('/').pop(), massage.src.split('/').pop())
            let you_found_picture = this.picket_picture_pc.image.split('/').pop() === massage.src.split('/').pop();
            if (you_found_picture){
                leave_game(this.id);
                return you_found_picture;
            }

        }else{
            this.ask_counter_player1 ++;
            // console.log(this.picket_picture_pc.description_control, massage)
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
                leave_game(this.id)
                console.log('CERTAIN ACTUAL QUESTION ',this.define_end_of_the_game,player_name,massage,this.ask_counter_player2,this.ask_counter_player1);
                return massage
            }
        }
        // else{
        //     return massage
        // }
    }

}

module.exports = {is_existing_game,create_game,all_games,search_for_free_game,leave_game,Game};