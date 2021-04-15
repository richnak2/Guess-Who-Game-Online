const express = require("express");
const bodyParser = require("body-parser");
const fs = require('fs');
const up = require('express-fileupload');

const router = express.Router();
router.use(up());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// const dbService = require('../DbService');
const {remove_dirs_not_origin,delete_folder_r} = require("../create_game");
// const { getCurrentUser } = require('../users');
const DB = require('../DbService');
const db = DB.getDbServiceInstance();
const FM = require('../FileManager');
const FileManager = FM.getFileManagerInstance()
const AllUsers = require('../users');

function printError(err){
    console.log(err)
}

function makeMainDir(main_img,old_path, new_path, path_is_renamed) {
    FileManager.makeDir(new_path)
    if (path_is_renamed){
        if (main_img.mimetype.includes('image')){
            main_img.mv(new_path+ '/default.png');
        }else{
            let copied = FileManager.copyFile(old_path+ "/default.png",new_path+ "/default.png")
            if (copied){return copied}
        }
    }else{
        if (main_img.mimetype.includes('image')){
            main_img.mv(new_path+ '/default.png');
        }else{
            if (main_img.name === 'create_game.png') {
                let copied = FileManager.copyFile('./public/images/create_game.png',new_path+ "/default.png")
                if (copied){return copied}
            }
        }
    }
    return true
}

function makeGameDescriptors(id_of_game,description_img,description_type,description_question,old_path,new_path,path_is_renamed){
    let result =  undefined;
    if (description_img ===  undefined){
        if (description_type === undefined){
            result = db.removeAllGameDirectories(id_of_game);
            result.then().catch(err => {
                return {data:`Something is want wrong with <strong>removeAllGameDirectories</strong> ${err}`,time_of_exception:20,type_of_exception:'danger'};
            });
        }else{
            result = db.removeAllGameDirectories(id_of_game);
            result.then().catch(err => {
                return {data:`Something is want wrong with <strong>removeAllGameDirectories</strong> ${err}`,time_of_exception:20,type_of_exception:'danger'};
            });

            let set_of_dirs_descriptors = new Set(description_type);
            set_of_dirs_descriptors.forEach(descriptor_path =>{
                for (let path_indexes = 0 ;path_indexes < description_type.length;path_indexes++){
                    if (description_type[path_indexes] === descriptor_path){

                        result = db.createGameDescriptors(id_of_game,descriptor_path,description_question[path_indexes],'');
                        result.then().catch(err => {
                            return {data:`Something is want wrong with <strong>createGameDescriptors</strong> ${err}`,time_of_exception:20,type_of_exception:'danger'};
                        });
                    }
                }
            });
        }
        return FileManager.removeDirsButNotOrigin(old_path,old_path)

    }else{
        if (path_is_renamed){
            console.log('PATH RENAMET TRUE DESCRIPTOR')
            let result = db.removeAllGameDirectories(id_of_game);
            result.then().catch(err => {
                return {data:`Something is want wrong with <strong>removeAllGameDirectories</strong> ${err}`,time_of_exception:20,type_of_exception:'danger'};
            });

            let set_of_dirs_descriptors = new Set(description_type);
            set_of_dirs_descriptors.forEach(descriptor_path =>{
                FileManager.makeDir(new_path+'/'+descriptor_path)
                for (let path_indexes = 0 ;path_indexes < description_type.length;path_indexes++){
                    if (description_type[path_indexes] === descriptor_path){
                        if (description_img[path_indexes].name === 'images|create_game.png'){

                            result = db.createGameDescriptors(id_of_game,descriptor_path,description_question[path_indexes],'');
                            result.then().catch(err => {
                                return {data:`Something is want wrong with <strong>createGameDescriptors</strong> ${err}`,time_of_exception:20,type_of_exception:'danger'};
                            });
                        }else if (description_img[path_indexes].name.includes('|') === false){ // novi IMG
                            description_img[path_indexes].mv(new_path+'/'+descriptor_path+ '/' + description_img[path_indexes].name);

                            // uloz descriptor do db
                            result = db.createGameDescriptors(id_of_game,descriptor_path,description_question[path_indexes],description_img[path_indexes].name);
                            result.then().catch(err => {
                                return {data:`Something is want wrong with <strong>createGameDescriptors</strong> ${err}`,time_of_exception:20,type_of_exception:'danger'};
                            });
                        }else{ // iba sa zmenila cesta decriptora
                            console.log('OLD IMG DES')
                            let old_dir_name_and_file = description_img[path_indexes].name.split("|");

                            let copied = FileManager.copyFile(old_path+ "/"+old_dir_name_and_file[0]+'/'+old_dir_name_and_file[1],new_path+"/"+descriptor_path+'/'+old_dir_name_and_file[1])
                            if (copied){return copied}

                            result = db.createGameDescriptors(id_of_game,descriptor_path,description_question[path_indexes],old_dir_name_and_file[1]);
                            result.then().catch(err => {
                                return {data:`Something is want wrong with <strong>createGameDescriptors</strong> ${err}`,time_of_exception:20,type_of_exception:'danger'};
                            });

                        }

                    }
                }
            });
            return true
        }else {
            result = db.removeAllGameDirectories(id_of_game);
            result.then().catch(err => {
                return {data:`Something is want wrong with <strong>removeAllGameDirectories</strong> ${err}`,time_of_exception:20,type_of_exception:'danger'};
            });

            console.log('PATH RENAMET FALSE DESCRIPTOR')
            let set_of_dirs_descriptors = new Set(description_type);
            set_of_dirs_descriptors.forEach(descriptor_path =>{
                FileManager.makeDir(old_path+'/'+descriptor_path)

                for (let path_indexes = 0 ;path_indexes < description_type.length;path_indexes++){
                    if (description_type[path_indexes] === descriptor_path){
                        if (description_img[path_indexes].name === 'images|create_game.png'){
                            result = db.createGameDescriptors(id_of_game,descriptor_path,description_question[path_indexes],'');
                            result.then().catch(err => {
                                return {data:`Something is want wrong with <strong>createGameDescriptors</strong> ${err}`,time_of_exception:20,type_of_exception:'danger'};
                            });

                        }else if (description_img[path_indexes].name.includes('|') === false){ // novi IMG
                            console.log('NEW IMG DES ',description_img[path_indexes].name)//game_description_img[path_indexes]
                            description_img[path_indexes].mv(old_path+'/'+descriptor_path+ '/' + description_img[path_indexes].name);

                            // uloz descriptor do db
                            result = db.createGameDescriptors(id_of_game,descriptor_path,description_question[path_indexes],description_img[path_indexes].name);
                            result.then().catch(err => {
                                return {data:`Something is want wrong with <strong>createGameDescriptors</strong> ${err}`,time_of_exception:20,type_of_exception:'danger'};
                            });
                        }else{ // iba sa zmenila cesta decriptora
                            console.log('OLD IMG DES ',description_img[path_indexes].name)//game_description_img[path_indexes]
                            let old_dir_name_and_file = description_img[path_indexes].name.split("|");

                            if (old_dir_name_and_file[1] !== descriptor_path){
                                let copied = FileManager.copyFile(old_path+ "/"+old_dir_name_and_file[0]+'/'+old_dir_name_and_file[1], old_path+"/"+descriptor_path+'/'+old_dir_name_and_file[1])
                                if (copied){return copied}
                            }
                            result = db.createGameDescriptors(id_of_game,descriptor_path,description_question[path_indexes],old_dir_name_and_file[1]);
                            result.then().catch(err => {
                                return {data:`Something is want wrong with <strong>createGameDescriptors</strong> ${err}`,time_of_exception:20,type_of_exception:'danger'};
                            });

                        }
                    }
                }

            });
            return true
        }
    }
}



