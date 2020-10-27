const greeting = ['We welcome you at the game!', 'Please, provide game id given by your game-leader.'];
const onNotFound = ['We welcome you at the game!', 'But your game was not found :( Perhaps, retry your input?'];

const setSuggestions = () => {
    const pickContainer = find('.topic-selector');
    gameState.topics.forEach(topic => {
        const topicSuggestion = createNiceRectangleDiv(topic, ['nice-div', 'hover-shadow']);
        pickContainer.appendChild(topicSuggestion);
        topicSuggestion.addEventListener('click', () => {
            socket.emit('submit-topic-idea', [gameState.id, gameState.nickname, topic]);
            gameState.submittedTopic = topic;
            pickContainer.innerHTML = '';
            const alreadySubmitted = createPar('You submitted a topic: ' + topic);
            pickContainer.appendChild(alreadySubmitted);
            const waitHint = createPar('Wait for the host to resolve the match!');
            pickContainer.appendChild(waitHint);
        });
    });
};

const retrieveHostStory = () => {
    socket.emit('send-story', gameState.id);
    socket.on('get-story', (story) => {
        const sendButton = document.createElement('input');
        sendButton.type = 'button';
        sendButton.value = 'Send story to your roommates!';
        sendButton.addEventListener('click', () => {
            socket.emit('send-story', gameState.id);
        });
        const storyWrapper = find('.story-wrapper');
        storyWrapper.appendChild(sendButton);
        setStory(story);
    });
};

const fillGreeting = (data) => {
    const greeting = find('.greeting');
    greeting.innerHTML = "";
    data.forEach(text => {
        greeting.appendChild(createPar(text));
    });
};

const fillGameFor = (whom) => {
    const forWhom = find('.for-' + whom);
    forWhom.style.display = 'grid';
    if (whom == 'player') {
        setUpPlayerListeners();
        setSuggestions();
    } else {
        setUpHostListeners();
    }
};

const loadTopics = () => {
    const hostTopics = find('.host-topics');
    socket.emit('get-topic-ideas', '');
    socket.on('receive-topic-ideas', values => {
        gameState.topics = values;
        values.forEach(topic => {
            let par = createPar(topic, ['selectable-topic', 'hover-shadow']);
            hostTopics.appendChild(par);
        });

        const topics = findAll('.selectable-topic');
        topics.forEach(topic => {
            topic.addEventListener('click', () => {
                topics.forEach(inTopic => {
                    inTopic.classList.remove('selected');
                });
                topic.classList.add('selected');
                gameState.topic = topic.innerHTML;
            });
        });
    });
};

const fillGameId = () => {
    findAll('.game-id-field').forEach(field => {
        field.innerHTML = gameState.id;
    });
}

const fillGameDetails = () => {
    fillGameId();

    findAll('.game-topic-field').forEach(field => {
        field.innerHTML = gameState.topic;
    });
};

const createRoom = () => {
    let topic = gameState.topic;
    let hostNickname = find('.submit-host-nickname').value;
    socket.emit('create-room', [hostNickname, topic, generateRandomSHA()]);

    socket.on('receive-game-id', (id) => {
        gameState.id = id;
        fillGameDetails();
        retrieveHostStory();
    });
};

const onSearchFailed = () => {
    const submitGameId = find('.submit-game-id');
    submitGameId.value = '';
    takeToWindow(0);
    fillGreeting(onNotFound);
    socket.on('room-state', () => {});
};

const populatePlayers = (players) => {
    players.forEach(player => {
        if (!gameState.roommates.has(player)) {
            addPlayerToRoom(player);
            gameState.roommates.add(player);
        }
    });
};

const findRoom = (userNickname, roomId) => {
    takeToWindow(1);
    socket.emit('join-room', [userNickname, roomId]);

    let searchFailedTimeout = setTimeout(onSearchFailed, 10000);

    socket.on('room-state', (reply) => {
        clearTimeout(searchFailedTimeout);
        if (Array.isArray(reply)) {
            takeToWindow(2);
            fillGameFor('player');
            fillGameId();
            populatePlayers(reply);
        } else {
            onSearchFailed();
        }
    });
};

const init = () => {
    fillGreeting(greeting);
    loadTopics();
    const body = find('.game-content');

    const finder = find('.game-finder');
    finder.addEventListener('click', () => {
        const userNickname = find('.submit-nickname').value;
        if (!userNickname) {
            pulse('.submit-nickname', 'red');
            return;
        }
        const roomId = find('.submit-game-id').value;
        if (!roomId) {
            pulse('.submit-game-id', 'red');
            return;
        }

        gameState.nickname = userNickname;
        gameState.id = roomId;
        findRoom(userNickname, roomId);
    });

    const starter = find('.game-starter');
    starter.addEventListener('click', () => {
        const hostNickname = find('.submit-host-nickname').value;
        if (!hostNickname) {
            pulse('.submit-host-nickname', 'red');
            return;
        }
        if (findAll('.selected').length == 0) {
            pulse('.selectable-topic', 'red');
            return;
        }

        gameState.nickname = hostNickname;
        takeToWindow(1);
        fillGameFor('host');
        createRoom(hostNickname);
        setTimeout(() => {
            takeToWindow(2);
        }, 2000);
    });
}

document.addEventListener('DOMContentLoaded', init);
