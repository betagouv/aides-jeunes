import { expect, vi } from "vitest"
import { Request, Response } from "express"
import crypto from "node:crypto"
import {
  verifyAuthentication,
  validateRequestPayload,
  postOnMattermost,
} from "../../../backend/controllers/webhook.js"
import Mattermost from "../../../backend/lib/mattermost-bot/mattermost.js"
import config from "../../../backend/config/index.js"

type MockRequest = {
  body: any
  get?: (name: string) => string | undefined
}

type MockResponse = {
  status: (code: number) => MockResponse
  json: (data: any) => void
  statusCode?: number
}

describe("webhook", () => {
  let req: MockRequest, res: MockResponse, next: any

  beforeEach(() => {
    req = {
      body: "aBody",
    }
    res = {
      status: function (code) {
        this.statusCode = code
        return this
      },
      json: vi.fn(),
    }
    next = vi.fn()
  })

  it("calls next() when signature is valid", () => {
    const validSignature = crypto
      .createHmac("sha256", config.rdvAideNumerique.sharedSecret)
      .update(req.body)
      .digest("hex")
    req.get = (header) =>
      header === "X-Lapin-Signature" ? validSignature : undefined

    verifyAuthentication(
      req as unknown as Request,
      res as unknown as Response,
      next
    )

    expect(next).toHaveBeenCalled()
    expect(res.statusCode).toBeUndefined()
    expect(res.json).not.toHaveBeenCalled()
  })

  it("returns 401 when signature is missing", () => {
    req.get = () => undefined

    verifyAuthentication(
      req as unknown as Request,
      res as unknown as Response,
      next
    )

    expect(res.statusCode).toBe(401)
    expect(res.json).toHaveBeenCalledWith({ error: "Signature required" })
    expect(next).not.toHaveBeenCalled()
  })

  it("returns 401 when signature is invalid", () => {
    req.get = () => "anInvalidSignature"

    verifyAuthentication(
      req as unknown as Request,
      res as unknown as Response,
      next
    )

    expect(res.statusCode).toBe(401)
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid signature" })
    expect(next).not.toHaveBeenCalled()
  })
})

describe("validateRequestPayload", () => {
  let req: MockRequest, res: MockResponse, next: any, consoleSpy: any

  beforeEach(() => {
    req = {
      body: JSON.stringify({
        meta: {
          model: "Rdv",
          event: "created",
        },
        data: {
          users: [{ email: "test@example.com" }],
          id: "123",
          organisation: { id: "456" },
        },
      }),
    }
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    }
    next = vi.fn()
    consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it("calls next() when body is valid", () => {
    validateRequestPayload(
      req as unknown as Request,
      res as unknown as Response,
      next
    )

    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })

  it("returns 400 when body is not valid", () => {
    req.body = JSON.stringify({})

    validateRequestPayload(
      req as unknown as Request,
      res as unknown as Response,
      next
    )

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: "Event not supported",
    })
    expect(next).not.toHaveBeenCalled()
  })

  it("returns 400 when data is not valid", () => {
    req.body = JSON.stringify({
      meta: {
        model: "Rdv",
        event: "created",
      },
      data: {},
    })

    validateRequestPayload(
      req as unknown as Request,
      res as unknown as Response,
      next
    )

    expect(consoleSpy).toHaveBeenCalledWith("Invalid data in payload", {})
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid data in payload" })
    expect(next).not.toHaveBeenCalled()
  })
})

describe("postOnMattermost", () => {
  let req: MockRequest, res: MockResponse, mattermostSpy: any

  beforeEach(() => {
    req = {
      body: {
        data: {
          id: "rdv123",
          organisation: { id: "org456" },
        },
      },
    }
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    }
    mattermostSpy = vi
      .spyOn(Mattermost, "post")
      .mockImplementation(async () => Promise.resolve())
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it("posts message to Mattermost and responds with 200 OK", async () => {
    const expectedMessage =
      `Une personne vient de prendre RDV.\n` +
      `Plus d'informations /admin/organisations/org456/rdvs/rdv123`

    await postOnMattermost(
      req as unknown as Request,
      res as unknown as Response
    )

    expect(mattermostSpy).toHaveBeenCalledWith(expectedMessage)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ message: "OK" })
  })
})
