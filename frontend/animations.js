const SCREEN_TRANSITION_MS = 500;

const takeToWindow = (num) => {
    const vws = -100 * num;
    const body = find('.game-content');
    body.style.transform = `translate(${vws}vw)`;
}

const pulse = (elemFinder, color) => {
    const elems = findAll(elemFinder);
    elems.forEach(elem => {
        elem.style.animation = 'pulse' + color + ' 0.5s';
        setTimeout(() => {
            elem.style.animation = 'none';
        }, 500);
    });
};
