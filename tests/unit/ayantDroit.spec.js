describe("benefit amount", function () {
  const format = require("../../lib/benefits").formatAyantDroit
  let droit = {
    montant: undefined,
    unit: undefined,
    legend: undefined
  }

  it("should format benefit amount label with a different type.", function () {
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
    expect(ayantDroit.label).toEqual("Valeur estimée")

    droit = {
      type: "number",
      unit:  "séances",
    }
    ayantDroit = format(droit)
    expect(ayantDroit.label).toEqual("Nombre estimé")
  })

})
