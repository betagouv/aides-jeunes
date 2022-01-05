import ABTestingService from "@/plugins/ABTestingService"
const abTesting = ABTestingService.getEnvironment()

export default {
  methods: {
    abTestingFilter: function (items) {
      return items.filter((item) => {
        return !item.abTesting || item.abTesting(abTesting)
      })
    },
  },
}
