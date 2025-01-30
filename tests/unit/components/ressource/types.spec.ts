import { expect } from "vitest"
import { mount } from "@vue/test-utils"
import { createPinia, setActivePinia } from "pinia"
import { createRouter, createMemoryHistory } from "vue-router"
import Types from "@/components/ressource/types.vue"

describe("types.vue", () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [],
  })
  const pinia = createPinia()
  const mockStore = {
    situation: {},
    dates: {
      twelveMonthsAgo: { label: "test" },
    },
    simulation: {
      answers: {
        all: [],
      },
    },
    getAllSteps: [],
    answer: () => {},
  }

  const mountComponent = () => {
    return mount(Types, {
      props: {
        individu: {},
      },
      global: {
        mocks: {
          $route: { params: { id: "test" } },
          $push: () => {},
        },
        plugins: [pinia, router],
        provide: {
          store: mockStore,
        },
      },
    })
  }

  beforeEach(() => {
    setActivePinia(pinia)
  })

  describe("sort method", () => {
    const categories = [
      { label: "Stage" },
      { positionInList: 1, label: "Salaire 1" },
      { positionInList: 2, label: "Salaire 2" },
      { label: "Prime" },
    ]

    const expectedResult = [
      { positionInList: 1, label: "Salaire 1" },
      { positionInList: 2, label: "Salaire 2" },
      { label: "Prime" },
      { label: "Stage" },
    ]

    it("should sort ressource types following multiple criterias", () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.sort(categories)).toEqual(expectedResult)
    })
  })

  describe("groupTypes method", () => {
    const categories = [
      { label: "Salaire", category: "Revenus" },
      { label: "Revenus de stage", category: "Revenus" },
      { label: "APL", category: "Allocations" },
      { label: "Bourse", category: "Autre" },
    ]

    const expectedResult = {
      Autre: [{ label: "Bourse", category: "Autre" }],
      Allocations: [{ label: "APL", category: "Allocations" }],
      Revenus: [
        { label: "Salaire", category: "Revenus" },
        { label: "Revenus de stage", category: "Revenus" },
      ],
    }

    it("should group resources by their types", () => {
      const wrapper = mountComponent()
      expect(wrapper.vm.groupTypes(categories)).toEqual(expectedResult)
    })
  })
})
