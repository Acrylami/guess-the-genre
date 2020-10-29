require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const {spawn} = require('child_process');
const {createStoreValue, getValueFromStore, deleteValueFromStore, addPlayer} = require('./store');
const {testTopics, testStories} = require('./test-data');

let id = 0;

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req,res)=>{
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'))
});

io.on('connection', (socket) => {
  console.log('connected to socket.io successfully');

  socket.on('get-topic-ideas', () => {
    //socket.emit('receive-topic-ideas', ["horror","crime","fantasy","sicfi","superhero"]);
    getTopics(socket);
  });
  socket.on('create-room', (values) => {
    id++;
    let [hostName, topic, hostId] = values;
    let newRoom = `room ${id}`;

    socket.join(hostId);
    socket.join(newRoom,() => {
      socket.emit('receive-game-id', newRoom);
      socket.emit('user-joined-room', hostName);
      createStory(topic, socket,newRoom,hostId,hostName);

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
    let roomDetails = getValueFromStore(roomName);
    if(roomDetails){
    socket.to(roomName).emit('receive-story',roomDetails.output);
    }

  });
  socket.on('submit-topic-idea', (values) => {
    let [roomName, nickname, topic] = values;
    let roomDetails = getValueFromStore(roomName);
    console.log('sent ' + nickname + ' ' + topic);
    socket.to(roomDetails.hostId).emit('receive-topic-idea', nickname, topic);
  });
  socket.on('host-picked-topic', (values) =>{
    let[roomName, topicIdea] = values;
    socket.to(roomName).emit('receive-winning-topic', topicIdea);
  });
  socket.on('close-room', (roomName) => {
    deleteValueFromStore(roomName);
  })
});

function getTopics(socket){
  let output;
  let python = spawn('python', ['../nlp/connect_backend.py', "get-topics"]);
  python.stdout.on('data', (data) => {
    console.log('pipe data from python script');
    output = data.toString();
  });
  python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    output = output.split("|");
    console.log("topics",output);
    socket.emit('receive-topic-ideas', output);
  })
}

function createStory(topic,socket,newRoom,hostId,hostName){
  let output;
  // output = testStories[topic];
  // socket.emit('get-story', output);
  // return output;
  console.log(topic);
  createStoreValue(newRoom,hostId,topic,hostName, output);
  let python = spawn('python', ['../nlp/connect_backend.py', `${topic}`], {cwd: path.join(__dirname, '../nlp')});
  python.stdout.on('data', (data) => {
    console.log('pipe data from python script');
    output = data.toString();
    console.log(output);
  });
  python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    console.log('story',output);
    socket.emit('get-story', output);
    createStoreValue(newRoom,hostId,topic,hostName, output);
    //socket.to(roomName).emit('receive-story',output);
  });


}

server.listen(5000, () => {
  console.log('server started on port 5000')
});
