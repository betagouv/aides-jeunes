import objectPath from 'object-path-immutable';

import store from '../store';
import {
    createErrorAction,
    createOpenfiscaSituationUpdateAction,
} from '../actions';

if (typeof window != 'undefined')  // isomorphism
    require('../forms');


/** @class
* Represents a data element to get from the user.
*/
export default class Question {
    /**
    * @param {Object} options Handlers for lifecycle events of the question.
    * @constructs
    */
    constructor({
        validate = (input => undefined),  // should return an Error redux action or a falsy
        parse    = (value => value),
        format   = (value => value),
        route    = (state => ''),
    } = {}) {
        Object.assign(this, { validate, parse, format, route });
    }

    bindTo(inputName) {
        this.openFiscaPropertyPath = inputName;
        this.form = getInput(inputName).form;

        this.form.addEventListener('submit', event => {
            event.preventDefault();

            const input = getInput(inputName);  // need to select it again in case it is a dynamic input (e.g. radio button)

            store.dispatch(this.validate(input) || this.update(this.parse(input.value)));
        });

        store.subscribe(() => {
            const state = store.getState();

            if (! state.error)
                window.location = this.route(state) || this.form.action;
        });
    }

    validate(input) {
        if (input.required && ! input.value)
            return createErrorAction(input.name, 'required', input.value);

        if (input.required && input.type == 'radio' && ! input.checked)
            return createErrorAction(input.name, 'required', input.value);

        return this.validator(input);
    }

    /**
     * @param {String} value  Value to set.
     * @return {Action} A Redux action to be dispatched to the store.
     */
    update(value) {
        const situation = objectPath.set(
            store.getState().openfiscaSituation,
            this.openFiscaPropertyPath,
            this.format(value)
        );

        return createOpenfiscaSituationUpdateAction(situation);
    }
}


function getInput(name) {
    return document.querySelector(`input[name="${name}"]:checked`)  // support radio groups, including for browsers that don't support RadioNodeList (IE)
           || document.querySelector(`input[name="${name}"]`);
}
