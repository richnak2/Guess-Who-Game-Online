const fs = require('fs');

function look_folders(dir_name) {
    return fs.existsSync('./public/images/' + dir_name);
}

async function delete_folder_r(path) {
    // console.log('REMOVING OLD PATHS',path)

    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file) {
            let current_path = path + "/" + file;
            if (fs.lstatSync(current_path).isDirectory()) { // recurse
                delete_folder_r(current_path);
            } else { // delete file
                fs.unlinkSync(current_path);
            }
        });
        fs.rmdirSync(path);
    }
    return true;

}

function remove_dirs_not_origin(origin_path, path){
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file) {
            let current_path = path + "/" + file;
            if(fs.lstatSync(current_path).isDirectory() ) { // recurse
                if (current_path.includes('images') === false){
                    remove_dirs_not_origin(origin_path,current_path);
                }
            } else { // delete file
                if (current_path.includes('default.png') === false){
                    fs.unlinkSync(current_path);
                }
            }
        });
        if (origin_path !== path){
            fs.rmdirSync(path);
        }

    }
}
// function remove_dirs_not_origin(path){
//
// }
function get_all_files_in_game(game){
    let files = fs.readdirSync('./public/images/'+game.title);
    game.game_images = [];
    game.game_descriptors = [];
    // console.log(files);
    for (let file_index = 0 ; file_index < files.length ; file_index++){
        if (files[file_index].includes('.') === false && files[file_index] === 'images'){
            let path = './public/images/'+game.title+'/'+files[file_index];
            let dirs = fs.readdirSync(path);
            for (let image_index = 0 ;image_index < dirs.length;image_index++){
                for (let game_image_index = 0 ;game_image_index < this.list_of_images.length;game_image_index++){
                    // console.log(dirs[image_index] , this.list_of_images[game_image_index]['image'])
                    if (dirs[image_index] === this.list_of_images[game_image_index]['image']){
                        // console.log("NASIEL")
                        this.list_of_images[game_image_index]['image'] = path.replace('./public','.')+'/'+dirs[image_index];
                        this.list_of_images[game_image_index]['description_control'] = this.list_of_images[game_image_index]['description_control'].split(' ');// tuna musi byt ciarka ,
                        break;
                    }
                }
            }
            // console.log(files[file_index] , ' = ', dirs);
        }else if (files[file_index].includes('.') === false && files[file_index] !== 'images'){
            let path = './public/images/'+game.title+'/'+files[file_index];
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
        }
    }
    return game;
}

module.exports = {look_folders,delete_folder_r,get_all_files_in_game, remove_dirs_not_origin};