import { expect, vi } from "vitest"

const {
  getComputeSignature,
  computeAides,
  areParametersLoaded,
  getParametersAsync,
  captureException,
} = vi.hoisted(() => ({
  getComputeSignature: vi.fn(),
  computeAides: vi.fn(),
  areParametersLoaded: vi.fn(),
  getParametersAsync: vi.fn(),
  captureException: vi.fn(),
}))

// Seule la signature globale est simulée : l'empreinte de situation, qui
// complète la clé de cache, reste celle du code de production, tout comme la
// sérialisation des résultats.
vi.mock(
  "@backend/lib/openfisca/compute-signature.js",
  async (importOriginal) => ({
    ...((await importOriginal()) as object),
    getComputeSignature,
  }),
)
vi.mock("@backend/lib/openfisca/parameters.js", () => ({
  areParametersLoaded,
  getParametersAsync,
}))
vi.mock("@lib/benefits/compute.js", () => ({ computeAides }))
vi.mock("@sentry/node", () => ({ captureException }))

import mongoose from "mongoose"
import Simulations from "@backend/models/simulation.js"
import openfisca from "@backend/lib/openfisca/index.js"
import benefits from "@root/data/all.js"
import { getSituationSignature } from "@backend/lib/openfisca/compute-signature.js"
import { serializeResults } from "@backend/lib/computed-results.js"
import { SimulationStatus } from "@lib/enums/simulation.js"

const A_CONTEXT =
  "openfisca:openfisca-france@175.1.7|environment:abc|benefits:abc|simulation:17"
const ANOTHER_CONTEXT =
  "openfisca:openfisca-france@176.0.7|environment:abc|benefits:abc|simulation:17"

const situation = { dateDeValeur: new Date("2024-01-01") }
const A_SIGNATURE = `${A_CONTEXT}|${getSituationSignature(situation)}`
const ANOTHER_SIGNATURE = `${ANOTHER_CONTEXT}|${getSituationSignature(situation)}`
const openfiscaResponse = { individus: {} }

// Les droits sont ceux du catalogue : la persistance ne garde que leur part
// volatile et les reconstruit à la relecture.
const aBenefit = (benefits.all as any[]).find((benefit) => benefit.id === "rsa")
const anotherBenefit = (benefits.all as any[]).find(
  (benefit) => benefit.id === "aah",
)

const freshResults = {
  droitsEligibles: [{ ...aBenefit, montant: 100, legend: "/ mois" }],
  droitsInjectes: [],
}
const cachedResults = {
  droitsEligibles: [{ ...anotherBenefit, montant: 200, legend: "/ mois" }],
  droitsInjectes: [],
}

function buildSimulation(computedResults?) {
  const simulation = new Simulations({
    answers: { all: [], current: [] },
    dateDeValeur: new Date("2024-01-01"),
    computedResults,
  })
  simulation.getSituation = () => situation
  return simulation
}

function aCacheEntry(results, { signature = A_SIGNATURE, computedAt } = {}) {
  return {
    signature,
    computedAt: computedAt ?? new Date(),
    results: serializeResults(results),
  }
}

function hydrateSimulation() {
  const answer = {
    entityName: "individu",
    id: "demandeur",
    fieldName: "date_naissance",
    value: "2000-01-01T00:00:00.000Z",
  }

  return Simulations.hydrate({
    _id: new mongoose.Types.ObjectId(),
    answers: { all: [answer], current: [answer] },
    dateDeValeur: new Date("2024-01-01"),
    version: 17,
  })
}

