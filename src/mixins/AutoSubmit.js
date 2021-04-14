
import ABTestingService from '@/plugins/ABTestingService'

export const autoSubmitMixin = (props) => {

    const { fieldName = props, manualValidation = false } = props || {}

    const abTesting = ABTestingService.getEnvironment();
    var submitTesting = abTesting && abTesting.submit && abTesting.submit.value;

    if (manualValidation)
        return {}
    const mixin = {
        methods: {
            tryAutoSubmit() {
                if(this.canAutoSubmit() && (submitTesting === 'auto' || process.env.VUE_APP_FORCE_AUTOSUBMIT)) {
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
                    this.tryAutoSubmit()
                })
            }
        }
    }
}
