import { setActivePinia, createPinia } from 'pinia'
import { version } from "@root/lib/simulation.ts"
import { useStore } from "@root/src/stores/index.ts"
import dayjs from "dayjs"

const now = dayjs().format()

const storeSimulation = {
  answers: {
    all: [{
      id: 1,
      entityName: "individu",
      fieldName: "foyer_fiscal",
      value: true
    }, 
    {
      id: 2,
      entityName: "individu",
      fieldName: "handicap",
      value: true
    }],
    current: [],
  },
  dateDeValeur: new Date(),
  version,
};

describe("Store answers tests", function () {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia())
  })
  
  it('Store should not be dirty when the answer value is the same', function () {
    const newAnswer =  {
      id: 2,
      entityName: "individu",
      fieldName: "handicap",
      value: true
    }
    const store = useStore()
    store.simulation = storeSimulation
    store.answer(newAnswer)
    expect(store.calculs.dirty).toEqual(false)
  })

  it('Store should be dirty when the answer value is different', function () {
    const newAnswer =  {
      id: 2,
      entityName: "individu",
      fieldName: "handicap",
      value: false
    }
    const store = useStore()
    store.simulation = storeSimulation
    store.answer(newAnswer)
    expect(store.calculs.dirty).toEqual(true)
  })
})
