import { expect, beforeEach } from "vitest"
import { setActivePinia, createPinia } from "pinia"
import Individu from "@lib/properties/individu-properties.js"
import { parametersList } from "@lib/openfisca-parameters.js"
import { useStore } from "@/stores/index.js"

const PARAMETRE_TAUX_MAX =
  "prestations_sociales.prestations_etat_de_sante.invalidite.aah.taux_capacite.taux_incapacite"

const propertyData = (openFiscaParameters) =>
  ({
    openFiscaParameters,
    individu: { _role: "enfant", _firstName: "votre 1ᵉʳ enfant" },
  }) as any

describe("question du taux d'incapacité", () => {
  beforeEach(() => setActivePinia(createPinia()))

  // Le magasin est l'unique source de ces paramètres pour la question. Tant
  // qu'il pouvait rester vide, deux des trois options valaient NaN, que JSON
  // écrit `null` : la valeur choisie était perdue au moment même où elle était
  // enregistrée. C'est le générateur de la panne, et il doit être fermé à la
  // source, avant même que la moindre requête ait abouti.
  it("ne peut pas proposer d'option NaN, aucune requête n'ayant abouti", () => {
    const items = Individu.taux_incapacite.getItems(
      propertyData(useStore().openFiscaParameters),
    )

    expect(items.every((item) => Number.isFinite(item.value))).toBe(true)
    expect(items.every((item) => !item.label.includes("NaN"))).toBe(true)
  })

  it("propose trois paliers exploitables", () => {
    const items = Individu.taux_incapacite.getItems(
      propertyData({ [PARAMETRE_TAUX_MAX]: 0.8 }),
    )

    // Valeurs écrites en dur : elles ne sont pas recalculées avec le code testé.
    expect(items.map((item) => item.value)).toEqual([0.3, 0.65, 0.9])
    expect(items.map((item) => item.label)).toEqual([
      "Moins de 50%",
      "De 50% à 79%",
      "80% et plus",
    ])
  })

  // Les paramètres servis quand OpenFisca est injoignable doivent produire une
  // question utilisable : une option valant NaN s'enregistre `null` et rend le
  // taux choisi irrécupérable.
  it("reste utilisable avec les paramètres de repli du serveur", () => {
    const items = Individu.taux_incapacite.getItems(
      propertyData(parametersList),
    )

    expect(items.every((item) => Number.isFinite(item.value))).toBe(true)
    expect(items.every((item) => !item.label.includes("NaN"))).toBe(true)
  })

  // Le récapitulatif relit les options pour afficher la réponse : il ne doit
  // dépendre d'aucun paramètre chargé.
  it("affiche la réponse au récapitulatif sans paramètres chargés", () => {
    const step = {
      entity: "individu",
      variable: "taux_incapacite",
      id: "enfant_0",
    }
    const simulation = {
      answers: {
        all: [
          {
            entityName: "individu",
            id: "enfant_0",
            fieldName: "taux_incapacite",
            value: 0.9,
          },
        ],
      },
    }

    expect(() =>
      Individu.taux_incapacite.getRecap(
        { ...propertyData({}), simulation } as any,
        step as any,
      ),
    ).not.toThrow()
  })
})
