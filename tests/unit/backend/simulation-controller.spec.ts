import { expect, vi } from "vitest"

// Le chargement des migrations parcourt le système de fichiers à l'import :
// hors de propos pour la création d'une simulation.
vi.mock("@backend/lib/migrations/index.js", () => ({
  apply: (model) => model,
}))

import simulationController from "@backend/controllers/simulation.js"
import Simulations from "@backend/models/simulation.js"

describe("simulation controller create", () => {
  let req, res, next, createSpy

  beforeEach(() => {
    vi.clearAllMocks()
    req = {
      body: {
        answers: { all: [], current: [] },
        dateDeValeur: new Date("2024-01-01"),
      },
      cookies: {},
    }
    res = { cookie: vi.fn(), clearCookie: vi.fn(), status: vi.fn() }
    next = vi.fn()
    createSpy = vi.spyOn(Simulations, "create").mockResolvedValue({} as any)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("does not persist client-provided computed results", async () => {
    req.body.computedResults = {
      signature: "forged",
      computedAt: new Date(),
      results: { droitsEligibles: [{ id: "rsa", montant: 999999 }] },
    }

    await simulationController.create(req, res, next)

    expect(createSpy).toHaveBeenCalledTimes(1)
    expect(createSpy.mock.calls[0][0]).not.toHaveProperty("computedResults")
    expect(next).toHaveBeenCalledWith()
  })

  it("keeps the simulation payload", async () => {
    await simulationController.create(req, res, next)

    expect(createSpy.mock.calls[0][0]).toEqual(req.body)
  })
})
