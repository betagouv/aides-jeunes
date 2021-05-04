export const autoSubmitMixin = (props) => {

    const { fieldName = props, manualValidation = false } = props || {}

    if (manualValidation)
        return {}
    const mixin = {
        methods: {
            tryAutoSubmit() {
            },
        },
    }

    if (! fieldName) {
        return mixin
    } else {
        return {
            ...mixin,
            methods: {
                ...mixin.methods,
                canAutoSubmit() {
                    return true
                },
            },
            created() {
                this.$watch(fieldName, function () {
                    this.tryAutoSubmit()
                })
            }
        }
    }
}
