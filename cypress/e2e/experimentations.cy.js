/// <reference types="Cypress" />
import "cypress-axe"

context("Test du site d'expérimentations", () => {
  it("Go to the recap during a basic situation and modify/continue the simulation", () => {
    expect(process.env.GITHUB_HEAD_REF).to.eq("test")
    expect(process.env.GITHUB_RUN_ID).to.eq("test")
    expect(100).to.eq(200)
  })
})
