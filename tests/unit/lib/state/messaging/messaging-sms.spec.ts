import { expect, jest } from "@jest/globals"
import {
  shouldSendSurveyBySms,
  filterInitialSurveySms,
} from "@backend/lib/messaging/sending.js"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)

describe("shouldSendSurveyBySms condition tests", () => {
  let followup
  beforeEach(() => {
    followup = {
      surveys: [],
      phone: "0600000000",
      email: "test@test.fr",
      sentAt: dayjs("2023-11-17"),
      smsSentAt: dayjs("2023-11-17"),
      createdAt: dayjs("2023-11-17"),
    }
    jest.useFakeTimers().setSystemTime(new Date("2023-11-19"))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("should not sent sms without phone field inside the followup", async () => {
    followup.phone = undefined
    expect(shouldSendSurveyBySms(followup)).toBe(false)
  })

  it("should sent sms without email field inside the followup", async () => {
    followup.email = undefined
    expect(shouldSendSurveyBySms(followup)).toBe(true)
  })

  it("should not send sms if followup has phone and already track-click-on-benefit-action-sms survey", async () => {
    followup.surveys = [
      {
        type: "track-click-on-benefit-action-sms",
        createdAt: dayjs("2023-11-16"),
        answers: [],
      },
    ]
    expect(shouldSendSurveyBySms(followup)).toBe(false)
  })

  it("should not send sms if followup has both phone and email sended 2 days ago without answers", async () => {
    followup.surveys = [
      {
        type: "track-click-on-simulation-usefulness-email",
        createdAt: dayjs("2023-11-17"),
        answers: [],
      },
    ]
    expect(shouldSendSurveyBySms(followup)).toBe(false)
  })

  it("should send sms if followup has both phone and email sended more than 3 days ago without answers", async () => {
    followup.surveys = [
      {
        type: "track-click-on-simulation-usefulness-email",
        createdAt: dayjs("2023-11-16").subtract(1, "hour"),
        answers: [],
      },
    ]
    expect(shouldSendSurveyBySms(followup)).toBe(true)
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
    expect(shouldSendSurveyBySms(followup)).toBe(false)
  })
})

describe("filterInitialSurveySms tests", () => {
  let mockFollowups
  const limit = 10

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2023-11-25"))

    mockFollowups = [
      {
        // should not be included because it has already a sms survey
        _id: "mock-0",
        surveys: [
          {
            type: "track-click-on-simulation-usefulness-sms",
            createdAt: dayjs("2023-11-17").toDate(),
            answers: [],
          },
        ],
        phone: "0600000000",
        email: "test@test.fr",
        createdAt: dayjs("2023-11-06").toDate(),
        sentAt: dayjs("2023-11-14").toDate(),
        smsSentAt: dayjs("2023-11-17").toDate(),
      },
      {
        // should be included because it has no sms survey and has a phone and respect the email delay
        _id: "mock-1",
        surveys: [
          {
            type: "track-click-on-simulation-usefulness-email",
            createdAt: dayjs("2023-11-21").toDate(),
            answers: [],
          },
        ],
        phone: "0600000000",
        email: "test@test.fr",
        createdAt: dayjs("2023-11-15").toDate(),
        sentAt: dayjs("2023-11-15").toDate(),
        smsSentAt: dayjs("2023-11-15").toDate(),
      },
      {
        // should not be included because it has no sms survey and has a phone
        // but does not respect the email delay
        _id: "mock-2",
        surveys: [],
        phone: "0600000000",
        email: "test@test.fr",
        createdAt: dayjs("2023-11-21").toDate(),
        sentAt: dayjs("2023-11-21").toDate(),
        smsSentAt: dayjs("2023-11-24").toDate(),
      },
      {
        // should not be included because it has no phone
        _id: "mock-3",
        surveys: [],
        email: "test@test.fr",
        createdAt: dayjs("2023-11-17").toDate(),
        sentAt: dayjs("2023-11-17").toDate(),
      },
      {
        // should be included because it has a phone, no sms survey and no email
        _id: "mock-4",
        surveys: [],
        phone: "0600000000",
        createdAt: dayjs("2023-11-17").toDate(),
        sentAt: dayjs("2023-11-17").toDate(),
      },
    ]
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("should not include followup with sms survey", async () => {
    const result = await filterInitialSurveySms([mockFollowups[0]], limit)
    expect(result).not.toContainEqual(
      expect.objectContaining({ _id: "mock-0" })
    )
  })

  it("should include followup with no sms survey and has a phone and respects the email delay", async () => {
    const result = await filterInitialSurveySms([mockFollowups[1]], limit)
    expect(result).toContainEqual(expect.objectContaining({ _id: "mock-1" }))
  })

  it("should not include followup with no sms survey and has a phone but does not respect the email delay", async () => {
    const result = await filterInitialSurveySms([mockFollowups[2]], limit)
    expect(result).not.toContainEqual(
      expect.objectContaining({ _id: "mock-2" })
    )
  })

  it("should not include followup without a phone", async () => {
    const result = await filterInitialSurveySms([mockFollowups[3]], limit)
    expect(result).not.toContainEqual(
      expect.objectContaining({ _id: "mock-3" })
    )
  })

  it("should include followup with a phone, no sms survey, and no email", async () => {
    const result = await filterInitialSurveySms([mockFollowups[4]], limit)
    expect(result).toContainEqual(expect.objectContaining({ _id: "mock-4" }))
  })
})
