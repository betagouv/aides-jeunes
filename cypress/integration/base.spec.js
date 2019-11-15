/// <reference types="Cypress" />

context('Full simulation', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/')
  })

  it('accepts a basic situation', () => {
    // 1
    //TODO10 metaOGDescription
    //TODO10 metaTwitterDescription
    cy.get('.hero__container').invoke('text')
      .should('match', /\d+ aides/i)

    cy.get('.button.xlarge.primary')
      .click()

    // 2
    cy.get('h1').invoke('text').should('contain', 'Vous')
    cy.get('#date-de-naissance')
      .type('12121980')

    cy.get('button[type="submit"]').click()

    // 3
    cy.get('h1').invoke('text').should('contain', ' enfants ')
    cy.get('button[type="submit"]').click()

    // 4
    cy.get('h1').invoke('text').should('contain', 'couple')
    cy.get('button[type="submit"]').click()

    // 5
    cy.get('h1').invoke('text').should('contain', 'logement')
    cy.get('input[name="logementType"').get('[value="sansDomicile"]').check()

    cy.get('button[type="submit"]').click()
    cy.get('.notification.warning').invoke('text')
      .should('match', /code postal est invalide/i)

    cy.get('#postal-code').type('61509')
    cy.get('button[type="submit"]').click()
    cy.get('.notification.warning').invoke('text')
      .should('match', /code postal est invalide/i)

    cy.get('#postal-code').clear().type('61500')
    cy.get('#commune').invoke('text')
      .should('match', /Sées/i)

    cy.get('button[type="submit"]').click()

    // 6
    cy.get('fieldset').find('input[type="checkbox"]').first().check()
    cy.get('button[type="submit"]').click()

    cy.get('fieldset').as('salarySection')
    cy.get('@salarySection').find('input[type="radio"][value="true"]').first().check()
    cy.get('@salarySection').find('input[type="number"]').type('1101.42')
    cy.get('button[type="submit"]').click()

    // 7
    cy.get('h1').invoke('text').should('contain', 'Pensions alimentaires versées')
    cy.get('fieldset').find('input[type="radio"][value="false"]').first().check()
    cy.get('button[type="submit"]').click()

    // 8
    const position = 1
    const name = /Prime d’activité/
    const id = 'ppa'
    const description = /revenus/
    cy.get('h1').invoke('text').should('contain', 'Résultats')
    cy.get('.droits-list [itemtype="http://schema.org/GovernmentService"]:nth-of-type(' + position + ')').as(id + '-summary')
    cy.get('@' + id + '-summary').get('[itemprop="name"]').invoke('text')
      .should('match', name)
    cy.get('@' + id + '-summary').get('[itemprop="offers"]').invoke('text')
      .should('match', /(\d+)[\S\n\r\s]+€[\S\n\r\s]+\/ mois/)

    cy.get('.droit-detail:nth-of-type(' + position + ')').as(id)
    cy.get('@' + id).get('[itemprop="description"]').invoke('text')
      .should('match', description)
    cy.get('@' + id).get('[itemprop="termsOfService"]').should('be.visible')
  })
})
