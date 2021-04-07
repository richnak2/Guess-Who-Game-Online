
function format_message(game_id, socket_id,massage) {
  return {
    game_id:game_id,
    player_name:socket_id,
    massage:massage
  };
}

module.exports = {format_message};


