const hostStore = {};

exports.createStoreValue = (roomName, hostId, hostTopic, hostName, output) => {
  hostStore[roomName] = {hostId, hostTopic,players: [hostName], output};
}

exports.addPlayer = (roomName, name) =>{
  let value = hostStore[roomName];
  value.players.push(name);
}

exports.getValueFromStore = (roomName) => {
  return hostStore[roomName];
}

exports.deleteValueFromStore = (roomName) =>{
  delete hostStore[roomName];
}
