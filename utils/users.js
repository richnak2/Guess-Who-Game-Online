// Include file s DB
const DB = require('./dbService');
const db = DB.getDbServiceInstance();


const color_pallet = [['#00000000',0],// base color default
  ['#ffffff80',100],['#0013ff80',150],['#e0497080',200],['#30ff0280',250],
  ['#02ffec80',350],['#fcb04580',400],['#fffe1e80',450],['#833ab480',500],
  ['#00000080',550],['#ff00e7ff',600],['#d58ffd80',650], // half transparent colors
  ['#ffffffff',700],['#0013ffff',750],['#e04970ff',800],['#30ff02ff',850],
  ['#02ffecff',900],['#fcb045ff',950],['#fffe1eff',1000],['#833ab4ff',1050],
  ['#000000ff',1100],['#ff00e7ff',1150],['#d58ffdff',1200]]; // full colors
const user_names = ['Sara','Britney','Sabal','Amita','Ajay','Walter White',
                    'Jesse','Pinkman','Skyler','Gus','Michael','Tuco','Hector',
                    'Trevor', 'Amanda','Tracey','Christina','Margot','Chloe','Hermione',
                    'Harry Potter', 'Eric Clapton', 'Nicolas Cage','Will Smith', 'Heisenberg'];

class AllUsers {
  static all_clients = {};
  static x = setInterval(() => {console.log(`Interval :  ${this.strGetAllLength()}`)},10 * 1000)

  // static removeLoggedOut(){
  //   console.log(this.getAllToString());
  //   console.log(`Count of players : ${this.getAllLength()}`)
  //   for (let index = 0; index < this.getAllLength(); index++) {
  //     if (this.all_clients[index].removeUser() > 6){
  //       this.all_clients.splice(index, 1);
  //
  //     }
  //   }
  //
  // }

  static ping(id_socket){
    try{
      this.all_clients[id_socket].setSession();
    }catch (e) {
      console.log( `ping lost player ${id_socket}` )
    }

  }

  static push(id_socket , id, game_name, role , points , character , bought_characters){
    let user = new Users(id_socket , id, game_name, role , points , character , bought_characters);
    this.all_clients[id_socket] = user;
    console.log(`Join : ${this.strGetAllLength()}`)
    return user;
  }

  static strGetAllLength(){
    return `Count of players : ${Object.keys(this.all_clients).length}`;
  }

  static getAllToString(){
    let str = ''
    let index = 0
    for (let key in this.all_clients) {
      if (this.all_clients.hasOwnProperty(key)) {
        str += `NUMBER : ${index}\n`;
        str += `${this.all_clients[key].toString()}\n`
      }
    }
    return str;
  }

  static userLeave(socket_id) {
    delete this.all_clients[socket_id]
    console.log(`Leave : ${this.strGetAllLength()}`)
  }


  static async getUser(socket_id){
    try {
      return await new Promise((resolve, reject) => {
        let user = this.all_clients[socket_id];
        if (user !== undefined){
          resolve(user)
        }else{
          reject(`user with socket : ${socket_id} does not exist`);
        }
      }).catch(err => {return new Error("ALLUsers.getUser => "+err)})
    }catch (err) {
      return new Error("ALLUsers.getUser => "+err)
    }
  }
  static async getUserData(socket_id, variable_id_socket){
    try {
      return await new Promise((resolve, reject) => {
        let user = this.getUser(socket_id);
        user.then(user_located => {
          resolve(user_located.getUserData(variable_id_socket))
        }).catch(err => { reject( new Error("Users.getUserData => "+err) )})
      }).catch(err => {return new Error("ALLUsers.getUserData => "+err)})
    }catch (err) {
      return new Error("ALLUsers.getUserData => "+err)
    }
  }



  static async addPoints(time_of_complete, my_socket_id, variable_id_socket, guess_count) {
    let current_user = this.getUserData(my_socket_id, variable_id_socket);
    if (current_user) {
      current_user.addPoints(Math.ceil(500 / guess_count)).then(updated_user => {
        return updated_user;
      }).catch(err => {return new Error(err)});
    }
  }