async function make_game_images(id_of_game, old_path, new_path,game_img,game_img_descriptor,game_img_question, path_is_renamed){

    let result = undefined;
    result = db.removeAllGameImages(id_of_game);
    result.then( () => {
        if (game_img !==  undefined){
            FileManager.makeDir(new_path)

            for (let img_game_index = 0 ;img_game_index < game_img.length; img_game_index++){
                if (path_is_renamed){
                    if (game_img[img_game_index].mimetype.includes('image')){ // new game image is added
                        console.log('NEW IMG IS ADDED EDIT GAME')
                        game_img[img_game_index].mv(new_path+ '/' + game_img[img_game_index].name);
                    }else{ // old img is beaning added
                        console.log('COPINIG IMG IS ADDED EDIT GAME')//,old_path_for_images + '/' + decodeURI(game_img[img_game_index].name),new_path_for_images+'/' + decodeURI(game_img[img_game_index].name)
                        let copied = FileManager.copyFile(old_path + '/' + decodeURI(game_img[img_game_index].name), new_path+'/' + decodeURI(game_img[img_game_index].name))
                        if (copied){return copied}
                    }

                }else{
                    if (game_img[img_game_index].mimetype.includes('image')){ // new game image is added
                        console.log('NEW IMG IS ADDED EDIT GAME')
                        game_img[img_game_index].mv(new_path+ '/' + game_img[img_game_index].name);
                    }else{
                        console.log('OLD IMG NOT CHANGEING')
                    }
                }

                if (game_img_descriptor[img_game_index]){ // for students
                    result = db.createGameImages(id_of_game,decodeURI(game_img[img_game_index].name),game_img_descriptor[img_game_index]);
                    result.then().catch(err => {
                        return  {data:`Something is want wrong with <strong>createGameImages</strong> ${err}`,time_of_exception:10,type_of_exception:'danger'};
                    })

                }else{// for PC and KID AND SUTDENDS
                    result = db.createGameImages(id_of_game,decodeURI(game_img[img_game_index].name),game_img_question[img_game_index]);
                    result.then().catch(err => {
                        return  {data:`Something is want wrong with <strong>createGameImages</strong> ${err}`,time_of_exception:10,type_of_exception:'danger'};
                    })
                }
            }
        }

        if (path_is_renamed){
            let old_path_r = old_path.split('/');
            old_path_r.pop();
            old_path_r = old_path_r.join('/');
            old_path_r = old_path_r+'/'
            if (FileManager.deleteFolderServer(old_path_r)){
                console.log('hotovo ulozene')
                return {data:'Saving game',time_of_exception:10,type_of_exception:'success'}
            }
        }
        console.log('hotovo ulozene')
        return {data:'Saving game .',time_of_exception:10,type_of_exception:'success'}
    }).catch(err => {
        return {data:`Something is want wrong with <strong>createUpdateGameImages</strong> ${err}`,time_of_exception:20,type_of_exception:'danger'}
    });



}


