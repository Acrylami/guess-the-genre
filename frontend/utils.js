const gameState = {
    id: null,
    topic: null,
    story: null,
    topics: null,
};

const createPar = (text, classes = []) => {
    const p = document.createElement('p');
    p.innerHTML = text;
    classes.forEach(addClass => {
        p.classList.add(addClass);
    });
    return p;
}

const find = (line, elem = document) => {
    return elem.querySelector(line);
}

const findAll = (line, elem = document) => {
    return elem.querySelectorAll(line);
}

const addPlayerToRoom = (player) => {
    let roomContents = findAll('.roomview-wrapper');
    const par = createPar(player);
    roomContents.forEach(roomContent => {
        roomContent.appendChild(par);
    });
}

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
