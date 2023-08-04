import { getBenefitImage } from "@lib/benefits/details.js"

export default {
  methods: {
    getBenefitImage: (droit) => {
      return getBenefitImage(droit)
    },
  },
}
