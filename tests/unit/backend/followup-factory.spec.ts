import { expect, jest } from "@jest/globals"

import { FollowupFactory } from "@backend/lib/followup-factory.js"
import Followups from "@backend/models/followup.js"
import utils from "@backend/lib/utils.js"

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
      mockCompute = jest.fn().mockImplementation(() => {
        return {
          droitsEligibles: [
            { id: "1", montant: 100, unit: "month" },
            { id: "2", montant: 200, unit: "month" },
          ],
        }
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

      mockFollowupCreate = jest.spyOn(Followups, "create")
      mockFollowupCreate.mockResolvedValue({})
    })

    it("should call compute once", async () => {
      await FollowupFactory.create(mockSimulation, mockSurveyOptin, mockEmail)
      expect(mockCompute).toHaveBeenCalledTimes(1)
    })

    it("should call generateToken twice", async () => {
      // Note: generateToken is called twice because it is also called in the
      // simulation pre-save hook.
      await FollowupFactory.create(mockSimulation, mockSurveyOptin, mockEmail)
      expect(mockGenerateToken).toHaveBeenCalledTimes(2)
    })

    it("should call create with the correct data", async () => {
      await FollowupFactory.create(mockSimulation, mockSurveyOptin, mockEmail)
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
      await FollowupFactory.create(mockSimulation, mockSurveyOptin, mockEmail)
      expect(mockSimulation.hasFollowup).toBe(true)
    })

    it("should call save once", async () => {
      await FollowupFactory.create(mockSimulation, mockSurveyOptin, mockEmail)
      expect(mockSimulation.save).toHaveBeenCalledTimes(1)
    })

    describe("when the simulation compute fails", () => {
      beforeEach(() => {
        mockCompute = jest
          .fn<() => Promise<never>>()
          .mockRejectedValue(new Error("Compute error"))

        mockSimulation = {
          compute: mockCompute,
          hasFollowup: false,
          save: jest.fn(),
        }
      })

      it("throws an error", async () => {
        await expect(
          FollowupFactory.create(mockSimulation, mockSurveyOptin, mockEmail)
        ).rejects.toThrow("Compute error")
      })
    })
  })
})
