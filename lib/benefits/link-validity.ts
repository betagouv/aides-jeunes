import {
  BenefitLinkProperties,
  GristOperation,
} from "../types/link-validity.js"

function buildPullRequestProcessor(pullRequestURL) {
  function processPullRequest(
    _,
    linkInfo,
    existingWarning,
    operations: GristOperation[]
  ) {
    if (linkInfo.ok && existingWarning) {
      if (existingWarning.fields.PR != pullRequestURL) {
        operations.push({
          type: "update",
          data: {
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
  { id, priority },
  linkInfo,
  existingWarning,
  operations: GristOperation[]
) {
  if (linkInfo.ok) {
    if (existingWarning) {
      operations.push({
        type: "update",
        data: {
          id: existingWarning.id,
          fields: {
            Corrige: true,
          },
        },
      })
    }
    return
  }

  const data = {
    fields: {
      Aide: id,
      Priorite: priority,
      Erreur: linkInfo.status,
      Lien: linkInfo.link,
      Type: linkInfo.type,
    },
  }
  if (!existingWarning) {
    operations.push({
      type: "add",
      data,
    })
  } else {
    if (existingWarning.fields.Erreur !== linkInfo.status) {
      operations.push({
        type: "update",
        data: {
          id: existingWarning.id,
          fields: {
            Corrige: true,
          },
        },
      })
      operations.push({
        type: "add",
        data,
      })
    }
  }
}

export function determineOperationsOnBenefitLinkError(
  existingWarnings,
  benefitLinksCheckResult: BenefitLinkProperties,
  pullRequestURL?: string
) {
  const processor = pullRequestURL
    ? buildPullRequestProcessor(pullRequestURL)
    : processCron
  const operations: GristOperation[] = []
  const benefitId = benefitLinksCheckResult.id
  const existingWarningsLink = existingWarnings?.[benefitId]

  benefitLinksCheckResult.links.forEach((link) => {
    const existingWarning = existingWarningsLink?.[link.type]
    processor(benefitLinksCheckResult, link, existingWarning, operations)
    if (!existingWarning && existingWarningsLink) {
      // cas ou le lien a été supprimé ainsi que sa propriété
      for (const type in existingWarningsLink) {
        if (
          !benefitLinksCheckResult.links.some(
            (linkObject) =>
              linkObject.link === existingWarningsLink[type]?.fields?.Lien &&
              benefitLinksCheckResult.links.length > 0
          )
        ) {
          processor(
            benefitLinksCheckResult,
            benefitLinksCheckResult.links[0], //je prends le premier lien
            existingWarningsLink[type],
            operations
          )
        }
      }
    }
  })

  return operations
}

export function determineExistingWarningsFixByPrivateBenefits(
  existingWarnings,
  privateBenefits,
  benefitOperationsList,
  pullRequestURL?: string
) {
  for (const warningBenefitId in existingWarnings) {
    const privateBenefit = privateBenefits?.filter(
      (benefit) => benefit.id === warningBenefitId
    )
    if (privateBenefit?.length) {
      for (const type in existingWarnings[warningBenefitId]) {
        const PR =
          pullRequestURL &&
          existingWarnings[warningBenefitId][type].fields.PR !== pullRequestURL
            ? { pullRequestURL }
            : {}
        benefitOperationsList.push([
          {
            type: "update",
            data: {
              id: existingWarnings[warningBenefitId][type].id,
              fields: {
                Corrige: true,
                ...PR,
              },
            },
          },
        ])
      }
    }
  }
}
