// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

export function home() {
  cy.get('meta[name="og:description"]')
    .invoke('attr', 'content')
    .should('match', /\d+ prestations/i)

  cy.get('.hero__container').invoke('text')
    .should('match', /\d+ aides/i)

  cy.get('.button.xlarge.primary')
    .click()
}

export function demandeur() {
  cy.get('h1').invoke('text').should('contain', 'naissance')
  cy.get('#date_naissance')
    .type('12121980')

  cy.get('button[type="submit"]').click()
  cy.get('button[type="submit"]').click() // Nationalité
  cy.get('button[type="submit"]').click() // Activité
  cy.get('button[type="submit"]').click() // Handicap
  cy.get('button[type="submit"]').click() // Inapte au travail
}

export function zeroEnfants() {
  cy.get('h1').invoke('text').should('contain', 'enfants')
  cy.get('button[type="submit"]').click()
}

export function deuxEnfants() {
}

export function celibataire() {
  cy.get('h1').invoke('text').should('contain', 'couple')
  cy.get('button[type="submit"]').click()
}

export function sansDomicileStable() {
  cy.get('button[type="submit"]').click() // Logement
  cy.get('button[type="submit"]').click() // Coloc
  cy.get('button[type="submit"]').click() // Chambre
  cy.get('button[type="submit"]').click() // Propriétaire proche familial
  cy.get('button[type="submit"]').click() // Loyer et charges
  cy.get('button[type="submit"]').click() // Commune de résidence
}

export function salaireSeul() {
  cy.get('div').find('input[type="checkbox"]').first().check()
  cy.get('button[type="submit"]').click()

  cy.get('div').as('salarySection')
  cy.get('@salarySection').find('input[type="radio"][value="true"]').first().check()
  cy.get('@salarySection').find('input[type="number"]').type('1101.42')
  cy.get('button[type="submit"]').click()
}

export function sansPensionAlimentaireVersees() {
  cy.get('h1').invoke('text').should('contain', 'Pensions alimentaires versées')
  cy.get('div').find('input[type="radio"][value="false"]').first().check()
  cy.get('button[type="submit"]').click()
}

export function hasPrimeActivite() {
  const position = 1
  const name = /prime d’activité/
  const id = 'ppa'
  const description = /revenus/
  cy.get('h1').invoke('text').should('contain', 'Résultats')
  cy.get('.droits-list [itemtype="http://schema.org/GovernmentService"]:nth-of-type(' + position + ')', { timeout: 6000 }).as(id + '-summary')
  cy.get('@' + id + '-summary').get('[itemprop="name"]').invoke('text')
    .should('match', name)
  cy.get('@' + id + '-summary').get('[itemprop="offers"]').invoke('text')
    .should('match', /(\d+)[\S\n\r\s]+€[\S\n\r\s]+\/ mois/)

  cy.get('.droit-detail:nth-of-type(' + position + ')').as(id)
  cy.get('@' + id).get('[itemprop="description"]').invoke('text')
    .should('match', description)
  cy.get('@' + id).get('[itemprop="termsOfService"]').should('be.visible')
}

export function hasLogementSocial() {
  const position = 2
  const name = /logement social/
  const id = 'logement'
  const description = /revenus/
  cy.get('#print-disclaimer', { timeout: 15000 }).invoke('text').should('contain', 'engagement')
  cy.get('.droits-list [itemtype="http://schema.org/GovernmentService"]:nth-of-type(' + position + ')').as(id + '-summary')
  cy.get('@' + id + '-summary').get('[itemprop="name"]').invoke('text')
    .should('match', name)
  cy.get('.droit-detail:nth-of-type(' + position + ')').as(id)
  cy.get('@' + id).get('[itemprop="description"]').invoke('text')
    .should('match', description)
  cy.get('@' + id).get('[itemprop="termsOfService"]').should('be.visible')
}
