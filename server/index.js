require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const {spawn} = require('child_process');
const {createStoreValue, getValueFromStore, deleteValueFromStore, addPlayer} = require('./store');
const {testTopics, testeStories} = require('./test-data');

let id = 0;

io.on('connection', (socket) => {
  let output;
  console.log('connected to socket.io successfully');

  socket.on('get-topic-ideas', () => {
    socket.emit('receive-topic-ideas', testTopics);
  });
  socket.on('create-room', (values) => {
    id++;
    let [hostName, topic, hostId] = values;
    let newRoom = `room ${id}`;
    createStoreValue(newRoom,hostId,topic,hostName);

    socket.join(hostId);
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
    socket.to(roomDetails.hostId).emit('receive-topic-idea',values)
  });
  socket.on('host-picked-topic', (values) =>{
    let[roomName, ...rest] = values;
    socket.to(roomName).emit('receive-winning-topic', rest);
  });
  socket.on('close-room', (roomName) => {
    deleteValueFromStore(roomName);
  })

});



function createStory(topic,socket,output){
  if(topic === 'sci-fi'){
    topic = 'sci_fi';
  }
  output = testeStories[topic];
  socket.emit('get-story', output);
  // let python = spawn('python', ['some python file', topic]);
  // python.stdout.on('data', (data) => {
  //   console.log('pipe data from python script');
  //   output = data.toString();
  // });
  // python.on('close', (code) => {
  //   console.log(`child process close all stdio with code ${code}`);
  //   socket.emit('get-story', output);
  // })

}



server.listen(5000, () => {
  console.log('server started on port 5000')
});
