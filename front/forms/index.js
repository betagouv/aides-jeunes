import store from '../store';
import updateErrorMessages from './update-semantic-validation';
import validateCommon from './validate-common';


/**
 * Handles forms submission.
 * @param  {String} inputName Name of the field from which to get the value, which must also be property path of the OpenFisca situation.
 * @param  {Function<String, ?> => Action} createAction Returns a Redux action to be dispatched to the store from the input name and input value.
 */
export default function bindToForm(inputName, createAction) {
    const form = document.forms[0];

    form.addEventListener('submit', event => {
        event.preventDefault();

        const input = document.querySelector(`input[name="${inputName}"]:checked`)  // support radio groups, including for browsers that don't support RadioNodeList (IE)
                      || document.querySelector(`input[name="${inputName}"]`);

        store.dispatch(validateCommon(inputName, input) || createAction(inputName, input.value));
    });

    store.subscribe(() => {
        if (! store.getState().error)
            window.location = form.action;
    });
}

store.subscribe(() => { updateErrorMessages(store.getState()) });
