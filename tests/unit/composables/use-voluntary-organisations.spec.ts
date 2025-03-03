import { describe, expect, it, vi, beforeEach } from "vitest"
import { useVolontaryOrganisations } from "@/composables/use-voluntary-organisations"
import { useStore } from "@/stores/index.js"

vi.mock("@/stores/index.js")

describe("useVoluntaryOrganisations", () => {
  describe("fetchCenterCoordinatesFromPostalCode", () => {
    it("returns the center coordinates of a commune", async () => {
      vi.mocked(useStore).mockReturnValue({
        situation: {
          menage: {
            _codePostal: "75001",
            depcom: "75056",
          },
        },
        hasResults: true,
        fetch: vi.fn(),
      } as any)

      const { buildVolontaryOrganisationsLink, volontaryOrganisationsLink } =
        useVolontaryOrganisations()
      await buildVolontaryOrganisationsLink()

      expect(volontaryOrganisationsLink.value).toBe(
        "https://www.jeveuxaider.gouv.fr/organisations?city=75001&aroundLatLng=48.859,2.347"
      )
    })

    it("returns 404 if the commune is not found", async () => {
      vi.mocked(useStore).mockReturnValue({
        situation: {
          menage: {
            _codePostal: "99999",
            depcom: "99999",
          },
        },
        hasResults: true,
        fetch: vi.fn(),
      } as any)

      const { buildVolontaryOrganisationsLink, volontaryOrganisationsLink } =
        useVolontaryOrganisations()
      await buildVolontaryOrganisationsLink()

      expect(volontaryOrganisationsLink.value).toBe(
        "https://www.jeveuxaider.gouv.fr/organisations"
      )
    })

    it("returns 404 if the commune coordinates are not found", async () => {
      vi.mocked(useStore).mockReturnValue({
        situation: {
          menage: {
            _codePostal: "97417", // Saint-Philippe à la Réunion
            depcom: "97442",
          },
        },
        hasResults: true,
        fetch: vi.fn(),
      } as any)

      const { buildVolontaryOrganisationsLink, volontaryOrganisationsLink } =
        useVolontaryOrganisations()
      await buildVolontaryOrganisationsLink()

      expect(volontaryOrganisationsLink.value).toBe(
        "https://www.jeveuxaider.gouv.fr/organisations"
      )
    })
  })
})
