import IndividuMethods from "@lib/individu.js"
import { useStore } from "@/stores/index.js"

export const useIndividu = (individuId: string) => {
  const store = useStore()
  const role = individuId.split("_")[0]
  const { individu } = IndividuMethods.get(
    store.peopleParentsFirst,
    role,
    individuId
  )
  return individu
}
