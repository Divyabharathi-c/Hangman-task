// routes/game.js
const express = require('express');
const GameRoom = require('../model/GameRoom');
const router = express.Router();

router.post('/create', async (req, res) => {
  const { roomId, word } = req.body;
  const gameRoom = new GameRoom({ roomId, word, players: [] });
  await gameRoom.save();
  res.status(201).send('Game room created');
});

router.post('/join', async (req, res) => {
  const { roomId, userId } = req.body;
  const gameRoom = await GameRoom.findOne({ roomId });
  if (!gameRoom) return res.status(404).send('Room not found');
  gameRoom.players.push(userId);
  await gameRoom.save();
  res.send('Joined game room');
});

module.exports = router;
