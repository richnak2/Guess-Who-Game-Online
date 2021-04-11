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
//Something is want wrong with createNewGameImages ReferenceError: remove_dirs_not_origin is not defined

// async function checkUserValid(id_user){
//     return await AllUsers.getUser(id_user).then(user => {
//         if (user.getId()) {
//             console.log(`server check_current_user seys ${user.getId()}`)
//             return user.getId()
//         }else{
//             new Error(`invalid user ${JSON.stringify(user.getUserData())}`)
//         }
//     }).catch(err => {
//         return new Error(`check_current_user => ${err}`)
//     })
//
// }

async function makeMainDir(main_img,old_path, new_path, path_is_renamed) {
    try{
        return await new Promise((resolve, reject) => {
            if (!fs.existsSync(new_path)){
                fs.mkdirSync(new_path);
            }
            if (path_is_renamed){
                if (main_img.mimetype.includes('image')){
                    main_img.mv(new_path+ '/default.png');
                }else{
                    fs.copyFile(old_path+ "/default.png", new_path+ "/default.png",function (err) {
                        if (err){
                            reject( {data:`Something is want wrong with replacing main img  ${err}`,time_of_exception:10,type_of_exception:'warning'});
                        }
                    });
                }
            }else{
                if (main_img.mimetype.includes('image')){
                    main_img.mv(new_path+ '/default.png');
                }else{
                    if (main_img.name === 'create_game.png') {
                        fs.copyFile('./public/images/create_game.png', new_path + '/default.png', (err) => {
                            if (err) {
                                reject( {data:`Something is want wrong with main img  ${err}`,time_of_exception:10,type_of_exception:'warning'});
                            }
                        });
                    }
                }
            }
            resolve(true)
        }).catch(err => {return err})
    }catch (err) {
        return new Error(`makeMainDir => ${err}`)
    }

}

