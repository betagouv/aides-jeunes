store.subscribe(function updateErrorMessages() {
    const state = store.getState();

    Array.prototype.forEach.call(document.querySelectorAll('[data-for]'), message => {
        const shouldBeVisible = state.error && (state.error.id == message.attributes['data-for'].value);

        message.classList[
            shouldBeVisible ? 'add' : 'remove'
        ]('ui', 'form', 'error');
    });
});
