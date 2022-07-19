import { defineStore } from "pinia"

export const useStore = defineStore("store", {
  state: () => ({
    test: "lol",
  }),
  getters: {},
  actions: {
    setTest(value: string) {
      this.test = value
    },
  },
})
