import Montants from "./montants.vue"

describe("<Montants />", () => {
  it("renders", () => {
    const updateSpy = cy.spy().as("updateSpy")
    cy.mount(Montants, {
      props: {
        onUpdate: updateSpy,
        type: {
          meta: { id: "salaire_net", label: "Salaire" },
          amounts: {
            "2024-01": "",
            "2023-12": "",
            "2023-11": "",
            "2023-10": "",
            "2023-09": "",
            "2023-08": "",
            "2023-07": "",
            "2023-06": "",
            "2023-05": "",
            "2023-04": "",
            "2023-03": "",
            "2023-02": "",
            "2023-01": "",
          },
          individu: {
            id: "demandeur",
            annee_etude: "licence_1",
            date_naissance: "2005-01-01T00:00:00.000Z",
            enfant_a_charge: {},
            nationalite: "FR",
            _role: "demandeur",
            activite: "etudiant",
            service_civique: false,
            handicap: false,
            enceinte: "pas_enceinte",
            statut_marital: "celibataire",
            salaire_net: {
              "2024-01": 0,
              "2023-12": 0,
              "2023-11": 0,
              "2023-10": 0,
              "2023-09": 0,
              "2023-08": 0,
              "2023-07": 0,
              "2023-06": 0,
              "2023-05": 0,
              "2023-04": 0,
              "2023-03": 0,
              "2023-02": 0,
              "2023-01": 0,
            },
            _interetsAidesVelo: [],
            _interetBafa: true,
            _interetPermisDeConduire: false,
            _interetAidesSanitaireSocial: true,
            scolarite: "enseignement_superieur",
            statuts_etablissement_scolaire: "public",
            mention_baccalaureat: "mention_bien",
            stagiaire: false,
            alternant: false,
            groupe_specialites_formation: "groupe_330",
            bourse_criteres_sociaux_base_ressources_parentale: 3000,
            _interetEtudesEtranger: false,
          },
          months: [
            { id: "2024-01", label: "janvier 2024" },
            { id: "2023-12", label: "décembre 2023" },
            { id: "2023-11", label: "novembre 2023" },
            { id: "2023-10", label: "octobre 2023" },
            { id: "2023-09", label: "septembre 2023" },
            { id: "2023-08", label: "août 2023" },
            { id: "2023-07", label: "juillet 2023" },
            { id: "2023-06", label: "juin 2023" },
            { id: "2023-05", label: "mai 2023" },
            { id: "2023-04", label: "avril 2023" },
            { id: "2023-03", label: "mars 2023" },
            { id: "2023-02", label: "février 2023" },
            { id: "2023-01", label: "janvier 2023" },
          ],
          displayMonthly: false,
          meta: {
            id: "salaire_net",
            label: "Salaire (dont primes et indemnités de fin de contrat)",
            category: "revenusActivite",
            interuptionQuestionLabel:
              "un salaire, des allocations chômage, ou des indemnités de la sécurité sociale",
            positionInList: "1",
            hint: "Entrez le montant avant la retenue à la source",
          },
          extra: {},
        },
        dates: {
          twelveMonthsAgo: { id: "2023-01", label: "janvier 2023" },
          thisMonth: { id: "2024-01", label: "janvier 2024" },
        },
      },
    })
    cy.get("[value=true]").click()
    cy.get("@updateSpy").should(
      "have.been.calledWith",
      "displayMonthly",
      undefined,
      true
    )
    cy.get("[value=false]").click()
    cy.get("@updateSpy").should(
      "have.been.calledWith",
      "displayMonthly",
      undefined,
      false
    )
    cy.get("[value=false]").then(($el) => {
      expect($el).to.have.prop("checked", true)
    })
  })
})
