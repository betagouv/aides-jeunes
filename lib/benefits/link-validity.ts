import { benefitData, GristOperation } from "../types/link-validity.js"

function buildPullRequestProcessor(pullRequestURL) {
  function processPullRequest(
    checkResult,
    linkInfo,
    existingWarning,
    operations: GristOperation[]
  ) {
    if (linkInfo.ok && existingWarning) {
      if (existingWarning.fields.PR != pullRequestURL) {
        operations.push({
          type: "update",
          record: {
            id: existingWarning.id,
            fields: {
              PR: pullRequestURL,
            },
          },
        })
      }
    }
  }
  return processPullRequest
}

function processCron(
  checkResult,
  linkInfo,
  existingWarning,
  operations: GristOperation[]
) {
  if (linkInfo.ok) {
    if (existingWarning) {
      operations.push({
        type: "update",
        record: {
          id: existingWarning.id,
          fields: {
            Corrige: true,
          },
        },
      })
    }
    return
  }

  const record = {
    fields: {
      Aide: checkResult.id,
      Priorite: checkResult.priority,
      Erreur: linkInfo.status,
      Lien: linkInfo.link,
      Type: linkInfo.type,
    },
  }
  if (!existingWarning) {
    operations.push({
      type: "add",
      record,
    })
  } else {
    if (existingWarning.fields.Erreur !== linkInfo.status) {
      operations.push({
        type: "update",
        record: {
          id: existingWarning.id,
          fields: {
            Corrige: true,
          },
        },
      })
      operations.push({
        type: "add",
        record,
      })
    }
  }
}

export function determineOperationsOnBenefitLinkError(
  existingWarnings,
  checkResult: benefitData,
  pullRequestURL?: string
) {
  const processor = pullRequestURL
    ? buildPullRequestProcessor(pullRequestURL)
    : processCron
  const operations: GristOperation[] = []
  checkResult.links.forEach((link) => {
    const existingWarning = existingWarnings?.[checkResult.id]?.[link.type]
    processor(checkResult, link, existingWarning, operations)
  })
  return operations
}
