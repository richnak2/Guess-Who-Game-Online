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
  static all_clients = [];
  static push(id_socket , id, game_name, role , points , character , bought_characters){
    let user = new Users(id_socket , id, game_name, role , points , character , bought_characters);
    this.all_clients.push(user);
    return user;
  }

  static async getAllLength(){
    return this.all_clients.length;
  }

  static async getAllToString(){
    let str = '';
    for (let index = 0; index < this.all_clients.length; index++) {
      str += `NUMBER : ${index}\n`;
      str += `${await this.all_clients[index].ToString()}\n`;
    }
    return str;
  }

  static async setCharacter(socket_id, variable_id_socket, character) {
    const index = this.all_clients.findIndex(user => user.id_socket === socket_id && user.variable_id_socket === variable_id_socket);
    if (index !== -1) {
      return this.all_clients[index].SetCharacter(character);
    }
  }

  static async  UserLeave(socket_id, variable_id_socket) {
    const index = users.findIndex(user => user.id_socket === socket_id && user.variable_id_socket === variable_id_socket);
    if (index !== -1) {
      return this.all_clients.splice(index, 1)[0];
    }
  }

  static async getCurrentUser(socket_id,variable_id_socket){
    return this.all_clients.findIndex(user => user.id_socket === socket_id && user.variable_id_socket === variable_id_socket);
  }

  static async addPoints(time_of_complete, my_socket_id, variable_id_socket, guess_count) {
    const current_user_index = await this.GetCurrentUser(my_socket_id, variable_id_socket);
    if (current_user_index !== -1) {
      await this.all_clients[current_user_index].AddPoints(Math.ceil(500 / guess_count)).then(data =>{
        return data;
      })

    }
  }
  static async RegisterNewUser(name,password,role){
    const exist = db.userExist(name);
    exist.then(data => {
      if (data){
        const result = db.registerUser(name,password,role);
        result.then(data => {
          return true;
        }).catch(err => throw new Error(err));
      }else{
        return false;
      }
    }).catch(err => throw new Error(err));
  }

  static async LogIn(name, password) {
    const result = db.findUser(name, password);
    result.then(data => {
      if (data[0] !== undefined) {
        this.push(socket.id, data[0]['id'], data[0]['game_name'], data[0]['role'], data[0]['points'], data[0]['type_of_character'], data[0]['bought_characters']);
        return true;
      } else {
        return false;
      }

    }).catch(err => throw new Error(err));
  }
}
class Users {
  constructor(id_socket , id, game_name, role , points , character , bought_characters) {
    this.id_socket = id_socket
    this.variable_id_socket = id_socket
    this.id = id
    this.game_name = (game_name === undefined?user_names[Math.floor(Math.random() * user_names.length)]:game_name)
    this.role = role
    this.points = points
    this.character= character
    this.bought_characters = bought_characters
  }
  async ToString(){
    return `SOCKET ID : ${this.id_socket}\nID : ${this.id}\nGAME : ${this.game_name}\nROLE : ${this.role}\nPOINTS : ${this.points}\n`
  }
  async GetUserData(){
    return {
      id_socket : this.id_socket,
      id : this.id,
      variable_id_socket : this.variable_id_socket,
      game_name : this.game_name,
      role : this.role,
      points : this.points,
      character : this.character,
      bought_characters : this.bought_characters,
    }
  }
  SetCharacter( character) {
    this.character = character;
    return this.GetUserData()
  }


  AddPoints(points) {
    this.points += points;
    return this.GetUserData()
  }


}
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
  AllUsers,
  Users


};
