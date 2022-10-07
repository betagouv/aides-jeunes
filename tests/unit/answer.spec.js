import { createPinia, setActivePinia } from "pinia"
import { useStore } from "@root/src/stores"

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

describe("Store answers tests", () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia())
  })

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
})
