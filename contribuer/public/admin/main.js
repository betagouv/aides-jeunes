const LEGENDE_PERIODICITE_AIDE_ENUM = {
  ponctuelle: "",
  mensuelle: "/ mois",
  annuelle: "/ an",
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
      const montant = droit.montant || 1
      const unit = droit.unit || "€"
      const legend =
        droit.legend || LEGENDE_PERIODICITE_AIDE_ENUM[droit.periodicite] || ""
      droitEstime = (
        <span className="aj-droit-value">
          {montant + " " + unit + " " + legend}
        </span>
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

  return (
    <div className="aj-main-container">
      <div className="aj-results-details">
        <div className="aj-droit-detail">
          <div className="aj-droit-identity">{droit.label}</div>
          <div className="aj-droit-montant">
            <DroitEstime droit={droit} />
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

CMS.registerPreviewTemplate("benefits", DroitPreviewTemplate)
