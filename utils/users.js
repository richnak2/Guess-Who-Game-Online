let users = [];
const color_pallet = [['#00000000',0],// base color default
  ['#ffffff80',100],['#0013ff80',150],['#e0497080',200],['#30ff0280',250],
  ['#02ffec80',350],['#fcb04580',400],['#fffe1e80',450],['#833ab480',500],
  ['#00000080',550],['#ff00e7ff',600],['#d58ffd80',650], // half transparent colors
  ['#ffffffff',700],['#0013ffff',750],['#e04970ff',800],['#30ff02ff',850],
  ['#02ffecff',900],['#fcb045ff',950],['#fffe1eff',1000],['#833ab4ff',1050],
  ['#000000ff',1100],['#ff00e7ff',1150],['#d58ffdff',1200]]; // full colors
const user_names = ['Ondrej','Barbora','Dusan','Fedor','Chorche','Britni','Julia','Sara','Hazelnut','RushB','Guess','Filomena'];
//get all users
function getAll(){
  return users;
}
// Join user
function userJoin(id_socket , id, game_name, role , points , character , bought_characters) {
  // let user = { id_socket: (id_socket) ? id_socket : undefined ,
  //   id : (id) ? id : undefined ,
  //   game_name : (game_name) ? game_name : undefined ,
  //   role : (role) ? role : undefined ,
  //   points : (points !== undefined) ? points : undefined ,
  //   character: (character) ? character : undefined
  // };
  let user = { id_socket: id_socket,
    id : id ,
    game_name : (game_name === undefined?game_name:user_names[Math.floor(Math.random() * user_names.length)]) ,
    role : role ,
    points : points ,
    character: character ,
    bought_characters : bought_characters
  };
  console.log('ALL USERRS LENGTH : '+users.length)
  if (users.length > 200 ){ // tvrdi restart vsetkych hracov bez oboznamenia prekroceni limmit server connection
    console.log(users)
    users = [];
  }
  users.push(user);

  return user;
}
function buy_character(socket_id,character_or_color) {
  const index = users.findIndex(user => user.id_socket === socket_id);
  if (index !== -1) {
    if (character_or_color.charAt(0) === '#'){ // color
      const index_color = color_pallet.findIndex(color => color[0] === character_or_color);
      if (index_color !== -1) {
        if (users[index].points >= color_pallet[index_color][1] ){
          users[index].points -= color_pallet[index_color][1];
          users[index].bought_characters += ' '+character_or_color;
        }
      }else{
        console.log('NOT FOUNDED COLOR')
      }
    }else{ // character
      let price = parseInt(character_or_color.split('.')[0])*100;
      if (users[index].points >= price  ){
        users[index].points -= price;
        users[index].bought_characters += ' '+character_or_color;
      }
    }
  }
  return users[index];
}

function set_character(socket_id,character) {
  const index = users.findIndex(user => user.id_socket === socket_id);
  if (index !== -1) {
    users[index].character = character;
    return users[index];
  }


}
// Get current user
function getCurrentUser(socket_id) {
  // console.log('GETTING USER WITH SOCKET ID : ',socket_id)
  // return users[0];
  return users.find(user => user.id_socket === socket_id);
}

// User leaves chat
function userLeave(socket_id) {
  const index = users.findIndex(user => user.id_socket === socket_id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}
function add_points(time_of_complete,my_socket_id,guess_count){
  console.log(time_of_complete,my_socket_id,guess_count)
  const get_current_user = getCurrentUser(my_socket_id);
  if (get_current_user !== undefined){
    // treba spravit zmenu aby nezalezalo na case lebo to uz nieje odstatna vec pre hraca

    let points = Math.ceil(500/guess_count);

    get_current_user['points'] += points;
  }else{
    console.log('Neviem pridat body');
  }
}

module.exports = {
  userJoin,
  getCurrentUser,
  set_character,
  buy_character,
  getAll,
  userLeave,
  add_points
};
