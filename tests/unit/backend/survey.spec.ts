import { expect, jest } from "@jest/globals"
import { SurveyType } from "../../../lib/enums/survey"

describe("Survey methods", () => {
  let mockFollowup

  beforeEach(() => {
    mockFollowup = {
      surveys: [],
      save: jest.fn(),
      addSurveyIfMissing: jest.fn(),
      updateSurvey: jest.fn(),
    }
  })

  describe("addSurveyIfMissing", () => {
    it("should add survey if not exists", async () => {
      const expectedSurvey = {
        type: SurveyType.TrackClickOnSimulationUsefulnessEmail,
      }

      mockFollowup.addSurveyIfMissing.mockResolvedValue(expectedSurvey)

      const result = await mockFollowup.addSurveyIfMissing(
        SurveyType.TrackClickOnSimulationUsefulnessEmail
      )

      expect(mockFollowup.addSurveyIfMissing).toHaveBeenCalledWith(
        SurveyType.TrackClickOnSimulationUsefulnessEmail
      )
      expect(result).toEqual(expectedSurvey)
    })
  })

  describe("updateSurvey", () => {
    it("should update survey with answers", async () => {
      const answers = [
        {
          id: "wasUseful",
          value: true,
        },
      ]

      mockFollowup.updateSurvey.mockResolvedValue(undefined)

      await mockFollowup.updateSurvey(
        SurveyType.TrackClickOnSimulationUsefulnessEmail,
        answers
      )

      expect(mockFollowup.updateSurvey).toHaveBeenCalledWith(
        SurveyType.TrackClickOnSimulationUsefulnessEmail,
        answers
      )
    })
  })

  describe("route handler", () => {
    it("should handle survey update from request", async () => {
      const req = {
        query: { wasuseful: "true" },
        followup: mockFollowup,
      }

      const expectedAnswers = [
        {
          id: "wasUseful",
          value: true,
        },
      ]

      mockFollowup.updateSurvey.mockResolvedValue(undefined)

      await mockFollowup.updateSurvey(
        SurveyType.TrackClickOnSimulationUsefulnessEmail,
        expectedAnswers
      )

      expect(mockFollowup.updateSurvey).toHaveBeenCalledWith(
        SurveyType.TrackClickOnSimulationUsefulnessEmail,
        expectedAnswers
      )
    })
  })
})