async function makeGameDescriptors(id_of_game,description_img,description_type,description_question,old_path,new_path,path_is_renamed){
    try{
        return await new Promise((resolve, reject) => {
            let result =  undefined;
            if (description_img ===  undefined){
                if (description_type === undefined){
                    result = db.removeAllGameDirectories(id_of_game);
                    result.then().catch(err => {
                        reject({data:`Something is want wrong with <strong>removeAllGameDirectories</strong> ${err}`,time_of_exception:20,type_of_exception:'danger'});
                    });
                }else{
                    result = db.removeAllGameDirectories(id_of_game);
                    result.then().catch(err => {
                        reject({data:`Something is want wrong with <strong>removeAllGameDirectories</strong> ${err}`,time_of_exception:20,type_of_exception:'danger'});
                    });

                    let set_of_dirs_descriptors = new Set(description_type);
                    set_of_dirs_descriptors.forEach(descriptor_path =>{
                        for (let path_indexes = 0 ;path_indexes < description_type.length;path_indexes++){
                            if (description_type[path_indexes] === descriptor_path){

                                result = db.createGameDescriptors(id_of_game,descriptor_path,description_question[path_indexes],'');
                                result.then().catch(err => {
                                    reject({data:`Something is want wrong with <strong>createGameDescriptors</strong> ${err}`,time_of_exception:20,type_of_exception:'danger'});
                                });
                            }
                        }
                    });
                }
                FileManager.removeDirsButNotOrigin(old_path,old_path).then( result => { resolve(result) } )
                    .catch(err => reject(new Error(`CHECK2 => make_game_descriptors => FileManager.removeDirsButNotOrigin => ${err}`)));

            }else{
                if (path_is_renamed){
                    console.log('PATH RENAMET TRUE DESCRIPTOR')
                    let result = db.removeAllGameDirectories(id_of_game);
                    result.then().catch(err => {
                        reject({data:`Something is want wrong with <strong>removeAllGameDirectories</strong> ${err}`,time_of_exception:20,type_of_exception:'danger'});
                    });

                    let set_of_dirs_descriptors = new Set(description_type);
                    set_of_dirs_descriptors.forEach(descriptor_path =>{
                        if (!fs.existsSync(new_path+'/'+descriptor_path)){
                            fs.mkdirSync(new_path+'/'+descriptor_path);
                        }
                        for (let path_indexes = 0 ;path_indexes < description_type.length;path_indexes++){
                            if (description_type[path_indexes] === descriptor_path){
                                if (description_img[path_indexes].name === 'images|create_game.png'){

                                    result = db.createGameDescriptors(id_of_game,descriptor_path,description_question[path_indexes],'');
                                    result.then().catch(err => {
                                        reject({data:`Something is want wrong with <strong>createGameDescriptors</strong> ${err}`,time_of_exception:20,type_of_exception:'danger'});
                                    });
                                }else if (description_img[path_indexes].name.includes('|') === false){ // novi IMG
                                    description_img[path_indexes].mv(new_path+'/'+descriptor_path+ '/' + description_img[path_indexes].name);

                                    // uloz descriptor do db
                                    result = db.createGameDescriptors(id_of_game,descriptor_path,description_question[path_indexes],description_img[path_indexes].name);
                                    result.then().catch(err => {
                                        reject({data:`Something is want wrong with <strong>createGameDescriptors</strong> ${err}`,time_of_exception:20,type_of_exception:'danger'});
                                    });
                                }else{ // iba sa zmenila cesta decriptora
                                    console.log('OLD IMG DES')
                                    let old_dir_name_and_file = description_img[path_indexes].name.split("|");

                                    fs.copyFile(old_path+ "/"+old_dir_name_and_file[0]+'/'+old_dir_name_and_file[1], new_path+"/"+descriptor_path+'/'+old_dir_name_and_file[1],function (err) {
                                        if (err){
                                            reject( {data:`Something is want wrong with copying of old img  ${err}`,time_of_exception:10,type_of_exception:'danger'})
                                        }
                                    });

                                    result = db.createGameDescriptors(id_of_game,descriptor_path,description_question[path_indexes],old_dir_name_and_file[1]);
                                    result.then().catch(err => {
                                        reject({data:`Something is want wrong with <strong>createGameDescriptors</strong> ${err}`,time_of_exception:20,type_of_exception:'danger'});
                                    });

                                }

                            }
                        }
                    });
                    resolve(true)
                }else {
                    result = db.removeAllGameDirectories(id_of_game);
                    result.then().catch(err => {
                        reject({data:`Something is want wrong with <strong>removeAllGameDirectories</strong> ${err}`,time_of_exception:20,type_of_exception:'danger'});
                    });

                    console.log('PATH RENAMET FALSE DESCRIPTOR')
                    let set_of_dirs_descriptors = new Set(description_type);
                    set_of_dirs_descriptors.forEach(descriptor_path =>{
                        if (!fs.existsSync(old_path+'/'+descriptor_path)){
                            fs.mkdirSync(old_path+'/'+descriptor_path);
                        }
                        for (let path_indexes = 0 ;path_indexes < description_type.length;path_indexes++){
                            if (description_type[path_indexes] === descriptor_path){
                                if (description_img[path_indexes].name === 'images|create_game.png'){
                                    result = db.createGameDescriptors(id_of_game,descriptor_path,description_question[path_indexes],'');
                                    result.then().catch(err => {
                                        reject({data:`Something is want wrong with <strong>createGameDescriptors</strong> ${err}`,time_of_exception:20,type_of_exception:'danger'});
                                    });

                                }else if (description_img[path_indexes].name.includes('|') === false){ // novi IMG
                                    console.log('NEW IMG DES ',description_img[path_indexes].name)//game_description_img[path_indexes]
                                    description_img[path_indexes].mv(old_path+'/'+descriptor_path+ '/' + description_img[path_indexes].name);


                                    // uloz descriptor do db
                                    result = db.createGameDescriptors(id_of_game,descriptor_path,description_question[path_indexes],description_img[path_indexes].name);
                                    result.then().catch(err => {
                                        reject({data:`Something is want wrong with <strong>createGameDescriptors</strong> ${err}`,time_of_exception:20,type_of_exception:'danger'});
                                    });
                                }else{ // iba sa zmenila cesta decriptora
                                    console.log('OLD IMG DES ',description_img[path_indexes].name)//game_description_img[path_indexes]
                                    let old_dir_name_and_file = description_img[path_indexes].name.split("|");

                                    // find_img_by_name(game_description_img[path_indexes].name)
                                    if (old_dir_name_and_file[1] !== descriptor_path){
                                        fs.copyFile(old_path+ "/"+old_dir_name_and_file[0]+'/'+old_dir_name_and_file[1], old_path+"/"+descriptor_path+'/'+old_dir_name_and_file[1],function (err) {
                                            if (err){
                                                reject( {data:`Something is want wrong with copying of old img  ${err}`,time_of_exception:10,type_of_exception:'danger'})
                                            }
                                        });
                                    }
                                    result = db.createGameDescriptors(id_of_game,descriptor_path,description_question[path_indexes],old_dir_name_and_file[1]);
                                    result.then().catch(err => {
                                        reject({data:`Something is want wrong with <strong>createGameDescriptors</strong> ${err}`,time_of_exception:20,type_of_exception:'danger'});
                                    });

                                }
                            }
                        }

                    });
                    resolve(true);
                }
            }
        }).catch(err => {return err})
    }catch (err) {
        return new Error(`makeMainDir => ${err}`)
    }
    // let result = undefined;
    //
    //         return undefined;
    //     }
    // }
}



