import { submit } from "./form.js"

const wait = () => {
  cy.wait("@results")
}

const getBenefitSummary = (id) => cy.get(`@${id}-summary`)

const back = () => cy.get('[data-testid="back-button"]').click()

const IdentifyBenefit = (id, name) => {
  cy.get(
    `[itemtype="http://schema.org/GovernmentService"][data-testid="${id}"]`,
    { timeout: 10000 }
  ).as(`${id}-summary`)
  cy.checkA11y()
  getBenefitSummary(id)
    .find('[itemprop="name"]')
    .invoke("text")
    .should("match", name)
}

const hasBafaGroupPreviewBenefit = (mustBeDisplay) => {
  const bafaGroupPreviewId = "bafa-bafd-preview"
  if (mustBeDisplay) {
    const name = /Aides BAFA et BAFD/
    IdentifyBenefit(bafaGroupPreviewId, name)
    cy.checkA11y()
  } else {
    cy.get(
      `[itemtype="http://schema.org/GovernmentService"][data-testid="${bafaGroupPreviewId}"]`,
      { timeout: 10000 }
    ).should("not.exist")
  }
}

const hasBafaBenefit = () => {
  const name =
    /Aide nationale au Brevet d'aptitude aux fonctions d'animateur \(BAFA\)/
  const id = "caf-aide-nationale-bafa"
  IdentifyBenefit(id, name)
  cy.checkA11y()
}

const hasPrimeActivite = () => {
  const name = /Prime d’activité/
  const id = "ppa"
  const description = /revenus/
  IdentifyBenefit(id, name)
  getBenefitSummary(id)
    .find('[data-testid="droit-estime-value"]')
    .invoke("text")
    .should("match", /(\d+)[\S\n\r\s]+€/)
  getBenefitSummary(id)
    .find('[data-testid="droit-estime-legend"]')
    .invoke("text")
    .should("match", /\/ mois/)
  cy.checkA11y()
  getBenefitSummary(id).find('[data-testid="droit-estime-legend"]').click()

  cy.get('[data-testid="droit-detail"]').as(id)
  cy.get(`@${id}`)
    .get('[itemprop="description"]')
    .invoke("text")
    .should("match", description)
  cy.get(`@${id}`).get('[itemprop="termsOfService"]').should("be.visible")
}

const hasPrimeActiviteNearbyPlaces = () => {
  cy.get('[data-testid="nearby-places"]').should("be.visible")
  cy.get('[data-testid="lieu-title"]').should(
    "contain",
    "Caisse d'allocations familiales"
  )
  cy.get('[data-testid="lieu-informations-link"]').should(
    "contain",
    "Voir les informations"
  )
}

const hasSituationNearbyPlaces = () => {
  cy.get('[data-testid="nearby-help"]').should("be.visible").click()
  cy.get('[data-testid="nearby-help"]').should("not.exist")
  cy.get('[data-testid="lieu-title"]')
    .first()
    .should("contain", "Mairie - Fontenay-sous-Bois")
  cy.get('[data-testid="lieu-address"]').first().should("be.visible")
}

const captureFiscalResources = () => {
  const name = /Livret d’épargne populaire/
  const id = "livret_epargne_populaire_taux"
  back()
  IdentifyBenefit(id, name)
  getBenefitSummary(id).click()
  cy.get(`div[data-testid="benefit-detail-warning"]`)
    .invoke("text")
    .should("contain", "ressources")
  cy.get(`a[data-testid="benefit-ressources-link"]`).click()
  cy.get('input[type="number"]').first().type("50000")
  cy.checkA11y()
  submit()
  cy.get(`${id}-summary`).should("not.exist")
}

