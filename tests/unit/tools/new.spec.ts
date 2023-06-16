describe("process for new link results", () => {
  describe("process for new link results", () => {
    it("should anonymize followup", () => {
      const operations = process([], {})

      expect(operations).toHaveLength(1)
    })
  })
})