async function make_game_images(id_of_game, old_path, new_path,game_img,game_img_descriptor,game_img_question, path_is_renamed){
    try {
        return await new Promise((resolve, reject) => {

            let result = undefined;

            if (game_img !==  undefined){

                if (!fs.existsSync(new_path)){
                    fs.mkdirSync(new_path);
                }
                for (let img_game_index = 0 ;img_game_index < game_img.length; img_game_index++){
                    // console.log('THIS IS EXISTING PICTURE ',game_img[img_game_index].name)
                    if (path_is_renamed){
                        if (game_img[img_game_index].mimetype.includes('image')){ // new game image is added
                            console.log('NEW IMG IS ADDED EDIT GAME')
                            game_img[img_game_index].mv(new_path+ '/' + game_img[img_game_index].name);
                        }else{ // old img is beaning added
                            console.log('COPINIG IMG IS ADDED EDIT GAME')//,old_path_for_images + '/' + decodeURI(game_img[img_game_index].name),new_path_for_images+'/' + decodeURI(game_img[img_game_index].name)
                            fs.copyFile(old_path + '/' + decodeURI(game_img[img_game_index].name), new_path+'/' + decodeURI(game_img[img_game_index].name),function (err) {
                                if (err){
                                    reject( {data:`Something is want wrong with old img copy file ${err}`,time_of_exception:10,type_of_exception:'danger'});
                                }
                            });
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
                            reject( {data:`Something is want wrong with <strong>createGameDescriptors</strong> ${err}`,time_of_exception:20,type_of_exception:'danger'});
                        });
                    }else{// for PC and KID AND SUTDENDS
                        result = db.createGameImages(id_of_game,decodeURI(game_img[img_game_index].name),game_img_question[img_game_index]);
                        result.then().catch(err => {
                            reject( {data:`Something is want wrong with <strong>createGameDescriptors</strong> ${err}`,time_of_exception:20,type_of_exception:'danger'});
                        });
                    }

                }

            }

            if (path_is_renamed){
                let old_path_r = old_path.split('/');
                old_path_r.pop();
                old_path_r = old_path_r.join('/');
                old_path_r = old_path_r+'/'
                FileManager.deleteFolderServer(old_path_r).then(err => {
                    if (err){
                        resolve( {data:'Game has been updated succesfully i hope :D .',time_of_exception:10,type_of_exception:'success'});
                    }else{
                        reject({data:'Something want wrong with deleting old directory !!! .',time_of_exception:10,type_of_exception:'danger'});
                    }
                });

            }else{
                resolve( {data:'Game has been updated succesfully i hope :D .',time_of_exception:10,type_of_exception:'success'});
            }

        }).catch(err => {return err})

    } catch (error) {
        return new Error(error);
    }
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
    user_id.then(id => {
        console.log(`server seys  id after than ${id}`)
        let id_of_new_game = undefined;
        /// CHECK 1
        let main_game_img = req.files.main_img_file
        let main_game_description = req.body.game_description;
        let main_game_name = req.body.game_name;
        let game_category_of_players = set_game_category(req.body.category_of_players);
        let created = req.body.created;


        // vytvorenie hlavneho herneho priecinka
        let old_path = './public/images/'+main_game_name[0];//decodeURI(main_game_name[0]);
        let new_path = './public/images/'+main_game_name[1];//decodeURI(main_game_name[1]);
        console.log(old_path,new_path)
        let path_is_renamed = old_path!==new_path;

        // CHECK 1
        let check_1 = makeMainDir(main_game_img,'./public/images/',new_path,path_is_renamed);
        check_1.then(result_makeMainDir => {
            if (typeof result_makeMainDir === 'boolean' ){
                let result = db.createGameMain(main_game_name[0],game_category_of_players,'default.png',main_game_description,id,created);//get_current_user.id,
                result.then(inserted_id => {
                    id_of_new_game = inserted_id;

                    /// CHECK 2
                    let game_description_img = undefined;
                    let game_description_type = req.body.d_type ;
                    let game_description_question = req.body.d_descriptor_question;
                    try{
                        game_description_img = req.files.d_img;
                        if (game_description_img.length === undefined){
                            game_description_img = [game_description_img];
                            game_description_type = [game_description_type];
                            game_description_question = [game_description_question];
                        }
                    }catch (err) {
                        printError(`Check2 => createGameMain => Non existing object game_description_img`)
                    }

                    let check_2 = makeGameDescriptors(id_of_new_game,game_description_img,game_description_type,game_description_question,old_path,new_path,path_is_renamed);
                    check_2.then(result_makeGameDescriptors => {
                        if (typeof result_makeGameDescriptors === 'boolean'){
                            // CHECK 3
                            let game_img = undefined;
                            let game_img_descriptor = req.body.game_img_auto_descriptor ;
                            let game_img_question = req.body.game_img_question;
                            try{
                                game_img =  req.files.game_img;
                                if (game_img.length === undefined){
                                    game_img = [game_img];
                                    game_img_descriptor = [game_img_descriptor];
                                    game_img_question = [game_img_question];
                                }
                            }catch (e) {
                                printError(`Check3 => makeGameDescriptors => Non existing object game_img`)
                            }
                            let new_path_for_images = new_path+'/images';
                            let old_path_for_images = old_path+'/images';

                            make_game_images(id_of_new_game, old_path_for_images, new_path_for_images, game_img, game_img_descriptor, game_img_question, path_is_renamed)
                                .then(result =>{
                                    if (result.data.includes('Game')){
                                        printError(`CHeck3 => ${result.data}`)
                                        return res.send(result);
                                    }else{
                                        printError(`CHeck3 => Something is want wrong with createNewGameImages => ${JSON.stringify(err)}`)
                                        return res.send(result);
                                    }
                                }).catch(err =>{
                                    printError(`CHeck3 => Something is want wrong with createNewGameImages => ${JSON.stringify(err)}`)
                                    return res.send(err);
                                });
                        }else{
                            printError(`Check2 => Something is want wrong with createNewGameImages => ${JSON.stringify(check_2)}`)
                            return res.send(check_2);
                        }
                    }).catch(err => {
                        printError(`Check2 =>  Something is want wrong with makeGameDescriptors => ${err}`)
                        return res.send({data:`Something is want wrong with <strong>makeGameDescriptors</strong>  ${err}`,time_of_exception:20,type_of_exception:'danger'})
                    });
                }).catch(err => {
                    printError(`Check1 => Something is want wrong with createGameMain => ${err}`)
                    return res.send({data:`Something is want wrong with <strong>createNewGameImages</strong>  ${err}`,time_of_exception:20,type_of_exception:'danger'})
                });
            }else{
                printError(`makeMainDir => ${check_1}`)
                return res.send(check_1);
            }
        }).catch(err => {printError(`makeMainDir => ${err}`)})
    }).catch(err => {
        printError(`post to /upload_new_game => ${err}`)
        return res.send(new Error(`post to /upload_new_game => ${err}`))})
    // res.send(user);
    // console.log(`server seis ${user_id}`)
    // if (user_id === undefined){
    //     return res.send(new Error('Not valid player'));
    // }

});



