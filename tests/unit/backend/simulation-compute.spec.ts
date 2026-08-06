import { expect, vi } from "vitest"

const { getComputeSignature, computeAides, captureException } = vi.hoisted(
  () => ({
    getComputeSignature: vi.fn(),
    computeAides: vi.fn(),
    captureException: vi.fn(),
  }),
)

// Seule la signature globale est simulée : l'empreinte de situation, qui
// complète la clé de cache, reste celle du code de production.
vi.mock(
  "@backend/lib/openfisca/compute-signature.js",
  async (importOriginal) => ({
    ...((await importOriginal()) as object),
    getComputeSignature,
  }),
)
vi.mock("@lib/benefits/compute.js", () => ({ computeAides }))
vi.mock("@sentry/node", () => ({ captureException }))

import mongoose from "mongoose"
import Simulations from "@backend/models/simulation.js"
import openfisca from "@backend/lib/openfisca/index.js"
import { getSituationSignature } from "@backend/lib/openfisca/compute-signature.js"

const A_CONTEXT =
  "openfisca:openfisca-france@175.1.7|benefits:abc|simulation:17"
const ANOTHER_CONTEXT =
  "openfisca:openfisca-france@176.0.7|benefits:abc|simulation:17"

const situation = { dateDeValeur: new Date("2024-01-01") }
const A_SIGNATURE = `${A_CONTEXT}|${getSituationSignature(situation)}`
const ANOTHER_SIGNATURE = `${ANOTHER_CONTEXT}|${getSituationSignature(situation)}`
const openfiscaResponse = { individus: {} }
const freshResults = { droitsEligibles: [{ id: "fresh", montant: 100 }] }
const cachedResults = { droitsEligibles: [{ id: "cached", montant: 200 }] }

function buildSimulation(computedResults?) {
  const simulation = new Simulations({
    answers: { all: [], current: [] },
    dateDeValeur: new Date("2024-01-01"),
    computedResults,
  })
  simulation.getSituation = () => situation
  return simulation
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
    getComputeSignature.mockResolvedValue(A_CONTEXT)
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
        undefined,
      )
      expect(updateOneSpy).toHaveBeenCalledWith(
        { _id: simulation._id },
        {
          $set: {
            computedResults: {
              signature: A_SIGNATURE,
              computedAt: expect.any(Date),
              results: freshResults,
            },
          },
        },
      )
    })
  })

  describe("with cached results matching the current signature", () => {
    it("serves the cache without calling OpenFisca", async () => {
      const simulation = buildSimulation({
        signature: A_SIGNATURE,
        computedAt: new Date("2024-01-02"),
        results: cachedResults,
      })

      const results = await simulation.compute()

      expect(results).toEqual(cachedResults)
      expect(calculateSpy).not.toHaveBeenCalled()
      expect(computeAides).not.toHaveBeenCalled()
      expect(updateOneSpy).not.toHaveBeenCalled()
    })
  })

  describe("with cached results from another signature", () => {
    it("computes again and refreshes the cache", async () => {
      const simulation = buildSimulation({
        signature: ANOTHER_SIGNATURE,
        computedAt: new Date("2024-01-02"),
        results: cachedResults,
      })

      const results = await simulation.compute()

      expect(results).toEqual(freshResults)
      expect(calculateSpy).toHaveBeenCalledTimes(1)
      expect(updateOneSpy).toHaveBeenCalledWith(
        { _id: simulation._id },
        expect.objectContaining({
          $set: expect.objectContaining({
            computedResults: expect.objectContaining({
              signature: A_SIGNATURE,
              results: freshResults,
            }),
          }),
        }),
      )
    })
  })

  describe("when showPrivate is set", () => {
    it("bypasses the cache in both directions", async () => {
      const simulation = buildSimulation({
        signature: A_SIGNATURE,
        computedAt: new Date("2024-01-02"),
        results: cachedResults,
      })

      const results = await simulation.compute(true)

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

  describe("when the signature is unavailable", () => {
    it("neither reads nor writes the cache", async () => {
      getComputeSignature.mockResolvedValue(null)
      const simulation = buildSimulation({
        signature: A_SIGNATURE,
        computedAt: new Date("2024-01-02"),
        results: cachedResults,
      })

      const results = await simulation.compute()

      expect(results).toEqual(freshResults)
      expect(calculateSpy).toHaveBeenCalledTimes(1)
      expect(updateOneSpy).not.toHaveBeenCalled()
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

      expect(results).toEqual(freshResults)
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
