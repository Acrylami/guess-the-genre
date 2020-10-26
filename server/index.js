require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const {spawn} = require('child_process');
const {createStoreValue, getValueFromStore, deleteValueFromStore, addPlayer} = require('./store');

let id = 0;

io.on('connection', (socket) => {
  let output;
  console.log('connected to socket.io successfully');

  socket.on('get-topic-ideas', () => {
    let topics = ['action','drama','fantasy','sci-fi','sports','biography'];
    socket.emit('receive-topic-ideas', topics);
  });
  socket.on('create-room', (values) => {
    id++;
    let [hostName, topic, email] = values;
    let newRoom = `room ${id}`;
    createStoreValue(newRoom,email,topic,hostName);

    socket.join(email);
    socket.join(newRoom, () => {
      socket.emit('receive-game-id', newRoom);
      createStory(topic, socket,output);
    });

  });
  socket.on('join-room', (values) => {
    let [username, roomName] = values;
    if(io.sockets.adapter.rooms[roomName]){
      socket.join(roomName, () => {
        addPlayer(roomName, username);
        let roomDetails = getValueFromStore(roomName);
        socket.emit('room-state', roomDetails.players);
        socket.to(roomName).emit('user-joined-room', username);
      });

    }else{
      socket.emit('room-state', 'room-not-found');
    }

  });
  socket.on('send-story',(roomName) =>{
    socket.to(roomName).emit('receive-story',output);
  });
  socket.on('submit-topic-idea', (values) => {
    let [roomName, ...rest] = values;
    let roomDetails = getValueFromStore(roomName);
    socket.to(roomDetails.hostEmail).emit('receive-topic-idea',values)
  });
  socket.on('host-picked-topic', (values) =>{
    let[roomName, ...rest] = values;
    socket.to(roomName).emit('receive-winning-topic', rest);
  });

});



function createStory(topic,socket,output){
  let python = spawn('python', ['some python file', topic]);
  python.stdout.on('data', (data) => {
    console.log('pipe data from python script');
    output = data.toString();
  });
  python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    socket.emit('get-story', output);
  })

}



server.listen(5000, () => {
  console.log('server started on port 5000')
});