router.post('/upload_game', function(req, res) {
    console.log('UPDATUJEM NOVU HRU');

    let user = AllUsers.checkUserValid(req.body.my_socket_id)
    // res.send(user);
    if (user.id === undefined){
        return res.send(user);
    }

    let id_of_game = req.body.game_id;

    /// CHECK 1
    let main_game_img = req.files.main_img_file
    let main_game_description = req.body.game_description;
    let main_game_name = req.body.game_name;
    let game_category_of_players = set_game_category(req.body.category_of_players);
    let created = req.body.created;

    let old_path = './public/images/'+main_game_name[0];
    let new_path = './public/images/'+main_game_name[1];
    let path_is_renamed = old_path!==new_path;

    // CHECK 1
    let check_1 = makeMainDir(main_game_img,old_path,new_path,path_is_renamed);
    if (check_1 !== undefined){
        return res.send(check_1);
    }


    const db = dbService.getDbServiceInstance();
    let result = db.updateYourGameMain(id_of_game,main_game_name,game_category_of_players,main_game_description,created);
    result.then().catch(err => {
        return res.send({data:`Something is want wrong with <strong>updateYourGameMain</strong> ${err}`,time_of_exception:20,type_of_exception:'danger'})
    });

    // CHECK 2
    let game_description_img = undefined;
    let game_description_type = req.body.d_type ;
    let game_description_question = req.body.d_descriptor_question;
    try{

        game_description_img = req.files.d_img;
        if (game_description_img.length === undefined){
            game_description_img = [game_description_img];
            game_description_type = [game_description_type];
            game_description_question = [game_description_question];
        }
    }catch (e) {
        console.log('nexistuje ziaden descriptor obrazok');
    }

    let check_2 = makeGameDescriptors(id_of_game,game_description_img,game_description_type,game_description_question,old_path,new_path,path_is_renamed);
    if (check_2 !== undefined){
        return res.send(check_2);
    }



    let game_img = undefined;
    let game_img_descriptor = req.body.game_img_auto_descriptor ;
    let game_img_question = req.body.game_img_question;
    // console.log('ADDED FILES : ',req.files.game_img)
    try{
        game_img =  req.files.game_img;
        if (game_img.length === undefined){
            game_img = [game_img];
            game_img_descriptor = [game_img_descriptor];
            game_img_question = [game_img_question];
        }
    }catch (e) {
        console.log('Hra zatial nema ziadne obrazky');
    }
    console.log('toto su aktualne obrazky co sa pridavaju : ',game_img_descriptor,game_img_question)//,game_img

    let new_path_for_images = new_path+'/images';
    let old_path_for_images = old_path+'/images';

    result = db.removeAllGameImages(id_of_game);
    result.then( () => {

        make_game_images(id_of_game, old_path_for_images, new_path_for_images, game_img, game_img_descriptor, game_img_question, path_is_renamed).then(result =>{
            return res.send(result);
        }).catch(err =>{
            return res.send(err);
        });

    }).catch(err => {
        return res.send({data:`Something is want wrong with <strong>createUpdateGameImages</strong> ${err}`,time_of_exception:20,type_of_exception:'danger'})
    });
});



module.exports = router;