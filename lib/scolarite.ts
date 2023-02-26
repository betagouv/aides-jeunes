import { ScolariteType } from "./enums/scolarite.js"
export default {
  types: [
    {
      value: ScolariteType.college,
      label: "Au collège",
    },
    {
      value: ScolariteType.lycee,
      label: "Au lycée / En CAP / En CPA",
    },
    {
      value: ScolariteType.enseignement_superieur,
      label: "Dans l'enseignement supérieur",
    },
    {
      value: ScolariteType.grande_ecole_du_numerique,
      label: "Dans une grande école du numérique",
    },
    {
      value: ScolariteType.inconnue,
      label: "Autre",
    },
  ],
  mentionsBaccalaureat: [
    {
      label: "Mention assez bien",
      value: "mention_assez_bien",
    },
    {
      label: "Mention bien",
      value: "mention_bien",
    },
    {
      label: "Mention très bien",
      value: "mention_tres_bien",
    },
    {
      label: "Mention très bien avec félicitations du jury",
      value: "mention_tres_bien_felicitations_jury",
    },
    {
      label: "Autre",
      value: "non_renseignee",
    },
  ],
  // https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006526701
  groupeSpecialitesFormation: {
    specialites_plurivalentes_sanitaires_et_sociales: {
      label: "Sanitaire et social",
      value: "groupe_330",
    },
    specialites_pluritechnologiques_genie_civil_construction_bois: {
      label: "Génie civil, construction, bois",
      value: "groupe_230",
    },
    autre: {
      label: "Autre",
      value: "aucun",
    },
  },
}
