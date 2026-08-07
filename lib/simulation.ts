export const version = 18

// Réponses que la migration v18 retire lorsque leur valeur enregistrée est
// inexploitable. Le taux choisi est irrécupérable : la question doit être
// reposée avant tout affichage de résultats, sinon le droit qui en dépend
// manquerait sur une page d'apparence complète.
export const fieldsToAnswerAgain = ["taux_incapacite"]
