import { expect, vi } from "vitest"

const { openfiscaParameters } = vi.hoisted(() => ({
  openfiscaParameters: {
    "prestations_sociales.education.carte_des_metiers.age_maximal": 26,
    "prestations_sociales.prestations_etat_de_sante.invalidite.aah.taux_capacite.taux_incapacite": 0.8,
    "taxation_capital.epargne.livret_a.taux": 0.017,
    "marche_travail.salaire_minimum.smic.smic_b_horaire": 11.88,
    "marche_travail.salaire_minimum.smic.nb_heures_travail_mensuel": 151.67,
  },
}))

// Les paramètres sont ceux d'un OpenFisca joignable : c'est le seul état dans
// lequel un résultat a le droit d'être mis en cache.
vi.mock("@backend/lib/openfisca/parameters.js", () => ({
  getParameters: () => openfiscaParameters,
}))

import { BSON } from "mongodb"
import { computeAides } from "@lib/benefits/compute.js"
import benefits from "@root/data/all.js"
import { datesGenerator } from "@lib/dates.js"
import {
  serializeResults,
  deserializeResults,
} from "@backend/lib/computed-results.js"
import {
  basicBenefitText,
  formatBenefits,
} from "@backend/lib/mes-aides/emails/simulation-results.js"

const compute = computeAides.bind(benefits as any)
const A_SIMULATION_ID = "6555555555555555555555ff"

function aSituation(): any {
  return {
    dateDeValeur: "2025-04-01",
    demandeur: {
      // Deux droits déclarés par l'usager alimentent `droitsInjectes`.
      aah: { "2025-04": 100 },
      aide_logement: { "2025-04": 250 },
      activite: "salarie",
      date_naissance: "2003-04-01",
      _interetsAidesVelo: [],
    },
    famille: {},
    menage: {
      depcom: "75056",
      _departement: "75",
      _region: "11",
      statut_occupation_logement: "locataire_vide",
      loyer: 700,
    },
  }
}

// Chaque aide du catalogue reçoit une valeur pour la période qu'elle interroge :
// le résultat couvre alors l'ensemble du référentiel, pas un échantillon.
function anOpenfiscaResponse(situation): any {
  const periods = datesGenerator(situation.dateDeValeur)
  const demandeur: any = {}
  const familles: any = {}

  for (const benefit of benefits.all as any[]) {
    const period = benefit.openfiscaPeriod
      ? periods[benefit.openfiscaPeriod].id
      : periods.thisMonth.id
    const source = benefit.openfisca_eligibility_source || benefit.id

    demandeur[source] = { ...demandeur[source], [period]: 123.45 }
    familles[source] = { ...familles[source], [period]: 123.45 }
  }

  return {
    familles: { _: familles },
    menages: {
      _: {
        personne_de_reference: ["demandeur"],
        depcom: { [periods.thisMonth.id]: "75056" },
      },
    },
    individus: { demandeur },
    foyers_fiscaux: {
      _: {
        rfr: { [periods.fiscalYear.id]: 12000 },
        nbptr: { [periods.fiscalYear.id]: 1 },
      },
    },
  }
}

function computeFreshResults() {
  const situation = aSituation()
  return compute(situation, A_SIMULATION_ID, anOpenfiscaResponse(situation))
}

// Aller-retour BSON réel : c'est le format dans lequel Mongo range le document.
function throughMongo<T>(value: T): T {
  return BSON.deserialize(BSON.serialize({ value })).value
}

function roundTrip(results) {
  return deserializeResults(
    throughMongo(serializeResults(results)),
    A_SIMULATION_ID,
  )
}

