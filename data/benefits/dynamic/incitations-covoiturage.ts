import { Institution } from "../../../data/types/institutions.d.js"
import { CovoiturageBenefit } from "../../../data/types/benefits.d.js"
import { capitalize, uncapitalize } from "../../../lib/utils.js"
import benefits from "./incitations-covoiturage.json" assert { type: "json" }

export default function buildIncitationsCovoiturage(
  institutions: Institution[]
): CovoiturageBenefit[] {
  try {
    const formattedBenefits: CovoiturageBenefit[] = []
    benefits.map((b) => {
      const institution = institutions.find(
        (i) => i.code_siren === b.code_siren
      )
      if (!institution) {
        return null
      }

      const prefixFormat = institution?.prefix
        ? institution?.prefix + (institution.prefix === "d'" ? "" : " ")
        : ""

      const prefixSansDe =
        (institution?.type === "departement" && !institution.prefix
          ? "le "
          : "") + prefixFormat.replace("de ", "").replace("d'", "")

      const prefixTitle =
        institution?.type === "departement" && !institution?.prefix
          ? "du "
          : prefixFormat

      let gainConducteur = ` Vous êtes conductrice ou conducteur ? `
      if (
        b.conducteur_montant_min_par_passager !==
        b.conducteur_montant_max_par_passager
      ) {
        gainConducteur += `Recevez entre ${b.conducteur_montant_min_par_passager} € et ${b.conducteur_montant_max_par_passager} € par trajet et par passager selon la distance parcourue`
      } else {
        gainConducteur += `Vous êtes indemnisé ${b.conducteur_montant_min_par_passager} € par trajet et par passager selon la distance parcourue`
      }

      if (b.conducteur_montant_max_par_mois) {
        gainConducteur += ` dans la limite de ${b.conducteur_montant_max_par_mois} € de gain par mois`
      }

      const institutionLabel =
        institution?.type === "departement"
          ? uncapitalize(institution?.label)
          : institution?.label

      const operateur =
        (!b.nom_plateforme
          ? ` ` + b.operateurs
          : b.nom_plateforme + ` , opérée par ` + b.operateurs) + `.`

      formattedBenefits.push({
        label: `Incitation au covoiturage ${prefixTitle}${institutionLabel}`,
        type: "bool",
        description:
          `${capitalize(prefixSansDe)}${institutionLabel}
          subventionne tous vos trajets réservés depuis l’application ` +
          operateur +
          gainConducteur +
          `. Vous êtes passagère ou passager ? Bénéficiez de ${
            b.passager_trajets_max_par_mois / 30
          } trajets gratuits par jour.`,
        id: `${institution?.slug.replace(
          /_/g,
          "-"
        )}-incitations-covoiturage-eligibilite`,
        conditions: [
          `Télécharger l'application mobile ${operateur}`,
          `Réaliser votre trajet au départ ${b.zone_sens_des_trajets} à l’arrivée ${prefixTitle}${institutionLabel}.`,
          `Effectuer un trajet dont la distance est comprise entre ${b.trajet_longueur_min} et ${b.trajet_longueur_max} kilomètres.`,
        ],
        institution: institution?.slug,
        prefix: "l'",
        periodicite: "ponctuelle",
        link: b.link,
        source: "javascript",
        conditions_generales: [
          {
            type: "attached_to_institution",
          },
        ],
      })
    })
    return formattedBenefits.filter((benefit) => benefit !== null)
  } catch (error: any) {
    console.error(
      "Erreur lors de la construction des incitations co-voiturage",
      error.message
    )
    throw error
  }
}
