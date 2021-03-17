/// <reference types="Cypress" />
import * as steps from '../support'

context('Full simulation', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/')
  })

  afterEach(() => {
    cy.window().then((win) => {
      win.sessionStorage.clear()
    })
  })

  it('accepts a basic situation', () => {
    steps.home()
    steps.demandeur()
    steps.zeroEnfants()
    steps.celibataire()
    steps.sansDomicileStable()
    // steps.salaireSeul()
    // steps.sansPensionAlimentaireVersees()
    // steps.hasPrimeActivite()
    steps.hasLogementSocial()
  })

  it('accepts a situation with handicap', () => {
    steps.home()
    steps.demandeur({
      enfant: false,
      handicap: {
        taux_incapacite: 0.7
      },
    })
    steps.zeroEnfants()
    steps.celibataire()
    steps.sansDomicileStable()
    // steps.salaireSeul()
    // steps.sansPensionAlimentaireVersees()
    // steps.hasPrimeActivite()
    steps.hasLogementSocial()
  })
})
