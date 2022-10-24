import { createPinia, setActivePinia } from "pinia"
import { useStore } from "@root/src/stores"
import { getPreviousAnswer } from "@lib/answers"

const initMock = (store) => {
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

const initStore = () => {
  const store = useStore()
  initMock(store)
  return store
}

describe("Answers tests", () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia())
  })

  // Store answer tests
  it("Store should not be dirty when the answer value is the same", () => {
    const store = initStore()
    const newAnswer = {
      id: "demandeur",
      entityName: "individu",
      fieldName: "nationalite",
      value: "FR",
    }
    store.answer(newAnswer)
    expect(store.calculs.dirty).toEqual(false)
  })

  it("Store should not be dirty when multiple answers values are the same", () => {
    const store = initStore()
    let newAnswer = {
      id: "demandeur",
      entityName: "individu",
      fieldName: "nationalite",
      value: "FR",
    }
    store.answer(newAnswer)
    newAnswer = {
      entityName: "individu",
      fieldName: "handicap",
      id: "demandeur",
      value: false,
    }
    store.answer(newAnswer)
    expect(store.calculs.dirty).toEqual(false)
  })

  it("Store should be dirty when the answer value is different", () => {
    const store = initStore()
    const newAnswer = {
      id: "demandeur",
      entityName: "individu",
      fieldName: "nationalite",
      value: "EN",
    }
    store.answer(newAnswer)
    expect(store.calculs.dirty).toEqual(true)
  })

  it("Store should be dirty when multiple answers values are different", () => {
    const store = initStore()
    let newAnswer = {
      id: "demandeur",
      entityName: "individu",
      fieldName: "nationalite",
      value: "EN",
    }
    store.answer(newAnswer)
    newAnswer = {
      entityName: "individu",
      fieldName: "handicap",
      id: "demandeur",
      value: true,
    }
    store.answer(newAnswer)
    expect(store.calculs.dirty).toEqual(true)
  })

  // Answer tests
  it("Get previous answer", () => {
    const store = initStore()
    const answer = store.simulation.answers.all[2]

    const previousAnswer = getPreviousAnswer(
      store.simulation.answers.all,
      answer.entityName,
      answer.id,
      answer.fieldName
    )
    expect(previousAnswer).toStrictEqual(store.simulation.answers.all[1])

    const firstAnswer = store.simulation.answers.all[0]
    const previousFirstAnswer = getPreviousAnswer(
      store.simulation.answers.all,
      firstAnswer.entityName,
      firstAnswer.id,
      firstAnswer.fieldName
    )
    expect(previousFirstAnswer).toEqual(undefined)
  })
  it("Previous answer of the first should be undefined", () => {
    const store = initStore()
    const answer = store.simulation.answers.all[1]
    const presviousAnswer = getPreviousAnswer(
      store.simulation.answers.all,
      answer.entityName,
      answer.fieldName,
      answer.id
    )
    expect(presviousAnswer).toEqual(undefined)
  })
})
