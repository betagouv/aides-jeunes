import store from '../store';
import updateErrorMessages from './update-semantic-validation';
import updateLoaders from './update-semantic-async';
import updateRecap from '../recap';


store.subscribe(() => {
    const state = store.getState();

    updateErrorMessages(state);
    updateLoaders(state);
    updateRecap(state);
});

window.onload = () => updateRecap(store.getState());
