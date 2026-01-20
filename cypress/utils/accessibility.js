import { checkA11y } from "cypress-axe"

function terminalLog(violations) {
  cy.task(
    "log",
    `${violations.length} accessibility violation${
      violations.length === 1 ? "" : "s"
    } ${violations.length === 1 ? "was" : "were"} detected`,
  )
  // pluck specific keys to keep the table readable
  const violationData = violations.map(
    ({ id, impact, description, nodes }) => ({
      id,
      impact,
      description,
      nodes: nodes.length,
    }),
  )

  cy.task("table", violationData)
}
const prevFnt = cy.checkA11y
Cypress.Commands.add("checkA11y", () => prevFnt(null, null, terminalLog))
