import { assign, capitalize, map } from "lodash-es"

import {
  formatDroitEstime,
  getBenefitImage,
} from "../../../../lib/benefits/details.js"

export function basicBenefitText(droit, parameters) {
  const droitEstime = formatDroitEstime(droit, parameters)

  if (droit.labelFunction) {
    return droit.labelFunction({ ...droit, legend: droitEstime.legend })
  }

  if (droitEstime.type === "bool") {
    return droit.label
  }
  if (droitEstime.unit === "séances") {
    return `${droit.label} : vous pouvez bénéficier de ${droitEstime.value} ${droitEstime.legend}`
  }

  return `${droit.label} pour un montant de ${droitEstime.value} ${droitEstime.legend}`
}

export function formatBenefits(benefits, parameters) {
  return map(benefits, function (droit) {
    let value = ""
    const droitEstime = formatDroitEstime(droit, parameters)

    if (droitEstime.type === "float") {
      value = `${droitEstime.value} ${droitEstime.legend}`
    }

    let ctaLink = ""
    let ctaLabel = ""
    if (droit.teleservice) {
      ctaLink = droit.teleservice
      ctaLabel = "Faire une demande en ligne"
    } else if (droit.form) {
      ctaLink = droit.form
      ctaLabel = "Accéder au formulaire papier"
    } else if (droit.instructions) {
      ctaLink = droit.instructions
      ctaLabel = "Accéder aux instructions"
    } else {
      ctaLink = droit.link
      ctaLabel = "Plus d'informations"
    }

    return assign({}, droit, {
      imgSrc: getBenefitImage(droit),
      montant: value,
      ctaLink: ctaLink,
      ctaLabel: ctaLabel,
      benefitLabel: capitalize(droit.label),
    })
  })
<<<<<<< HEAD
=======

  return mustache
    .render(mjmlTemplate, {
      droits: droits,
      baseURL: config.baseURL,
      returnURL: `${config.baseURL}${followup.returnPath}`,
    })
    .then(function (templateString) {
      const output = mjml(templateString)
      return {
        html: output.html,
      }
    })
}

export default async function render(followup) {
  const populated = await (followup.populated("simulation")
    ? Promise.resolve(followup)
    : followup.populate("simulation"))

  const parameters = await openfiscaController.getParameters(
    populated.simulation.dateDeValeur
  )

  const situationResults = await populated.simulation.compute()
  const droitsEligibles = situationResults.droitsEligibles
  followup.benefits = droitsEligibles.map((benefit) => ({
    id: benefit.id,
    amount: benefit.montant,
    unit: benefit.unit,
  }))
  followup.save()

  return Promise.all([
    renderAsText(followup, droitsEligibles, parameters),
    renderAsHtml(followup, droitsEligibles, parameters),
  ]).then(function (values) {
    return {
      subject: `Récapitulatif de votre simulation sur 1jeune1solution.gouv.fr [${followup.simulation._id}]`,
      text: values[0],
      html: values[1].html,
      attachments: values[1].attachments,
    }
  })
>>>>>>> 3b9282283 (Changement ordre affichage sujet email)
}
