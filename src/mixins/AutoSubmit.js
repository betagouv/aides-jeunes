export const autoSubmitMixin = (props) => {
    const { fieldName = props, manualValidation = false } = props || {}

    if (manualValidation)
        return {}

    const mixin = {
        methods: {
            autoSubmit() {
                if(this.canAutoSubmit()) {
                    setTimeout(this.onSubmit, process.env.VUE_APP_VALIDATION_DELAY || 0)
                }
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
                    this.autoSubmit()
                })
            }
        }
    }
}
