import { Grist } from "../lib/grist"
import fs from "fs"
import path from "path"
import { GristIncitationsCovoiturageResponse } from "../lib/types/download-incitations-covoiturage.js"
import { missingInstitutionsCovoiturageBenefit } from "./generate-missing-institutions"
import covoiturageBenefitJSON from "../data/benefits/dynamic/incitations-covoiturage.json" assert { type: "json" }
const __dirname = new URL(".", import.meta.url).pathname

const noDownload = process.argv.includes("--no-download")

async function main() {
  let covoiturageBenefit
  if (!noDownload) {
    if (!process.env.GRIST_COVOITURAGE_DOC_ID) {
      throw new Error("Missing GRIST_DOC_COVOITURAGE_ID")
    }
    if (!process.env.GRIST_API_KEY) {
      throw new Error("Missing GRIST_API_KEY")
    }
    const gristAPI = Grist(
      process.env.GRIST_COVOITURAGE_DOC_ID,
      process.env.GRIST_API_KEY
    )

    const user = await gristAPI.getConnectedUser()
    console.log(`Connected as ${user.name}.`)

    //Données issue du fichier en Open Data mais avec des informations supplémentaires sur Grist
    //https://www.data.gouv.fr/fr/datasets/conditions-des-campagnes-dincitation-financiere-au-covoiturage/
    const incitationsCovoiturages: GristIncitationsCovoiturageResponse =
      await gristAPI.get({
        passager_gratuite: ["Oui"],
        passager_eligible_gratuite: ["Tous"],
        passager_montant_ticket: ["Gratuit%C3%A9"],
        Expire: ["false"],
        type: ["aom"],
      })

    covoiturageBenefit = incitationsCovoiturages.records.map((record) => {
      const row = record.fields

      return {
        link: row["lien_page_collectivite"],
        code_siren: String(row["code_SIREN"]),
        nom_plateforme:
          row["nom_plateforme"] !== null ? row["nom_plateforme"] : "",
        operateurs: row["operateurs"],
        zone_sens_des_trajets: row["zone_sens_des_trajets"].toLowerCase(),
        conducteur_montant_max_par_mois:
          row["conducteur_montant_max_par_mois"] !== ""
            ? parseFloat(row["conducteur_montant_max_par_mois"])
            : 0,
        conducteur_montant_min_par_passager: parseFloat(
          row["conducteur_montant_min_par_passager"]
        ),
        conducteur_montant_max_par_passager:
          row["conducteur_montant_max_par_passager"] !== ""
            ? parseFloat(row["conducteur_montant_max_par_passager"])
            : 0,
        trajet_longueur_max: row["trajet_longueur_max"],
        trajet_longueur_min: row["trajet_longueur_min"],
        passager_trajets_max_par_mois:
          row["passager_trajets_max_par_mois"] !== ""
            ? parseInt(row["passager_trajets_max_par_mois"])
            : 0,
      }
    })
  } else {
    // Récupération de la dernière version collecté depuis Grist
    covoiturageBenefit = covoiturageBenefitJSON
  }

  const countOccurencyCodeSiren = covoiturageBenefit.reduce((a, e) => {
    a[e.code_siren] = ++a[e.code_siren] || 0
    return a
  }, {})

  const duplicateRow = covoiturageBenefit.filter(
    (e) => countOccurencyCodeSiren[e.code_siren]
  )
  if (!duplicateRow.length) {
    if (!noDownload) {
      const incitationJson = path.join(
        __dirname,
        "../data/benefits/dynamic/incitations-covoiturage.json"
      )

      fs.writeFile(
        incitationJson,
        JSON.stringify(covoiturageBenefit, null, 2),
        (err) => {
          if (err) console.log(err)
        }
      )
    }

    missingInstitutionsCovoiturageBenefit(covoiturageBenefit)
  } else {
    console.error("Incitations covoiturage dupliquées", duplicateRow)
  }
}

main()
