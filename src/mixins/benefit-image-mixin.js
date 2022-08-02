import { getBenefitImage } from "../../lib/benefits/details"

export default {
  methods: {
    getBenefitImage: (droit) => {
      return getBenefitImage(droit)
    },
  },
}
