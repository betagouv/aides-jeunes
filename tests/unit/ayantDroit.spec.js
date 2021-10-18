describe("benefit estimated", function () {
  const format = require("../../lib/benefits").formatDroitEstime

  it("should format the benefit estimated label with a different type.", function () {
    droit = {
      type: "number",
      unit: "€",
    }
    let droitEstime = format(droit)
    expect(droitEstime.label).toEqual("Montant estimé")

    droit = {
      type: "number",
      unit: "%",
    }
    droitEstime = format(droit)
    expect(droitEstime.label).toEqual("Valeur estimée")

    droit = {
      type: "number",
      unit: "séances",
    }
    droitEstime = format(droit)
    expect(droitEstime.label).toEqual("Nombre estimé")
  })
})