  static async setCharacter(socket_id, character) {
    try {
      return await new Promise((resolve, reject) => {
        let current_user = this.all_clients[socket_id];
        // console.log(`Updated user ${JSON.stringify(current_user.getUserData())}`)
        if (current_user) {
          current_user.setCharacter(character).then(() => {
            // console.log(`Updated user ${JSON.stringify(current_user.getUserData())}`)
            if (current_user.getId()) {
              db.updateUserCharacter(current_user.getUserData()).then(() => {
                resolve(current_user);
              }).catch(err => {
                return new Error("ALLUsers.setCharacter DB: " + err)
              })
            } else {
              resolve(current_user);
            }
          }).catch(err => {
            return new Error("ALLUsers.setCharacter : " + err)
          })
        }else{
          return new Error("ALLUsers.setCharacter : Cannot find user")
        }
      })
    }catch (err) {
      return new Error("ALLUsers.setCharacter : "+err)
    }
  }
  static async buyCharacterOrColor(socket_id, item) {
    try {
      return await new Promise((resolve, reject) => {
        let current_user = this.all_clients[socket_id];
        console.log(`Updated user ${current_user.getUserData()}`)
        if (current_user) {
          current_user.buyCharacterOrColor(item).then(() => {
            console.log(`Updated user ${current_user.getUserData()}`)
            if (current_user.getId()) {
              db.updateUserCharacter(current_user.getUserData()).then(() => {
                resolve(current_user);
              }).catch(err => {
                return new Error("ALLUsers.setCharacter DB: " + err)
              })
            } else {
              resolve(current_user);
            }
          }).catch(err => {
            return new Error("ALLUsers.setCharacter : " + err)
          })
        }else{
          return new Error("ALLUsers.setCharacter : Cannot find user")
        }
      })
    }catch (err) {
      return new Error("ALLUsers.setCharacter : "+err)
    }
  }


  static async getAllGames(socket_id){
    try {
      return await new Promise((resolve, reject) => {
        const current_user = this.getUser(socket_id);
        current_user.then(user_located => {
          const result = db.getAllGames(user_located.getId());
          result.then(data => {
            resolve(data)
          }).catch(err => reject(new Error(`db.getAllGames =>  ${err}`) ) );
        }).catch(err => reject(new Error(`AllUsers.getAllGames =>  ${err}`) ) );
      }).catch(err => {new Error(`AllUsers.getAllGames =>  ${err}`)})
    }catch (err) {
      return new Error("ALLUsers.getAllGames => "+err)
    }
  }

  static async getAllYourGames(socket_id){
    try {
      return await new Promise((resolve, reject) => {
        let current_user = this.all_clients[socket_id];
        if (current_user.getId()) {
          const result = db.getAllYourGames(current_user.getId());
          result.then(data => {
            if (data){
              resolve(data)
            }else{
              reject(new Error("ALLUsers.getAllGames : Empty games"))
            }
          }).catch(err => reject(new Error("ALLUsers.getAllGames : "+err)) );
        }//!!!
      }).catch(err => {return new Error("ALLUsers.getAllGames : "+err)})
    }catch (err) {
      return new Error("ALLUsers.getAllGames : "+err)
    }
  }

  static async RegisterNewUser(name,password,role){
    try {
      return await new Promise((resolve, reject) => {
        const exist = db.userExist(name);
        exist.then(data => {
          if (data) {
            const result = db.registerUser(name, password, role);
            result.then(data => {
              if (data) {
                resolve()
              } else {
                reject(`something want wrong with registration`)
              }
            }).catch(err => {return new Error(err)});
          } else {
            resolve(`user with this name already exist`)
          }
        }).catch(err => {return new Error(err)});
      }).catch(err => {return new Error(err)});
    }catch (err) {
      return new Error("ALLUsers.getAllGames => "+err)
    }
  }


  static async LogIn(socket_id, name, password) {
    try {
      return await new Promise((resolve, reject) => {
        const result = db.findUser(name, password);
        result.then(user => {
          if (user[0] !== undefined) {
            this.push(socket_id, user[0]['id'], user[0]['game_name'], user[0]['role'], user[0]['points'], user[0]['type_of_character'], user[0]['bought_characters']);
            resolve('You are logged in')
          }else {
            reject(`Cannot find user ${name} ${password}`) ;
          }
        }).catch(err => { throw new Error(`db.findUser =>  ${err}`)} )
      }).catch(err => { throw new Error(`AllUsers.LogIn =>  ${err}`)})
    }catch (err) {
      return throw new Error(`AllUsers.LogIn =>  ${err}`)
    }


  }
}

class Users {

  constructor(id_socket , id, game_name, role , points , character , bought_characters) {
    this.id_socket = id_socket
    this.id = id
    this.game_name = (game_name === undefined ? user_names[Math.floor(Math.random() * user_names.length)] : game_name)
    this.role = role
    this.points = points
    this.setCharacter(character,id_socket)
    this.bought_characters = bought_characters
    this.session_time = Date.now()
  }

  toString(){
    return `SOCKET ID : ${this.id_socket}\nID : ${this.id}\nGAME : ${this.game_name}\nROLE : ${this.role}\nPOINTS : ${this.points}\n`
  }
  // ping from active user
  setSession(){
      this.session_time = Date.now()
  }
  getId(){
    return this.id === undefined ? 0 : this.id;
  }


  getUserData(variable_id_socket){
    this.variable_id_socket = variable_id_socket ? this.variable_id_socket : variable_id_socket
    return {
      'id_socket' : this.id_socket,
      'id' : this.id,
      'variable_id_socket' : this.variable_id_socket,
      'game_name' : this.game_name,
      'role' : this.role,
      'points' : this.points,
      'color' : this.color,
      'character' : this.character,
      'bought_characters' : this.bought_characters
    }
  }
  setCharacter(character) {
    let splinted_character = character.split(' ');
    this.color = splinted_character[0];
    this.character =  splinted_character[1];
  }


