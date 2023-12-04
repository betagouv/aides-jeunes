import { ref, onMounted } from "vue"
import axios from "axios"
import dayjs from "dayjs"
import * as Sentry from "@sentry/vue"
import { useRouter } from "vue-router"

import { FetchSurvey } from "@lib/types/survey.d.js"
import { StandardBenefit, BenefitWithChoice } from "@data/types/benefits.d.js"
import { getBenefit } from "@/lib/benefits.js"
import { useStore } from "@/stores/index.js"

export function useFollowupSurveyData(token: string) {
  const followupCreatedAt = ref<string>("")
  const benefitsWithChoice = ref<BenefitWithChoice[]>([])
  const simulationWasUseful = ref<boolean>(false)
  const loading = ref<boolean>(true)
  const store = useStore()
  const router = useRouter()

  const getFollowupSurveyData = async () => {
    const { data: followupSurveyData } = (await axios.get(
      `/api/followups/surveys/${token}`
    )) as { data: FetchSurvey }

    followupCreatedAt.value = dayjs(followupSurveyData.createdAt).format(
      "DD MMMM YYYY"
    )
    simulationWasUseful.value = followupSurveyData.simulationWasUseful
    const benefits: StandardBenefit[] = followupSurveyData.benefits.map(
      (benefit) => ({
        ...getBenefit(benefit.id),
        montant: benefit.amount,
      })
    )

    benefitsWithChoice.value = benefits.map((benefit) => {
      return {
        ...benefit,
        choiceValue: null,
        choiceComments: "",
      }
    }) as BenefitWithChoice[]

    loading.value = false
  }

  onMounted(() => {
    getFollowupSurveyData().catch((err) => {
      Sentry.captureException(err)
      store.redirection((route) => router.push(route))
    })
  })

  return {
    followupCreatedAt,
    benefitsWithChoice,
    simulationWasUseful,
    loading,
  }
}
