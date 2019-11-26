/// <reference types="Cypress" />
import * as steps from '../support'

context('Full simulation', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/')
  })

  it('accepts a family situation', () => {
    steps.home()
    steps.demandeur()

    // 30
    cy.get('h1').invoke('text').should('contain', ' enfants ')

    cy.get('.new-entity').as('addButton')
    cy.get('@addButton').invoke('text').should('contain', 'Ajouter un enfant')

    cy.get('@addButton').click()
    cy.get('form').next().first().as('addForm')
    cy.get('@addForm').get('h1').invoke('text').should('contain', 'Nouvel enfant')
    cy.get('#date-de-naissance')
      .type('01042000')
    cy.get('button[type="submit"]').click()
    cy.get('.child').first().invoke('text').should('contain', 'Votre 1ᵉʳ enfant')

    cy.get('@addButton').click()
    cy.get('#date-de-naissance')
      .type('01082005')
    cy.get('button[type="submit"]').click()
    cy.get('.child').next().invoke('text').should('contain', 'Votre 2ᵉ enfant')

    cy.get('button[type="submit"]').click()

    // 40
    cy.get('h1').invoke('text').should('contain', 'couple')
    cy.contains('Je vis en couple').click()
    cy.get('h1').contains('Votre conjoint')
    cy.get('#date-de-naissance')
      .type('04051979')
    cy.get('button[type="submit"]').click()

    // 50
    cy.get('h1').invoke('text').should('contain', 'logement principal')
    cy.get('[value="locataire"]').check()

    cy.contains('fieldset', 'colocation').find('input[value=false]').check()
    cy.contains('fieldset', 'parenté').find('input[value=false]').check()
    cy.get('input[value="nonmeuble"]').check()
    cy.contains('fieldset', 'chambre').find('input[value=true]').check()
    cy.get('label').contains('loyer').type('600')
    cy.get('label').contains('charges').type('500')
    cy.get('[id="postal-code"]').type('61500')
    cy.get('button[type="submit"]').click()

    // 60
    steps.salaireSeul()

    cy.get('button[type="submit"]').click()

    cy.contains('fieldset', 'Votre 1ᵉʳ enfant').find('input[value=true]').check()
    cy.get('button[type="submit"]').click()

    cy.get('fieldset').find('input[type="checkbox"]').first().check()
    cy.get('button[type="submit"]').click()

    cy.get('fieldset').as('salarySection')
    cy.get('@salarySection').find('input[type="radio"][value="false"]').first().check()
    cy.get('@salarySection').find('input[type="number"]').as('inputs')
    cy.get('@inputs').its('length').should('equal', 13)

    cy.get('@inputs').eq(0).type(400)
    cy.get('@inputs').eq(2).type('{selectall}0')
    cy.get('button[type="submit"]').click()

    // 70
    steps.sansPensionAlimentaireVersees()

    // 80
    const position = 1
    const name = /Allocations familiales/
    const id = 'af'
    const description = /au moins 2 enfants/
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

    // 90
    cy.contains('a', 'Déclarez vos ressources').first().click()

    cy.get('h1').invoke('text').should('contain', 'Les revenus imposables de votre foyer')
    cy.contains('.form__group span', '13217.04')
    cy.contains('.form__group', 'Vous').contains('.form__group', 'activité').type(10000)
    cy.contains('.form__group', 'Votre conjoint').contains('.form__group', 'chômage').type(5000)

    cy.get('button[type="submit"]').click()
    cy.get('h1').invoke('text').should('contain', 'Résultats')
  })
})
