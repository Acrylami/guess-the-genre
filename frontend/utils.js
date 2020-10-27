const gameState = {
    id: null,
    topic: null,
    story: null,
    topics: null,
    submittedTopic: null,
    roommates: new Set(),
};

const appendClassesToElem = (elem, classes) => {
    classes.forEach(cls => {
        elem.classList.add(cls);
    });
}

const createDiv = (classes = []) => {
    const div = document.createElement('div');
    appendClassesToElem(div, classes);
    return div;
};

const createPar = (text, classes = []) => {
    const p = document.createElement('p');
    p.innerHTML = text;
    appendClassesToElem(p, classes);
    return p;
}

const createNiceRectangleDiv = (parText, divClasses) => {
    const p = createPar(parText);
    const div = createDiv(divClasses);
    div.appendChild(p);
    return div;
};

const find = (line, elem = document) => {
    return elem.querySelector(line);
};

const findAll = (line, elem = document) => {
    return elem.querySelectorAll(line);
};

const addPlayerToRoom = (player) => {
    const parHost = createPar(player);
    find('.for-host .roomview-wrapper').appendChild(parHost);
    const parPlayer = createPar(player);
    find('.for-player .roomview-wrapper').appendChild(parPlayer);
};

const setStory = (story) => {
    gameState.story = story;
    findAll('.story-content').forEach(storyPar => {
        storyPar.innerHTML = story;
    });
};

const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
}

const generateRandomSHA = () => {
    let ans = '';
    for (let i = 0; i < 20; i++) {
        ans += getRandomInt(9);
    }
    return ans;
};

const showWinningScreen = (topic) => {
    const topicSpot = find('.winning-topic');
    topicSpot.innerHTML = topic;
    const winScreen = find('.win-screen');
    winScreen.style.display = 'flex';
    console.log('comparison ' + gameState.submittedTopic + ' ' + topic);
    if (!gameState.submittedTopic) {
        find('.host-finish').style.display = 'block';
    } else if (topic == gameState.submittedTopic) {
        find('.congrats').style.display = 'block';
    } else {
        find('.failure').style.display = 'block';
    }
};
