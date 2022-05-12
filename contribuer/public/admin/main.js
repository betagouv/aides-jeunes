const config = {
  institutionRessourcesURL: "https://mes-aides.1jeune1solution.beta.gouv.fr",
}

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
        item.parentNode.parentNode
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

const Conditions = ({ conditions }) => {
  if (!conditions || !conditions.length) {
    return <div></div>
  }

  let conditionsList = conditions.map((condition, index) => {
    return <li key={index} dangerouslySetInnerHTML={{ __html: condition }}></li>
  })
  return (
    <div className="aj-content-conditions">
      <p className="aj-content-conditions-title">
        Pour en bénéficier, vous devez également :
      </p>
      <ul className="list-unstyled">{conditionsList}</ul>
    </div>
  )
}

const Description = ({ description, link }) => {
  const linkHTML = link ? (
    <a href={link}>Plus d&apos;informations</a>
  ) : (
    <span></span>
  )

  if (!description) {
    return <p>{linkHTML}</p>
  }

  return (
    <div className="aj-content-description">
      <p className="aj-droit-description-text">
        <span
          dangerouslySetInnerHTML={{
            __html: description,
          }}
        ></span>
        &nbsp;
        {linkHTML}
      </p>
    </div>
  )
}

const DroitEstime = ({ droit }) => {
  if (!droit.type) {
    return <span></span>
  }

  let droitEstime
  switch (droit.type) {
    case "bool":
      droitEstime = <span className="aj-droit-eligible">✅</span>
      break
    case "float":
      const montant = droit.montant || ""
      const unit = droit.montant ? droit.unit : ""
      const legend =
        droit.legend && LEGENDE_PERIODICITE_AIDE_ENUM[droit.periodicite]
          ? `${droit.legend} ${
              LEGENDE_PERIODICITE_AIDE_ENUM[droit.periodicite]
            }`
          : droit.legend ||
            LEGENDE_PERIODICITE_AIDE_ENUM[droit.periodicite] ||
            ""
      droitEstime = (
        <span className="aj-droit-value">{`${montant} ${unit} ${legend}`}</span>
      )
      break
    default:
      droitEstime = <span></span>
      break
  }
  return droitEstime
}

const CTA = ({ droit }) => {
  if (!droit.teleservice && !droit.form && !droit.instructions) {
    return <span></span>
  }

  const ctas = [
    {
      test: Boolean(droit.teleservice),
      ctaLink: droit.teleservice,
      ctaLabel: "Faire une demande en ligne",
    },
    {
      test: Boolean(droit.form),
      ctaLink: droit.form,
      ctaLabel: "Accéder au formulaire papier",
    },
    {
      test: Boolean(droit.instructions),
      ctaLink: droit.instructions,
      ctaLabel: "Lien vers des instructions à suivre",
    },
  ]

  return ctas
    .filter((cta) => cta.test)
    .slice(0, 2)
    .map((cta, index) => (
      <a href={cta.ctaLink} key={index} className="aj-droit-cta button cta">
        {cta.ctaLabel}
      </a>
    ))
}

const DroitPreviewTemplate = ({ entry }) => {
  const droit = entry.get("data").toJS()
  const institution =
    droit.institution && institutionsMap[droit.institution]
      ? institutionsMap[droit.institution].name
      : ""
  const institutionImage =
    droit.institution && institutionsMap[droit.institution]
      ? institutionsMap[droit.institution].imgSrc
      : undefined
  return (
    <div className="aj-main-container">
      <h1 className="aj-preview">Aperçu</h1>
      <div className="aj-results-details">
        <div className="aj-droit-detail">
          <div className="aj-droit-header">
            {(droit.imgSrc && (
              <img
                className="aj-droit-illustration"
                src={`${config.institutionRessourcesURL}/${droit.imgSrc}`}
              />
            )) ||
              (institutionImage && (
                <img
                  className="aj-droit-illustration"
                  src={`${config.institutionRessourcesURL}/${institutionImage}`}
                />
              ))}
            <div>
              <div className="aj-droit-identity">{droit.label}</div>
              <div className="aj-institution-label">{institution}</div>
            </div>

            <div className="aj-droit-montant">
              <DroitEstime droit={droit} />
            </div>
          </div>
          <div className="aj-droit-content">
            <div className="aj-droit-content-description">
              <Description description={droit.description} link={droit.link} />
            </div>
            <div className="aj-droit-conditions">
              <Conditions conditions={droit.conditions} />
            </div>
            <div className="aj-droit-content-buttons-cta">
              <CTA droit={droit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

CMS.registerPreviewTemplate("benefits_openfisca", DroitPreviewTemplate)
CMS.registerPreviewTemplate("benefits_javascript", DroitPreviewTemplate)
