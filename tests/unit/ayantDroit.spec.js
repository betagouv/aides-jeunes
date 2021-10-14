describe("benefit amount", function () {
  const format = require("../../lib/benefits").formatAyantDroit
  let droit = {
    montant: undefined,
    unit: undefined,
    legend: undefined
  }

  it("should format label with different type.", function () {
    droit = {
      type: "number",
      unit:  "€",
    }
    let ayantDroit = format(droit)
    expect(ayantDroit.label).toEqual("Montant estimé")

    droit = {
      type: "number",
      unit:  "%",
    }
    ayantDroit = format(droit)
    expect(ayantDroit.label).toEqual("Remise estimée")

    droit = {
      type: "number",
      unit:  "seances",
    }
    ayantDroit = format(droit)
    expect(ayantDroit.label).toEqual("Nombre estimé")
  })

})
