const LEGENDE_PERIODICITE_AIDE_ENUM = {
  ponctuelle: "",
  mensuelle: "/ mois",
  annuelle: "/ an",
}

// Effectue une vérification groupée sur les champs ayant l'attribut required_group
const groupFieldsLegend = {
  cta: "Liens vers un site, téléservice ou formulaire",
  identifier: "Code INSEE ou code SIREN",
}
const groupFieldsHint = "Au moins un des champs suivants doit être rempli"

const requiredGroupValidator = (group) => {
  return [
    ...document.querySelectorAll(`[data-group-required*=${group}]`),
  ].reduce((previous, current) => {
    return previous || current.querySelector(":scope > input").value.length > 0
  }, false)
}

const groups = {}
const requiredGroupRender = (name, item, id) => {
  try {
    // Flush group container on page update
    if (
      typeof groups[id] !== "undefined" &&
      groups[id]?.childs.includes(name)
    ) {
      delete groups[id]
    }
    if (!groups[id]?.container) {
      groups[id] = {
        childs: [],
        container: document.createElement("div"),
      }

      groups[id].container.className = "fields-group"
      item.parentNode.parentNode.parentNode.insertBefore(
        groups[id].container,
        item.parentNode.parentNode,
      )

      if (groupFieldsLegend[id]) {
        const legend = document.createElement("div")
        legend.innerText = groupFieldsLegend[id]
        legend.className = "fields-group-label"
        groups[id].container.appendChild(legend)
      }
      const hint = document.createElement("div")
      hint.innerText = groupFieldsHint
      hint.className = "fields-group-hint"
      groups[id].container.appendChild(hint)
    }
    groups[id].childs.push(name)
    groups[id].container.appendChild(item.parentNode.parentNode)
  } catch (e) {
    console.log("Failed to set fields group", e)
  }
}
// Fin de la validation de champ groupés

// Affichage d'informations d'institution
var institutionsMap = {}
function updateInstitutionsList(institutions) {
  for (let key in institutions) {
    if (institutions[key]?.slug && institutions[key].data) {
      const slug = institutions[key].slug
      institutionsMap[slug] = {
        name: institutions[key].data?.name,
        imgSrc: institutions[key].data?.imgSrc,
      }
    }
  }
}

const baseURL =
  document.location.host == "localhost:3000"
    ? "http://localhost:8080"
    : "https://mes-aides.1jeune1solution.beta.gouv.fr"
class DroitPreviewTemplate extends React.Component {
  constructor(props) {
    super(props)
    this.iframe = React.createRef()
    this.checkReadiness = this.checkReadiness.bind(this)
    this.send = this.send.bind(this)
    addEventListener("message", this.checkReadiness)
  }
  checkReadiness(event) {
    if (event.data.source == "aides-jeunes" && event.data.value == "ready") {
      removeEventListener("message", this.checkReadiness)
      this.send()
    }
  }
  send() {
    const slug = this.props.entry.get("slug")
    const benefit = {
      slug,
      id: slug,
      ...this.props.entry.get("data").toJS(),
    }
    const institutionData =
      (benefit.institution && institutionsMap[benefit.institution]) || {}
    const institution = {
      label: institutionData.name || benefit.institution,
      ...institutionData,
    }
    this.iframe.current.contentWindow.postMessage(
      {
        source: "decap",
        value: {
          ...benefit,
          institution,
        },
      },
      baseURL,
    )
  }
  componentDidUpdate(prevProps) {
    this.send()
  }
  render() {
    return (
      <iframe
        ref={this.iframe}
        class="aj-iframe"
        src={`${baseURL}/preview?iframe`}
      />
    )
  }
}

CMS.registerPreviewTemplate("benefits_openfisca", DroitPreviewTemplate)
CMS.registerPreviewTemplate("benefits_javascript", DroitPreviewTemplate)

if (document.location.host == "localhost:3000") {
  const productionURL = "https://contribuer-aides-jeunes.netlify.app/"
  if (localStorage.getItem("netlifySiteURL") !== productionURL) {
    window.localStorage.setItem("netlifySiteURL", productionURL)
    document.location.reload()
  }
}
