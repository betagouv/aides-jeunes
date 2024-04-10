/// <reference types="Cypress" />
import "cypress-axe"

context("Test du site d'expérimentations", () => {
  it("Go to the recap during a basic situation and modify/continue the simulation", () => {
    expect(Cypress.env("GITHUB_RUN_ID")).to.eq("test")
    expect(100).to.eq(200)
  })
})
