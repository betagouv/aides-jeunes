const texts = {
  nc_code_postal() {
    return "Attention, les calculs du simulateur sont peu fiables pour la NC."
  },
}

const Warning = {
  get: function (attribute) {
    return texts[attribute]()
  },
}

export default Warning
