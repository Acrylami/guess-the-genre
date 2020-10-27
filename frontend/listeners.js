const socket = io('ws://localhost:5000');

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
    socket.on('receive-winning-topic', ([topicIdea]) => {
        console.log(topicIdea);
    });
};

let firstSuggestion = true;
const listenForStorySuggestion = () => {
    socket.on('receive-topic-idea', (playerName, topicIdea) => {
        const suggestions = find('.suggestions-wrapper');
        if (firstSuggestion) {
            const suggestionsTitle = createPar('Suggestions from your players');
            suggestions.innerHTML = "";
            suggestions.appendChild(suggestionsTitle);
            firstSuggestion = false;
        }

        const suggestion = createPar(topicIdea, ['hover-shadow']);
        suggestion.addEventListener('click', () => {
            socket.emit('host-picked-topic', [gameState.id, [topicIdea]]);
        });
        suggestions.appendChild(suggestion);
    });
}

let playerEvents = ['user-joined-room', 'receive-story'];
let hostEvents = ['user-joined-room'];

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