function set_game_category(category){
    let type;
    if (category === '1'){
        type = '1 1 1';
    }else if(category === '2'){
        type = '1 0 1';
    }else{
        type = '0 0 1';
    }
    return type;
}



router.post('/upload_new_game', function(req, res) {
    // TUNA MUSI BYT SERVEROVA KONTROLA CI SU DANe FIles OK  a ci data ktore sa posielaju su tiez oki !!!
    let user_id = AllUsers.checkUserValid(req.body.my_socket_id)
    if (user_id) {
        console.log(`server seys  id after than ${user_id}`)
        let id_of_game = undefined;
        try{
            id_of_game = req.body.game_id === undefined ? false : req.body.game_id ;
        }catch (err) {
            console.log(`This game does not exist`)
        }

        /// CHECK 1
        let main_game_img = req.files.main_img_file
        let main_game_description = req.body.game_description;
        let main_game_name = req.body.game_name;
        let game_category_of_players = set_game_category(req.body.category_of_players);
        let created = req.body.created;


        // vytvorenie hlavneho herneho priecinka
        let old_path = './public/images/' + main_game_name[0];//decodeURI(main_game_name[0]);
        let new_path = './public/images/' + main_game_name[1];//decodeURI(main_game_name[1]);
        console.log(old_path, new_path)
        let path_is_renamed = old_path !== new_path;
        // CHECK 1
        let check_1 = makeMainDir(main_game_img, './public/images/', new_path, path_is_renamed);
        if (typeof check_1 === 'boolean') {
            if (id_of_game){
                console.log(`updating game ${id_of_game}`)
                let result = db.updateYourGameMain(id_of_game,main_game_name,game_category_of_players,main_game_description,created);
                result.then().catch(err => {
                    return res.send({data:`Something is want wrong with <strong>updateYourGameMain</strong> ${err}`,time_of_exception:20,type_of_exception:'danger'})
                });
            }else {
                console.log(`creating new game ${id_of_game}`)
                const new_game_id = db.createGameMain(main_game_name[0], game_category_of_players, 'default.png', main_game_description, user_id, created);
                new_game_id.then(id => {
                    id_of_game = id
                    console.log(id)
                    console.log(id_of_game)
                })

            }
            console.log(`creating new game ${id_of_game}`)
            /// CHECK 2
            let game_description_img = undefined;
            let game_description_type = req.body.d_type;
            let game_description_question = req.body.d_descriptor_question;
            try {
                game_description_img = req.files.d_img;
                if (game_description_img.length === undefined) {
                    game_description_img = [game_description_img];
                    game_description_type = [game_description_type];
                    game_description_question = [game_description_question];
                }
            } catch (err) {
                printError(`Check2 => createGameMain => Non existing object game_description_img`)
            }

            let check_2 = makeGameDescriptors(id_of_game, game_description_img, game_description_type, game_description_question, old_path, new_path, path_is_renamed);
            if (typeof check_2 === 'boolean') {
                // CHECK 3
                let game_img = undefined;
                let game_img_descriptor = req.body.game_img_auto_descriptor;
                let game_img_question = req.body.game_img_question;
                try {
                    game_img = req.files.game_img;
                    if (game_img.length === undefined) {
                        game_img = [game_img];
                        game_img_descriptor = [game_img_descriptor];
                        game_img_question = [game_img_question];
                    }
                } catch (e) {
                    printError(`Check3 => makeGameDescriptors => Non existing object game_img`)
                }
                let new_path_for_images = new_path + '/images';
                let old_path_for_images = old_path + '/images';

                return res.send(make_game_images(id_of_game, old_path_for_images, new_path_for_images, game_img, game_img_descriptor, game_img_question, path_is_renamed));

            }

            return res.send(check_2)
        }
        return res.send(check_1)
    }
    return res.send({data:'Something want wrong your profile.',time_of_exception:10,type_of_exception:'danger'})
})

module.exports = router;