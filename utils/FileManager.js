const fs = require('fs');
let instance = null;

class FileManager {
    static getFileManagerInstance() {
        return instance ? instance : new FileManager();
    }

    lookFolders(dir_name){
        return fs.existsSync('./public/images/' + dir_name);
    }

    deleteFolderServer(path) {
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

    removeDirsButNotOrigin(origin_path, path){
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
        return true
    }


    makeDir(new_path) {
        if (!fs.existsSync(new_path)){
            fs.mkdirSync(new_path);
        }
    }

    copyFile(old_path,new_path) {
        fs.copyFile(old_path, new_path,function (err) {
            if (err){
                return {data:`Something is want wrong with replacing main img  ${err}`,time_of_exception:10,type_of_exception:'warning'};
            }else{
                return false
            }
        });
    }
}
module.exports = FileManager