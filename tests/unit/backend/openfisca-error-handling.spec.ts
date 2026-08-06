import { expect, vi } from "vitest"

vi.mock("axios", () => ({
  default: { post: vi.fn(), defaults: {} },
}))

// Le chargement du module lit le système de fichiers, ce que l'environnement
// de test ne permet pas ; seul `apply` est utilisé par le contrôleur.
vi.mock("@backend/lib/migrations/index.js", () => ({
  apply: (simulation) => simulation,
}))

import axios from "axios"
import { sendToOpenfisca } from "@backend/lib/openfisca/index.js"
import simulationController from "@backend/controllers/simulation.js"
import teleservices from "@backend/controllers/teleservices/index.js"

const PERSONAL_VALUE = "<img src=x onerror=alert(1)>"

// Un AxiosError d'abandon : pas de `response`, mais `config` porte la requête
// envoyée — donc la situation personnelle — et `stack` les chemins du serveur.
function abortError() {
  return Object.assign(new Error("timeout of 25000ms exceeded"), {
    name: "AxiosError",
    code: "ECONNABORTED",
    config: { data: JSON.stringify({ depcom: PERSONAL_VALUE }) },
    stack: "AxiosError\n    at /srv/app/node_modules/axios/lib/core.js:1:1",
  })
}

function callbackOf(fn): Promise<{ err: any; result: any }> {
  return new Promise((resolve) => fn((err, result) => resolve({ err, result })))
}

describe("remontée des erreurs OpenFisca", () => {
  beforeEach(() => vi.clearAllMocks())

  describe("véracité de l'erreur transmise", () => {
    // Une réponse d'erreur HTTP à corps vide donne `response.data === ""`.
    // Transmise telle quelle, elle est falsy : les appelants testent `if (err)`
    // et poursuivent comme si le calcul avait abouti.
    it.each([
      ["chaîne vide", ""],
      ["zéro", 0],
      ["objet nul", null],
    ])("reste vraie quand OpenFisca répond %s", async (_libelle, data) => {
      vi.mocked(axios.post).mockRejectedValue(
        Object.assign(new Error("Request failed with status code 502"), {
          name: "AxiosError",
          code: "ERR_BAD_RESPONSE",
          response: { status: 502, data },
        }),
      )

      const { err, result } = await callbackOf((cb) =>
        sendToOpenfisca("calculate", () => ({}))({}, cb),
      )

      expect(err).toBeTruthy()
      expect(result).toBeUndefined()
    })

    it("traite une réponse 200 vide comme une erreur", async () => {
      vi.mocked(axios.post).mockResolvedValue({ status: 200, data: "" })

      const { err, result } = await callbackOf((cb) =>
        sendToOpenfisca("calculate", () => ({}))({}, cb),
      )

      expect(err).toBeTruthy()
      expect(result).toBeUndefined()
    })

    it("n'expose pas l'adresse interne du service sur une erreur réseau", async () => {
      vi.mocked(axios.post).mockRejectedValue(
        Object.assign(new Error("connect ECONNREFUSED 10.0.0.12:2000"), {
          name: "Error",
          code: "ECONNREFUSED",
        }),
      )

      const { err } = await callbackOf((cb) =>
        sendToOpenfisca("calculate", () => ({}))({}, cb),
      )

      expect(JSON.stringify(err)).not.toContain("10.0.0.12")
      expect(err.code).toBe("ECONNREFUSED")
    })

    it("conserve le message d'abandon, que le front utilise", async () => {
      vi.mocked(axios.post).mockRejectedValue(abortError())

      const { err } = await callbackOf((cb) =>
        sendToOpenfisca("calculate", () => ({}))({}, cb),
      )

      expect(err.message).toMatch(/time.?out/i)
    })

    it("ne renvoie pas la pile quand la construction de la requête échoue", async () => {
      const { err } = await callbackOf((cb) =>
        sendToOpenfisca("calculate", () => {
          throw Object.assign(new TypeError("boom"), {
            stack: "TypeError\n    at /srv/app/backend/lib/openfisca/x.ts:1:1",
          })
        })({}, cb),
      )

      expect(err).toBeTruthy()
      expect(err).not.toHaveProperty("stack")
      expect(JSON.stringify(err)).not.toContain("/srv/app")
    })
  })

  describe("sendToOpenfisca", () => {
    it("ne divulgue ni la situation personnelle ni les chemins du serveur", async () => {
      vi.mocked(axios.post).mockRejectedValue(abortError())

      const { err } = await callbackOf((cb) =>
        sendToOpenfisca("calculate", () => ({}))({}, cb),
      )

      const serialized = JSON.stringify(err)
      expect(serialized).not.toContain(PERSONAL_VALUE)
      expect(serialized).not.toContain("node_modules")
      expect(err).not.toHaveProperty("config")
      expect(err).not.toHaveProperty("stack")
      expect(err).toMatchObject({ name: "AxiosError", code: "ECONNABORTED" })
    })

    it("conserve le corps d'erreur renvoyé par OpenFisca quand il existe", async () => {
      vi.mocked(axios.post).mockRejectedValue(
        Object.assign(new Error("Bad Request"), {
          response: { data: { error: "unknown variable" } },
        }),
      )

      const { err } = await callbackOf((cb) =>
        sendToOpenfisca("calculate", () => ({}))({}, cb),
      )

      expect(err).toEqual({ error: "unknown variable" })
    })
  })

  describe("openfiscaTrace", () => {
    it("passe l'erreur à next() quand elle n'a pas de réponse HTTP", async () => {
      vi.mocked(axios.post).mockRejectedValue(abortError())

      const next = vi.fn()
      const res: any = { send: vi.fn() }
      await new Promise((resolve) => {
        simulationController.openfiscaTrace(
          { situation: {}, simulationId: "abc" } as any,
          res,
          (...args) => {
            next(...args)
            resolve(null)
          },
        )
      })

      expect(res.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)
      expect(next.mock.calls[0][0]).toMatchObject({ _id: "abc" })
    })
  })

  describe("exportRepresentation", () => {
    it("passe le rejet à next() au lieu de laisser la requête pendante", async () => {
      const failure = new Error("timeout of 25000ms exceeded")
      const next = vi.fn()
      const res: any = { json: vi.fn() }

      function FailingTeleservice() {}
      FailingTeleservice.prototype.toExternal = () => Promise.reject(failure)

      await teleservices.exportRepresentation(
        {
          teleservice: { class: FailingTeleservice },
          simulation: {},
          payload: { query: {} },
        } as any,
        res,
        next,
      )

      expect(res.json).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(failure)
    })
  })
})