  addPoints(points) {
    this.points += points;
  }

  buyCharacterOrColor(character_or_color) {
    if (character_or_color.charAt(0) === '#'){ // color
      const index_color = color_pallet.findIndex(color => color[0] === character_or_color);
      if (index_color !== -1) {

        if (this.points >= color_pallet[index_color][1] ){
          this.points -= color_pallet[index_color][1];
        }
      }else{
        return new Error('Color was not found');
      }
    }else{ // character
      let price = parseInt(character_or_color.split('.')[0])*100;
      if (this.points >= price  ){
        this.points -= price;
      }
    }
    this.bought_characters += ' '+character_or_color;
  }



}
// const interval = setInterval(AllUsers.removeLoggedOut,5 * 60 * 1000)
// AllUsers.removeLoggedOut()
//
// // Join user
// function userJoin(id_socket , id, game_name, role , points , character , bought_characters) {
//   // let user = { id_socket: (id_socket) ? id_socket : undefined ,
//   //   id : (id) ? id : undefined ,
//   //   game_name : (game_name) ? game_name : undefined ,
//   //   role : (role) ? role : undefined ,
//   //   points : (points !== undefined) ? points : undefined ,
//   //   character: (character) ? character : undefined
//   // };
//   // AllUsers.push(id_socket , id, game_name, role , points , character , bought_characters).then(data => {
//   //   console.log(data.GetUserData())
//   // });
//   // // AllUsers.push(id_socket , id, game_name, role , points , character , bought_characters).then(data => {
//   // //   console.log(data)
//   // // });
//   // AllUsers.getAllLength().then(data => {
//   //   console.log(`The length is ${data}`);
//   // })
//   //
//   // AllUsers.getAllToString().then(data => {
//   //   console.log(`prihlaseni su : \n ${data}`);
//   // })
//
//   let user = {
//     id_socket: id_socket,
//     id : id ,
//     game_name : (game_name === undefined?user_names[Math.floor(Math.random() * user_names.length)]:game_name) ,
//     role : role ,
//     points : points ,
//     character: character ,
//     bought_characters : bought_characters
//   };
//
//   console.log('ALL USERRS LENGTH : '+users.length)
//   if (users.length > 200 ){ // tvrdi restart vsetkych hracov bez oboznamenia prekroceni limmit server connection
//     console.log(users)
//     users = [];
//   }
//   users.push(user);
//
//   return user;
// }
// function buyCharacter(socket_id, character_or_color) {
//   const index = users.findIndex(user => user.id_socket === socket_id);
//   if (index !== -1) {
//     if (character_or_color.charAt(0) === '#'){ // color
//       const index_color = color_pallet.findIndex(color => color[0] === character_or_color);
//       if (index_color !== -1) {
//         if (users[index].points >= color_pallet[index_color][1] ){
//           users[index].points -= color_pallet[index_color][1];
//           users[index].bought_characters += ' '+character_or_color;
//         }
//       }else{
//         console.log('NOT FOUNDED COLOR')
//       }
//     }else{ // character
//       let price = parseInt(character_or_color.split('.')[0])*100;
//       if (users[index].points >= price  ){
//         users[index].points -= price;
//         users[index].bought_characters += ' '+character_or_color;
//       }
//     }
//   }
//   return users[index];
// }
//
// function setCharacter(socket_id, character) {
//   const index = users.findIndex(user => user.id_socket === socket_id);
//   if (index !== -1) {
//     users[index].character = character;
//     return users[index];
//   }
//
//
// }
// // Get current user
// function getCurrentUser(socket_id) {
//   // console.log('GETTING USER WITH SOCKET ID : ',socket_id)
//   // return users[0];
//   return users.find(user => user.id_socket === socket_id);
// }
//
// // User leaves chat
// function userLeave(socket_id) {
//   const index = users.findIndex(user => user.id_socket === socket_id);
//   if (index !== -1) {
//     return users.splice(index, 1)[0];
//   }
// }
// function addPoints(time_of_complete, my_socket_id, guess_count){
//   console.log(time_of_complete,my_socket_id,guess_count)
//   const get_current_user = getCurrentUser(my_socket_id);
//   if (get_current_user !== undefined){
//     // treba spravit zmenu aby nezalezalo na case lebo to uz nieje odstatna vec pre hraca
//
//     let points = Math.ceil(500/guess_count);
//
//     get_current_user['points'] += points;
//   }else{
//     console.log('Neviem pridat body');
//   }
// }

module.exports = {
  // userJoin,
  // getCurrentUser,
  // setCharacter,
  // buyCharacter,
  // getAll,
  // userLeave,
  // addPoints,
  // AllUsers,
  AllUsers


};