describe("Simulation.compute", () => {
  let calculateSpy, updateOneSpy, consoleSpy

  beforeEach(() => {
    vi.clearAllMocks()
    computeAides.mockReturnValue(freshResults)
    getComputeSignature.mockReturnValue(A_CONTEXT)
    areParametersLoaded.mockReturnValue(true)
    getParametersAsync.mockResolvedValue({})
    calculateSpy = vi
      .spyOn(openfisca, "calculate")
      .mockImplementation((_situation, callback) =>
        callback(null, openfiscaResponse),
      )
    updateOneSpy = vi
      .spyOn(Simulations, "updateOne")
      .mockResolvedValue({} as any)
    consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe("without cached results", () => {
    it("calls OpenFisca and persists the computed results", async () => {
      const simulation = buildSimulation()

      const results = await simulation.compute()

      expect(results).toEqual(freshResults)
      expect(calculateSpy).toHaveBeenCalledTimes(1)
      expect(computeAides).toHaveBeenCalledWith(
        situation,
        String(simulation._id),
        openfiscaResponse,
        false,
      )
      expect(updateOneSpy).toHaveBeenCalledWith(
        { _id: simulation._id, status: { $ne: SimulationStatus.Anonymized } },
        {
          $set: {
            computedResults: {
              signature: A_SIGNATURE,
              computedAt: expect.any(Date),
              results: serializeResults(freshResults),
            },
          },
        },
      )
    })

    // Le document anonymisé a perdu les réponses dont ces montants dérivent :
    // la condition vit dans le filtre pour rester atomique.
    it("excludes anonymized documents from the cache write", async () => {
      const simulation = buildSimulation()

      await simulation.compute()

      expect(updateOneSpy.mock.calls[0][0]).toEqual({
        _id: simulation._id,
        status: { $ne: SimulationStatus.Anonymized },
      })
    })

    // Le résultat persisté ne garde que l'écart au catalogue : ni la
    // description, ni les conditions, ni les propriétés fonction.
    it("persists only the volatile part of each benefit", async () => {
      const simulation = buildSimulation()

      await simulation.compute()

      const stored = updateOneSpy.mock.calls[0][1].$set.computedResults.results
      expect(stored.droitsEligibles).toEqual([
        { id: "rsa", overlay: { montant: 100, legend: "/ mois" } },
      ])
      expect(JSON.stringify(stored).length).toBeLessThan(
        JSON.stringify(freshResults).length / 10,
      )
    })
  })

  describe("with cached results matching the current signature", () => {
    it("serves the cache without calling OpenFisca", async () => {
      const simulation = buildSimulation(aCacheEntry(cachedResults))

      const results = await simulation.compute()

      expect(results).toEqual({
        ...cachedResults,
        _id: String(simulation._id),
      })
      expect(calculateSpy).not.toHaveBeenCalled()
      expect(computeAides).not.toHaveBeenCalled()
      expect(updateOneSpy).not.toHaveBeenCalled()
    })

    // Le TTL borne la dérive que la signature ne voit pas : une correction de
    // la logique JavaScript ne change pas toujours la version applicative.
    it("computes again once the entry is older than the TTL", async () => {
      const simulation = buildSimulation(
        aCacheEntry(cachedResults, {
          computedAt: new Date(Date.now() - 25 * 60 * 60 * 1000),
        }),
      )

      const results = await simulation.compute()

      expect(results).toEqual(freshResults)
      expect(calculateSpy).toHaveBeenCalledTimes(1)
    })

    it("serves an entry that is still within the TTL", async () => {
      const simulation = buildSimulation(
        aCacheEntry(cachedResults, {
          computedAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
        }),
      )

      await simulation.compute()

      expect(calculateSpy).not.toHaveBeenCalled()
    })

    it("reports an unreadable entry and computes again", async () => {
      const simulation = buildSimulation({
        signature: A_SIGNATURE,
        computedAt: new Date(),
        results: { droitsEligibles: [], droitsInjectes: [] },
      })

      const results = await simulation.compute()

      expect(results).toEqual(freshResults)
      expect(calculateSpy).toHaveBeenCalledTimes(1)
      expect(captureException).toHaveBeenCalledWith(expect.any(Error))
    })
  })

  describe("with cached results from another signature", () => {
    it("computes again and refreshes the cache", async () => {
      const simulation = buildSimulation(
        aCacheEntry(cachedResults, { signature: ANOTHER_SIGNATURE }),
      )

      const results = await simulation.compute()

      expect(results).toEqual(freshResults)
      expect(calculateSpy).toHaveBeenCalledTimes(1)
      expect(updateOneSpy).toHaveBeenCalledWith(
        expect.objectContaining({ _id: simulation._id }),
        expect.objectContaining({
          $set: expect.objectContaining({
            computedResults: expect.objectContaining({
              signature: A_SIGNATURE,
              results: serializeResults(freshResults),
            }),
          }),
        }),
      )
    })
  })

  describe("when showPrivate is set", () => {
    it("bypasses the cache in both directions", async () => {
      const simulation = buildSimulation(aCacheEntry(cachedResults))

      const results = await simulation.compute({ showPrivate: true })

      expect(results).toEqual(freshResults)
      expect(getComputeSignature).not.toHaveBeenCalled()
      expect(calculateSpy).toHaveBeenCalledTimes(1)
      expect(computeAides).toHaveBeenCalledWith(
        situation,
        String(simulation._id),
        openfiscaResponse,
        true,
      )
      expect(updateOneSpy).not.toHaveBeenCalled()
    })
  })

  // Les téléservices calculent sur un document modifié en mémoire : leur
  // résultat ne décrit pas le document persisté et ne doit pas en évincer
  // l'entrée.
  describe("when the caller opts out of the cache", () => {
    it("bypasses the cache in both directions", async () => {
      const simulation = buildSimulation(aCacheEntry(cachedResults))

      const results = await simulation.compute({ cache: false })

      expect(results).toEqual(freshResults)
      expect(getComputeSignature).not.toHaveBeenCalled()
      expect(calculateSpy).toHaveBeenCalledTimes(1)
      expect(updateOneSpy).not.toHaveBeenCalled()
    })
  })

  describe("when the signature is unavailable", () => {
    it("neither reads nor writes the cache", async () => {
      getComputeSignature.mockReturnValue(null)
      const simulation = buildSimulation(aCacheEntry(cachedResults))

      const results = await simulation.compute()

      expect(results).toEqual(freshResults)
      expect(calculateSpy).toHaveBeenCalledTimes(1)
      expect(updateOneSpy).not.toHaveBeenCalled()
    })
  })

  // Sans paramètres, `getParameters` retombe sur des constantes figées et les
  // légendes produites sont fausses : les graver serait les rendre permanentes.
  describe("when the OpenFisca parameters are not loaded", () => {
    it("serves the results without caching them", async () => {
      areParametersLoaded.mockReturnValue(false)
      const simulation = buildSimulation()

      const results = await simulation.compute()

      expect(results).toEqual(freshResults)
      expect(updateOneSpy).not.toHaveBeenCalled()
    })

    it("reports the loading failure", async () => {
      const error = new Error("OF offline")
      getParametersAsync.mockRejectedValue(error)
      areParametersLoaded.mockReturnValue(false)
      const simulation = buildSimulation()

      await simulation.compute()

      expect(consoleSpy).toHaveBeenCalledWith(
        `Unable to load the OpenFisca parameters before computing simulation ${simulation._id}`,
        error,
      )
      expect(captureException).toHaveBeenCalledWith(error)
    })

    it("loads them before computing so the legends are not the fallback constants", async () => {
      const simulation = buildSimulation()

      await simulation.compute()

      expect(getParametersAsync).toHaveBeenCalledWith(situation.dateDeValeur)
      expect(getParametersAsync.mock.invocationCallOrder[0]).toBeLessThan(
        computeAides.mock.invocationCallOrder[0],
      )
    })
  })

  // Restauration d'onglet, iframes rechargées : les rafales portent sur le même
  // document.
  describe("with concurrent requests on the same document", () => {
    it("computes once and shares the result", async () => {
      const simulation = buildSimulation()

      const results = await Promise.all([
        simulation.compute(),
        simulation.compute(),
        simulation.compute(),
      ])

      expect(calculateSpy).toHaveBeenCalledTimes(1)
      expect(updateOneSpy).toHaveBeenCalledTimes(1)
      expect(results).toEqual([freshResults, freshResults, freshResults])
    })

    it("computes again for a later request", async () => {
      const simulation = buildSimulation()

      await simulation.compute()
      await simulation.compute()

      expect(calculateSpy).toHaveBeenCalledTimes(2)
    })
  })

  describe("when caching fails", () => {
    it("reports the error and still returns the computed results", async () => {
      const error = new Error("write error")
      updateOneSpy.mockRejectedValue(error)
      const simulation = buildSimulation()

      const results = await simulation.compute()

      expect(results).toEqual(freshResults)
      expect(consoleSpy).toHaveBeenCalledWith(
        `Unable to cache the computed results of simulation ${simulation._id}`,
        error,
      )
      expect(captureException).toHaveBeenCalledWith(error)
    })
  })

  describe("with a document modified in memory", () => {
    it("serves the cache written by an identical situation", async () => {
      const simulation = hydrateSimulation()

      await simulation.compute()
      simulation.computedResults =
        updateOneSpy.mock.calls[0][1].$set.computedResults
      calculateSpy.mockClear()

      const results = await simulation.compute()

      expect(results).toEqual({
        ...freshResults,
        _id: String(simulation._id),
      })
      expect(calculateSpy).not.toHaveBeenCalled()
    })

    it("computes again when the answers no longer match the cached situation", async () => {
      const simulation = hydrateSimulation()

      await simulation.compute()
      simulation.computedResults =
        updateOneSpy.mock.calls[0][1].$set.computedResults
      calculateSpy.mockClear()
      simulation.answers.current.push({
        entityName: "menage",
        fieldName: "loyer",
        value: { loyer: 500 },
      })

      await simulation.compute()

      expect(calculateSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe("when OpenFisca fails", () => {
    it("rejects and writes nothing", async () => {
      const error = new Error("OF error")
      calculateSpy.mockImplementation((_situation, callback) => callback(error))
      const simulation = buildSimulation()

      await expect(simulation.compute()).rejects.toThrow("OF error")
      expect(updateOneSpy).not.toHaveBeenCalled()
    })
  })
})
