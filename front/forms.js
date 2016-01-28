import {
    setError,
} from './actions';


/**
 * Handles forms submission.
 * @param  {String} inputName Name of the field from which to get the value, which must also be property path of the OpenFisca situation.
 * @param  {Function<String, ?> => Action} createAction Returns a Redux action to be dispatched to the store from the input name and input value.
 */
export default function bindToForm(inputName, createAction) {
    const form = document.forms[0],
          input = form.elements[inputName];  // not equivalent to querySelector due to radio buttons

    form.addEventListener('submit', event => {
        event.preventDefault();

        const value = input.value;

        if (input.required && ! value)
            return store.dispatch(setError(name, 'required', value));

        store.dispatch(createAction(inputName, value));
    });

    store.subscribe(() => {
        if (! store.getState().error)
            window.location = form.action;
    });
}
