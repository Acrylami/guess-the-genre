const hostStore = {};

exports.createStoreValue = (roomName, hostId, hostTopic, hostName) => {
  hostStore[roomName] = {hostId, hostTopic,players: [hostName]};
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
