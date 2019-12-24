function buildHref({to, subject, body}) {
    let params = [];
    if (subject) {
        params.push('subject=' + encodeURIComponent(subject))
    }
    if (body) {
        params.push('body=' + encodeURIComponent(body))
    }
    let comps = ['mailto:' + to, params.join('&')]
    return comps.join('?')
}

const MailDirective = (Vue) => {
    Vue.directive('mail', function (el, binding) {
      el.setAttribute('href', buildHref(binding.value))
    })
}

export default MailDirective
