import { benefitData } from "../types/link-validity.js"

export function determineOperations(
  existingWarnings,
  checkResult: benefitData
): any {
  const operations: any[] = []

  checkResult.links.forEach((item) => {
    if (!item.ok) {
      if (
        existingWarnings[checkResult.id] &&
        existingWarnings[checkResult.id][item.type]
      ) {
        if (
          existingWarnings[checkResult.id][item.type].fields.Erreur !==
          item.status
        ) {
          operations.push({
            type: "addition",
            record: {
              fields: {
                Aide: checkResult.id,
                Priorite: checkResult.priority,
                Erreur: item.status,
                Lien: item.link,
                Type: item.type,
              },
            },
          })
        } else {
          existingWarnings[checkResult.id][item.type].keep = true
        }
      } else {
        operations.push({
          type: "addition",
          record: {
            fields: {
              Aide: checkResult.id,
              Priorite: checkResult.priority,
              Erreur: item.status,
              Lien: item.link,
              Type: item.type,
            },
          },
        })
      }
    }
  })
  return operations
}
