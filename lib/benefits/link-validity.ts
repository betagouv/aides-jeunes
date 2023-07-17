import {
  benefitData,
  GristData,
  GristAddition,
  GristUpdate,
} from "../types/link-validity.js"

function buildPRProcessor(pullRequestURL) {
  function processPR(checkResult, linkInfo, existingWarning, { update }) {
    if (linkInfo.ok && existingWarning) {
      if (existingWarning.fields.PR != pullRequestURL) {
        update.push({
          id: existingWarning.id,
          fields: {
            PR: pullRequestURL,
          },
        })
      }
    }
  }
  return processPR
}

function processCron(
  checkResult,
  linkInfo,
  existingWarning,
  { add, keep, update }
) {
  if (linkInfo.ok) {
    if (existingWarning) {
      update.push({
        id: existingWarning.id,
        fields: {
          Corrige: true,
        },
      })
    }
    return
  }

  const newRecord = {
    fields: {
      Aide: checkResult.id,
      Priorite: checkResult.priority,
      Erreur: linkInfo.status,
      Lien: linkInfo.link,
      Type: linkInfo.type,
    },
  }
  if (!existingWarning) {
    add.push(newRecord)
  } else {
    if (existingWarning.fields.Erreur === linkInfo.status) {
      keep.push(existingWarning)
    } else {
      update.push({
        id: existingWarning.id,
        fields: {
          Corrige: true,
        },
      })
      add.push(newRecord)
    }
  }
}

export function determineOperationsOnBenefitLinkError(
  existingWarnings,
  checkResult: benefitData,
  pullRequestURL?: string
) {
  const processor = pullRequestURL
    ? buildPRProcessor(pullRequestURL)
    : processCron
  const add: GristAddition[] = []
  const keep: GristData[] = []
  const update: GristUpdate[] = []
  const result = { add, keep, update }
  checkResult.links.forEach((link) => {
    const existingWarning = existingWarnings?.[checkResult.id]?.[link.type]
    processor(checkResult, link, existingWarning, result)
  })
  return result
}
