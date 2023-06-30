import { benefitData } from "../types/link-validity.js"

export function determineOperations(
  existingWarnings,
  checkResult: benefitData
): any {
  const operations: any[] = []
  checkResult.links.forEach((item) => {
    if (!item.ok) {
      const additionOperation = {
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
      }
      const warning = existingWarnings?.[checkResult.id]?.[item.type]
      if (warning) {
        if (warning.fields.Erreur === item.status) {
          warning.keep = true
        } else {
          operations.push(additionOperation)
        }
      } else {
        operations.push(additionOperation)
      }
    }
  })
  return operations
}
