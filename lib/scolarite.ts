import {
  GroupeSpecialite,
  MentionBaccalaureat,
  Scolarite,
  ScolariteEnfant,
} from "./enums/scolarite.js"
export default {
  scolariteTypes: [
    {
      value: Scolarite.College,
      label: "Au collège",
    },
    {
      value: Scolarite.Lycee,
      label: "Au lycée / En CAP / En CPA",
    },
    {
      value: Scolarite.EnseignementSuperieur,
      label: "Dans l'enseignement supérieur",
    },
    {
      value: Scolarite.GrandeEcoleDuNumerique,
      label: "Dans une grande école du numérique",
    },
    {
      value: Scolarite.Inconnue,
      label: "Autre",
    },
  ],
  scolariteEnfantTypes: [
    {
      value: ScolariteEnfant.Maternelle,
      label: "À la maternelle",
    },
    {
      value: ScolariteEnfant.Primaire,
      label: "À l'école primaire",
    },
  ],
  mentionsBaccalaureat: [
    {
      label: "Mention assez bien",
      value: MentionBaccalaureat.MentionAssezBien,
    },
    {
      label: "Mention bien",
      value: MentionBaccalaureat.MentionBien,
    },
    {
      label: "Mention très bien",
      value: MentionBaccalaureat.MentionTresBien,
    },
    {
      label: "Mention très bien avec félicitations du jury",
      value: MentionBaccalaureat.MentionTresBienFelicitationsJury,
    },
    {
      label: "Autre",
      value: MentionBaccalaureat.NonRenseignee,
    },
  ],
  // https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006526701
  groupeSpecialitesFormation: {
    specialites_plurivalentes_sanitaires_et_sociales: {
      label: "Sanitaire et social",
      value: GroupeSpecialite.Groupe330,
    },
    specialites_pluritechnologiques_genie_civil_construction_bois: {
      label: "Génie civil, construction, bois",
      value: GroupeSpecialite.Groupe230,
    },
    autre: {
      label: "Autre",
      value: GroupeSpecialite.Aucun,
    },
  },
}
