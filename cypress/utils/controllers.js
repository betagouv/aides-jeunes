export const urlInclude = (text) => {
  if (cy.state("aliases").iframe) {
    cy.get("@iframe")
      .its("0.contentWindow.location.href")
      .should("include", text)
  } else {
    cy.url().should("include", text)
  }
}
