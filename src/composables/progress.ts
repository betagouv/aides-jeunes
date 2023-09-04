import { isStepAnswered } from "@lib/answers.ts"
import { computed, ComputedRef } from "vue"
import { useRoute } from "vue-router"
import { useStore } from "@/stores/index.ts"
import { Step } from "@lib/types/steps.d.js"
import { SimulationStatusEnum } from "@lib/enums/simulation.ts"

export function useProgress(): ComputedRef<number> {
  const route = useRoute()
  const store = useStore()
  const progress = computed(() => {
    const cleanPath = route.path.replace(/\/en_savoir_plus$/, "")
    const allSteps: Step[] = store.getAllSteps.filter(
      (step: Step) => !["/", "/simulation/resultats"].includes(step.path)
    )
    const activeSteps = allSteps.filter((step: Step) => step.isActive)

    // Use anwers as basis when you are not in journey
    if (
      store.simulation.status !== SimulationStatusEnum.ANONYMIZED &&
      !allSteps.some((step) => step.path === cleanPath)
    ) {
      const answeredSteps: Step[] = activeSteps.filter((step) =>
        isStepAnswered(store.simulation.answers.all, step)
      )
      return answeredSteps.length / activeSteps.length
    } else {
      const stepIndex = allSteps.findIndex((item) => item.path === cleanPath)
      const previousStep = allSteps
        .slice(0, stepIndex)
        .filter((step) => step.isActive)
      return previousStep.length / activeSteps.length
    }
  })
  return progress
}
