export const autoSubmitMixin = (props) => {
    const { fieldName = props, manualValidation = false } = props

    if (manualValidation)
        return {}

    return {
        data() {
            return {
                value: this[fieldName]
            }
        },
        watch: {
            value() {
                setTimeout(this.onSubmit, process.env.VUE_APP_VALIDATION_DELAY || 0)
            }
        },
    }
}
