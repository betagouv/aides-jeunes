import { ref, onMounted } from "vue"
import axios from "axios"
import dayjs from "dayjs"
import * as Sentry from "@sentry/vue"

import { FetchSurvey } from "@lib/types/survey.d.js"
import { StandardBenefit, BenefitWithChoice } from "@data/types/benefits.d.js"
import { getBenefit } from "@/lib/benefits.js"

export function useFollowupSurveyData(token: string) {
  const followupCreatedAt = ref<string>("")
  const benefitsWithChoice = ref<BenefitWithChoice[]>([])
  const loading = ref<boolean>(true)

  const getFollowupSurveyData = async () => {
    const { data: followupSurveyData } = (await axios.get(
      `/api/followups/surveys/${token}`
    )) as { data: FetchSurvey }

    followupCreatedAt.value = dayjs(followupSurveyData.createdAt).format(
      "DD MMMM YYYY"
    )
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
    })
  })

  return {
    followupCreatedAt,
    benefitsWithChoice,
    loading,
  }
}
