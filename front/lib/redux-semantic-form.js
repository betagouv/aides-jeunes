store.subscribe(function updateErrorMessages() {
    const state = store.getState();

    Array.prototype.forEach.call(document.querySelectorAll('[data-for]'), message => {
        message.classList[
            message.attributes['data-for'].value == (state.error && state.error.id)
            ? 'add'
            : 'remove'
        ]('ui', 'form', 'error');
    });
});