const hasHousingBenefit = () => {
  const name = /Aides au logement/
  const id = "aide_logement"
  const description = /Apl/
  IdentifyBenefit(id, name)
  getBenefitSummary(id)
    .find('[data-testid="droit-estime-value"]')
    .invoke("text")
    .should("match", /(\d+)[\S\n\r\s]+€/)
  getBenefitSummary(id)
    .find('[data-testid="droit-estime-legend"]')
    .invoke("text")
    .should("match", /\/ mois/)
  getBenefitSummary(id).find('[data-testid="droit-estime-legend"]').click()

  cy.get('[data-testid="droit-detail"]').as(id)
  cy.get(`@${id}`)
    .get('[itemprop="description"]')
    .invoke("text")
    .should("match", description)
  cy.get(`@${id}`).get('[itemprop="termsOfService"]').should("be.visible")
}

const hasCSS = () => {
  const name = /Complémentaire santé solidaire/
  const id = "css_participation_forfaitaire"
  IdentifyBenefit(id, name)
}

const hasAAH = () => {
  const name = /Allocation aux adultes handicapés/
  const id = "aah"
  const description = "AAH"
  IdentifyBenefit(id, name)
  getBenefitSummary(id)
    .find('[data-testid="droit-estime-value"]')
    .invoke("text")
    .should("match", /(\d+)[\S\n\r\s]+€/)
  getBenefitSummary(id)
    .find('[data-testid="droit-estime-legend"]')
    .invoke("text")
    .should("match", /\/ mois/)
  cy.checkA11y()
  getBenefitSummary(id).find('[data-testid="droit-estime-legend"]').click()

  cy.get('[data-testid="droit-detail"]').as(id)
  cy.get(`@${id}`)
    .get('[itemprop="description"]')
    .invoke("text")
    .should("contain", description)
  cy.get(`@${id}`).get('[itemprop="termsOfService"]').should("be.visible")
}

const hasBourseCriteresSociaux = () => {
  const name = /Bourse sur critères sociaux/
  const id = "bourse_criteres_sociaux"
  const description = /BCS/
  IdentifyBenefit(id, name)
  getBenefitSummary(id)
    .find('[data-testid="droit-estime-value"]')
    .invoke("text")
    .should("match", /(\d+)[\S\n\r\s]+€/)
  getBenefitSummary(id)
    .find('[data-testid="droit-estime-legend"]')
    .invoke("text")
    .should("match", /\/ mois/)
  cy.checkA11y()
  getBenefitSummary(id).find('[data-testid="droit-estime-legend"]').click()

  cy.get('[data-testid="droit-detail"]').as(id)
  cy.get(`@${id}`)
    .get('[itemprop="description"]')
    .invoke("text")
    .should("match", description)
  cy.get(`@${id}`).get('[itemprop="termsOfService"]').should("be.visible")
}

const hasIleDeFranceAideAuMerite = () => {
  const name = /Aide au mérite/
  const id = "ile-de-france-aide-au-merite"
  IdentifyBenefit(id, name)
  getBenefitSummary(id)
    .find('[data-testid="droit-estime-value"]')
    .invoke("text")
    .should("match", /(\d+)[\S\n\r\s]+€/)
}

const hasAideVeloNationale = () => {
  const name = /Aide à l'achat d'un vélo : Bonus vélo/
  const id = "aidesvelo_aides_bonus_vélo"
  IdentifyBenefit(id, name)
}

const hasVeloGroupPreviewBenefit = (mustBeDisplay) => {
  const veloGroupPreviewId = "velo-preview"
  if (mustBeDisplay) {
    const name = /Aides à l'achat d'un vélo/
    IdentifyBenefit(veloGroupPreviewId, name)
    cy.checkA11y()
  } else {
    cy.get(
      `[itemtype="http://schema.org/GovernmentService"][data-testid="${veloGroupPreviewId}"]`,
      { timeout: 10000 }
    ).should("not.exist")
  }
}

const hasIncitationCovoiturage = () => {
  const name = /Incitation au covoiturage de Montpellier Méditerranée Métropole/
  const id =
    "intercommunalite-montpellier-mediterranee-metropole-incitations-covoiturage-eligibilite"
  IdentifyBenefit(id, name)
}

