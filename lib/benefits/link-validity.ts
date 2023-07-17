import { benefitData } from "../types/link-validity.js"

export function getRequiredAdditionsAndTouchWarningsToKeep(
  existingWarnings,
  checkResult: benefitData
): any {
  const recordsToAdd: any[] = []
  checkResult.links.forEach((item) => {
    if (item.ok) {
      return
    }
    const record = {
      fields: {
        Aide: checkResult.id,
        Priorite: checkResult.priority,
        Erreur: item.status,
        Lien: item.link,
        Type: item.type,
      },
    }
    const existingWarning = existingWarnings?.[checkResult.id]?.[item.type]
    if (existingWarning?.fields?.Erreur === item.status) {
      existingWarning.keep = true
    } else {
      recordsToAdd.push(record)
    }
  })
  return recordsToAdd
}
