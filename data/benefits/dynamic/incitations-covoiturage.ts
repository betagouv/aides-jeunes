import { Institution } from "../../../data/types/institutions.d.js"
import { CoVoiturageBenefit } from "../../../data/types/benefits"
import { capitalize, uncapitalize } from "../../../lib/utils.js"

export function buildIncitationsCovoiturage(
  institutions: Institution[]
): CoVoiturageBenefit[] {
  benefits.forEach(
    (b) =>
      (b.institution = institutions.find((i) => i.code_siren === b.code_siren))
  )

  // const siren = benefits
  //   .filter((b) => !b.institution?.prefix)
  //   .map((b) => {
  //     return { slug: b.institution?.slug, siren: b.code_siren }
  //   })
  //
  // console.log(JSON.stringify(siren))

  return benefits
    .filter((b) => b.institution)
    .map((b) => {
      const prefixFormat = b.institution?.prefix
        ? b.institution?.prefix + (b.institution.prefix === "d'" ? "" : " ")
        : ""

      const prefixSansDe =
        (b.institution?.type === "departement" && !b.institution.prefix
          ? "le "
          : "") + prefixFormat.replace("de ", "").replace("d'", "")

      const prefixTitle =
        b.institution?.type === "departement" && !b.institution?.prefix
          ? "du "
          : prefixFormat

      let gainConducteur = ` Vous êtes conductrice ou conducteur ? `
      if (b.conducteur_montant_max_par_mois) {
        if (
          b.conducteur_montant_min_par_passager !==
          b.conducteur_montant_max_par_passager
        ) {
          gainConducteur += `Vous êtes indemnisé entre ${b.conducteur_montant_min_par_passager}€ et ${b.conducteur_montant_max_par_passager}€ par trajet et par passager, selon la distance parcourue, dans la limite de ${b.conducteur_montant_max_par_mois} € de gain par mois. `
        } else {
          gainConducteur += `Vous êtes indemnisé entre ${b.conducteur_montant_min_par_passager}€ et ${b.conducteur_montant_max_par_passager}€ par trajet et par passager, selon la distance parcourue. `
        }
      } else if (
        b.conducteur_montant_min_par_passager ===
        b.conducteur_montant_max_par_passager
      ) {
        gainConducteur += `Vous êtes indemnisé ${b.conducteur_montant_min_par_passager}€ par trajet et par passager, selon la distance parcourue. `
      } else {
        gainConducteur = ""
      }

      const institutionLabel =
        b.institution?.type === "departement"
          ? uncapitalize(b.institution?.label)
          : b.institution?.label

      const operateur =
        (!b.nom_plateforme
          ? ` ` + b.operateurs
          : b.nom_plateforme + ` , opérée par ` + b.operateurs) + `.`

      return {
        label: `Incitation au covoiturage ${prefixTitle}${institutionLabel}`,
        type: "bool",
        description:
          `${capitalize(prefixSansDe)}${institutionLabel}
          subventionne tous vos trajets réservés depuis l’application ` +
          operateur +
          gainConducteur +
          `Vous êtes passagère ou passager ? Bénéficiez de ${
            b.passager_trajets_max_par_mois / 30
          } trajets gratuits par jour.`,
        id: `${b.institution?.slug.replace(
          /_/g,
          "-"
        )}-incitations-covoiturage-eligibilite`,
        conditions: [
          `Télécharger l'application mobile ${operateur}`,
          `Réaliser votre trajet au départ ${b.zone_sens_des_trajets} à l’arrivée ${prefixTitle} ${b.institution?.label}.`,
          `Effectuer un trajet dont la distance est comprise entre ${b.trajet_longueur_min} et ${b.trajet_longueur_max} kilomètres.`,
        ],
        institution: b.institution?.slug,
        prefix: "l'",
        periodicite: "ponctuelle",
        link: b.link,
        source: "javascript",
        conditions_generales: [
          {
            type: "attached_to_institution",
          },
        ],
      }
    })
}

