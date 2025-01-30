import { expect, jest } from "@jest/globals"
import { SurveyType } from "../../../lib/enums/survey"
import { Survey } from "@lib/types/survey"
import FollowupModel from "../../../backend/models/followup.js"

describe("Survey methods", () => {
  let mockFollowup

  beforeEach(() => {
    mockFollowup = {
      surveys: [],
      save: jest.fn(),
      addSurveyIfMissing: FollowupModel.prototype.addSurveyIfMissing,
      updateSurvey: FollowupModel.prototype.updateSurvey,
    }
  })

  describe("addSurveyIfMissing", () => {
    it("should add survey if not exists", async () => {
      const existingSurvey: Survey = {
        _id: "test-id",
        type: SurveyType.TrackClickOnSimulationUsefulnessEmail,
        answers: [],
        touchedAts: [],
      }
      mockFollowup.surveys = [existingSurvey]
      const newAnswers = [{ id: "wasUseful", value: true }]
      await mockFollowup.updateSurvey(
        SurveyType.TrackClickOnSimulationUsefulnessEmail,
        newAnswers
      )
      expect(mockFollowup.surveys[0].answers).toEqual(newAnswers)
      expect(mockFollowup.surveys[0].touchedAts).toHaveLength(1)
    })

    it("should not add survey if it already exists", async () => {
      const existingSurvey: Survey = {
        _id: "test-id",
        type: SurveyType.TrackClickOnSimulationUsefulnessEmail,
        answers: [],
        touchedAts: [],
      }
      mockFollowup.surveys = [existingSurvey]

      const result = await mockFollowup.addSurveyIfMissing(
        SurveyType.TrackClickOnSimulationUsefulnessEmail
      )
      expect(result.type).toEqual(
        SurveyType.TrackClickOnSimulationUsefulnessEmail
      )
      expect(mockFollowup.surveys).toHaveLength(1)
      expect(mockFollowup.surveys[0].type).toEqual(
        SurveyType.TrackClickOnSimulationUsefulnessEmail
      )
    })
  })

  describe("updateSurvey", () => {
    it("should update survey with answers", async () => {
      const existingSurvey: Survey = {
        _id: "test-id",
        type: SurveyType.TrackClickOnSimulationUsefulnessEmail,
        answers: [],
        touchedAts: [],
      }
      mockFollowup.surveys = [existingSurvey]
      const newAnswers = [{ id: "wasUseful", value: true }]
      await mockFollowup.updateSurvey(
        SurveyType.TrackClickOnSimulationUsefulnessEmail,
        newAnswers
      )
      expect(mockFollowup.surveys[0].answers).toEqual(newAnswers)
      expect(mockFollowup.surveys[0].touchedAts).toHaveLength(1)
    })
  })
})
