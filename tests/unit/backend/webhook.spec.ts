import { expect, jest } from "@jest/globals"
import crypto from "crypto"

import {
  verifyAuthentication,
  validateRequestPayload,
  postOnMattermost,
} from "../../../backend/controllers/webhook.js"
import config from "../../../backend/config/index.js"
import Mattermost from "../../../backend/lib/mattermost-bot/mattermost.js"

describe("verifyAuthentication", () => {
  let req, res, next

  beforeEach(() => {
    req = {
      body: "aBody",
    }
    res = {
      status: function (code) {
        this.statusCode = code
        return this
      },
      json: jest.fn(),
    }
    next = jest.fn()
  })

  it("calls next() when signature is valid", () => {
    const validSignature = crypto
      .createHmac("sha256", config.rdvAideNumerique.sharedSecret)
      .update(req.body)
      .digest("hex")
    req.get = (header) =>
      header === "X-Lapin-Signature" ? validSignature : null

    verifyAuthentication(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.statusCode).toBeUndefined()
    expect(res.json).not.toHaveBeenCalled()
  })

  it("returns 401 when signature is missing", () => {
    req.get = () => undefined

    verifyAuthentication(req, res, next)

    expect(res.statusCode).toBe(401)
    expect(res.json).toHaveBeenCalledWith({ error: "Signature required" })
    expect(next).not.toHaveBeenCalled()
  })

  it("returns 401 when signature is invalid", () => {
    req.get = () => "anInvalidSignature"

    verifyAuthentication(req, res, next)

    expect(res.statusCode).toBe(401)
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid signature" })
    expect(next).not.toHaveBeenCalled()
  })
})

describe("validateRequestPayload", () => {
  let req, res, next, consoleSpy

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
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    next = jest.fn()
    consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("calls next() when body is valid", () => {
    validateRequestPayload(req, res, next)

    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })

  it("returns 400 when body is not valid", () => {
    req.body = JSON.stringify({})

    validateRequestPayload(req, res, next)

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

    validateRequestPayload(req, res, next)

    expect(consoleSpy).toHaveBeenCalledWith("Invalid data in payload", {})
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid data in payload" })
    expect(next).not.toHaveBeenCalled()
  })
})

describe("postOnMattermost", () => {
  let req, res, mattermostSpy

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
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    mattermostSpy = jest
      .spyOn(Mattermost, "post")
      .mockImplementation(async () => Promise.resolve())
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("posts message to Mattermost and responds with 200 OK", async () => {
    const expectedMessage =
      `Une personne vient de prendre RDV.\n` +
      `Plus d'informations /admin/organisations/org456/rdvs/rdv123`

    await postOnMattermost(req, res)

    expect(mattermostSpy).toHaveBeenCalledWith(expectedMessage)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ message: "OK" })
  })
})
