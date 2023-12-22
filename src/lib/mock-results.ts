import { useStore } from "@/stores/index.js"
import { useRouter } from "vue-router"

const mockResultsNeeded = () => {
  return useRouter().currentRoute.value.query?.debug !== undefined
}
const mock = (detail) => {
  if (mockResultsNeeded()) {
    useStore().mockResults(
      detail || useRouter().currentRoute.value.query?.debug
    )
  }
}

export default {
  mockResultsNeeded,
  mock,
}
