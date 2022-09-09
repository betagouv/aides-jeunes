import { addAnswer } from "@root/lib/answers.ts"

const store = {}

const initMockStore = () => {
  store.calculs = { dirty: false }
  store.simulation = {
    answers: {
      all: [
        {
          id: "demandeur",
          entityName: "individu",
          fieldName: "date_naissance",
          value:
            "Thu Jul 06 1995 00:00:00 GMT+0200 (heure d’été d’Europe centrale)",
        },
        {
          id: "demandeur",
          entityName: "individu",
          fieldName: "nationalite",
          value: "FR",
        },
        {
          id: "demandeur",
          entityName: "individu",
          fieldName: "activite",
          value: "independant",
        },
        {
          entityName: "individu",
          fieldName: "handicap",
          id: "demandeur",
          value: false,
        },
      ],
      current: [],
    },
  }
}

describe("Store answers tests", () => {
  beforeEach(() => {
    initMockStore()
  })

  it("Store should not be dirty when the answer value is the same", () => {
    const newAnswer = {
      id: "demandeur",
      entityName: "individu",
      fieldName: "nationalite",
      value: "FR",
    }
    addAnswer(newAnswer, store.simulation, store.calculs)
    expect(store.calculs.dirty).toEqual(false)
  })

  it("Store should not be dirty when multiple answers values are the same", () => {
    let newAnswer = {
      id: "demandeur",
      entityName: "individu",
      fieldName: "nationalite",
      value: "FR",
    }
    addAnswer(newAnswer, store.simulation, store.calculs)
    newAnswer = {
      entityName: "individu",
      fieldName: "handicap",
      id: "demandeur",
      value: false,
    }
    addAnswer(newAnswer, store.simulation, store.calculs)
    expect(store.calculs.dirty).toEqual(false)
  })

  it("Store should be dirty when the answer value is different", () => {
    const newAnswer = {
      id: "demandeur",
      entityName: "individu",
      fieldName: "nationalite",
      value: "EN",
    }
    addAnswer(newAnswer, store.simulation, store.calculs)
    expect(store.calculs.dirty).toEqual(true)
  })

  it("Store should be dirty when multiple answers values are different", () => {
    let newAnswer = {
      id: "demandeur",
      entityName: "individu",
      fieldName: "nationalite",
      value: "EN",
    }
    addAnswer(newAnswer, store.simulation, store.calculs)
    newAnswer = {
      entityName: "individu",
      fieldName: "handicap",
      id: "demandeur",
      value: true,
    }
    addAnswer(newAnswer, store.simulation, store.calculs)
    expect(store.calculs.dirty).toEqual(true)
  })
})
