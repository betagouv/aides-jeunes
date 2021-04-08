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
    .should('match', /\d+ aides/i)

  cy.get('.aj-home-hero-content').invoke('text')
    .should('contain', 'aides')

  cy.get('.button.primary')
    .click()
}

export function demandeur(params={}) {
  // Naissance
  cy.get('label').invoke('text').should('contain', 'naissance')
  cy.get('#date_naissance')
    .type(params.date_naissance || '12121980')
  cy.get('button[type="submit"]').click()
  // Nationalite
  cy.get('legend').invoke('text').should('contain', 'nationalité')
  cy.get('input[type="radio"]').check('fr')
  // Activite
  cy.get('legend').invoke('text').should('contain', 'Êtes-vous')
  cy.get('label').invoke('text').should('contain', 'En activité')
  cy.get('input[type="radio"]').check('actif')
  // Handicap
  handicap(params)
}

export function handicap(params) {
  cy.get('legend').invoke('text').should('contain', 'handicap')
  if (params.handicap) {
    cy.get('input[type="radio"]').check('true')
    // Taux d'incapacite
    cy.get('legend').invoke('text').should('contain', `taux d'incapacité`)
    cy.get('input[type="radio"]').check(params.handicap.taux_incapacite.toString())
    if (!params.enfant && 0.5 < params.handicap.taux_incapacite && params.handicap.taux_incapacite <= 0.8) {
      // AAH
      cy.get('legend').invoke('text').should('contain', `CDAPH`)
      cy.get('input[type="radio"]').check('true')
    }
  } else {
    cy.get('input[type="radio"]').check('false')
  }
}

export function zeroEnfants() {
  cy.get('h2').invoke('text').should('contain', 'enfants')
  cy.get('button[type="submit"]').click()
}

export function deuxEnfants() {
  cy.get('h2').invoke('text').should('contain', 'enfants')
  cy.get('button#add-pac').click()
  enfant()
  cy.get('h2').invoke('text').should('contain', 'enfants')
  cy.get('button#add-pac').click()
  enfant()
  cy.get('h2').invoke('text').should('contain', 'enfants')
  cy.get('button[type="submit"]').click()
}

export function conjoint(params={}) {
  cy.get('button[type="submit"]').click()
  // Naissance
  cy.get('label').invoke('text').should('contain', 'naissance')
  cy.get('#date_naissance')
    .type(params.date_naissance || '12121980')
  cy.get('button[type="submit"]').click()
  // Nationalite
  cy.get('legend').invoke('text').should('contain', 'nationalité')
  cy.get('input[type="radio"]').check('fr')
  // Statut Marital
  cy.get('legend').invoke('text').should('contain', 'Quelle est votre relation avec votre conjoint')
  cy.get('input[type="radio"]').check('marie')
  // Activite
  cy.get('legend').invoke('text').should('contain', 'est-il/elle')
  cy.get('label').invoke('text').should('contain', 'En activité')
  cy.get('input[type="radio"]').check('actif')
  // Handicap
  cy.get('legend').invoke('text').should('contain', 'handicap')
  cy.get('input[type="radio"]').check('false')
}

export function enfant(params={}) {
  // Prénom
  cy.get('label').invoke('text').should('contain', 'prénom')
  cy.get('button[type="submit"]').click()
  // Naissance
  cy.get('label').invoke('text').should('contain', 'naissance')
  cy.get('#date_naissance')
    .type(params.date_naissance || '12122000')
  cy.get('button[type="submit"]').click()
  // Nationalite
  cy.get('legend').invoke('text').should('contain', 'nationalité')
  cy.get('input[type="radio"]').check('fr')
  // Garde Alterne
  cy.get('legend').invoke('text').should('contain', 'en garde alternée')
  cy.get('input[type="radio"]').check('true')
  // Handicap
  cy.get('legend').invoke('text').should('contain', 'handicap')
  cy.get('input[type="radio"]').check('false')
  // Scolarite
  cy.get('legend').invoke('text').should('contain', 'scolarisé·e')
  cy.get('input[type="radio"]').check('college')
  // Enfant a charge
  cy.get('legend').invoke('text').should('contain', 'dernière déclaration d\'impôts')
  cy.get('input[type="radio"]').check('false')
}

