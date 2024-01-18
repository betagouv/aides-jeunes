import Montants from "./montants.vue"

describe("<Montants />", () => {
  it("renders", () => {
    const updateSpy = cy.spy().as("updateSpy")
    cy.mount(Montants, {
      props: {
        onUpdate: updateSpy,
        type: {
          meta: { id: "salaire_net", label: "Salaire" },
          amounts: {
            ce_mois: 42,
          },
        },
        dates: {
          twelveMonthsAgo: { label: "Y a 12 mois" },
          thisMonth: { id: "ce_mois" },
        },
      },
    })
    //cy.get("#salaire_net_question").click()
    cy.get("[value=true]").click()
    cy.get("@updateSpy").should("have.been.calledWith", 1)
  })
})