const benefits: {
  code_siren: string
  link: string
  nom_plateforme: string
  operateurs: string
  institution?: Institution
  zone_sens_des_trajets: string
  conducteur_montant_max_par_mois?: number
  conducteur_montant_min_par_passager?: number
  conducteur_montant_max_par_passager?: number
  trajet_longueur_min: number
  trajet_longueur_max: number
  passager_trajets_max_par_mois: number
}[] = [
  {
    link: "https://www.agglo-sarreguemines.fr/covoiturage/",
    code_siren: "200070746",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 120.0,
    conducteur_montant_min_par_passager: 2.0,
    conducteur_montant_max_par_passager: 4.0,
    trajet_longueur_max: 80,
    trajet_longueur_min: 2,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.intercauxvexin.fr/fr/news/Covoiturage",
    code_siren: "200070449",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 150.0,
    conducteur_montant_min_par_passager: 1.5,
    conducteur_montant_max_par_passager: 3.0,
    trajet_longueur_max: 80,
    trajet_longueur_min: 2,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.vitrecommunaute.org/covoiturage/",
    code_siren: "243500808",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 120.0,
    conducteur_montant_min_par_passager: 1.0,
    conducteur_montant_max_par_passager: 2.0,
    trajet_longueur_max: 60,
    trajet_longueur_min: 2,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.vallons-de-haute-bretagne-communaute.fr/le-covoiturage/",
    code_siren: "200043990",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 150.0,
    conducteur_montant_min_par_passager: 1.5,
    conducteur_montant_max_par_passager: 3.0,
    trajet_longueur_max: 80,
    trajet_longueur_min: 2,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://jeromeviaud.com/la-ville-et-la-communaute-dagglomeration-du-pays-de-grasse-encouragent-la-politique-de-covoiturage-avec-le-dispositif-klaxit-tous-covoitureurs/",
    code_siren: "200039857",
    nom_plateforme: "",
    operateurs: "Klaxit",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 150.0,
    conducteur_montant_min_par_passager: 1.5,
    conducteur_montant_max_par_passager: 3.0,
    trajet_longueur_max: 80,
    trajet_longueur_min: 2,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.agglo-laval.fr/utile-au-quotidien/transports-et-mobilites/le-covoiturage",
    code_siren: "200083392",
    nom_plateforme: "",
    operateurs: "Klaxit",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 120.0,
    conducteur_montant_min_par_passager: 0.5,
    conducteur_montant_max_par_passager: 0.5,
    trajet_longueur_max: 80,
    trajet_longueur_min: 5,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.paysdessorgues.fr/le-covoiturage",
    code_siren: "248400319",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 150.0,
    conducteur_montant_min_par_passager: 1.0,
    conducteur_montant_max_par_passager: 2.0,
    trajet_longueur_max: 80,
    trajet_longueur_min: 2,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.paysdesherbiers.fr/le-covoiturage-avec-klaxit/#:~:text=Pour%20continuer%20sur%20cette%20dynamique,\u00e0%20destination%20de%20sa%20population.",
    code_siren: "248500621",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 120.0,
    conducteur_montant_min_par_passager: 0.5,
    conducteur_montant_max_par_passager: 0.5,
    trajet_longueur_max: 80,
    trajet_longueur_min: 5,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.ca-ajaccien.corsica/covoiturer-en-pays-ajaccien-pratique-economique-et-ecologique/",
    code_siren: "242010056",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 150.0,
    conducteur_montant_min_par_passager: 2.5,
    conducteur_montant_max_par_passager: 1.5,
    trajet_longueur_max: 80,
    trajet_longueur_min: 2,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.gardrhodanien.fr/services/transport/adoptez-une-mobilite-plus-verte-et-economique/#:~:text=Les%20conducteurs%20sont%20r\u00e9mun\u00e9r\u00e9s%20\u00e0,Sorgue%2C%20Sorgues%2C%20Cavaillon).",
    code_siren: "200034692",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 150.0,
    conducteur_montant_min_par_passager: 1.0,
    conducteur_montant_max_par_passager: 2.0,
    trajet_longueur_max: 80,
    trajet_longueur_min: 2,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.luberonmontsdevaucluse.fr/avec-blablacar-daily-lmv-finance-vos-covoiturages/",
    code_siren: "809693906",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 150.0,
    conducteur_montant_min_par_passager: 1.0,
    conducteur_montant_max_par_passager: 2.0,
    trajet_longueur_max: 80,
    trajet_longueur_min: 2,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.paysflechois.fr/actualites/le-covoiturage-facilite/",
    code_siren: "247200348",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 120.0,
    conducteur_montant_min_par_passager: 0.5,
    conducteur_montant_max_par_passager: 0.5,
    trajet_longueur_max: 80,
    trajet_longueur_min: 5,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.valleesduhautanjou.fr/le-covoiturage/",
    code_siren: "200071868",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 120.0,
    conducteur_montant_min_par_passager: 0.5,
    conducteur_montant_max_par_passager: 0.5,
    trajet_longueur_max: 80,
    trajet_longueur_min: 5,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://loire-layon-aubance.fr/vivre-habiter/mes-demarches-de-mobilite/covoiturage/",
    code_siren: "200071553",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 120.0,
    conducteur_montant_min_par_passager: 0.5,
    conducteur_montant_max_par_passager: 0.5,
    trajet_longueur_max: 80,
    trajet_longueur_min: 5,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.communaute.paysdechateaugiron.bzh/covoiturage/#:~:text=Covoiturages%20subventionn\u00e9s%20pour%20tous%20les,fonction%20de%20la%20distance%20parcourue.",
    code_siren: "243500659",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 150.0,
    conducteur_montant_min_par_passager: 1.5,
    conducteur_montant_max_par_passager: 3.0,
    trajet_longueur_max: 80,
    trajet_longueur_min: 2,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.mayenne-communaute.net/a-votre-service/mobilites/mayenne-communaute-paie-vos-co-voiturages/",
    code_siren: "200055887",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 120.0,
    conducteur_montant_min_par_passager: 0.5,
    conducteur_montant_max_par_passager: 0.5,
    trajet_longueur_max: 80,
    trajet_longueur_min: 5,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://epernay-agglo.fr/lagglo-soutient-le-developpement-du-covoiturage#:~:text=Pour%20les%20conducteurs%2C%20les%20covoits,covoiturage%2C%20selon%20la%20distance%20parcourue.",
    code_siren: "200067684",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 120.0,
    conducteur_montant_min_par_passager: 2.0,
    conducteur_montant_max_par_passager: 3.0,
    trajet_longueur_max: 80,
    trajet_longueur_min: 2,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.joue-labbe-72.fr/actualites/412727",
    code_siren: "200051944",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 120.0,
    conducteur_montant_min_par_passager: 0.5,
    conducteur_montant_max_par_passager: 0.5,
    trajet_longueur_max: 80,
    trajet_longueur_min: 5,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.lacove.fr/covoiturage.html",
    code_siren: "248400053",
    nom_plateforme: "",
    operateurs: "Klaxit",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 120.0,
    conducteur_montant_min_par_passager: 1.0,
    conducteur_montant_max_par_passager: 2.0,
    trajet_longueur_max: 80,
    trajet_longueur_min: 2,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://esterelcotedazur-agglo.fr/transports_et_mobilites/se_deplacer_en_voiture/le-covoiturage/#:~:text=Le%20covoiturage%20devient%20gratuit%20gr\u00e2ce,le%201er%20f\u00e9vrier%202024%20!",
    code_siren: "200035319",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 150.0,
    conducteur_montant_min_par_passager: 1.5,
    conducteur_montant_max_par_passager: 3.0,
    trajet_longueur_max: 80,
    trajet_longueur_min: 2,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.gouv.mc/Action-Gouvernementale/La-Qualite-de-Vie/Actualites/Hausse-du-prix-des-carburants-Monaco-finance-vos-covoiturages-via-l-application-Klaxit#:~:text=Ainsi%2C%20depuis%20septembre%202020%2C%20tous,\u20ac%2Fmois%20en%20covoiturant%20r\u00e9guli\u00e8rement.",
    code_siren: "809868276",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 150.0,
    conducteur_montant_min_par_passager: 1.5,
    conducteur_montant_max_par_passager: 3.0,
    trajet_longueur_max: 80,
    trajet_longueur_min: 2,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.carcassonne-agglo.fr/fr/actualites/deplacez-vous-autrement-sur-le-territoire.html",
    code_siren: "200035715",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 150.0,
    conducteur_montant_min_par_passager: 2.0,
    conducteur_montant_max_par_passager: 4.0,
    trajet_longueur_max: 80,
    trajet_longueur_min: 2,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://sorguesducomtat.fr/fr/infos/35/le-covoiturage-avec-blablacardaily#:~:text=-%20les%20passagers%20voyagent%20gratuitement%2C,fonction%20de%20la%20distance%20parcourue).",
    code_siren: "248400293",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 150.0,
    conducteur_montant_min_par_passager: 1.0,
    conducteur_montant_max_par_passager: 2.0,
    trajet_longueur_max: 80,
    trajet_longueur_min: 2,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.grandavignon.fr/fr/actualites/covoiturage-grand-avignon",
    code_siren: "248400251",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 150.0,
    conducteur_montant_min_par_passager: 1.0,
    conducteur_montant_max_par_passager: 2.0,
    trajet_longueur_max: 80,
    trajet_longueur_min: 2,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.communaute-paysbasque.fr/a-la-une-2/actualites/actualite/covoiturage-au-pays-basque-les-conducteurs-indemnises",
    code_siren: "256401605",
    nom_plateforme: "",
    operateurs: "Karos, BlablaCarDaily, Klaxit",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 150.0,
    conducteur_montant_min_par_passager: 2.0,
    conducteur_montant_max_par_passager: 3.0,
    trajet_longueur_max: 80,
    trajet_longueur_min: 2,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.beauvaisis.fr/actualites/actualites-du-beauvaisis/klaxit-arrive-dans-le-beauvaisis.html",
    code_siren: "200067999",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 150.0,
    conducteur_montant_min_par_passager: 1.5,
    conducteur_montant_max_par_passager: 3.0,
    trajet_longueur_max: 80,
    trajet_longueur_min: 2,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.atmb.com/telepeage-tarifs/nos_abonnements_telepeage_atmb/je-covoit-encourager-le-covoiturage-en-haute-savoie/",
    code_siren: "582056511",
    nom_plateforme: "",
    operateurs: "Karos, BlablaCarDaily, Klaxit",
    zone_sens_des_trajets: "et",
    conducteur_montant_max_par_mois: 50.0,
    conducteur_montant_min_par_passager: 2.0,
    conducteur_montant_max_par_passager: 4.0,
    trajet_longueur_max: 80,
    trajet_longueur_min: 4,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.agglo-sarreguemines.fr/covoiturage/",
    code_siren: "200070746",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 150.0,
    conducteur_montant_min_par_passager: 1.0,
    conducteur_montant_max_par_passager: 4.0,
    trajet_longueur_max: 80,
    trajet_longueur_min: 2,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.agglo-sophiaantipolis.fr/vivre-et-habiter/se-deplacer/le-covoiturage",
    code_siren: "240600585",
    nom_plateforme: "",
    operateurs: "Klaxit",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 150.0,
    conducteur_montant_min_par_passager: 1.0,
    conducteur_montant_max_par_passager: 2.0,
    trajet_longueur_max: 80,
    trajet_longueur_min: 2,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://paysdelor.fr/vivre-ici/transports/covoiturage/",
    code_siren: "243400470",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 150.0,
    conducteur_montant_min_par_passager: 1.0,
    conducteur_montant_max_par_passager: 2.0,
    trajet_longueur_max: 80,
    trajet_longueur_min: 5,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.agglopole.fr/bougerdecouvrir/se-deplacer/le-covoiturage/",
    code_siren: "200066355",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 150.0,
    conducteur_montant_min_par_passager: 1.0,
    conducteur_montant_max_par_passager: 2.0,
    trajet_longueur_max: 80,
    trajet_longueur_min: 5,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.mairie-hauteluce.fr/covoiturage/",
    code_siren: "200068997",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 120.0,
    conducteur_montant_min_par_passager: 1.5,
    conducteur_montant_max_par_passager: 3.0,
    trajet_longueur_max: 80,
    trajet_longueur_min: 5,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.montpellier3m.fr/vivre-transport/covoiturez-avec-blablacar-daily#:~:text=En%20s%27appuyant%20sur%20le,via%20l%27application%20BlaBlaCar%20Daily.",
    code_siren: "243400017",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 150.0,
    conducteur_montant_min_par_passager: 1.0,
    conducteur_montant_max_par_passager: 2.0,
    trajet_longueur_max: 80,
    trajet_longueur_min: 5,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.artois-mobilites.fr/le-covoiturage-tadao-avec-blablacar-daily/",
    code_siren: "256204165",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et",
    conducteur_montant_max_par_mois: 150.0,
    conducteur_montant_min_par_passager: 2.0,
    conducteur_montant_max_par_passager: 4.0,
    trajet_longueur_max: 80,
    trajet_longueur_min: 2,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.picardieverte.com/la-ccpv-paie-vos-covoiturages/urbanisme-habitat/mobilite/",
    code_siren: "246000848",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 150.0,
    conducteur_montant_min_par_passager: 1.5,
    conducteur_montant_max_par_passager: 3.0,
    trajet_longueur_max: 80,
    trajet_longueur_min: 2,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://cc-sablons.com/klaxit-lapplication-qui-covoiture/",
    code_siren: "246000582",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 150.0,
    conducteur_montant_min_par_passager: 1.5,
    conducteur_montant_max_par_passager: 3.0,
    trajet_longueur_max: 80,
    trajet_longueur_min: 2,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.essonne.fr/economie-amenagement-mobilites/lactualite-economie-amenagement-mobilites/laide-au-covoiturage-pour-les-18-25-ans-prolongee",
    code_siren: "229102280",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 0.0,
    conducteur_montant_min_par_passager: 0.0,
    conducteur_montant_max_par_passager: 0.0,
    trajet_longueur_max: 80,
    trajet_longueur_min: 2,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://ccgvm.com/covoiturage/",
    code_siren: "245100615",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 150.0,
    conducteur_montant_min_par_passager: 2.0,
    conducteur_montant_max_par_passager: 3.0,
    trajet_longueur_max: 80,
    trajet_longueur_min: 2,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.savoie.fr/web/sw_101242/covoiturez-et-faites-le-plein-d-economies",
    code_siren: "257302216",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et",
    conducteur_montant_max_par_mois: 0,
    conducteur_montant_min_par_passager: 2.0,
    conducteur_montant_max_par_passager: 0,
    trajet_longueur_max: 80,
    trajet_longueur_min: 5,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.coeurdetarentaise.fr/covoiturer-gratuitement-cest-desormais-possible/",
    code_siren: "200023299",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 120.0,
    conducteur_montant_min_par_passager: 1.5,
    conducteur_montant_max_par_passager: 3.0,
    trajet_longueur_max: 150,
    trajet_longueur_min: 5,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.avant-pays-savoyard.com/smaps/project/mobilite-velo/",
    code_siren: "257302182",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 120.0,
    conducteur_montant_min_par_passager: 1.5,
    conducteur_montant_max_par_passager: 3.0,
    trajet_longueur_max: 150,
    trajet_longueur_min: 5,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.hautetarentaise.fr/10433-covoiturage-local.htm",
    code_siren: "247300254",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 120.0,
    conducteur_montant_min_par_passager: 1.5,
    conducteur_montant_max_par_passager: 3.0,
    trajet_longueur_max: 150,
    trajet_longueur_min: 5,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://versantsdaime.fr/accueil/vivre-en-versants-d-aime/cadre-de-vie/rezo-pouce-service-dauto-stop-securise/",
    code_siren: "247300817",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 120.0,
    conducteur_montant_min_par_passager: 1.5,
    conducteur_montant_max_par_passager: 3.0,
    trajet_longueur_max: 150,
    trajet_longueur_min: 5,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.valvanoise.fr/9537-mov-ici-covoiturage-local.htm",
    code_siren: "200040798",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 120.0,
    conducteur_montant_min_par_passager: 1.5,
    conducteur_montant_max_par_passager: 3.0,
    trajet_longueur_max: 150,
    trajet_longueur_min: 5,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://ccva-savoie.com/index.php/vie-pratique-et-services/mobilite",
    code_siren: "247300015",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 120.0,
    conducteur_montant_min_par_passager: 1.5,
    conducteur_montant_max_par_passager: 3.0,
    trajet_longueur_max: 150,
    trajet_longueur_min: 5,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.maugescommunaute.fr/actualites/covoiturage/",
    code_siren: "200060010",
    nom_plateforme: "",
    operateurs: "BlablaCarDaily",
    zone_sens_des_trajets: "et/ou",
    conducteur_montant_max_par_mois: 120.0,
    conducteur_montant_min_par_passager: 0.5,
    conducteur_montant_max_par_passager: 0.5,
    trajet_longueur_max: 80,
    trajet_longueur_min: 5,
    passager_trajets_max_par_mois: 60,
  },
  {
    link: "https://www.evad.fr/la-ccpeva-favorise-le-covoiturage-sur-le-territoire/",
    code_siren: "200071967",
    nom_plateforme: "",
    operateurs: "Karos",
    zone_sens_des_trajets: "et",
    conducteur_montant_max_par_mois: 0,
    conducteur_montant_min_par_passager: 2.0,
    conducteur_montant_max_par_passager: 8.0,
    trajet_longueur_max: 80,
    trajet_longueur_min: 2,
    passager_trajets_max_par_mois: 60,
  },
]
