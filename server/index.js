require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const {spawn} = require('child_process');


app.use(express.json(), express.urlencoded({extended: true}));



io.on('connection', (socket) => {
  console.log('connected to socket.io successfully');
  let id = 0;
  socket.on('create-room', (name) => {
    id++;
    let newRoom = `room ${id}`;
    socket.join(newRoom, () => {
      io.in(newRoom).emit('user-joined-room', `${name} entered ${newRoom}`);
    });

  });
  socket.on('join-room', (values) => {
    let [username, roomName] = values.split('|');
    socket.join(roomName, () => {
      io.in(roomName).emit('user-joined-room', `${username} entered ${roomName}`);
    });
  });
  socket.on('create-story', (values) => {
    let [topic, roomName] = values.split('|');
    createStory(topic, roomName);
  });

});
function createStory(topic, roomName){
  let output;
  let python = spawn('python', ['some python file', topic]);
  python.stdout.on('data', (data) => {
    console.log('pipe data from python script');
    output = data.toString();
  });
  python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    io.in(roomName).emit('get-story', output);
  })

}



server.listen(5000, () => {
  console.log('server started on port 5000')
});
