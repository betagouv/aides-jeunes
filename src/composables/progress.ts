import { isStepAnswered } from "@lib/answers.js"
import { computed, ComputedRef } from "vue"
import { useRoute } from "vue-router"
import { useStore } from "@/stores/index.js"
import { StepStrict } from "@lib/types/steps.d.js"
import { SimulationStatusEnum } from "@lib/enums/simulation.js"

export function useProgress(): ComputedRef<number> {
  const route = useRoute()
  const store = useStore()
  const progress = computed(() => {
    const cleanPath = route.path.replace(/\/en_savoir_plus$/, "")
    const allSteps: StepStrict[] = store.getAllSteps.filter(
      (step: StepStrict) => !["/", "/simulation/resultats"].includes(step.path)
    )
    const activeSteps = allSteps.filter((step: StepStrict) => step.isActive)

    // Use anwers as basis when you are not in journey
    if (
      store.simulation.status !== SimulationStatusEnum.ANONYMIZED &&
      !allSteps.some((step) => step.path === cleanPath)
    ) {
      const answeredSteps: StepStrict[] = activeSteps.filter((step) =>
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
