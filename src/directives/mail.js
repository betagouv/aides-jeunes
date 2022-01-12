function buildHref({ to, subject, body }) {
  let params = []
  if (subject) {
    params.push("subject=" + encodeURIComponent(subject))
  }
  if (body) {
    params.push("body=" + encodeURIComponent(body))
  }
  let comps = [
    "mailto:" + (to || "aides-jeunes@beta.gouv.fr"),
    params.join("&"),
  ]
  return comps.join("?")
}

const MailDirective = {
  beforeMount(el, binding) {
    el.setAttribute("href", buildHref(binding.value))
  },
  unmounted(el) {
    el.removeEventListener("click", el.myAnalyticsHandler)
  },
}

export default MailDirective
