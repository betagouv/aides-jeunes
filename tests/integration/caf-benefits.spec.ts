import data from "@root/data/all"

for (const benefit of data.all) {
  if (benefit.institution.type == "caf") {
    describe(`CAF benefit ${benefit.slug}`, () => {
      it("should be restricted to exactly one departement", () => {
        expect(
          benefit.conditions_generales.some((condition) => {
            return (
              condition.type === "departements" && condition.values.length === 1
            )
          })
        )
      })
      if (benefit.label.match(/bafa/i)) {
        it("is related to BAFA and should have a corresponding flag", () => {
          expect(
            benefit.interestFlag && benefit.interestFlag === "_interetBafa"
          )
        })
      }
    })
  }
}
