const find = (line) => {
    return document.querySelector(line);
}

const greeting = ['We welcome you at the game!', 'Please, provide game id given by your game-leader.'];
const onNotFound = ['We welcome you at the game!', 'But your game was not found :( Perhaps, retry your input?'];

const fillGreeting = (data) => {
    const greeting = find('.greeting');
    greeting.innerHTML = "";
    data.forEach(text => {
        const par = document.createElement('p');
        par.innerHTML = text;
        greeting.appendChild(par);
    });
}

const takeToLoader = (body) => {
    body.style.transform = 'translate(-100vw)';
}

const fillGameFor = (whom) => {
    const forWhom = find('.for-' + whom);
    forWhom.style.display = 'grid';
}

const init = () => {
    fillGreeting(greeting);
    const body = find('.game-content');
    
    const finder = find('.game-finder');
    finder.addEventListener('click', () => {
        takeToLoader(body);
        const submitGameId = find('.submit-game-id');

        setTimeout(() => {
            submitGameId.value = '';
            body.style.transform = 'translate(0)';
            fillGreeting(onNotFound);
        }, 2000);
    });

    const starter = find('.game-starter');
    starter.addEventListener('click', () => {
        takeToLoader(body);
        fillGameFor('host');
        setTimeout(() => {
            body.style.transform = 'translate(-200vw)';
        }, 2000);
    });
}

document.addEventListener('DOMContentLoaded', init);
