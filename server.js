// const express = require('express');
// const socketIo = require('socket.io');
// const mongoose = require('mongoose');
// const authRoutes = require('./routes/auth.js');
// const gameRoutes = require('./routes/game.js');

// const app = express();
// const server = app.listen(4000, () => console.log('Server running on port 4000'));
// const io = socketIo(server);


// // mongoose.connect('mongodb+srv://divyabharathicsit:<password>@cluster0.wmgjesg.mongodb.net/, {
// // //   useNewUrlParser: true,
// //

// mongoose.connect('mongodb+srv://divyabharathicsit:hangman@cluster0.wmgjesg.mongodb.net/')
//     .then(() => {
//         console.log('Connected to the database ')
//     })
//     .catch((err) => {
//         console.error(`Error connecting to the database. n${err}`);
//     })






// app.use(express.json());
// app.use('/auth', authRoutes);
// app.use('/game', gameRoutes);

// io.on('connection', (socket) => {
//   console.log('New client connected');

//   socket.on('joinRoom', (roomId) => {
//     socket.join(roomId);
//   });

//   socket.on('makeGuess', async ({ roomId, guess }) => {
//     const gameRoom = await GameRoom.findOne({ roomId });
//     gameRoom.guesses.push(guess);
//     if (!gameRoom.word.includes(guess)) gameRoom.incorrectGuesses += 1;
//     await gameRoom.save();
//     io.to(roomId).emit('updateGame', gameRoom);
//   });

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });




const express = require('express');
const cors = require('cors');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.js');
const gameRoutes = require('./routes/game.js');

const app = express();
const server = app.listen(4000, () => console.log('Server running on port 4000'));
const io = socketIo(server);

mongoose.connect('mongodb+srv://divyabharathicsit:hangman@cluster0.wmgjesg.mongodb.net/')
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.error(`Error connecting to the database.\n${err}`);
  });

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/game', gameRoutes);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).send({ message: 'Invalid JSON' });
  }
  next();
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
  });

  socket.on('makeGuess', async ({ roomId, guess }) => {
    const gameRoom = await GameRoom.findOne({ roomId });
    gameRoom.guesses.push(guess);
    if (!gameRoom.word.includes(guess)) gameRoom.incorrectGuesses += 1;
    await gameRoom.save();
    io.to(roomId).emit('updateGame', gameRoom);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
