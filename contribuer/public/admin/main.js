const PERIODICITE_LEGEND_ENUM = {
  ponctuelle: "",
  mensuelle: "/ mois",
  annuelle: "/ an"
}

export const DroitPreviewTemplate = createClass({
  render: function() {
    const entry = this.props.entry

    const name = entry.getIn(["data", "label"]) || ""
    const description = entry.getIn(["data", "description"]) || undefined
    const link = entry.getIn(["data", "link"]) || undefined

    const montant = entry.getIn(["data", "montant"]) || 1
    const typeMontant = entry.getIn(["data", "type"])
    const unit = entry.getIn(["data", "unit"]) || "€"
    const legend = entry.getIn(["data", "legend"]) || ""

    const periodicite = PERIODICITE_LEGEND_ENUM[entry.getIn(["data", "periodicite"])] || ""

    const conditions = entry.getIn(["data", "conditions"]) || []

    const teleservice = entry.getIn(["data", "teleservice"]) || undefined

    let components = {
      conditions: (conditions) => {
        if (!conditions) return
        return h("div", { className: "aj-content-conditions" },
          h("p", { className: "aj-content-conditions-title" }, "Pour en bénéficier, vous devez également :"),
          h("ul", { className: "list-unstyled" }, conditions.map(condition => h("li", {}, condition)))
        )
      },
      description: (description, link) => {
        if (!description) return
        return h("p", { className: "aj-droit-description-text" }, description)
      },
      droitEstime: (type, unit) => {
        if (!type) return
        let droitEstime
        switch (type) {
          case "bool":
            droitEstime = h("span", { className: "aj-droit-eligible" }, "✅")
            break
          case "float":
            droitEstime = h("span", { className: "aj-droit-value" },
              montant + " " + unit + " " + legend + " " + periodicite
            )
            break
        }
        return droitEstime
      },
      teleservice: (link) => {
        if (!link) return
        return h("a", { href: link, className: "aj-droit-cta button cta" }, "Faire une demande en ligne")
      }
    }

    return h("div", { className: "aj-main-container" },
      h("div", { className: "aj-results-details" },
        h("div", { className: "aj-droit-detail" },
          h("div", { className: "aj-droit-identity" }, name),
          h("div", { className: "aj-droit-montant" }, components.droitEstime(typeMontant, unit)),
          h("div", { className: "aj-droit-content" },
            h("div", { className: "aj-droit-content-description" },
              h("div", { className: "aj-content-description" }, components.description(description, link)),
              h("div", { className: "aj-droit-conditions" }, components.conditions(conditions)),
              h("div", { className: "aj-droit-content-cta" }, components.teleservice(teleservice))
            )
          )
        )
      )
    )
  }
})
