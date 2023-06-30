import axios from "axios"

import config from "../../backend/config/index.js"
import Benefits from "../../data/all.js"
import { benefitData } from "../types/link-validity.js"

const customBenefitsFiles = [
  {
    pattern: /-fsl-eligibilite$/,
    file: `${config.github.repository_url}/blob/master/data/benefits/dynamic/fsl.ts`,
  },
  {
    pattern: /-apa-eligibilite$/,
    file: `${config.github.repository_url}/blob/master/data/benefits/dynamic/apa.ts`,
  },
  {
    pattern: /^aidesvelo_/,
    file: `https://github.com/mquandalle/mesaidesvelo/blob/master/src/aides.yaml`,
  },
]

function setEditLink(benefit) {
  for (const category of customBenefitsFiles) {
    if (benefit.id.match(category.pattern)) {
      return category.file
    }
  }
  return ["openfisca", "javascript"].includes(benefit.source)
    ? `https://contribuer-aides-jeunes.netlify.app/admin/#/collections/benefits_${benefit.source}/entries/${benefit.id}`
    : undefined
}

async function getPriorityStats() {
  const stats = await axios
    .get("https://aides-jeunes-stats-recorder.osc-fr1.scalingo.io/statistics")
    .then((r) => r.data)
  const statTotal = stats.map((v) => {
    const p = v.events?.showDetails || {}
    const totals = Object.keys(p)
    return {
      benefit: v.benefit,
      count: totals.reduce((at, t) => {
        const indexes = Object.keys(p[t])
        return (
          at +
          indexes.reduce((ai, i) => {
            return ai + p[t][i]
          }, 0)
        )
      }, 0),
    }
  })

  const statByBenefitId = statTotal.reduce((a, v) => {
    a[v.benefit] = v.count
    return a
  }, {})

  return statByBenefitId
}

export async function getBenefitData(noPriority: boolean) {
  const priorityMap = noPriority ? {} : await getPriorityStats()

  const data = Benefits.all.map((benefit) => {
    const linkMap = ["link", "instructions", "form", "teleservice"]
      .filter(
        (linkType) => benefit[linkType] && typeof benefit[linkType] === "string"
      )
      .reduce((a, linkType) => {
        const link = benefit[linkType]
        a[link] = a[link] || { link, types: [] }
        a[link].types.push(linkType)

        return a
      }, {})

    const links = Object.values(linkMap).map((v: any) => {
      return {
        link: v.link,
        type: v.types.join(" / "),
      }
    })

    return {
      id: benefit.id,
      label: benefit.label,
      institution: benefit.institution.label,
      priority: priorityMap[benefit.id] || 0,
      links,
      editLink: setEditLink(benefit),
    }
  })
  return data.sort((a, b) => +(a.priority - b.priority))
}

export function getRequiredAdditionsAndTouchWarningsToKeep(
  existingWarnings,
  checkResult: benefitData
): any {
  const recordsToAdd: any[] = []
  checkResult.links.forEach((item) => {
    if (!item.ok) {
      const record = {
        fields: {
          Aide: checkResult.id,
          Priorite: checkResult.priority,
          Erreur: item.status,
          Lien: item.link,
          Type: item.type,
        },
      }
      const warning = existingWarnings?.[checkResult.id]?.[item.type]
      if (warning) {
        if (warning.fields.Erreur === item.status) {
          warning.keep = true
        } else {
          recordsToAdd.push(record)
        }
      } else {
        recordsToAdd.push(record)
      }
    }
  })
  return recordsToAdd
}
