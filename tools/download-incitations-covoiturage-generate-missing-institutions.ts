import { Grist } from "../lib/grist"
import fs from "fs"
import path from "path"
const __dirname = new URL(".", import.meta.url).pathname

async function main() {
  if (!process.env.GRIST_DOC_ID) {
    throw new Error("Missing GRIST_DOC_ID")
  }
  if (!process.env.GRIST_API_KEY) {
    throw new Error("Missing GRIST_API_KEY")
  }
  const gristAPI = Grist(process.env.GRIST_DOC_ID, process.env.GRIST_API_KEY)

  const user = await gristAPI.getConnectedUser()
  console.log(`Connected as ${user.name}.`)

  const incitationsCovoiturages: GristIncitationsCoVoiturageResponse =
    await gristAPI.get({
      passager_gratuite: ["Oui"],
      passager_eligible_gratuite: ["Tous"],
      passager_montant_ticket: ["Gratuit%C3%A9"],
      Expire: ["false"],
    })

  const resultatJson = incitationsCovoiturages.records.map((record) => {
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

  const countOccurencyCodeSiren = resultatJson.reduce((a, e) => {
    a[e.code_siren] = ++a[e.code_siren] || 0
    return a
  }, {})

  const duplicateRow = resultatJson.filter(
    (e) => countOccurencyCodeSiren[e.code_siren]
  )
  if (!duplicateRow.length) {
    const incitationJson = path.join(
      __dirname,
      "../data/benefits/dynamic/incitations-covoiturage.json"
    )

    fs.writeFile(
      incitationJson,
      JSON.stringify(resultatJson, null, 2),
      (err) => {
        if (err) console.log(err)
      }
    )
  } else {
    console.error("Incitations covoiturage dupliquées", duplicateRow)
  }
}

main()
