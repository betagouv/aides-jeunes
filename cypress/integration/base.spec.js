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
      taux_incapacite: 0.7
    })
    steps.zeroEnfants()
    steps.celibataire()
    steps.sansDomicileStable()
    // steps.salaireSeul()
    // steps.sansPensionAlimentaireVersees()
    // steps.hasPrimeActivite()
    steps.hasLogementSocial()
  })

  it('accepts a situation where age between 8 && 25', () => {
    steps.home()
    steps.demandeur({
      enfant: false,
      taux_incapacite: 0.7,
      enfantACharge: true,
      date_naissance: '12122002'
    })
    steps.zeroEnfants()
    steps.celibataire()
    steps.sansDomicileStable()

    steps.hasLogementSocial()
  })

  it('accepts a situation where age over 60', () => {
    steps.home()
    steps.demandeur({
      enfant: false,
      taux_incapacite: 0.7,
      gir: true,
      date_naissance: '12121923'
    })
    steps.zeroEnfants()
    steps.celibataire()
    steps.sansDomicileStable()
    steps.hasLogementSocial()
  })

  it('accepts a situation with one enfant', () => {
    steps.home()
    steps.demandeur({
      enfant: false,
      taux_incapacite: 0.7,
      gir: true,
      date_naissance: '12121923'
    })
    steps.oneEnfants()
    steps.celibataire()
    steps.sansDomicileStable()
    // steps.hasLogementSocial()
  })
   
})
