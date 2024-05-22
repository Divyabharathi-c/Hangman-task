// models/GameRoom.js
const mongoose = require('mongoose');

const gameRoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  word: { type: String, required: true },
  guesses: [{ type: String }],
  incorrectGuesses: { type: Number, default: 0 },
});

module.exports = mongoose.model('GameRoom', gameRoomSchema);
