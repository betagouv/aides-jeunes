import { expect, jest } from "@jest/globals"
import outilsController from "@backend/controllers/outils.js"

describe("centerCoordinatesFromPostalCode", () => {
  it("returns the center coordinates of a commune", () => {
    const req = {
      params: {
        codePostal: "75001",
      },
    }
    const res = {
      send: jest.fn(),
    }
    outilsController.centerCoordinatesFromPostalCode(req, res)
    expect(res.send).toHaveBeenCalledWith([2.3752, 48.845])
  })

  it("returns 404 if the commune is not found", () => {
    const req = {
      params: {
        codePostal: "99999",
      },
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    }
    outilsController.centerCoordinatesFromPostalCode(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.send).toHaveBeenCalledWith("Coordinates not found")
  })

  it("returns 404 if the commune coordinates are not found", () => {
    const req = {
      params: {
        codePostal: "97150", // Saint-Martin actuellement n'a pas de coordinates
      },
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    }
    outilsController.centerCoordinatesFromPostalCode(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.send).toHaveBeenCalledWith("Coordinates not found")
  })
})
