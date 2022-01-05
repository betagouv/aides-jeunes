import ABTestingService from "@/plugins/ABTestingService"

export default {
  methods: {
    abTestingFilter: function (items) {
      const abTesting = ABTestingService.getEnvironment()
      items = items.filter((item) => {
        return !item.abTesting || item.abTesting(abTesting)
      })
      return items
    },
  },
}