const hasRSA = () => {
  const name = /Revenu de solidarité active/
  const id = "rsa"
  IdentifyBenefit(id, name)
}

const hasNotBenefit = (id) => {
  cy.checkA11y()
  cy.get(`[data-testid="${id}"]`, { timeout: 10000 }).should("not.exist")
}

const receiveResultsEmail = () => {
  cy.intercept({
    method: "POST",
    url: "/api/simulation/*/followup",
  }).as("post-receive-results-email")

  cy.get("[data-testid='send-email-and-sms-button']", {
    timeout: 20000,
  })
    .should("be.visible")
    .click()

  const email = "prenom.nom@beta.gouv.fr"
  cy.get("input#email").should("be.visible").type(email)
  cy.get(".fr-btn:contains(J'accepte d'être recontacté ou recontactée)")
    .should("be.visible")
    .click()

  cy.wait("@post-receive-results-email").should(({ request, response }) => {
    expect(request.method).to.equal("POST")
    expect(response.statusCode).to.equal(200)
  })

  cy.get('[data-testid="simulation-id"')
    .invoke("text")
    .then((simulationId) => {
      cy.url().then(() => {
        cy.task("getLastEmail", email)
          .its("headers.subject")
          .should("includes", simulationId)
      })
    })
}

const receiveResultsSms = () => {
  const phone = "0600000000"
  cy.intercept(
    {
      method: "POST",
      url: "/api/simulation/*/followup",
    },
    {
      statusCode: 200,
      body: {
        surveyOptin: true,
        phone: "0600000000",
      },
    }
  ).as("post-receive-results-sms")

  cy.get("[data-testid='send-email-and-sms-button']", {
    timeout: 20000,
  })
    .should("be.visible")
    .click()
  // scroll to input#phone
  cy.get("input#phone").scrollIntoView().should("be.visible").type(phone)
  cy.get(".fr-btn:contains(J'accepte d'être recontacté ou recontactée)")
    .should("be.visible")
    .click()

  cy.wait("@post-receive-results-sms").should(({ request, response }) => {
    expect(request.method).to.equal("POST")
    expect(response.statusCode).to.equal(200)
  })
}

const checkResultsRequests = () => {
  cy.wait("@post-simulation").then(({ request, response }) => {
    cy.writeFile(
      `cypress/payloads/${Cypress.spec.fileName}-simulation.json`,
      response.body
    )
    expect(request.method).to.equal("POST")
    expect(response.statusCode).to.equal(200)
  })
  cy.wait("@results").should(({ request, response }) => {
    expect(request.method).to.equal("GET")
    expect(response.statusCode).to.equal(200)
  })
}

const checkOpenFiscaAxe = () => {
  cy.get('[data-testid="partenaire-actions"]').should("be.visible").click()
  cy.get('[data-testid="openfisca-axe-link"]')
    .should("be.visible")
    .its("0.href")
    .then((href) => {
      const url = new URL(href)
      const source = url.searchParams.get("source")
      cy.request({
        url: source,
        timeout: 20000,
      }).should((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property("names")
        expect(response.body).to.have.property("data")
      })
    })
}

export default {
  wait,
  back,
  hasBafaGroupPreviewBenefit,
  hasBafaBenefit,
  hasPrimeActivite,
  hasPrimeActiviteNearbyPlaces,
  hasSituationNearbyPlaces,
  hasHousingBenefit,
  hasCSS,
  hasAAH,
  hasBourseCriteresSociaux,
  hasRSA,
  hasNotBenefit,
  captureFiscalResources,
  hasIleDeFranceAideAuMerite,
  hasAideVeloNationale,
  hasVeloGroupPreviewBenefit,
  hasIncitationCovoiturage,
  receiveResultsEmail,
  receiveResultsSms,
  checkResultsRequests,
  checkOpenFiscaAxe,
}