describe("computed results serialization", () => {
  let fresh, restored

  beforeEach(() => {
    fresh = computeFreshResults()
    restored = roundTrip(fresh)
  })

  it("covers the whole catalog", () => {
    expect(fresh.droitsEligibles.length).toBeGreaterThan(20)
    expect(fresh.droitsInjectes.length).toBeGreaterThan(0)
  })

  it("restores a result strictly identical to the computed one", () => {
    expect(restored).toStrictEqual(fresh)
  })

  // Les propriétés fonction ne survivent pas au BSON : elles reviennent du
  // catalogue, à l'identique.
  it("restores the function properties", () => {
    const droits = [...fresh.droitsEligibles, ...fresh.droitsInjectes]
    const functionProperties = droits.flatMap((droit) =>
      Object.keys(droit).filter((key) => typeof droit[key] === "function"),
    )
    expect(functionProperties.length).toBeGreaterThan(0)

    for (const [index, droit] of droits.entries()) {
      const target = [...restored.droitsEligibles, ...restored.droitsInjectes][
        index
      ]
      for (const key of Object.keys(droit)) {
        if (typeof droit[key] === "function") {
          expect(target[key]).toBe(droit[key])
        }
      }
    }
  })

  // `undefined` devient `null` en BSON : la distinction est rétablie plutôt que
  // laissée diverger.
  it("keeps undefined properties undefined", () => {
    const undefinedProperties = fresh.droitsEligibles.flatMap((droit) =>
      Object.keys(droit).filter((key) => droit[key] === undefined),
    )
    expect(undefinedProperties.length).toBeGreaterThan(0)

    for (const [index, droit] of fresh.droitsEligibles.entries()) {
      for (const key of Object.keys(droit)) {
        if (droit[key] === undefined) {
          expect(restored.droitsEligibles[index][key]).toBeUndefined()
          expect(key in restored.droitsEligibles[index]).toBe(true)
        }
      }
    }
  })

  it("stores a fraction of the computed payload", () => {
    const stored = BSON.serialize({ value: serializeResults(fresh) }).length
    const full = BSON.serialize({
      value: JSON.parse(JSON.stringify(fresh)),
    }).length

    expect(stored).toBeLessThan(full / 5)
  })

  it("refuses a payload serialized under another format", () => {
    const serialized = serializeResults(fresh)

    expect(() =>
      deserializeResults({ ...serialized, format: 99 } as any, A_SIMULATION_ID),
    ).toThrow(/Unsupported computed results format/)
  })

  it("refuses a benefit that has left the catalog", () => {
    const serialized = serializeResults(fresh)
    serialized.droitsEligibles[0].id = "aide_disparue"

    expect(() => deserializeResults(serialized, A_SIMULATION_ID)).toThrow(
      /is missing from the catalog/,
    )
  })

  // Les aides vélo sont produites à partir du moteur `@betagouv/aides-velo` :
  // leur écart au catalogue porte des clés qui lui sont étrangères.
  it("restores an aides-velo benefit", () => {
    const veloBenefit = (benefits.all as any[]).find(
      (benefit) => benefit.source === "aides-velo",
    )
    const droit = {
      ...veloBenefit,
      title: "Prime vélo",
      amount: 300,
      montant: 300,
      link: "https://example.org/prime",
      id: veloBenefit.id,
    }

    const restoredVelo = roundTrip({
      droitsEligibles: [droit],
      droitsInjectes: [],
    })

    expect(restoredVelo.droitsEligibles[0]).toStrictEqual(droit)
  })
})

describe("email rendered from cached results", () => {
  let fresh, restored

  beforeEach(() => {
    fresh = computeFreshResults()
    restored = roundTrip(fresh)
  })

  it("serves the same benefit texts", () => {
    const freshTexts = fresh.droitsEligibles.map((droit) =>
      basicBenefitText(droit, openfiscaParameters),
    )
    const restoredTexts = restored.droitsEligibles.map((droit) =>
      basicBenefitText(droit, openfiscaParameters),
    )

    expect(restoredTexts).toEqual(freshTexts)
  })

  it("serves the same formatted benefits", () => {
    expect(
      formatBenefits(restored.droitsEligibles, openfiscaParameters),
    ).toStrictEqual(formatBenefits(fresh.droitsEligibles, openfiscaParameters))
  })

  // Le texte du LEP vient de `labelFunction` et sa légende d'un paramètre
  // OpenFisca : c'est la phrase que le finding voit se dégrader.
  it("keeps the label produced by labelFunction", () => {
    const findLep = (results) =>
      results.droitsEligibles.find(
        (droit) => droit.id === "livret_epargne_populaire_taux",
      )
    const lep = findLep(fresh)
    expect(lep).toBeDefined()

    const text = basicBenefitText(lep, openfiscaParameters)
    expect(text).toMatch(/taux de .+ ?% \/ an au lieu de 1\.7 %/)
    expect(basicBenefitText(findLep(restored), openfiscaParameters)).toEqual(
      text,
    )
  })

  // Persister le résultat tel quel perd `labelFunction` : la phrase retombe sur
  // le gabarit générique et le montant change de sens.
  it("degrades when the whole result is persisted as is", () => {
    const lep = fresh.droitsEligibles.find(
      (droit) => droit.id === "livret_epargne_populaire_taux",
    )
    const naivelyStored = throughMongo(lep)

    expect(naivelyStored.labelFunction).toBeUndefined()
    expect(basicBenefitText(naivelyStored, openfiscaParameters)).not.toEqual(
      basicBenefitText(lep, openfiscaParameters),
    )
  })
})
