import * as details from "../../lib/benefits/details"

export default {
  methods: {
    getBenefitImage: (droit) => {
      return details.getBenefitImage(droit)
    },
  },
}
