function buildHref({to, subject, body}) {
    var params = [];
    if (subject) {
        params.push('subject=' + encodeURIComponent(subject))
    }
    if (body) {
        params.push('body=' + encodeURIComponent(body))
    }
    var comps = ['mailto:' + to, params.join('&')]
    return comps.join('?')
}

const MailDirective = (Vue) => {
    Vue.directive('mail', function (el, binding) {
      el.setAttribute('href', buildHref(binding.value))
    })
}

export default MailDirective
