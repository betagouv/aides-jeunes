import { jest } from "@jest/globals"

import { FollowupFactory } from "@backend/lib/followup-factory.ts"
import Followup from "@backend/models/followup.ts"
import utils from "@backend/lib/utils.ts"

describe("FollowupFactory", () => {
  describe("create", () => {
    let mockCompute,
      mockSimulation,
      mockEmail,
      mockSurveyOptin,
      mockAccessToken,
      mockGenerateToken,
      mockFollowupCreate

    beforeEach(() => {
      // Mock dependencies
      mockCompute = jest.fn().mockResolvedValue({
        droitsEligibles: [
          { id: "1", montant: 100, unit: "month" },
          { id: "2", montant: 200, unit: "month" },
        ],
      })

      mockSimulation = {
        compute: mockCompute,
        hasFollowup: false,
        save: jest.fn(),
      }

      mockEmail = "test@example.com"
      mockSurveyOptin = true

      mockAccessToken = "access-token"
      mockGenerateToken = jest.spyOn(utils, "generateToken")
      mockGenerateToken.mockResolvedValue(mockAccessToken)

      mockFollowupCreate = jest.spyOn(Followup, "create")
      mockFollowupCreate.mockResolvedValue({})
    })

    it("should call compute once", async () => {
      await FollowupFactory.create(mockSimulation, mockEmail, mockSurveyOptin)
      expect(mockCompute).toHaveBeenCalledTimes(1)
    })

    it("should call generateToken twice", async () => {
      // Note: generateToken is called twice because it is also called in the
      // simulation pre-save hook.
      await FollowupFactory.create(mockSimulation, mockEmail, mockSurveyOptin)
      expect(mockGenerateToken).toHaveBeenCalledTimes(2)
    })

    it("should call create with the correct data", async () => {
      await FollowupFactory.create(mockSimulation, mockEmail, mockSurveyOptin)
      expect(mockFollowupCreate).toHaveBeenCalledWith({
        simulation: mockSimulation,
        email: mockEmail,
        surveyOptin: mockSurveyOptin,
        accessToken: mockAccessToken,
        benefits: [
          { id: "1", amount: 100, unit: "month" },
          { id: "2", amount: 200, unit: "month" },
        ],
        version: 3,
      })
    })

    it("should set hasFollowup to true", async () => {
      await FollowupFactory.create(mockSimulation, mockEmail, mockSurveyOptin)
      expect(mockSimulation.hasFollowup).toBe(true)
    })

    it("should call save once", async () => {
      await FollowupFactory.create(mockSimulation, mockEmail, mockSurveyOptin)
      expect(mockSimulation.save).toHaveBeenCalledTimes(1)
    })
  })
})
