/// <reference types="Cypress" />
import * as steps from '../support'

context('Full simulation', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/')
  })

  it('accepts a family situation', () => {
    steps.home()
    steps.demandeur()
    steps.deuxEnfants()
    steps.couple()
    steps.conjoint()
    steps.sansDomicileStable()
    // steps.salaireSeul()
    // steps.sansPensionAlimentaireVersees()
    // steps.hasPrimeActivite()
    steps.hasLogementSocial()
  })
})
