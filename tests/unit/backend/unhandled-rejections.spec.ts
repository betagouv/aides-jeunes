import { expect, vi } from "vitest"

vi.mock("axios", () => ({
  default: { get: vi.fn(), post: vi.fn(), defaults: {} },
}))

vi.mock("openid-client", () => ({
  discovery: vi.fn(),
  buildAuthorizationUrl: vi.fn(),
  buildEndSessionUrl: vi.fn(),
  authorizationCodeGrant: vi.fn(),
  fetchUserInfo: vi.fn(),
}))

// Le chargement du module lit le système de fichiers, ce que l'environnement
// de test ne permet pas ; seul `apply` est utilisé par le contrôleur.
vi.mock("@backend/lib/migrations/index.js", () => ({
  apply: (simulation) => simulation,
}))

import axios from "axios"
import { discovery } from "openid-client"
import config from "@backend/config/index.js"
import moncompteproController from "@backend/controllers/moncomptepro.js"
import teleservices from "@backend/controllers/teleservices/index.js"
import DemarchesSimplifiees, {
  TeleserviceMetadataError,
} from "@backend/lib/teleservices/demarches-simplifiees.js"
import {
  formatRejection,
  registerProcessErrorHandlers,
  summarize,
} from "@backend/lib/process-error-handlers.js"

// Un AxiosError de production : `request.res` et `response.request` se
// référencent l'un l'autre. C'est cette boucle qui fait échouer la
// sérialisation du rejet par l'IPC de pm2.
function circularAxios404() {
  const request: any = { path: "/preremplir/cd53-bafa/schema" }
  const response: any = { status: 404, data: "<html>404</html>", request }
  request.res = response
  return Object.assign(new Error("Request failed with status code 404"), {
    name: "AxiosError",
    isAxiosError: true,
    code: "ERR_BAD_REQUEST",
    request,
    response,
  })
}

function metadataRequest() {
  return {
    simulation: { _id: "6a7680b4dce0e73de131d0e1", token: "jeton-simulation" },
    query: { procedure: "cd53-bafa" },
    protocol: "https",
    get: () => "mes-aides.exemple",
  }
}

describe("metadataResponseGenerator", () => {
  beforeEach(() => vi.clearAllMocks())

  it("passe le rejet de toInternal() à next() au lieu de laisser la requête pendante", async () => {
    const failure = new Error("téléservice injoignable")
    function FailingTeleservice() {}
    FailingTeleservice.prototype.toInternal = () => Promise.reject(failure)

    const handler = teleservices.metadataResponseGenerator({
      name: "ds",
      class: FailingTeleservice,
      destination: { label: "Aller sur le téléservice", url: "/api/proxy/ds" },
    })

    const next = vi.fn()
    const res: any = { json: vi.fn() }

    // Express 4 n'attend pas la promesse renvoyée par un gestionnaire ; on la
    // neutralise ici pour observer le gestionnaire, pas le harnais de test.
    await Promise.resolve(handler(metadataRequest() as any, res, next)).catch(
      () => undefined,
    )

    expect(res.json).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(failure)
  })

  it("répond quand le téléservice est joignable", async () => {
    function WorkingTeleservice() {}
    WorkingTeleservice.prototype.toInternal = async () => [
      { label: "Date de naissance", value: "2001-02-03" },
    ]

    const handler = teleservices.metadataResponseGenerator({
      name: "ds",
      class: WorkingTeleservice,
      destination: { label: "Aller sur le téléservice", url: "/api/proxy/ds" },
    })

    const next = vi.fn()
    const res: any = { json: vi.fn() }

    await handler(metadataRequest() as any, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.json.mock.calls[0][0].fields).toEqual([
      { label: "Date de naissance", value: "2001-02-03" },
    ])
  })
})

