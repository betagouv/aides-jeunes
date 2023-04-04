const expectedBody = [
  {
    benefit_id: "ppa",
    benefit_index: 1,
    page_total: 5,
    event_type: "show",
  },
  {
    benefit_id: "css_participation_forfaitaire",
    benefit_index: 2,
    page_total: 5,
    event_type: "show",
  },
  {
    benefit_id: "bourse_college",
    benefit_index: 3,
    page_total: 5,
    event_type: "show",
  },
  {
    benefit_id: "cohesion-territoires-conseillers-numeriques-france-services",
    benefit_index: 4,
    page_total: 5,
    event_type: "show",
  },
  {
    benefit_id: "livret_epargne_populaire_taux",
    benefit_index: 5,
    page_total: 5,
    event_type: "show",
  },
]

console.log(process.env.VITE_STATS_URL)

const init = () => {
  cy.intercept("POST", "http://127.0.0.1:4000/benefits", (req) => {
    req.reply({ statusCode: 200, body: "Hello world!" })
  }).as("recorderCall")
}

function testInterceptedBody(interceptedBody) {
  const reformattedBody = interceptedBody.map((item) => {
    delete item["hash_id"]
    delete item["abtesting"]
    delete item["version"]

    return item
  })

  expect(interceptedBody).to.deep.equal(expectedBody)
}

const wait = () => {
  cy.wait("@recorderCall").then((interception) => {
    testInterceptedBody(interception.request.body)
  })
}

export default {
  init,
  wait,
}
