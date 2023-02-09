const generateResultLines = (droits, customAmount) => {
  return droits
    .map(({ amount, label }) => {
      return `- ${customAmount || amount} pour la prestation « ${label} ».`
    })
    .join("\n")
}

export const sendEcartInstructions = (situationId, droitsEligibles) => {
  if (!situationId) situationId = "??"
  if (!droitsEligibles) droitsEligibles = []

  return {
    subject: `Montants inattendus [${situationId}]`,
    body: `Bonjour,

    En effectuant une simulation sur votre simulateur, j'ai obtenu le résultat suivant :
    ${generateResultLines(droitsEligibles)}
    Mais en effectuant la même simulation sur le site XXX, j'ai obtenu le résultat suivant :
    ${generateResultLines(droitsEligibles, "XXX")}

    J'ai bien compris que vous n'étiez pas décisionnaires et ne pourrez pas intervenir en ma faveur.
    Vous pouvez me joindre par téléphone au XX XX XX XX XX (de préférence en semaine) pour une dizaine de minutes d'échange afin de comprendre d'où provient cet écart et améliorer le simulateur pour d'autres utilisateurs.

    Bonne journée,

    ————
    ID : ${situationId} (à conserver impérativement pour traitement de votre demande)
            ————`,
  }
}
export const sendEcartSimulation = (situationId, droitsEligibles) => {
  if (!situationId) situationId = "??"
  if (!droitsEligibles) droitsEligibles = []

  return {
    subject: `Montants inattendus [${situationId}]`,
    body: `Bonjour,

    En effectuant une simulation sur votre simulateur, j'ai obtenu le résultat suivant :
    ${generateResultLines(droitsEligibles)}
    Mais en effectuant la même simulation sur le site XXX, j'ai obtenu le résultat suivant :
    ${generateResultLines(droitsEligibles, "XXX")}

    Vous pouvez me joindre par téléphone au XX XX XX XX XX (de préférence en semaine) pour une dizaine de minutes d'échange afin de comprendre d'où provient cet écart.

    Bonne journée,

    ————
    ID : ${situationId} (à conserver impérativement pour traitement de votre demande)
            ————`,
  }
}

export const sendSuggestion = (situationId) => {
  if (!situationId) situationId = "??"
  return {
    subject: `[${situationId}] Suggestion`,
  }
}

export const sendError = (situationId, error) => {
  if (!situationId) situationId = "??"
  if (!error) error = "Impossible de récupérer l'erreur."
  return {
    subject: `Problème technique [${situationId}]`,
    body: `Bonjour,

  J'ai tenté de XXX,
  Et en cliquant sur XXX,
  J'ai rencontré l'erreur ci-dessous.

  Je vous joins également une capture d'écran pour faciliter la compréhension du problème.

  ————
  ID : ${situationId}
  Erreur : ${error}
  ————`,
  }
}

export const sendMontantsAttendus = (situationId) => {
  if (!situationId) situationId = "??"
  return {
    subject: `Montant attendus [${situationId}]`,
    body: `Bonjour,

    En effectuant une simulation sur votre simulateur, j'ai obtenu le résultat suivant :
    - XXX € / mois pour la prestation «  ».

    Cependant, pour la prestation XXX, le résultat est correct/incorrect.

    Je vous joins le fichier de résultats pour faciliter la compréhension du problème.

  ————
  ID : ${situationId}
  ————`,
  }
}
