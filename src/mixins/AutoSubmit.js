export const autoSubmitMixin = (propName, manualValidation) => {
    if (manualValidation)
        return {}

    return {
        data() {
            return {
                value: this[propName]
            }
        },
        watch: {
            value() {
                setTimeout(this.onSubmit, process.env.VUE_APP_VALIDATION_DELAY || 0)
            }
        },
    }
}
