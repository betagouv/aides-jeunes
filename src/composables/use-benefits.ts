import { ref } from "vue"
import { useStore } from "@/stores/index.js"
import { StandardBenefit } from "@data/types/benefits"

export function useBenefits() {
  const store = useStore()

  const benefits = ref<StandardBenefit[]>(
    store.calculs?.resultats?.droitsEligibles || []
  )

  return {
    benefits,
  }
}
