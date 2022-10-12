import Individu from "@lib/individu.js"
import { useStore } from "@/stores"

export const useIndividu = (individuId: string) => {
  const store = useStore()
  const role = individuId.split("_")[0]
  const { individu } = Individu.get(store.peopleParentsFirst, role, individuId)
  return individu
}
