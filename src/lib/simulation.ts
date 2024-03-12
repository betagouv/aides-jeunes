import Simulation from "@/lib/simulation.js"
import StatisticsMixin from "@/mixins/statistics"
import { EventAction, EventCategory } from "@lib/enums/event"
import { useStore } from "@/stores/index.js"
import { useRouter } from "vue-router"

const getLatestId = (): string | undefined => {
  return document.cookie
    .split("; ")
    .reduce<Record<string, string>>((accum, pair) => {
      const [key, value] = pair.split("=", 2)
      accum[key] = value
      return accum
    }, {})?.lastestSimulation
}

const restoreLatestSimulation = async (resultsComputing = true) => {
  const lastestSimulationId = Simulation.getLatestId()
  const store = useStore()
  const router = useRouter()
  if (!lastestSimulationId) {
    StatisticsMixin.methods.sendEventToMatomo(
      EventCategory.General,
      EventAction.Redirection,
      router.currentRoute.value.fullPath
    )

    return store.redirection((route) => router.push(route))
  }

  StatisticsMixin.methods.sendEventToMatomo(
    EventCategory.General,
    EventAction.CalculResultatsRestauration,
    router.currentRoute.value.fullPath
  )

  await store.fetch(lastestSimulationId)

  if (store.simulationAnonymized) {
    await store.retrieveResultsAlreadyComputed()
  } else if (resultsComputing) {
    store.computeResults()
  }
}

const restoreLatestSimulationWithoutResultsComputing = async () =>
  restoreLatestSimulation(false)

export default {
  getLatestId,
  restoreLatestSimulation,
  restoreLatestSimulationWithoutResultsComputing,
}
