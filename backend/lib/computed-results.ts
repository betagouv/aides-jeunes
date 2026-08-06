import { isEqual } from "lodash-es"

import benefits from "../../data/all.js"

const GROUPS = ["droitsEligibles", "droitsInjectes"] as const

type Group = (typeof GROUPS)[number]

type SerializedDroit = {
  id: string
  overlay?: Record<string, unknown>
  undefinedKeys?: string[]
}

// Une entrée sérialisée sous un autre format ne décrit pas les mêmes données :
// elle est refusée plutôt que relue de travers.
const SERIALIZATION_FORMAT = 1

export type SerializedResults = Record<Group, SerializedDroit[]> & {
  format: number
}

let catalogById: Map<string, Record<string, unknown>> | undefined

function getCatalogBenefit(id: string): Record<string, unknown> {
  if (!catalogById) {
    catalogById = new Map(
      (benefits.all as unknown as Record<string, unknown>[]).map((benefit) => [
        benefit.id as string,
        benefit,
      ]),
    )
  }

  const benefit = catalogById.get(id)
  if (!benefit) {
    throw new Error(`Benefit "${id}" is missing from the catalog`)
  }

  return benefit
}

function containsFunction(value: unknown): boolean {
  if (typeof value === "function") {
    return true
  }

  if (Array.isArray(value)) {
    return value.some(containsFunction)
  }

  if (value && typeof value === "object") {
    return Object.values(value).some(containsFunction)
  }

  return false
}

/**
 * Un droit calculé est une aide du catalogue à laquelle le calcul a ajouté sa
 * part volatile (montant, légende, instructions, personnalisation locale). Seul
 * cet écart est persisté : les propriétés fonction (`labelFunction`,
 * `legend`, `compute`…) et les `undefined` ne survivent pas à un aller-retour
 * BSON, et le catalogue les restitue intacts à la relecture.
 */
function serializeDroit(droit: Record<string, unknown>): SerializedDroit {
  const id = droit.id as string
  const base = getCatalogBenefit(id)
  const overlay: Record<string, unknown> = {}
  const undefinedKeys: string[] = []

  for (const key of Object.keys(droit)) {
    const value = droit[key]

    if (value === undefined) {
      undefinedKeys.push(key)
      continue
    }

    if (isEqual(value, base[key])) {
      continue
    }

    if (containsFunction(value)) {
      throw new Error(
        `Benefit "${id}" holds a function in its computed field "${key}", which cannot be persisted`,
      )
    }

    overlay[key] = value
  }

  const serialized: SerializedDroit = { id }
  if (Object.keys(overlay).length) {
    serialized.overlay = overlay
  }
  if (undefinedKeys.length) {
    serialized.undefinedKeys = undefinedKeys
  }

  return serialized
}

function deserializeDroit(
  serialized: SerializedDroit,
): Record<string, unknown> {
  const droit = { ...getCatalogBenefit(serialized.id), ...serialized.overlay }

  for (const key of serialized.undefinedKeys ?? []) {
    droit[key] = undefined
  }

  return droit
}

export function serializeResults(results): SerializedResults {
  return {
    format: SERIALIZATION_FORMAT,
    ...Object.fromEntries(
      GROUPS.map((group) => [group, results[group].map(serializeDroit)]),
    ),
  } as SerializedResults
}

export function deserializeResults(
  serialized: SerializedResults,
  id: string,
): Record<string, unknown> {
  if (serialized?.format !== SERIALIZATION_FORMAT) {
    throw new Error(
      `Unsupported computed results format "${serialized?.format}", expected ${SERIALIZATION_FORMAT}`,
    )
  }

  const results = Object.fromEntries(
    GROUPS.map((group) => {
      if (!Array.isArray(serialized[group])) {
        throw new Error(`Computed results are missing the "${group}" group`)
      }

      return [group, serialized[group].map(deserializeDroit)]
    }),
  )

  return { ...results, _id: id }
}
