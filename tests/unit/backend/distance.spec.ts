import { describe, expect, it } from "vitest"
import {
  findCoordinateByInseeCode,
  computeDistanceCommunes,
} from "@backend/lib/mes-aides/distance"

describe("distance", () => {
  describe("computeDistanceCommunes", () => {
    it("calcule la distance entre deux communes", async () => {
      const villefranche = await findCoordinateByInseeCode("69264")
      const orange = await findCoordinateByInseeCode("84087")
      const distance = computeDistanceCommunes(villefranche, orange)
      expect(distance).toBeCloseTo(205, -1) // Distance approximative en km
    })

    it("retourne 0 si une commune n'est pas trouvée", async () => {
      const wrongCode = await findCoordinateByInseeCode("99999")
      const parisArrondissement = await findCoordinateByInseeCode("75101")
      const distance = await computeDistanceCommunes(
        wrongCode,
        parisArrondissement
      )
      expect(distance).toBe(0)
    })
  })

  describe("findCoordinateByInseeCode", () => {
    it("trouve les coordonnées d'une commune", async () => {
      const commune = await findCoordinateByInseeCode("75101")
      expect(commune).toEqual({
        centre: {
          coordinates: [2.340375, 48.884523],
        },
      })
    })
  })
})
