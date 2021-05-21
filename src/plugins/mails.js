export const sendEcartInstructions = (situationID) => {
  if (!situationID) situationID = "??"
  return {
    subject: `[${situationID}] Montants inattendus`,
    body: `Bonjour,
    En effectuant une simulation sur votre simulateur, j'ai obtenu le résultat suivant :
    - XXX € / mois pour la prestation «  ».
    Mais en effectuant la même simulation sur le site XXX, j'ai obtenu le résultat suivant :
    - XXX € / mois pour la prestation «  ».
    Vous pouvez me joindre par téléphone au XX XX XX XX XX (de préférence en semaine) pour une dizaine de minutes d'échange afin de comprendre d'où provient cet écart.
    Bonne journée,
    ————
    ID : ${situationID} (à conserver impérativement pour traitement de votre demande)
            ————`,
  }
}
export const sendEcartSimulation = (situationID) => {
  if (!situationID) situationID = "??"
  return {
    subject: `[${situationID}] Montants inattendus`,
    body: `Bonjour,
    En effectuant une simulation sur votre simulateur, j'ai obtenu le résultat suivant :
    - XXX € / mois pour la prestation «  ».
    Mais en effectuant la même simulation sur le site XXX, j'ai obtenu le résultat suivant :
    - XXX € / mois pour la prestation «  ».
    Vous pouvez me joindre par téléphone au XX XX XX XX XX (de préférence en semaine) pour une dizaine de minutes d'échange afin de comprendre d'où provient cet écart.
    Bonne journée,
    ————
    ID : ${situationID} (à conserver impérativement pour traitement de votre demande)
            ————`,
  }
}

export const sendSuggestion = (situationID) => {
  if (!situationID) situationID = "??"
  return {
    subject: `[${situationID}] Suggestion`,
  }
}

export const sendError = (situationID, error) => {
  if (!situationID) situationID = "??"
  if (!error) error = "Impossible de récupérer l'erreur."
  return {
    subject: `[${situationID}] Problème technique`,
    body: `Bonjour,
  J'ai tenté de XXX,
  Et en cliquant sur XXX,
  J'ai rencontré l'erreur ci-dessous.

  Je vous joins également une capture d'écran pour faciliter la compréhension du problème.

  ————
  ID : ${situationID}
  Erreur : ${error}
  ————`,
  }
}
