const NOTICEABLE_DELAY = 100;

let timeout;

/**
 * Hide and show async status based on given state.
 * @param  {Object} state Redux state with an `async` root property.
 */
export default function updateLoaders(state) {
    clearTimeout(timeout);

    if (state.async)
        timeout = setTimeout(setVisibility.bind(null, true), NOTICEABLE_DELAY);
    else
        setVisibility(false);
}

function setVisibility(shouldShow) {
    Array.prototype.forEach.call(document.querySelectorAll('.ui.loader'), loader => {
        loader.classList[  // IE>9 compatible only
            shouldShow
            ? 'add'
            : 'remove'
        ]('active');
    });
}
