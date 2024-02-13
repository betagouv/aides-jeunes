import { computed } from "vue"
import { useResultsStore } from "@/stores/results.js"

export function useScrollBenefitAnchor() {
  const resultsStore = useResultsStore()
  const benefitAnchor = computed(() => resultsStore.benefitAnchor)
  const setBenefitAnchor = (anchor: string) => {
    resultsStore.setBenefitAnchor(anchor)
  }

  const handleScrollEvent = () => {
    const hoveredDivIds: string[] = []

    const allDivs = document.querySelectorAll("div")
    const scrollOffset = window.scrollY
    allDivs.forEach((div) => {
      const { offsetTop, clientHeight, id } = div

      if (
        scrollOffset >= offsetTop &&
        scrollOffset < offsetTop + clientHeight
      ) {
        hoveredDivIds.push(id)
      }
    })

    const lastHoveredDiv = hoveredDivIds.find((id) =>
      id?.startsWith("benefit-")
    )
    if (lastHoveredDiv) {
      setBenefitAnchor(lastHoveredDiv)
    }
  }

  const addScrollEventListener = () => {
    window.addEventListener("scroll", handleScrollEvent)
  }

  const removeScrollEventListener = () => {
    window.removeEventListener("scroll", handleScrollEvent)
  }

  return {
    benefitAnchor,
    setBenefitAnchor,
    addScrollEventListener,
    removeScrollEventListener,
  }
}
