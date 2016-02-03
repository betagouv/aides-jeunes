import { createErrorAction } from '../actions';

/**
 * Apply common validations to an HTML input, based on its attributes. Contextual validation logic should be defined in a specific file.
 * @param {String} inputName The name of the input to validate. Can not be reliably obtained from `input.name` due to radio buttons, which are considered as a group and have no `name` attribute.
 * @param  {HTMLInputElement} input The input to validate.
 * @return {Action?}          Either nothing if no validation errors were found or an ERROR type redux Action.
 */
export default function validateCommon(inputName, input) {
    if (input.required && ! input.value)
        return createErrorAction(inputName, 'required', input.value);
}
