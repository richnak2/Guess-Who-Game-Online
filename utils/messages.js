
function format_message(game_id, socket_id,massage) {
  return {
    game_id:game_id,
    player_name:socket_id,
    massage:massage
  };
}
function format_error(massage, time,type) {
  return {
    massage:massage,
    time:time,
    type:type
  };
}

module.exports = {format_message,format_error};


