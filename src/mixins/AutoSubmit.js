export const autoSubmitMixin = (props) => {
    const { fields = props, manualValidation = false } = props

    if (manualValidation)
        return {}

    return {
        created() {
            fields.forEach((field) => {
                this.$watch(field.name, function (newVal) {
                    if (!field.values || (field.values && field.values.includes(newVal))) {
                        setTimeout(this.onSubmit, process.env.VUE_APP_VALIDATION_DELAY || 0)
                    }
                })
            })
        }
    }
}
