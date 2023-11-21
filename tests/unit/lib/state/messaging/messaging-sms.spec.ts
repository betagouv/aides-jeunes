import { expect } from "@jest/globals"
import { shouldSendSurveyBySms } from "@backend/lib/messaging/sending.js"
import dayjs from "dayjs"

describe("shouldSendSurveyBySms condition tests", () => {
  let followup
  beforeEach(() => {
    followup = {
      surveys: [],
      phone: "0600000000",
      email: "test@test.fr",
      sentAt: dayjs("2023-11-17"),
      smsSentAt: dayjs("2023-11-17"),
    }
  })

  it("should not sent sms without phone field inside the followup", async () => {
    followup.phone = undefined
    expect(shouldSendSurveyBySms(followup, dayjs("2023-11-19"))).toBe(false)
  })

  it("should sent sms without email field inside the followup", async () => {
    followup.email = undefined
    expect(shouldSendSurveyBySms(followup, dayjs("2023-11-19"))).toBe(true)
  })

  it("should not send sms if followup has phone and already track-click-on-benefit-action-sms survey", async () => {
    followup.surveys = [
      {
        type: "track-click-on-benefit-action-sms",
        createdAt: dayjs("2023-11-16"),
        answers: [],
      },
    ]
    expect(shouldSendSurveyBySms(followup, dayjs("2023-11-19"))).toBe(false)
  })

  it("should not send sms if followup has both phone and email sended 2 days ago without answers", async () => {
    followup.surveys = [
      {
        type: "track-click-on-simulation-usefulness-email",
        createdAt: dayjs("2023-11-17"),
        answers: [],
      },
    ]
    expect(shouldSendSurveyBySms(followup, dayjs("2023-11-19"))).toBe(false)
  })

  it("should send sms if followup has both phone and email sended more than 3 days ago without answers", async () => {
    followup.surveys = [
      {
        type: "track-click-on-simulation-usefulness-email",
        createdAt: dayjs("2023-11-16").subtract(1, "hour"),
        answers: [],
      },
    ]
    expect(shouldSendSurveyBySms(followup, dayjs("2023-11-19"))).toBe(true)
  })

  it("should not send sms if followup has both phone and email sended more than 3 days ago and email survey answers", async () => {
    followup.surveys = [
      {
        type: "track-click-on-simulation-usefulness-email",
        createdAt: dayjs("2023-11-16").subtract(1, "hour"),
        answers: [
          {
            question: "mock-question",
            value: "mock-value",
          },
        ],
      },
    ]
    expect(shouldSendSurveyBySms(followup, dayjs("2023-11-19"))).toBe(false)
  })
})
