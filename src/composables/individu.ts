import { useStore } from "vuex"
import * as individuLib from "../../lib/individu"

export const useIndividu = (individuId: string) => {
  const store = useStore()
  const role = individuId.split("_")[0]
  const { individu } = individuLib.Individu.get(
    store.getters.peopleParentsFirst,
    role,
    individuId
  )
  return individu
}