export function celibataire() {
  cy.get('legend').invoke('text').should('contain', 'couple')
  cy.get('input[type="radio"]').check('false')
}

export function couple() {
  cy.get('legend').invoke('text').should('contain', 'couple')
  cy.get('input[type="radio"]').check('true')
}

export function sansDomicileStable() {
  cy.get('input[name="logementType"').get('[value="sansDomicile"]').check()
  cy.get('button[type="submit"]').click()// Logement
  cy.get('input[type="number"')
    .type('94120')
  cy.get('button[type="submit"]').click() // Commune de résidence
}

export function salaireSeul() {
  cy.get('form').find('input[type="checkbox"] ').first().check()
  cy.get('button[type="submit"]').click()

  cy.get('div').as('salarySection')
  cy.get('@salarySection').find('input[type="radio"][value="true"]').first().check()
  cy.get('@salarySection').find('input[type="number"]').type('1101.42')
  cy.get('button[type="submit"]').click()
}

export function interestFlagExtra() {
  cy.get('input[type="radio"]').check('false')
}

export function sansPensionAlimentaireVersees() {
  cy.get('legend').invoke('text').should('contain', 'Pensions alimentaires versées')
  cy.get('div').find('input[type="radio"][value="false"]').first().check()
  cy.get('button[type="submit"]').click()
}

export function hasPrimeActivite() {
  const position = 1
  const name = /prime d’activité/
  const id = 'ppa'
  const description = /revenus/
  cy.get('#print-disclaimer', { timeout: 15000 }).invoke('text').should('contain', 'engagement')
  cy.get('.droits-list [itemtype="http://schema.org/GovernmentService"]:nth-of-type(' + position + ')', { timeout: 6000 }).as(id + '-summary')
  cy.get('@' + id + '-summary').find('[itemprop="name"]').invoke('text')
    .should('match', name)
  cy.get('@' + id + '-summary').find('[itemprop="offers"]').invoke('text')
    .should('match', /(\d+)[\S\n\r\s]+€[\S\n\r\s]+\/ mois/)
  cy.get('@' + id + '-summary').find('.aj-aide-cta').click()
  cy.get('.aj-droit-detail:nth-of-type(' + position + ')').as(id)
  cy.get('@' + id).get('[itemprop="description"]').invoke('text')
    .should('match', description)
  cy.get('@' + id).get('[itemprop="termsOfService"]').should('be.visible')
}

export function hasAAH() {
  const position = 1
  const name = /allocation aux adultes handicapés/
  const id = 'aah'
  const description = 'AAH'
  cy.get('#print-disclaimer', { timeout: 15000 }).invoke('text').should('contain', 'engagement')
  cy.get('.droits-list [itemtype="http://schema.org/GovernmentService"]:nth-of-type(' + position + ')', { timeout: 6000 }).as(id + '-summary')
  cy.get('@' + id + '-summary').find('[itemprop="name"]').invoke('text')
    .should('match', name)
  cy.get('@' + id + '-summary').find('[itemprop="offers"]').invoke('text')
    .should('match', /(\d+)[\S\n\r\s]+€[\S\n\r\s]+\/ mois/)
  cy.get('@' + id + '-summary').find('.aj-aide-cta').click()
  cy.get('.aj-droit-detail').as(id)
  cy.get('@' + id).get('[itemprop="description"]').invoke('text')
    .should('contain', description)
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
  cy.get('@' + id + '-summary').find('.aj-aide-cta').click()
  cy.get('.aj-droit-detail').as(id)
  cy.get('@' + id).get('[itemprop="description"]').invoke('text')
    .should('match', description)
  cy.get('@' + id).get('[itemprop="termsOfService"]').should('be.visible')
}