describe("getMetaData", () => {
  beforeEach(() => vi.clearAllMocks())

  it("convertit un 404 du téléservice en erreur nommée et diffusable", async () => {
    vi.mocked(axios.get).mockRejectedValue(circularAxios404())

    const teleservice = new (DemarchesSimplifiees as any)(
      { answers: { current: [] }, enfants: [] },
      { procedure: "cd53-bafa" },
    )
    const error: any = await teleservice.toInternal().then(
      () => null,
      (rejection) => rejection,
    )

    expect(error).toBeInstanceOf(TeleserviceMetadataError)
    expect(error.name).toBe("TeleserviceMetadataError")
    expect(error.procedure).toBe("cd53-bafa")
    expect(error.upstreamStatus).toBe(404)
    // Statut renvoyé au client par le middleware d'erreur : la démarche visée
    // n'existe plus côté tiers, la page de consentement est inconstructible.
    expect(error.code).toBe(502)
    expect(error.message).toContain("cd53-bafa")
    expect(error.message).toContain("404")

    // pm2 recopie l'erreur avant de la diffuser au processus maître. Une copie
    // superficielle perd le `toJSON` d'axios et expose la boucle req/res : la
    // sérialisation lève, et l'erreur d'origine disparaît sans laisser de trace.
    expect(() => JSON.stringify({ ...error })).not.toThrow()
    expect(JSON.parse(JSON.stringify({ ...error }))).toMatchObject({
      name: "TeleserviceMetadataError",
      procedure: "cd53-bafa",
      upstreamStatus: 404,
      code: 502,
    })
  })

  it("laisse passer les métadonnées quand le téléservice répond", async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: {
        revision: {
          champDescriptors: [{ id: "Q2hhbXAtMzc2NDE0", label: "Naissance" }],
        },
      },
    })

    const teleservice = new (DemarchesSimplifiees as any)(
      {
        answers: {
          current: [
            {
              id: "demandeur",
              entityName: "individu",
              fieldName: "date_naissance",
              value: "2001-02-03",
            },
          ],
        },
        enfants: [],
      },
      { procedure: "cd53-bafa" },
    )

    await expect(teleservice.toInternal()).resolves.toEqual([
      { label: "Naissance", value: "2001-02-03" },
    ])
  })
})

// `access` protège cinq groupes de routes : /api/followups/surveys,
// /api/followups/id/:surveyId, /api/followups/email/:email, /auth/redirect et
// /support. Un fournisseur d'identité injoignable y laissait la requête pendre.
describe("moncomptepro.access", () => {
  beforeEach(() => vi.clearAllMocks())

  it("redirige au lieu de rejeter quand le fournisseur d'identité est injoignable", async () => {
    const failure = new Error("only requests to HTTPS are allowed")
    vi.mocked(discovery).mockRejectedValue(failure)

    const res: any = { redirect: vi.fn(), clearCookie: vi.fn() }
    const next = vi.fn()

    const settled = await moncompteproController
      .access({ cookies: {}, query: {} } as any, res, next)
      .then(
        () => "resolue",
        () => "rejetee",
      )

    expect(settled).toBe("resolue")
    expect(res.redirect).toHaveBeenCalledWith(config.accompagnement.errorPath)
    expect(next).not.toHaveBeenCalled()
  })
})

describe("registerProcessErrorHandlers", () => {
  it("journalise un rejet non rattrapé sous une forme sérialisable", () => {
    const listeners: Record<string, ((reason: unknown) => void)[]> = {}
    const processLike: any = {
      on: (event: string, listener: (reason: unknown) => void) => {
        listeners[event] = listeners[event] || []
        listeners[event].push(listener)
      },
    }
    const logger = vi.fn()

    registerProcessErrorHandlers(processLike, logger)
    expect(listeners.unhandledRejection).toHaveLength(1)

    listeners.unhandledRejection[0](circularAxios404())

    const [label, payload] = logger.mock.calls[0]
    expect(label).toBe("unhandledRejection")
    expect(JSON.parse(payload as string)).toEqual({
      name: "AxiosError",
      message: "Request failed with status code 404",
      code: "ERR_BAD_REQUEST",
      upstreamStatus: 404,
    })
  })

  it("résume un rejet qui n'est pas une erreur", () => {
    expect(summarize("boom")).toEqual({ name: "string", message: "boom" })
  })

  // Un garde-fou qui lève détruit ce qu'il existe pour préserver : le rejet
  // deviendrait une exception non rattrapée, et rien ne serait journalisé.
  describe("charges hostiles", () => {
    function messageQuiLeve() {
      const error = new Error("remplacé")
      Object.defineProperty(error, "message", {
        get() {
          throw new Error("getter explose")
        },
      })
      return error
    }

    it.each([
      ["un code BigInt", () => Object.assign(new Error("b"), { code: 1n })],
      ["un message qui lève à la lecture", messageQuiLeve],
      ["un objet sans prototype", () => Object.create(null)],
      ["un symbole", () => Symbol("boom")],
      ["undefined", () => undefined],
    ])("journalise malgré %s", (_libelle, build) => {
      const listeners: ((reason: unknown) => void)[] = []
      const processLike: any = {
        on: (_event: string, listener: (reason: unknown) => void) =>
          listeners.push(listener),
      }
      const logger = vi.fn()
      registerProcessErrorHandlers(processLike, logger)

      expect(() => listeners[0](build())).not.toThrow()
      expect(logger).toHaveBeenCalledTimes(1)
      expect(logger.mock.calls[0][0]).toBe("unhandledRejection")
      expect(typeof logger.mock.calls[0][1]).toBe("string")
      expect(logger.mock.calls[0][1]).not.toBe("")
    })

    it("conserve la valeur du code BigInt dans le résumé", () => {
      expect(
        formatRejection(Object.assign(new Error("b"), { code: 1n })),
      ).toContain('"code":"1"')
    })
  })
})
