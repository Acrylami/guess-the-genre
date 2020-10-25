const hostStore = {};

exports.createStoreValue = (roomName, hostEmail, hostTopic, hostName) => {
  hostStore[roomName] = {hostEmail, hostTopic,players: [hostName]};
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
