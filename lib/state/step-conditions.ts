import IndividuMethods from "../individu.js"
import { Situation } from "../types/situations.d.js"

/* Condition BCS :
    "Vous devez avoir moins de 28 ans lors de votre 1re demande de bourse (au 1er septembre de l'année des études).
    À partir de 28 ans, vous devez poursuivre vos études pour continuer à toucher la bourse.
    Cette limite d'âge peut être reportée si vous êtes dans l'une des conditions suivantes :
    - Étudiant parent d'enfant :
    La limite d'âge est reculée d'1 an par enfant élevé."
    https://www.service-public.fr/particuliers/vosdroits/F12214
    */
export function BCSAgeCondition(situation: Situation): boolean {
  const { demandeur, enfants, dateDeValeur } = situation
  const childrenRaisedNumber = enfants?.length || 0
  const individuAge = IndividuMethods.age(demandeur, dateDeValeur.toString())
  return individuAge !== undefined && individuAge <= 28 + childrenRaisedNumber
}
