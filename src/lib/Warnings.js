const texts = {
  nc_code_postal() {
    return "Attention, les calculs du simulateur sont peu fiables pour les communes de Nouvelle-Calédonie."
  },
}

const Warning = {
  get: function (attribute) {
    return texts[attribute]()
  },
}

export default Warning
