const socket = io();

const listenForUserJoined = () => {
    socket.on('user-joined-room', (username) => {
        addPlayerToRoom(username);
    });
};

const listenForNewStory = () => {
    socket.on('receive-story', (story) => {
        setStory(story);
    });
};

const listenForWinnerTopic = () => {
    socket.on('receive-winning-topic', (topicIdea) => {
        showWinningScreen(topicIdea);
    });
};

const listenForStorySuggestion = () => {
    socket.on('receive-topic-idea', (playerName, topicIdea) => {
        const suggestions = find('.suggestions-container');
        const suggestion = createNiceRectangleDiv(topicIdea, ['nice-div', 'hover-shadow']);
        suggestion.addEventListener('click', () => {
            socket.emit('host-picked-topic', [gameState.id, topicIdea]);
            showWinningScreen(topicIdea);
        });
        suggestions.appendChild(suggestion);
    });
}

let playerEvents = ['user-joined-room', 'receive-story', 'receive-winning-topic'];
let hostEvents = ['user-joined-room', 'receive-topic-idea'];

const setUpPlayerListeners = () => {
    listenForUserJoined();
    listenForNewStory();
    listenForWinnerTopic();
}

const setUpHostListeners = () => {
    listenForUserJoined();
    listenForStorySuggestion();
}

const clearListeners = (whom) => {
    let which = whom == 'host' ? hostEvents : playerEvents;
    let noAction = () => {};
    which.forEach(ev => {
        socket.on(ev, noAction);
    });
}
