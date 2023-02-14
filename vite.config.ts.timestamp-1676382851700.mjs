// vite.config.ts
import vue from "file:///Users/valandriani/Code/Beta-gouv-Aides-jeunes/aides-jeunes/node_modules/@vitejs/plugin-vue/dist/index.mjs"
import legacy from "file:///Users/valandriani/Code/Beta-gouv-Aides-jeunes/aides-jeunes/node_modules/@vitejs/plugin-legacy/dist/index.mjs"
import { createHtmlPlugin } from "file:///Users/valandriani/Code/Beta-gouv-Aides-jeunes/aides-jeunes/node_modules/vite-plugin-html/dist/index.mjs"
import path2 from "path"
import {
  defineConfig,
  loadEnv,
} from "file:///Users/valandriani/Code/Beta-gouv-Aides-jeunes/aides-jeunes/node_modules/vite/dist/node/index.js"

// backend/config/index.ts
var __vite_injected_original_import_meta_url =
  "file:///Users/valandriani/Code/Beta-gouv-Aides-jeunes/aides-jeunes/backend/config/index.ts"
var __dirname = new URL(".", __vite_injected_original_import_meta_url).pathname
var env = process.env.NODE_ENV || "development"
var all = {
  env,
  animation: {
    delay: Number(process.env.ANIMATION_DELAY) || 300,
  },
  baseURL:
    process.env.MES_AIDES_ROOT_URL ||
    "https://mes-aides.1jeune1solution.beta.gouv.fr",
  openfiscaURL:
    process.env.OPENFISCA_INTERNAL_ROOT_URL || "http://localhost:2000",
  openfiscaAxeURL: "https://betagouv.github.io/mes-aides-changent",
  openfiscaPublicURL:
    process.env.OPENFISCA_PUBLIC_ROOT_URL ||
    "https://openfisca.mes-aides.1jeune1solution.beta.gouv.fr",
  openfiscaTracerURL: "https://openfisca.github.io/tracer",
  netlifyContributionURL:
    process.env.NETLIFY_CONTRIBUTION_URL ||
    "https://contribuer-aides-jeunes.netlify.app",
  sendInBlue: {
    apiKey: process.env.SEND_IN_BLUE_PRIVATE_KEY || "privateKey",
  },
  github: {
    repository_url: "https://github.com/betagouv/aides-jeunes",
    access_token_url: "https://github.com/login/oauth/access_token",
    authenticated_url: "https://api.github.com/user",
    authorize_url: "https://github.com/login/oauth/authorize",
    client_secret: process.env.GITHUB_CLIENT_SECRET || "",
    client_id: process.env.GITHUB_CLIENT_ID || "",
    authorized_users: [
      "alizeeeeeee",
      "Allan-CodeWorks",
      "Cugniere",
      "guillett",
      "shamzic",
      "yasmine-glitch",
      "Valandr",
    ],
  },
  matomo: {
    id: Number(process.env.MATOMO_ID) || 165,
  },
  statistics: {
    url:
      process.env.VITE_STATS_URL ||
      "https://aides-jeunes-stats-recorder.osc-fr1.scalingo.io/benefits",
    version: Number(process.env.VITE_STATS_VERSION) || 2,
  },
  mongo: {
    uri: process.env.MONGODB_URL || "mongodb://localhost/db_aides_jeunes",
    options: {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    },
  },
  sessionSecret: process.env.SESSION_SECRET || "fghjdfjkdf785a-jreu",
  mattermost_post_url: process.env.MATTERMOST_POST_URL || "",
  iframeTitle:
    "\xC9valuez vos droits aux aides avec le simulateur de 1jeune1solution",
}
var override = {}
try {
  const loaddedConfiguration = await import(`${__dirname}${env}.js`)
  override =
    loaddedConfiguration == null ? void 0 : loaddedConfiguration.default
  if (env !== "test") {
    console.info(`Using specific configuration for ${env}.`)
  }
} catch (e) {
  console.warn(`No specific configuration for ${env}`)
}
var config = Object.assign(all, override)
var config_default = config

// data/all.ts
import { existsSync } from "node:fs"

// data/benefits/additional-attributes/index.ts
import dayjs from "file:///Users/valandriani/Code/Beta-gouv-Aides-jeunes/aides-jeunes/node_modules/dayjs/dayjs.min.js"

// data/benefits/additional-attributes/occitanie-carte-transport-scolaire-lio.ts
var occitanie_carte_transport_scolaire_lio_default = {
  customization: {
    D09: {
      link: "https://lio.laregion.fr/transports-ariege-scolaire",
      teleservice: "https://mes-transports.laregion.fr/ut09/usager/",
    },
    D11: {
      link: "https://lio.laregion.fr/transports-aude-scolaire",
      teleservice: "https://mes-transports.laregion.fr/ut11/usager/",
    },
    D12: {
      link: "https://lio.laregion.fr/transports-aveyron-scolaire",
      teleservice: "https://mes-transports.laregion.fr/ut12/usager/",
    },
    D30: {
      link: "https://lio.laregion.fr/transports-gard-scolaire",
      teleservice: "https://mes-transports.laregion.fr/ut30/usager/",
    },
    D31: {
      link: "https://lio.laregion.fr/Transports-scolaires-en-Haute-Garonne",
      teleservice: "https://www.transportsscolaires.haute-garonne.fr/",
    },
    D32: {
      link: "https://lio.laregion.fr/transports-gers-scolaire",
      teleservice: "https://mes-transports.laregion.fr/ut32/usager/",
    },
    D34: {
      link: "https://lio.laregion.fr/transport-herault-scolaire",
      teleservice:
        "https://www.herault-transport.fr/lignes-scolaires/inscriptions",
    },
    D46: {
      link: "https://lio.laregion.fr/transports-lot-scolaire",
      teleservice: "https://mes-transports.laregion.fr/ut46/usager/",
    },
    D48: {
      link: "https://lio.laregion.fr/transports-lozere-scolaire",
      teleservice: "https://mes-transports.laregion.fr/ut48/usager/",
    },
    D65: {
      link: "https://lio.laregion.fr/transport-hautespyrenees-scolaire",
      teleservice: "https://mes-transports.laregion.fr/ut65/usager/",
    },
    D66: {
      link: "https://lio.laregion.fr/transports-pyrenees-orientales-scolaire",
      teleservice: "https://mes-transports.laregion.fr/ut66/usager/",
    },
    D81: {
      link: "https://lio.laregion.fr/Transports-scolaires-dans-le-Tarn-Annee-scolaire-2020-2021-36821",
      teleservice: "https://www.federteep.org/inscription",
    },
    D82: {
      link: "https://lio.laregion.fr/transports-tarnetgaronne-scolaire",
      teleservice: "https://mes-transports.laregion.fr/ut82/usager/",
    },
  },
}

// data/benefits/additional-attributes/index.ts
var additionalBenefitAttributes = {
  css_participation_forfaitaire: {
    extra: [
      {
        id: "cmu_c",
        entity: "familles",
        type: "bool",
        openfiscaPeriod: "thisMonth",
      },
    ],
    compute: function (result, period) {
      var _a2, _b
      return ((_a2 = result.cmu_c) == null ? void 0 : _a2[period])
        ? true
        : ((_b = result.css_participation_forfaitaire) == null
            ? void 0
            : _b[period]) || 0
    },
  },
  rsa: {
    labelFunction: function (b) {
      return `${b.label} pour un montant de ${b.montant} \u20AC / mois pendant 3 mois`
    },
    uncomputability: {
      tns: {
        reason: {
          user: "vous avez des revenus en tant qu\u2019ind\xE9pendant\xB7e",
          admin:
            "le demandeur a des revenus en tant qu\u2019ind\xE9pendant\xB7e",
        },
        solution:
          'Vous pouvez demander \xE0 b\xE9n\xE9ficier du RSA, mais c\u2019est le pr\xE9sident de votre conseil d\xE9partemental qui <a target="_blank" rel="noopener" title="Article R262-23 du code de l\u2019action sociale - Nouvelle fen\xEAtre" href="https://www.legifrance.gouv.fr/affichCodeArticle.do?idArticle=LEGIARTI000028251799&cidTexte=LEGITEXT000006074069">d\xE9cidera</a> de la mani\xE8re dont vos revenus non salari\xE9s impacteront le montant de votre aide.',
      },
      conjoint_tns: {
        reason: {
          user: "votre conjoint\xB7e a des revenus en tant qu\u2019ind\xE9pendant\xB7e",
          admin:
            "le conjoint du demandeur a des revenus en tant qu\u2019ind\xE9pendant\xB7e",
        },
        solution:
          'Vous pouvez demander \xE0 b\xE9n\xE9ficier du RSA, mais c\u2019est le pr\xE9sident de votre conseil d\xE9partemental qui <a target="_blank" rel="noopener" title="Article R262-23 du code de l\u2019action sociale - Nouvelle fen\xEAtre" href="https://www.legifrance.gouv.fr/affichCodeArticle.do?idArticle=LEGIARTI000028251799&cidTexte=LEGITEXT000006074069">d\xE9cidera</a> de la mani\xE8re dont les revenus non salari\xE9s de votre conjoint\xB7e impacteront le montant de votre aide.',
      },
    },
    customization: {
      D93: {
        link: "https://www.seine-saint-denis.fr/IMG/pdf/guide_rsa_a5_8p-2014.pdf",
      },
      D75: {
        form: void 0,
        teleservice:
          "https://www.paris.fr/rsa#ou-et-comment-faire-une-demande-de-rsa_6",
      },
      M200046977: {
        institution: {
          imgSrc: "img/logo_lyon_metropole.png",
        },
        link: "https://www.grandlyon.com/services/rsa-mode-d-emploi.html",
      },
    },
  },
  "cohesion-territoires-conseillers-numeriques-france-services": {
    instructionsGenerator: (codePostal) => {
      if (!codePostal) {
        return "https://cartographie.conseiller-numerique.gouv.fr/"
      } else {
        return `https://cartographie.conseiller-numerique.gouv.fr/?address=${codePostal}`
      }
    },
  },
  aide_logement: {
    computeUnexpectedAmount: (situation) => {
      var _a2, _b
      const salary = (
        (_a2 = situation == null ? void 0 : situation.demandeur) == null
          ? void 0
          : _a2.salaire_net
      )
        ? Object.values(situation.demandeur.salaire_net).reduce(
            (acc, value) => acc + value,
            0
          )
        : 0
      return (
        ((_b = situation == null ? void 0 : situation.demandeur) == null
          ? void 0
          : _b.activite) === "etudiant" && salary >= 7e3
      )
    },
    uncomputability: {
      primo_accedant: {
        reason: {
          user: 'vous \xEAtes <abbr title="Non propri\xE9taire de votre r\xE9sidence principale dans les deux ann\xE9es pr\xE9c\xE9dant l\u2019achat de votre r\xE9sidence actuelle">primo-acc\xE9dant</abbr> \xE0 la propri\xE9t\xE9 de votre r\xE9sidence principale',
          admin:
            "le demandeur est primo-acc\xE9dant de sa r\xE9sidence principale",
        },
        solution:
          'Le <a target="_blank" rel="noopener" title="simulateur de la CAF - Nouvelle fen\xEAtre" href="https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/estimervosdroits/lelogement">simulateur de la CAF</a> pourra estimer vos droits sur la base de la valeur de votre bien.',
      },
      locataire_foyer: {
        reason: {
          user: "vous logez dans un foyer",
          admin: "le demandeur loge dans un foyer",
        },
        solution:
          'Le <a target="_blank" rel="noopener" title="simulateur de la CAF - Nouvelle fen\xEAtre" href="https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/estimervosdroits/lelogement">simulateur de la CAF</a> vous donnera des estimations selon les diff\xE9rentes conventions possibles de votre foyer.',
      },
    },
  },
  ppa: {
    labelFunction: function (b) {
      return `${b.label} pour un montant de ${b.montant} \u20AC / mois pendant 3 mois`
    },
    computeUnexpectedAmount(situation) {
      const menage = situation.menage
      const isProprietaire = ["primo_accedant", "proprietaire"].includes(
        menage.statut_occupation_logement
      )
      return (
        (isProprietaire && menage.loyer > 0) ||
        (menage.statut_occupation_logement === "loge_gratuitement" &&
          menage.participation_frais)
      )
    },
  },
  contrat_engagement_jeune: {
    computeUnexpectedAmount: (situation) => {
      var _a2
      const demandeur = situation.demandeur
      const period =
        situation.dateDeValeur && dayjs(situation.dateDeValeur).format("YYYY")
      return (
        situation.demandeur.habite_chez_parents &&
        ((_a2 = demandeur.enfant_a_charge) == null ? void 0 : _a2[period])
      )
    },
  },
  livret_epargne_populaire_taux: {
    labelFunction: function (b) {
      return `${b.label} avec un taux de ${b.montant}% an ${b.legend}`
    },
    legend: (parameters) =>
      `au lieu de ${
        parameters["taxation_capital.epargne.livret_a.taux"] * 100
      }%`,
  },
  occitanie_carte_transport_scolaire_lio:
    occitanie_carte_transport_scolaire_lio_default,
}

// data/benefits/aides-velo-generator.ts
import aidesVelo from "file:///Users/valandriani/Code/Beta-gouv-Aides-jeunes/aides-jeunes/node_modules/aides-velo/build/index.es.js"
var benefits = [...aidesVelo()]
function generate_benefit_list(institutions2) {
  const potentialInstitutions = {
    région: institutions2.filter((i) => i.type === "region"),
    département: institutions2.filter((i) => i.type === "departement"),
    epci: institutions2.filter((i) => i.type === "epci"),
    "code insee": institutions2.filter((i) => i.type === "commune"),
  }
  benefits.forEach((b) => {
    var _a2, _b
    if (b && b.collectivity) {
      switch (b.collectivity.kind) {
        case "pays": {
          if (b.collectivity.value === "France") {
            b.institution = "etat"
          } else {
            b.discard = true
          }
          break
        }
        case "r\xE9gion":
        case "d\xE9partement":
        case "code insee": {
          const institutionList = potentialInstitutions[b.collectivity.kind]
          b.institution =
            (_a2 = institutionList.find((i) => {
              var _a3
              return (
                i.code_insee ===
                ((_a3 = b.collectivity) == null ? void 0 : _a3.value)
              )
            })) == null
              ? void 0
              : _a2.slug
          break
        }
        case "epci": {
          const institutionList = potentialInstitutions[b.collectivity.kind]
          b.institution =
            (_b = institutionList.find((i) => {
              var _a3
              return (
                i.code_siren ===
                ((_a3 = b.collectivity) == null ? void 0 : _a3.code)
              )
            })) == null
              ? void 0
              : _b.slug
          break
        }
      }
    }
  })
  return benefits
    .filter((b) => !b.discard)
    .map((b) => {
      const description =
        b.description && !b.description.match(/((\s\$)+|(^\$)+)\w+/)
          ? b.description
          : `Aide \xE0 l'achat d'un v\xE9lo : ${b.title}`
      return {
        label: `Aide \xE0 l'achat d'un v\xE9lo : ${b.title}`,
        description,
        id: `aidesvelo_${b.id}`.replace(/[ .']+/g, "_"),
        external_id: b.id,
        collectivity: b.collectivity,
        title: b.title,
        institution: b.institution,
        prefix: "l'",
        type: "float",
        periodicite: "ponctuelle",
        link: b.url,
      }
    })
}
var aides_velo_generator_default = generate_benefit_list

// data/benefits/dynamic/fsl.ts
var DEFAULT_FSL = {
  type: "bool",
  prefix: "une",
  top: 6,
  periodicite: "ponctuelle",
}
var FSL_BY_INSTITUTION_SLUG = {
  departement_ain: {
    label: "du d\xE9partement de l\u2019Ain",
    link: "https://www.ain.fr/solutions/fond-solidarite-logement-maintien-dans-le-logement/",
  },
  departement_aisne: {
    label: "du d\xE9partement de l\u2019Aisne",
    link: "https://aisne.com/aides/aide-a-lacces-au-logement-fonds-de-solidarite-pour-le-logement-fsl",
  },
  departement_allier: {
    label: "du d\xE9partement de l\u2019Allier",
    link: "https://www.allier.gouv.fr/exploitation-a603.html#!/particuliers/page/F1334",
    instructions:
      "https://www.allier.gouv.fr/exploitation-a603.html#!/particuliers/page/F1334",
  },
  departement_alpes_de_haute_provence: {
    label: "du d\xE9partement des Alpes-de-Haute-Provence",
    link: "http://www.mondepartement04.fr/rechercher-plus-daides/habitat-logement-urbanisme/fsl-masp/fonds-social-daide-au-logement-fsl.html",
    form: "http://www.mondepartement04.fr/fileadmin/mediatheque/cg04/formulaire/Insertion/Acc%C3%A8s_au_logement/IMPRIME_FSL_12-2019.pdf",
    instructions:
      "http://www.mondepartement04.fr/rechercher-plus-daides/habitat-logement-urbanisme/fsl-masp/mesure-daccompagnement-social-personnalise.html#c6266",
  },
  departement_hautes_alpes: {
    label: "du d\xE9partement des Hautes Alpes",
    link: "https://www.hautes-alpes.fr/4996-fonds-de-solidarite-pour-le-logement-fsl-.htm",
    instructions:
      "https://www.hautes-alpes.fr/4996-fonds-de-solidarite-pour-le-logement-fsl-.htm",
  },
  departement_alpes_maritimes: {
    label: "du d\xE9partement des Alpes Maritimes",
    link: "https://www.departement06.fr/aides-a-l-insertion/fsl-2607.html",
    excludedEPCI: "200030195",
  },
  intercommunalite_nice_cote_d_azur: {
    label: "de la M\xE9tropole Nice C\xF4te d\u2019Azur",
    link: "http://www.nicecotedazur.org/habitat-urbanisme/le-logement/fonds-de-solidarit%C3%A9-pour-le-logement",
    form: "http://www.nicecotedazur.org/uploads/media_items/locataire.original.pdf",
  },
  departement_ardeche: {
    label: "du d\xE9partement de l\u2019Ard\xE8che",
    link: "http://www.ardeche.fr/132-fonds-unique-logement.htm",
    form: "http://www.ardeche.fr/include/viewfilesecure.php?idtf=3609&path=cb%2F3609_762_formulaires-ful-2015BD.pdf",
  },
  departement_ardennes: {
    label: "du d\xE9partement de l\u2019Ardennes",
    link: "https://cd08.fr/aides-et-subventionss/fonds-de-solidarite-logement-fsl-formulaire-unique-de-demande-de-subvention",
    form: "https://cd08.fr/sites/default/files/maj2020_compilation_formulaires_fsl.pdf",
  },
  departement_ariege: {
    label: "du d\xE9partement de l\u2019Ari\xE8ge",
    link: "http://www.ariege.fr/Etre-solidaire/Logement/Le-Fonds-unique-Habitat-FUH",
    instructions:
      "http://www.ariege.fr/Etre-solidaire/Logement/Rencontrer-un-travailleur-social",
  },
  departement_aude: {
    label: "du d\xE9partement de l\u2019Aude",
    link: "https://www.aude.fr/je-beneficie-du-fonds-unique-logement-ful",
  },
  departement_aveyron: {
    label: "du d\xE9partement de l\u2019Aveyron",
    link: "https://aveyron.fr/pages/logement/des%20aides%20pour%20acc%C3%A9der%20%C3%A0%20un%20logement%20ou%20sy%20maintenir",
  },
  departement_bouches_du_rhone: {
    label: "du d\xE9partement Des Bouches-du-Rh\xF4ne",
    link: "https://www.departement13.fr/nos-actions/logement/les-dispositifs/le-fonds-de-solidarite-pour-le-logement/",
  },
  departement_calvados: {
    label: "du d\xE9partement du Calvados",
    link: "https://www.calvados.fr/accueil/le-departement/solidarite---familles/aide-au-logement/fsl.html",
    instructions:
      "https://www.calvados.fr/accueil/le-departement/solidarite---familles/aide-au-logement/fsl.html",
  },
  departement_cantal: {
    label: "du d\xE9partement du Cantal",
    link: "http://www.cantal.fr/fonds-de-solidarite-pour-le-logement/",
  },
  departement_de_la_charente: {
    label: "du d\xE9partement de Charente",
    link: "https://www.charentesolidarites.org/index.php/component/sppagebuilder/8-le-fsl.html",
    instructions:
      "https://www.charentesolidarites.org/index.php/component/sppagebuilder/8-le-fsl.html",
  },
  departement_charente_maritime: {
    label: "du d\xE9partement de Charente-Maritime",
    link: "https://la.charente-maritime.fr/fiches-aides/fonds-solidarite-pour-logement",
  },
  departement_cher: {
    label: "du d\xE9partement du Cher",
    link: "https://www.departement18.fr/Logement-habitat",
  },
  departement_correze: {
    label: "du d\xE9partement de Corr\xE8ze",
    link: "https://www.correze.fr/nos-missions/habitat/les-aides-sociales-pour-le-logement",
    instructions:
      "https://www.correze.fr/services-en-ligne/les-aides/aide-aux-travailleurs-de-condition-modeste",
  },
  departement_cote_or: {
    label: "du d\xE9partement de la C\xF4te-d\u2019Or",
    link: "https://www.cotedor.fr/votre-service/insertion/accompagnement-financier/accompagnement-et-aides-lacces-ou-au-maintien-dans",
  },
  departement_doubs: {
    label: "du d\xE9partement du Doubs",
    link: "https://www.doubs.fr/index.php/vous-accompagner/36-particuliers/2242-le-fonds-de-solidarite-logement-fsl",
    form: "http://www.adil25.org/fileadmin/user_upload/PDAHLPD/Grand_public/imprime_aide_financiere_individuelle_FSL_actualise.pdf",
    instructions:
      "http://www.adil25.org/le-pdalhpd/documentation/le-reglement-interieur-du-fsl-et-formulaire-de-demande-daide.html",
  },
  departement_drome: {
    label: "du d\xE9partement de la Dr\xF4me",
    link: "https://www.ladrome.fr/mon-quotidien/logement/en-cas-de-difficultes/les-aides-aux-locataires/",
  },
  departement_finistere: {
    label: "du d\xE9partement du Finist\xE8re",
    link: "https://www.finistere.fr/A-votre-service/Habitat-Logement/Acces-et-maintien-dans-un-logement-FSL",
    excludedEPCI: "242900314",
  },
  brest_metropole: {
    label: "de Brest M\xE9tropole",
    link: "https://infosociale.finistere.fr/etablissement/brest-metropole-fsl-fonds-de-solidarite-logement/",
    instructions:
      "https://infosociale.finistere.fr/etablissement/brest-metropole-fsl-fonds-de-solidarite-logement/",
  },
  departement_gard: {
    label: "du d\xE9partement du Gard",
    link: "https://www.gard.fr/au-quotidien/bien-se-loger/locataires/fonds-solidarite-logement.html",
    instructions:
      "https://www.gard.fr/fileadmin/mediatheque/documents_2020/logement/doc_fond_solidarite_logement-2020.pdf",
  },
  departement_haute_garonne: {
    label: "du d\xE9partement de la Haute-Garonne",
    link: "https://www.haute-garonne.fr/aide/fonds-de-solidarite-logement-fsl",
    excludedEPCI: "243100518",
  },
  toulouse_metropole: {
    label: "de Toulouse M\xE9tropole",
    link: "https://www.toulouse-metropole.fr/missions/solidarite/fonds-de-solidarite-logement-fsl-",
  },
  departement_gironde: {
    label: "du d\xE9partement de la Gironde",
    link: "https://www.fsl33.org/aide-financiere-maintien-logement/",
    instructions: "http://www.fsl33.org/aide-financiere-maintien-logement/",
  },
  departement_herault: {
    label: "du d\xE9partement de l\u2019H\xE9rault",
    link: "https://herault.fr/402-aide-financiere.htm",
  },
  departement_ille_et_vilaine: {
    label: "du d\xE9partement d\u2019Ille-et-Vilaine",
    link: "https://www.ille-et-vilaine.fr/demande-fsl",
    form: "https://www.ille-et-vilaine.fr/sites/default/files/asset/document/fo-psh-0818-001_imprimeuniquemasques_form_ext_0.pdf",
  },
  departement_indre: {
    label: "du d\xE9partement de l\u2019Indre",
    link: "https://www.adil36.org/aides-locales/locataires-en-difficultes",
  },
  departement_indre_et_loire: {
    label: "du d\xE9partement de l\u2019Indre-et-Loire",
    link: "https://www.touraine.fr/mes-services-au-quotidien/enfance-famille/laide-au-logement.html",
    form: "https://www.touraine.fr/files/touraine/documents/etre-accompagne/missions/617_impr_FSL_CD37_interactif_METRO_juillet_2021.pdf",
  },
  departement_isere: {
    label: "du d\xE9partement d\u2019Is\xE8re",
    link: "https://www.isere.fr/aides-au-logement",
    instructions: "https://www.isere.fr/aides-au-logement",
  },
  departement_landes: {
    label: "du d\xE9partement des Landes",
    link: "https://www.landes.fr/logement",
  },
  departement_loir_et_cher: {
    label: "du d\xE9partement du Loir-et-Cher",
    link: "https://www.departement41.fr/services-en-ligne/etre-accompagne/insertion-habitat/aide-au-logement/",
  },
  departement_loire: {
    label: "du d\xE9partement de la Loire",
    link: "https://www.loire.fr/jcms/lw_1024718/le-fonds-de-solidarite-pour-le-logement-fsl",
  },
  departement_loire_atlantique: {
    label: "du d\xE9partement de Loire Atlantique",
    link: "https://www.loire-atlantique.fr/jcms/classement-des-contenus/guides-aides/vous-etes/parent-/-famille/fonds-de-solidarite-pour-le-logement-fsl-les-aides-a-l-acces-ou-au-maintien-dans-votre-logement-fr-t1_16291",
    instructions:
      "https://www.loire-atlantique.fr/44/habitat-logement/fonds-de-solidarite-pour-le-logement-fsl-aide-a-l-acces-au-logement/c_1303821#idTitre5",
  },
  intercommunalite_orleans_metropole: {
    label: "de Orl\xE9ans M\xE9tropole",
    link: "http://www.orleans-metropole.fr/1679/fonds-unifie-logement-ful.htm",
    form: "http://www.orleans-metropole.fr/fileadmin/orleans/MEDIA/document/urbanisme/habitat/FUL_-formulaires_de_demande.pdf",
  },
  departement_maine_et_loire: {
    label: "du d\xE9partement du Maine-et-Loire",
    link: "https://www.maine-et-loire.fr/aides-et-services/logement-et-habitat/fonds-solidarite-logement/aides-pour-le-maintien-dans-le-logement",
  },
  departement_manche: {
    label: "du d\xE9partement de la Manche",
    link: "https://www.manche.fr/conseil-departemental/FSL.aspx",
    form: "https://www.manche.fr/conseil-departemental/iso_album/dossier_de_demande_logement.pdf",
  },
  departement_marne: {
    label: "du d\xE9partement de la Marne",
    link: "http://www.marne.fr/les-actions/sante-et-social/logement-social/acces-et-maintien-dans-le-logement-le-fonds-solidarite",
  },
  departement_mayenne: {
    label: "du d\xE9partement de la Mayenne",
    link: "https://www.lamayenne.fr/service/le-fonds-solidarite-pour-le-logement",
  },
  departement_morbihan: {
    label: "du d\xE9partement du Morbihan",
    link: "https://www.morbihan.fr/les-services/logement-habitat/fonds-de-solidarite-logement-fsl/",
    form: "https://www.morbihan.fr/fileadmin/Les_services/Aides_departementales/22_morbihan_5_H08_FSL_maintien_logement.pdf",
    instructions:
      "https://www.morbihan.fr/les-services/logement-habitat/fonds-de-solidarite-logement-fsl",
  },
  departement_moselle: {
    label: "du d\xE9partement de la Moselle",
    link: "https://www.moselle.fr/jcms/pl_12538/fr/fonds-solidarite-logement-fsl",
    form: "https://www.moselle.fr/upload/docs/application/pdf/2018-11/demande_dintervention_du_fsl_-_acces_impayes_locatifs.pdf",
  },
  departement_nord: {
    label: "du d\xE9partement du Nord",
    link: "https://services.lenord.fr/fonds-de-solidarite-pour-le-logement-fsl--aide-financiere-a-linstallation",
    instructions:
      "https://services.lenord.fr/fonds-de-solidarite-pour-le-logement-fsl--aide-financiere-a-linstallation",
    excludedEPCI: "245900410",
  },
  metropole_europeenne_de_lille: {
    label: "de la M\xE9tropole europ\xE9enne de Lille",
    link: "https://www.lillemetropole.fr/votre-metropole/competences/amenagement-du-territoire/logement/le-fonds-de-solidarite-logement",
    form: "https://www.lillemetropole.fr/sites/default/files/2019-12/Volet%20demandeur%20maintien.pdf",
  },
  departement_oise: {
    label: "du d\xE9partement de l\u2019Oise",
    link: "https://www.oise.fr/information/guide-des-aides-departementales/fonds-departemental-de-solidarite-3145",
  },
  departement_pas_de_calais: {
    label: "du d\xE9partement du Pas-de-Calais",
    link: "https://www.pasdecalais.fr/Solidarite-Sante/Reglement-Departemental-d-Aide-Sociale/Le-developpement-des-solidarites/Le-logement-des-personnes-defavorisees-et-le-Fonds-de-Solidarite-Logement/L-aide-financiere-Fonds-Solidarite-Logement-volet-acces-logement-identifie",
  },
  departement_puy_de_dome: {
    label: "du d\xE9partement du Puy-de-D\xF4me",
    link: "https://www.puy-de-dome.fr/social/logement-habitat/fonds-solidarite-logement.html",
    instructions:
      "https://www.puy-de-dome.fr/fileadmin/user_upload/CD63-2020-RI-FSL.pdf",
  },
  departement_pyrenees_atlantiques: {
    label: "du d\xE9partement des Pyr\xE9n\xE9es-Atlantiques",
    link: "https://le64.fr/vous-aider-acceder-un-logement-ou-vous-y-maintenir",
  },
  departement_bas_rhin: {
    label: "du d\xE9partement du Bas-Rhin",
    link: "https://www.bas-rhin.fr/action-sociale-et-sante/difficultes-logement/",
  },
  departement_du_haut_rhin: {
    label: "du d\xE9partement du Haut-Rhin",
    link: "https://www.haut-rhin.fr/content/des-aides-pour-votre-logement",
  },
  departement_rhone: {
    label: "du d\xE9partement du Rh\xF4ne",
    link: "https://www.rhone.fr/solidarites/logement/aides_au_logement/le_fonds_de_solidarite_logement",
    excludedEPCI: "200046977",
  },
  intercommunalite_metropole_lyon: {
    label: "de la M\xE9tropole de Lyon",
    link: "https://www.grandlyon.com/services/aides-fonds-solidarite-logement.html",
    instructions:
      "https://www.grandlyon.com/services/aides-fonds-solidarite-logement.html",
  },
  departement_saone_et_loire: {
    label: "du d\xE9partement de la Sa\xF4ne-et-Loire",
    link: "https://www.saoneetloire71.fr/que-peut-on-faire-pour-vous/vous-etes-proprietaire-locataire/rester-dans-mon-logement#:~:text=b%C3%A9n%C3%A9ficier%20peut%2D%C3%AAtre%20d'une,)%20%3A%20habitat71%40cg71.fr",
    form: "https://www.saoneetloire71.fr/fileadmin/Que_peut-on_faire_pour_vous__/Vous_etes_proprietaire_locataire/Aides_logement/7733_DOSSIER_UNIQUE.pdf",
  },
  departement_sarthe: {
    label: "du d\xE9partement de la Sarthe",
    link: "https://www.sarthe.fr/insertion-logement/logement-habitat/fonds-de-solidarite-logement",
  },
  departement_haute_savoie: {
    label: "du d\xE9partement de la Haute-Savoie",
    link: "https://www.hautesavoie.fr/informations-services/logement",
  },
  departement_paris: {
    label: "du d\xE9partement de Paris",
    link: "https://www.paris.fr/pages/aides-au-logement-3827#le-fonds-de-solidarite-pour-le-logement-de-paris",
  },
  departement_seine_maritime: {
    label: "du d\xE9partement de Seine-Maritime",
    link: "https://www.seinemaritime.fr/vos-services/habitat-logement/le-plan-departemental-daction-pour-le-logement-des-personnes-defavorisees/fonds-solidarite-logement.html",
  },
  departement_seine_et_marne: {
    label: "du d\xE9partement de Seine-et-Marne",
    link: "https://www.seine-et-marne.fr/fr/aides-au-logement",
  },
  departement_yvelines: {
    label: "du d\xE9partement des Yvelines",
    link: "https://www.yvelines.fr/solidarite/adultes-en-difficulte/logement/acces-et-maintien-logement/",
  },
  departement_somme: {
    label: "du d\xE9partement de la Somme",
    link: "https://www.somme.fr/services/rsa-insertion/les-aides-a-linsertion/le-fonds-de-solidarite-logement/",
  },
  departement_var: {
    label: "du d\xE9partement du Var",
    link: "https://www.var.fr/social/insertion/fonds-de-solidarite-logement",
    form: "https://www.var.fr/documents/20142/2028094/MAINTIEN+A4.pdf/7623c7eb-daa0-cf0e-aabf-cd701c8c6d1d",
  },
  departement_vaucluse: {
    label: "du d\xE9partement du Vaucluse",
    link: "http://www.vaucluse.fr/habitat-logement/les-aides-aux-particuliers/le-fonds-de-solidarite-pour-le-logement-1531.html",
  },
  departement_vendee: {
    label: "du d\xE9partement de la Vend\xE9e",
    link: "http://www.vendee.fr/Territoire-et-environnement/Habitat-Logement/42264-Habitat-Logement/L-accompagnement-des-menages-en-difficultes",
  },
  departement_vienne: {
    label: "du d\xE9partement de la Vienne",
    link: "http://www.fsl86.fr/",
    form: "http://www.fsl86.fr/images/pdf/declaration_de_ressources.pdf",
  },
  departement_essonne: {
    label: "du d\xE9partement de l\u2019Essonne",
    link: "http://www.essonne.fr/le-departement/les-organismes-associes/le-fonds-de-solidarite-pour-le-logement-fsl/",
  },
  departement_hauts_de_seine: {
    label: "du d\xE9partement des Hauts-de-Seine",
    link: "https://www.78-92.fr/annuaire/aides-et-services/detail/le-fonds-de-solidarite-logement-fsl-92",
  },
  departement_seine_saint_denis: {
    label: "du d\xE9partement de Seine-Saint-Denis",
    link: "https://seinesaintdenis.fr/solidarite/action-sociale/article/fonds-de-solidarite-logement",
    instructions:
      "https://seinesaintdenis.fr/solidarite/action-sociale/article/fonds-de-solidarite-logement#Comment-en-formuler-la-demande",
  },
  departement_val_de_marne: {
    label: "du d\xE9partement du Val-de-Marne",
    link: "https://www.valdemarne.fr/a-votre-service/habitat/logement/aides-aux-impayes-locatifs-fsh",
  },
  departement_val_d_oise: {
    label: "du d\xE9partement du Val d\u2019Oise",
    link: "https://www.valdoise.fr/aide-et-service/11/6-fonds-de-solidarite-logement-aide-a-l-acces-au-logement.htm",
  },
  departement_la_reunion: {
    label: "du d\xE9partement de la R\xE9union",
    link: "https://www.departement974.fr/aide/aide-habitat-fonds-de-solidarite-pour-logement-fsl#aidesimpayes",
  },
}
function formatBenefit(
  { label, link, form, instructions, excludedEPCI },
  institutionId
) {
  const conditions_generales = [
    {
      type: "attached_to_institution",
    },
    ...(excludedEPCI
      ? [
          {
            type: "not",
            value: {
              type: "epcis",
              values: [excludedEPCI],
            },
          },
        ]
      : []),
    {
      type: "statut_occupation_logement",
      excludes: [
        "loge_gratuitement" /* loge_gratuitement */,
        "sans_domicile" /* sans_domicile */,
      ],
    },
  ]
  return Object.assign(
    {},
    {
      id: `${institutionId.replace(/_/g, "-")}-fsl-eligibilite`,
      ...DEFAULT_FSL,
      description: `Dans le cadre du Fonds de Solidarit\xE9 Logement ${label}, des aides financi\xE8res sont mises en place pour vous aider \xE0 rester dans votre logement et \xE0 payer vos factures li\xE9es \xE0 votre logement (eau, \xE9lectricit\xE9, etc.).`,
      conditions: [
        `Occuper, \xE0 titre de r\xE9sidence principale, un logement sur le territoire ${label}.`,
        "<strong>Satisfaire les conditions de ressources</strong> d\xE9crites dans le r\xE8glement.",
      ],
      link,
      form: form ? form : null,
      instructions: instructions ? instructions : null,
      label: `Aide au maintien dans votre logement ${label}`,
      institution: institutionId,
      source: "javascript",
      conditions_generales,
    }
  )
}
function buildFSL() {
  return Object.entries(FSL_BY_INSTITUTION_SLUG).map(
    ([institutionSlug, customizationBenefit]) =>
      formatBenefit(customizationBenefit, institutionSlug)
  )
}

// data/benefits/dynamic/apa.ts
var DEFAULT_APA = {
  type: "bool",
  prefix: "l\u2019",
  periodicite: "ponctuelle",
}
var APA_BY_CODE = {
  departement_hautes_alpes: {
    label: "du d\xE9partement des Hautes Alpes",
    link: "https://www.hautes-alpes.fr/1647-l-allocation-personnalisee-d-autonomie-apa-.htm",
    form: "https://www.hautes-alpes.fr/include/viewFile.php?idtf=16823&path=a0%2F16823_639_1-dossier_apa_web_elec.pdf",
  },
  departement_alpes_maritimes: {
    label: "du d\xE9partement des Alpes Maritimes",
    teleservice:
      "https://www.departement06.fr/dossier-de-demande-d-allocation-personnalisee-d-autonomie-a-domicile-14249.html",
    link: "https://www.departement06.fr/aides-aux-personnes-agees/allocation-personnalisee-d-autonomie-apa-2578.html",
  },
  departement_bouches_du_rhone: {
    label: "du d\xE9partement des Bouches du Rh\xF4ne",
    link: "https://www.departement13.fr/le-13-en-action/seniors/les-dispositifs/allocation-personnalisee-dautonomie-apa/",
    form: "https://www.departement13.fr/fileadmin/user_upload/Famille/Seniors/formulaires/dossier_APA.pdf",
  },
  departement_calvados: {
    label: "du d\xE9partement du Calvados",
    teleservice: "https://teleservices.calvados.fr/demandes-apa/",
    link: "https://www.calvados.fr/contents/fiche/fiches-aide--services/lapa-en-ligne.html",
  },
  departement_eure_et_loir: {
    label: "du d\xE9partement d'Eure et Loir",
    link: "https://eurelien.fr/guide/autonomie",
    form: "https://www.eurelien.fr/sites/default/files/mda-dossier-dallocation-personnalisee-dautonomie.pdf",
  },
  departement_finistere: {
    label: "du d\xE9partement du Finist\xE8re",
    link: "https://www.finistere.fr/A-votre-service/Personnes-age-es-APA/Allocation-personnalisee-d-autonomie",
    form: "https://www.finistere.fr/var/finistere/storage/original/application/1f10539819d74121420da96880b95716.pdf",
  },
  departement_haute_garonne: {
    label: "du d\xE9partement de Haute Garonne",
    link: "https://www.haute-garonne.fr/guide-des-aides/allocation-personnalisee-dautonomie-apa",
    form: "https://www.haute-garonne.fr/sites/default/files/20172707-formulaire-demande-_apa.pdf",
  },
  departement_gironde: {
    label: "du d\xE9partement de Gironde",
    link: "https://www.gironde.fr/handicap-grand-age/aides-et-prestations-apa-pch-et-cmi#apa",
    form: "https://www.gironde.fr/sites/default/files/2017-04/demande_apa_web_0.pdf",
  },
  departement_herault: {
    institution: "departement",
    label: "du d\xE9partement de l'H\xE9rault",
    link: "https://www.herault.gouv.fr/Demarches-administratives/Toutes-les-demarches-pour-les-particuliers/Service-Public-pour-les-particuliers#!/particuliers/page/F10009",
    instructions:
      "http://www.herault.fr/lallocation-personnalisee-dautonomie-apa",
  },
  departement_ille_et_vilaine: {
    label: "du d\xE9partement d'Ille et Vilaine",
    link: "http://www.ille-et-vilaine.fr/fr/demande-apa",
    form: "http://www.ille-et-vilaine.fr/sites/default/files/asset/document/faire_demande_allocation_apa_juillet_2014.pdf",
  },
  departement_isere: {
    label: "du d\xE9partement de l'Is\xE8re",
    teleservice:
      "https://www.isere.fr/espace-personnel/Pages/creer-mon-compte.aspx",
    link: "https://www.isere.fr/mda38/particulier/pa/Pages/apa-en-ligne.aspx",
  },
  departement_loire: {
    label: "du d\xE9partement de la Loire",
    link: "http://www.loire.fr/jcms/c_308179/comment-beneficier-de-l-apa-a-domicile",
    form: "http://www.loire.fr/upload/docs/application/pdf/dossierapa.pdf",
  },
  departement_loire_atlantique: {
    label: "du d\xE9partement de Loire Atlantique",
    link: "https://www.loire-atlantique.fr/jcms/classement-des-contenus/guides-aides/vous-etes/personne-agee/l-allocation-personnalisee-d-autonomie-apa-a-domicile-fr-p1_315752?portal=aca_6941&category=p2_807421",
    form: "https://www.loire-atlantique.fr/upload/docs/application/pdf/2014-02/personnes_agees_for_apa_2006_10_03__16_42_50_200.pdf",
  },
  departement_loiret: {
    label: "du d\xE9partement du Loiret",
    link: "https://www.loiret.fr/aide/allocation-personnalisee-dautonomie-apa-domicile-et-en-etablissement-ayant-opte-pour-la-0#:~:text=est%20une%20prestation%20en%20nature,l'%C3%A9quipe%20pluridisciplinaire%20du%20D%C3%A9partement.",
    form: "https://www.loiret.fr/sites/loiret/files/media/documents/2021/11/formulaire-demande-APA-Carsat-MDA-01112021_0.pdf",
  },
  departement_moselle: {
    label: "du d\xE9partement de Moselle",
    link: "http://www.moselle.fr/moselleetvous/pages/fiche_senior_apa.aspx",
    form: "http://www.moselle.fr/sitecollectiondocuments/lamoselleetvous/solidarite/seniors/formulaire_demande_apa_domicile.pdf",
  },
  departement_nord: {
    label: "du d\xE9partement du Nord",
    link: "https://lenord.fr/jcms/prd2_335926/allocation-personnalisee-d-autonomie-apa",
    form: "https://lenord.fr/upload/docs/application/pdf/2018-04/formulaire_apa_2018-04-27_16-30-55_949.pdf",
  },
  departement_pas_de_calais: {
    label: "du d\xE9partement du Pas de Calais",
    link: "http://www.pasdecalais.fr/Solidarite-Sante/Retraites-et-personnes-agees/Beneficier-d-aides/L-Allocation-Personnalisee-d-Autonomie-APA",
    form: "http://www.pasdecalais.fr/content/download/79774/1263503/file/Dossier+de+demande+APA.pdf",
  },
  departement_pyrenees_atlantiques: {
    label: "du d\xE9partement des Pyr\xE9n\xE9es Atlantiques",
    link: "http://www.le64.fr/solidarite/autonomie/soutien-a-domicile/compenser-la-dependance-par-lapa.html",
    form: "http://www.le64.fr/fileadmin/mediatheque/cg64/documents/actualites/APA_2017/dossier_APA_modifi%C3%A9_juin_2017.pdf",
  },
  departement_bas_rhin: {
    label: "du d\xE9partement du Bas-Rhin",
    link: "http://www.bas-rhin.fr/acces-direct/guide-aides/detail-guide-aides/381/Allocation-personnalisee-d-autonomie--APA--a-domicile",
    form: "http://www.bas-rhin.fr/eCommunityDocuments/%7BE34C4D98-631D-459B-AA4E-61C91D2F7BA0%7D/3759/document_conseil-departemental-bas-rhin-formulaire-demande-apa.pdf",
  },
  departement_du_haut_rhin: {
    label: "du d\xE9partement du Haut-Rhin",
    link: "https://www.haut-rhin.fr/content/vivre-%C3%A0-domicile-1#:~:text=L'Allocation%20personnalis%C3%A9e%20d'autonomie%20%C3%A0%20domicile%20(APA),%C3%A0%20leur%20perte%20d'autonomie.",
    form: "https://www.haut-rhin.fr/sites/cea/files/FORMULAIRE%20APA_1.pdf",
  },
  departement_paris: {
    label: "de Paris",
    link: "https://www.paris.fr/aides_soutien_a_domicile#allocation-personnalisee-d-autonomie-a-domicile-apa_21",
    instructions: "https://apa.paris.fr/portailAPA/",
  },
  departement_seine_maritime: {
    label: "du d\xE9partement de Seine Maritime",
    link: "https://www.seinemaritime.fr/vos-services/personnes-agees-1/beneficier-daides/lallocation-aux-personnes-agees.html",
    form: "https://www.seinemaritime.fr/docs/1_apa-1ere-demande-domicile.pdf",
  },
  departement_seine_et_marne: {
    label: "du d\xE9partement de Seine et Marne",
    teleservice: "https://e-service.seine-et-marne.fr/",
    link: "http://www.seine-et-marne.fr/Solidarite/Seniors/Maintien-a-domicile-APA/Allocation-Personnalisee-d-Autonomie-APA",
  },
  departement_var: {
    label: "du d\xE9partement du Var",
    link: "https://www.var.fr/social/autonomie-personnes-agees/apa",
    instructions: "https://www.var.fr/social/autonomie-personnes-agees/apa",
  },
  departement_hauts_de_seine: {
    label: "du d\xE9partement de Hauts de Seine",
    link: "http://www.hauts-de-seine.fr/solidarites/personnes-agees/maintien-a-domicile/comment-beneficier-de-lapa/",
    form: "http://www.hauts-de-seine.fr/fileadmin/PDF/Solidarites/Autonomie/APA_DossierDemandeDom_dec2018.pdf",
  },
  departement_seine_saint_denis: {
    label: "du d\xE9partement de Seine Saint Denis",
    link: "https://seinesaintdenis.fr/Allocation-Departementale-Personnalisee-d-Autonomie.html",
    form: "https://seinesaintdenis.fr/IMG/pdf/formulaire_demande_adpa.pdf",
  },
  departement_val_de_marne: {
    label: "du d\xE9partement du Val de Marne",
    link: "https://www.valdemarne.fr/a-votre-service/personnes-agees/allocation-personnalisee-dautonomie-a-domicile-apad",
    form: "https://www.valdemarne.fr/download/sites/default/files/formulaires/webformudemande_apa_-2018_.pdf",
  },
  intercommunalite_metropole_lyon: {
    label: "de la M\xE9tropole de Lyon",
    link: "https://www.grandlyon.com/services/allocation-personnalisee-d-autonomie.html",
    form: "https://www.grandlyon.com/fileadmin/user_upload/media/pdf/pa-ph/personnes-agees/20170802_dossier_demande_apa.pdf",
  },
}
function formatBenefit2(institution) {
  const customizationBenefit = APA_BY_CODE[institution]
  return {
    id: `${institution.replace(/_/g, "-")}-apa-eligibilite`,
    ...DEFAULT_APA,
    description: `L\u2019allocation personnalis\xE9e d\u2019autonomie (APA) ${customizationBenefit.label} est une aide r\xE9serv\xE9e aux plus de
    60 ans en perte d\u2019autonomie. \xC0 travers un plan d\u2019action, elle favorise le
    maintien \xE0 domicile et l\u2019am\xE9lioration de la qualit\xE9 de vie des personnes \xE2g\xE9es
    en \xE9tablissement en subventionnant des services d\u2019aides \xE0 la personne. Sa
    gestion est confi\xE9e aux conseils d\xE9partementaux...`,
    conditions: [
      `Faire \xE9valuer votre perte d\u2019autonomie (classement GIR) \xE0 domicile par les
      services sociaux de votre d\xE9partement.`,
      "Accepter le plan d\u2019aide propos\xE9 par votre d\xE9partement.",
      "R\xE9sider depuis plus de trois mois dans votre d\xE9partement.",
      'Ne pas percevoir <a target="_blank" rel="noopener" title="Service Public.fr - Peut-on cumuler l\u2019APA avec d\u2019autres revenus ? - Nouvelle fen\xEAtre" href="https://www.service-public.fr/particuliers/vosdroits/F11678">certaines autres aides</a> non cumulables avec l\u2019APA.',
    ],
    ...customizationBenefit,
    label: `Allocation personnalis\xE9e d\u2019autonomie ${customizationBenefit.label}`,
    institution,
    source: "javascript",
    conditions_generales: [
      {
        type: "age",
        operator: ">=",
        value: "60",
      },
      {
        type: "attached_to_institution",
      },
    ],
  }
}
function buildAPA() {
  return Object.keys(APA_BY_CODE).map((code) => formatBenefit2(code))
}

// data/index.ts
function generateInstitutionId(institution) {
  return `${institution.type}_${
    institution.code_insee || institution.code_siren || institution.slug
  }`
}
function generateBenefitId(benefit) {
  return benefit.id || benefit.slug
}
function transformInstitutions(collection) {
  return collection.reduce((result, data) => {
    const item = {
      slug: data.slug,
      id: generateInstitutionId(data),
      code_siren: data.code_siren,
      code_insee: data.code_insee,
      label: data.name,
      imgSrc: data.imgSrc,
      department: data.department,
      benefitsIds: [],
      type: data.type,
      top: data.top,
      repository:
        data.repository || (data.type === "national" ? null : "france-local"),
      etablissements: data.etablissements,
    }
    result[data.slug] = item
    return result
  }, {})
}
function setTop(benefit, institution) {
  const default_top =
    institution.top ||
    (institution.type === "national"
      ? 3
      : benefit.source == "aides-velo"
      ? 13
      : 14)
  return benefit.top || default_top
}
function setDefaults(benefit, institution) {
  benefit.id = generateBenefitId(benefit)
  benefit.top = setTop(benefit, institution)
  benefit.floorAt = benefit.floorAt || 1
  return benefit
}
function generate(
  collections,
  additionalBenefitAttributes2,
  aidesVeloBenefitListGenerator,
  fslGenerator,
  apaGenerator
) {
  console.log(collections.institution_types.items)
  if (collections.institutions.items.length == 0) {
    throw new Error("Aucun type d'institution")
  }
  const institutions2 = transformInstitutions(collections.institutions.items)
  collections.benefits_javascript.items.forEach((benefit) => {
    benefit.source = "javascript"
  })
  collections.benefits_openfisca.items.forEach((benefit) => {
    benefit.source = "openfisca"
  })
  const aidesVeloBenefits = aidesVeloBenefitListGenerator
    ? aidesVeloBenefitListGenerator(Object.values(institutions2))
    : []
  aidesVeloBenefits.forEach((benefit) => {
    benefit.source = "aides-velo"
  })
  const fslBenefits = fslGenerator ? fslGenerator() : []
  const apaBenefits = apaGenerator ? apaGenerator() : []
  let benefits3 = [
    ...collections.benefits_javascript.items,
    ...collections.benefits_openfisca.items,
    ...aidesVeloBenefits.filter((b) => b.institution),
    ...apaBenefits,
    ...fslBenefits,
  ].map((benefit) => {
    return Object.assign(
      {},
      benefit,
      additionalBenefitAttributes2[benefit.slug]
    )
  })
  const benefitsMap = {}
  benefits3 = benefits3.map((benefit) => {
    const institution = institutions2[benefit.institution]
    benefit = setDefaults(benefit, institution)
    institution.benefitsIds.push(benefit.id)
    benefit.institution = institution
    benefitsMap[benefit.id] = benefit
    return benefit
  })
  const result = {
    all: benefits3,
    institutionsMap: institutions2,
    benefitsMap,
  }
  return result
}
var data_default = {
  generateInstitutionId,
  generateBenefitId,
  fn: generate,
  generate: (jam) =>
    generate(
      jam.collections,
      additionalBenefitAttributes,
      aides_velo_generator_default,
      buildFSL,
      buildAPA
    ),
}

// data/all.ts
import jamstackLoader from "file:///Users/valandriani/Code/Beta-gouv-Aides-jeunes/aides-jeunes/node_modules/jamstack-loader/src/index.js"
import path from "path"
var __vite_injected_original_import_meta_url2 =
  "file:///Users/valandriani/Code/Beta-gouv-Aides-jeunes/aides-jeunes/data/all.ts"
var __dirname2 = new URL(".", __vite_injected_original_import_meta_url2)
  .pathname
var configFile = path.join(__dirname2, "../contribuer/public/admin/config.yml")
var jamstack
if (existsSync(configFile)) {
  jamstack = jamstackLoader.get(configFile)
} else {
  configFile = path.join(__dirname2, "../../contribuer/public/admin/config.yml")
  jamstack = jamstackLoader.get(`${configFile}`)
}
var all_default = data_default.generate(jamstack)

// vite.config.ts
import { visualizer } from "file:///Users/valandriani/Code/Beta-gouv-Aides-jeunes/aides-jeunes/node_modules/rollup-plugin-visualizer/dist/plugin/index.js"

// rollup/institutions.ts
import { createRequire } from "module"
var __vite_injected_original_import_meta_url3 =
  "file:///Users/valandriani/Code/Beta-gouv-Aides-jeunes/aides-jeunes/rollup/institutions.ts"
var require2 = createRequire(__vite_injected_original_import_meta_url3)
var epcis = require2("@etalab/decoupage-administratif/data/epci.json")
var institutionsBenefits = {}
for (const benefit in all_default.benefitsMap) {
  if (all_default.benefitsMap[benefit].private) {
    continue
  }
  const institution = all_default.benefitsMap[benefit].institution.slug
  if (!institutionsBenefits[institution]) {
    institutionsBenefits[institution] = []
  }
  institutionsBenefits[institution].push({
    label: all_default.benefitsMap[benefit].label,
    id: all_default.benefitsMap[benefit].id,
  })
}
var institutions = {
  national: [],
  region: [],
  departement: [],
  epci: [],
  caf: [],
  msa: [],
  commune: [],
  autre: [],
}
var _a
for (const id in all_default.institutionsMap) {
  const institution = all_default.institutionsMap[id]
  if (!institutionsBenefits[institution.slug]) {
    continue
  }
  const institutionObject = {
    id: institution.slug,
    label: institution.label,
    type: institution.type,
    benefits: institutionsBenefits[institution.slug],
  }
  if (institution.type === "epci") {
    institutionObject.location =
      ((_a = epcis.find(
        (element) => element.code === institution.code_siren
      )) == null
        ? void 0
        : _a.membres.map((commune) => commune.code)) || []
  } else if (institution.type === "caf") {
    institutionObject.location = institution.department
  } else if (["region", "departement", "commune"].includes(institution.type)) {
    institutionObject.location = institution.code_insee
  }
  if (!institutions[institution.type]) {
    console.log(institution)
    const msg = `The new institution type '${institution.type}' of '${institution.slug}' needs to be added in rollup/institutions.ts`
    console.error(msg)
    throw new Error(msg)
  }
  institutions[institution.type].push(institutionObject)
}
var institutions_default = institutions

// rollup/benefits.ts
var benefits2 = {}
var excludeKeys = [
  "conditions_generales",
  "entity",
  "etablissements",
  "forms",
  "interestFlag",
  "openfisca_eligibility_source",
  "openfiscaPeriod",
  "profils",
  "setToZeroRecently",
  "teleservices",
  "top",
]
for (const benefit in all_default.benefitsMap) {
  if (benefit.private) {
    continue
  }
  benefits2[benefit] = all_default.benefitsMap[benefit]
  benefits2[benefit].institution = {
    label: benefits2[benefit].institution.label,
    imgSrc: benefits2[benefit].institution.imgSrc,
  }
  for (let key of excludeKeys) {
    if (benefits2[benefit][key]) {
      delete benefits2[benefit][key]
    }
  }
}
var benefits_default = benefits2

// rollup/generator.rollup.ts
var generator_rollup_default = {
  name: "data generator",
  resolveId: (source) => {
    if (
      source === "generator:institutions" ||
      source === "generator:benefits"
    ) {
      return source
    }
    return null
  },
  load: async (id) => {
    if (id === "generator:institutions") {
      return `export default ${JSON.stringify(institutions_default)}`
    } else if (id === "generator:benefits") {
      return `export default ${JSON.stringify(benefits_default)}`
    }
  },
}

// vite.config.ts
var __vite_injected_original_import_meta_url4 =
  "file:///Users/valandriani/Code/Beta-gouv-Aides-jeunes/aides-jeunes/vite.config.ts"
var __dirname3 = new URL(".", __vite_injected_original_import_meta_url4)
  .pathname
var { baseURL, github, matomo, netlifyContributionURL, statistics } =
  config_default
var vite_config_default = defineConfig(async ({ mode }) => {
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ""))
  const viteEnvironment = {
    VITE_BENEFIT_COUNT: all_default.all.filter((benefit) => !benefit.private)
      .length,
    VITE_MATOMO_ID: matomo.id,
    VITE_CONTACT_EMAIL: "aides-jeunes@beta.gouv.fr",
    VITE_CONTEXT_NAME: "1jeune1solution",
    VITE_BASE_URL: baseURL,
    VITE_CONTEXT: process.env.NODE_ENV,
    VITE_PR_URL: `${process.env.REPOSITORY_URL}/pull/${process.env.REVIEW_ID}`,
    VITE_REPOSITORY_URL: github.repository_url,
    VITE_BENEFIT_URL: `${github.repository_url}/blob/master/data/benefits`,
    VITE_NETLIFY_CONTRIBUTION_URL: netlifyContributionURL,
    VITE_STATS_URL: (statistics == null ? void 0 : statistics.url)
      ? statistics.url
      : "",
    VITE_STATS_VERSION: statistics == null ? void 0 : statistics.version,
    VITE_NETLIFY_PR: process.env.BRANCH,
    VITE_1J1S_URL: "https://www.1jeune1solution.gouv.fr",
  }
  viteEnvironment.VITE_TITLE = `\xC9valuez vos droits aux aides avec le simulateur de ${viteEnvironment.VITE_CONTEXT_NAME}`
  viteEnvironment.VITE_DESCRIPTION = `7 minutes suffisent pour \xE9valuer vos droits \xE0 ${viteEnvironment.VITE_BENEFIT_COUNT} aides avec le simulateur de ${viteEnvironment.VITE_CONTEXT_NAME}.`
  return {
    server: {
      port: 8080,
      strictPort: true,
    },
    build: {
      rollupOptions: {
        plugins: [],
      },
      commonjsOptions: {
        exclude: ["lib"],
      },
      emptyOutDir: false,
    },
    plugins: [
      generator_rollup_default,
      vue(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            VITE_TITLE: viteEnvironment.VITE_TITLE,
            VITE_DESCRIPTION: viteEnvironment.VITE_DESCRIPTION,
            VITE_BASE_URL: viteEnvironment.VITE_BASE_URL,
            VITE_CONTEXT_NAME: viteEnvironment.VITE_CONTEXT_NAME,
          },
        },
      }),
      legacy({
        targets: ["defaults"],
      }),
      visualizer(),
    ],
    resolve: {
      preferBuiltins: false,
      alias: {
        "@": path2.resolve(__dirname3, "src"),
        "@lib": path2.resolve(__dirname3, "lib"),
        "@data": path2.resolve(__dirname3, "data"),
      },
    },
    define: {
      "process.env": viteEnvironment,
    },
  }
})
export { vite_config_default as default }
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiYmFja2VuZC9jb25maWcvaW5kZXgudHMiLCAiZGF0YS9hbGwudHMiLCAiZGF0YS9iZW5lZml0cy9hZGRpdGlvbmFsLWF0dHJpYnV0ZXMvaW5kZXgudHMiLCAiZGF0YS9iZW5lZml0cy9hZGRpdGlvbmFsLWF0dHJpYnV0ZXMvb2NjaXRhbmllLWNhcnRlLXRyYW5zcG9ydC1zY29sYWlyZS1saW8udHMiLCAiZGF0YS9iZW5lZml0cy9haWRlcy12ZWxvLWdlbmVyYXRvci50cyIsICJkYXRhL2JlbmVmaXRzL2R5bmFtaWMvZnNsLnRzIiwgImRhdGEvYmVuZWZpdHMvZHluYW1pYy9hcGEudHMiLCAiZGF0YS9pbmRleC50cyIsICJyb2xsdXAvaW5zdGl0dXRpb25zLnRzIiwgInJvbGx1cC9iZW5lZml0cy50cyIsICJyb2xsdXAvZ2VuZXJhdG9yLnJvbGx1cC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy92YWxhbmRyaWFuaS9Db2RlL0JldGEtZ291di1BaWRlcy1qZXVuZXMvYWlkZXMtamV1bmVzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvdmFsYW5kcmlhbmkvQ29kZS9CZXRhLWdvdXYtQWlkZXMtamV1bmVzL2FpZGVzLWpldW5lcy92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvdmFsYW5kcmlhbmkvQ29kZS9CZXRhLWdvdXYtQWlkZXMtamV1bmVzL2FpZGVzLWpldW5lcy92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiXG5pbXBvcnQgbGVnYWN5IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1sZWdhY3lcIlxuaW1wb3J0IHsgY3JlYXRlSHRtbFBsdWdpbiB9IGZyb20gXCJ2aXRlLXBsdWdpbi1odG1sXCJcblxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIlxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSBcInZpdGVcIlxuXG5jb25zdCBfX2Rpcm5hbWUgPSBuZXcgVVJMKFwiLlwiLCBpbXBvcnQubWV0YS51cmwpLnBhdGhuYW1lXG5cbmltcG9ydCBjb25maWcgZnJvbSBcIi4vYmFja2VuZC9jb25maWcvaW5kZXhcIlxuaW1wb3J0IGJlbmVmaXRzIGZyb20gXCIuL2RhdGEvYWxsXCJcblxuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gXCJyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXJcIlxuaW1wb3J0IGdlbmVyYXRvciBmcm9tIFwiLi9yb2xsdXAvZ2VuZXJhdG9yLnJvbGx1cFwiXG5cbmNvbnN0IHsgYmFzZVVSTCwgZ2l0aHViLCBtYXRvbW8sIG5ldGxpZnlDb250cmlidXRpb25VUkwsIHN0YXRpc3RpY3MgfSA9IGNvbmZpZ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoYXN5bmMgKHsgbW9kZSB9KSA9PiB7XG4gIHByb2Nlc3MuZW52ID0gT2JqZWN0LmFzc2lnbihwcm9jZXNzLmVudiwgbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCBcIlwiKSlcbiAgY29uc3Qgdml0ZUVudmlyb25tZW50ID0ge1xuICAgIFZJVEVfQkVORUZJVF9DT1VOVDogYmVuZWZpdHMuYWxsLmZpbHRlcigoYmVuZWZpdCkgPT4gIWJlbmVmaXQucHJpdmF0ZSlcbiAgICAgIC5sZW5ndGgsXG4gICAgVklURV9NQVRPTU9fSUQ6IG1hdG9tby5pZCxcbiAgICBWSVRFX0NPTlRBQ1RfRU1BSUw6IFwiYWlkZXMtamV1bmVzQGJldGEuZ291di5mclwiLFxuICAgIFZJVEVfQ09OVEVYVF9OQU1FOiBcIjFqZXVuZTFzb2x1dGlvblwiLFxuICAgIFZJVEVfQkFTRV9VUkw6IGJhc2VVUkwsXG4gICAgVklURV9DT05URVhUOiBwcm9jZXNzLmVudi5OT0RFX0VOVixcbiAgICBWSVRFX1BSX1VSTDogYCR7cHJvY2Vzcy5lbnYuUkVQT1NJVE9SWV9VUkx9L3B1bGwvJHtwcm9jZXNzLmVudi5SRVZJRVdfSUR9YCxcbiAgICBWSVRFX1JFUE9TSVRPUllfVVJMOiBnaXRodWIucmVwb3NpdG9yeV91cmwsXG4gICAgVklURV9CRU5FRklUX1VSTDogYCR7Z2l0aHViLnJlcG9zaXRvcnlfdXJsfS9ibG9iL21hc3Rlci9kYXRhL2JlbmVmaXRzYCxcbiAgICBWSVRFX05FVExJRllfQ09OVFJJQlVUSU9OX1VSTDogbmV0bGlmeUNvbnRyaWJ1dGlvblVSTCxcbiAgICBWSVRFX1NUQVRTX1VSTDogc3RhdGlzdGljcz8udXJsID8gc3RhdGlzdGljcy51cmwgOiBcIlwiLFxuICAgIFZJVEVfU1RBVFNfVkVSU0lPTjogc3RhdGlzdGljcz8udmVyc2lvbixcbiAgICBWSVRFX05FVExJRllfUFI6IHByb2Nlc3MuZW52LkJSQU5DSCxcbiAgICBWSVRFXzFKMVNfVVJMOiBcImh0dHBzOi8vd3d3LjFqZXVuZTFzb2x1dGlvbi5nb3V2LmZyXCIsXG4gIH1cbiAgdml0ZUVudmlyb25tZW50LlZJVEVfVElUTEUgPSBgXHUwMEM5dmFsdWV6IHZvcyBkcm9pdHMgYXV4IGFpZGVzIGF2ZWMgbGUgc2ltdWxhdGV1ciBkZSAke3ZpdGVFbnZpcm9ubWVudC5WSVRFX0NPTlRFWFRfTkFNRX1gXG4gIHZpdGVFbnZpcm9ubWVudC5WSVRFX0RFU0NSSVBUSU9OID0gYDcgbWludXRlcyBzdWZmaXNlbnQgcG91ciBcdTAwRTl2YWx1ZXIgdm9zIGRyb2l0cyBcdTAwRTAgJHt2aXRlRW52aXJvbm1lbnQuVklURV9CRU5FRklUX0NPVU5UfSBhaWRlcyBhdmVjIGxlIHNpbXVsYXRldXIgZGUgJHt2aXRlRW52aXJvbm1lbnQuVklURV9DT05URVhUX05BTUV9LmBcbiAgcmV0dXJuIHtcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIHBvcnQ6IDgwODAsXG4gICAgICBzdHJpY3RQb3J0OiB0cnVlLFxuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgcGx1Z2luczogW10sXG4gICAgICB9LFxuICAgICAgY29tbW9uanNPcHRpb25zOiB7XG4gICAgICAgIGV4Y2x1ZGU6IFtcImxpYlwiXSxcbiAgICAgIH0sXG4gICAgICBlbXB0eU91dERpcjogZmFsc2UsXG4gICAgfSxcbiAgICBwbHVnaW5zOiBbXG4gICAgICBnZW5lcmF0b3IsXG4gICAgICB2dWUoKSxcbiAgICAgIGNyZWF0ZUh0bWxQbHVnaW4oe1xuICAgICAgICBtaW5pZnk6IHRydWUsXG4gICAgICAgIGluamVjdDoge1xuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIFZJVEVfVElUTEU6IHZpdGVFbnZpcm9ubWVudC5WSVRFX1RJVExFLFxuICAgICAgICAgICAgVklURV9ERVNDUklQVElPTjogdml0ZUVudmlyb25tZW50LlZJVEVfREVTQ1JJUFRJT04sXG4gICAgICAgICAgICBWSVRFX0JBU0VfVVJMOiB2aXRlRW52aXJvbm1lbnQuVklURV9CQVNFX1VSTCxcbiAgICAgICAgICAgIFZJVEVfQ09OVEVYVF9OQU1FOiB2aXRlRW52aXJvbm1lbnQuVklURV9DT05URVhUX05BTUUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgbGVnYWN5KHtcbiAgICAgICAgdGFyZ2V0czogW1wiZGVmYXVsdHNcIl0sXG4gICAgICB9KSxcbiAgICAgIHZpc3VhbGl6ZXIoKSxcbiAgICBdLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIHByZWZlckJ1aWx0aW5zOiBmYWxzZSxcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyY1wiKSxcbiAgICAgICAgXCJAbGliXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwibGliXCIpLFxuICAgICAgICBcIkBkYXRhXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiZGF0YVwiKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBkZWZpbmU6IHtcbiAgICAgIFwicHJvY2Vzcy5lbnZcIjogdml0ZUVudmlyb25tZW50LFxuICAgIH0sXG4gIH1cbn0pXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy92YWxhbmRyaWFuaS9Db2RlL0JldGEtZ291di1BaWRlcy1qZXVuZXMvYWlkZXMtamV1bmVzL2JhY2tlbmQvY29uZmlnXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvdmFsYW5kcmlhbmkvQ29kZS9CZXRhLWdvdXYtQWlkZXMtamV1bmVzL2FpZGVzLWpldW5lcy9iYWNrZW5kL2NvbmZpZy9pbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvdmFsYW5kcmlhbmkvQ29kZS9CZXRhLWdvdXYtQWlkZXMtamV1bmVzL2FpZGVzLWpldW5lcy9iYWNrZW5kL2NvbmZpZy9pbmRleC50c1wiOy8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbmltcG9ydCB7IENvbmZpZ3VyYXRpb25MYXlvdXQgfSBmcm9tIFwiLi4vdHlwZXMvY29uZmlnLmpzXCJcbmNvbnN0IF9fZGlybmFtZSA9IG5ldyBVUkwoXCIuXCIsIGltcG9ydC5tZXRhLnVybCkucGF0aG5hbWVcblxuY29uc3QgZW52ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgfHwgXCJkZXZlbG9wbWVudFwiXG5cbmNvbnN0IGFsbDogQ29uZmlndXJhdGlvbkxheW91dCA9IHtcbiAgZW52OiBlbnYsXG4gIGFuaW1hdGlvbjoge1xuICAgIGRlbGF5OiBOdW1iZXIocHJvY2Vzcy5lbnYuQU5JTUFUSU9OX0RFTEFZKSB8fCAzMDAsXG4gIH0sXG4gIGJhc2VVUkw6XG4gICAgcHJvY2Vzcy5lbnYuTUVTX0FJREVTX1JPT1RfVVJMIHx8XG4gICAgXCJodHRwczovL21lcy1haWRlcy4xamV1bmUxc29sdXRpb24uYmV0YS5nb3V2LmZyXCIsXG4gIG9wZW5maXNjYVVSTDpcbiAgICBwcm9jZXNzLmVudi5PUEVORklTQ0FfSU5URVJOQUxfUk9PVF9VUkwgfHwgXCJodHRwOi8vbG9jYWxob3N0OjIwMDBcIixcbiAgb3BlbmZpc2NhQXhlVVJMOiBcImh0dHBzOi8vYmV0YWdvdXYuZ2l0aHViLmlvL21lcy1haWRlcy1jaGFuZ2VudFwiLFxuICBvcGVuZmlzY2FQdWJsaWNVUkw6XG4gICAgcHJvY2Vzcy5lbnYuT1BFTkZJU0NBX1BVQkxJQ19ST09UX1VSTCB8fFxuICAgIFwiaHR0cHM6Ly9vcGVuZmlzY2EubWVzLWFpZGVzLjFqZXVuZTFzb2x1dGlvbi5iZXRhLmdvdXYuZnJcIixcbiAgb3BlbmZpc2NhVHJhY2VyVVJMOiBcImh0dHBzOi8vb3BlbmZpc2NhLmdpdGh1Yi5pby90cmFjZXJcIixcbiAgbmV0bGlmeUNvbnRyaWJ1dGlvblVSTDpcbiAgICBwcm9jZXNzLmVudi5ORVRMSUZZX0NPTlRSSUJVVElPTl9VUkwgfHxcbiAgICBcImh0dHBzOi8vY29udHJpYnVlci1haWRlcy1qZXVuZXMubmV0bGlmeS5hcHBcIixcbiAgc2VuZEluQmx1ZToge1xuICAgIGFwaUtleTogcHJvY2Vzcy5lbnYuU0VORF9JTl9CTFVFX1BSSVZBVEVfS0VZIHx8IFwicHJpdmF0ZUtleVwiLFxuICB9LFxuICBnaXRodWI6IHtcbiAgICByZXBvc2l0b3J5X3VybDogXCJodHRwczovL2dpdGh1Yi5jb20vYmV0YWdvdXYvYWlkZXMtamV1bmVzXCIsXG4gICAgYWNjZXNzX3Rva2VuX3VybDogXCJodHRwczovL2dpdGh1Yi5jb20vbG9naW4vb2F1dGgvYWNjZXNzX3Rva2VuXCIsXG4gICAgYXV0aGVudGljYXRlZF91cmw6IFwiaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS91c2VyXCIsXG4gICAgYXV0aG9yaXplX3VybDogXCJodHRwczovL2dpdGh1Yi5jb20vbG9naW4vb2F1dGgvYXV0aG9yaXplXCIsXG4gICAgY2xpZW50X3NlY3JldDogcHJvY2Vzcy5lbnYuR0lUSFVCX0NMSUVOVF9TRUNSRVQgfHwgXCJcIixcbiAgICBjbGllbnRfaWQ6IHByb2Nlc3MuZW52LkdJVEhVQl9DTElFTlRfSUQgfHwgXCJcIixcbiAgICBhdXRob3JpemVkX3VzZXJzOiBbXG4gICAgICBcImFsaXplZWVlZWVlXCIsXG4gICAgICBcIkFsbGFuLUNvZGVXb3Jrc1wiLFxuICAgICAgXCJDdWduaWVyZVwiLFxuICAgICAgXCJndWlsbGV0dFwiLFxuICAgICAgXCJzaGFtemljXCIsXG4gICAgICBcInlhc21pbmUtZ2xpdGNoXCIsXG4gICAgICBcIlZhbGFuZHJcIixcbiAgICBdLFxuICB9LFxuICBtYXRvbW86IHtcbiAgICBpZDogTnVtYmVyKHByb2Nlc3MuZW52Lk1BVE9NT19JRCkgfHwgMTY1LFxuICB9LFxuICBzdGF0aXN0aWNzOiB7XG4gICAgdXJsOlxuICAgICAgcHJvY2Vzcy5lbnYuVklURV9TVEFUU19VUkwgfHxcbiAgICAgIFwiaHR0cHM6Ly9haWRlcy1qZXVuZXMtc3RhdHMtcmVjb3JkZXIub3NjLWZyMS5zY2FsaW5nby5pby9iZW5lZml0c1wiLFxuICAgIHZlcnNpb246IE51bWJlcihwcm9jZXNzLmVudi5WSVRFX1NUQVRTX1ZFUlNJT04pIHx8IDIsXG4gIH0sXG4gIG1vbmdvOiB7XG4gICAgdXJpOiBwcm9jZXNzLmVudi5NT05HT0RCX1VSTCB8fCBcIm1vbmdvZGI6Ly9sb2NhbGhvc3QvZGJfYWlkZXNfamV1bmVzXCIsXG4gICAgb3B0aW9uczoge1xuICAgICAgdXNlVW5pZmllZFRvcG9sb2d5OiB0cnVlLFxuICAgICAgdXNlTmV3VXJsUGFyc2VyOiB0cnVlLFxuICAgIH0sXG4gIH0sXG4gIHNlc3Npb25TZWNyZXQ6IHByb2Nlc3MuZW52LlNFU1NJT05fU0VDUkVUIHx8IFwiZmdoamRmamtkZjc4NWEtanJldVwiLFxuICBtYXR0ZXJtb3N0X3Bvc3RfdXJsOiBwcm9jZXNzLmVudi5NQVRURVJNT1NUX1BPU1RfVVJMIHx8IFwiXCIsXG4gIGlmcmFtZVRpdGxlOlxuICAgIFwiXHUwMEM5dmFsdWV6IHZvcyBkcm9pdHMgYXV4IGFpZGVzIGF2ZWMgbGUgc2ltdWxhdGV1ciBkZSAxamV1bmUxc29sdXRpb25cIixcbn1cblxubGV0IG92ZXJyaWRlID0ge31cbnRyeSB7XG4gIGNvbnN0IGxvYWRkZWRDb25maWd1cmF0aW9uID0gYXdhaXQgaW1wb3J0KGAke19fZGlybmFtZX0ke2Vudn0uanNgKVxuICBvdmVycmlkZSA9IGxvYWRkZWRDb25maWd1cmF0aW9uPy5kZWZhdWx0XG4gIGlmIChlbnYgIT09IFwidGVzdFwiKSB7XG4gICAgY29uc29sZS5pbmZvKGBVc2luZyBzcGVjaWZpYyBjb25maWd1cmF0aW9uIGZvciAke2Vudn0uYClcbiAgfVxufSBjYXRjaCAoZSkge1xuICBjb25zb2xlLndhcm4oYE5vIHNwZWNpZmljIGNvbmZpZ3VyYXRpb24gZm9yICR7ZW52fWApXG59XG5cbmNvbnN0IGNvbmZpZyA9IE9iamVjdC5hc3NpZ24oYWxsLCBvdmVycmlkZSlcbmV4cG9ydCBkZWZhdWx0IGNvbmZpZ1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvdmFsYW5kcmlhbmkvQ29kZS9CZXRhLWdvdXYtQWlkZXMtamV1bmVzL2FpZGVzLWpldW5lcy9kYXRhXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvdmFsYW5kcmlhbmkvQ29kZS9CZXRhLWdvdXYtQWlkZXMtamV1bmVzL2FpZGVzLWpldW5lcy9kYXRhL2FsbC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvdmFsYW5kcmlhbmkvQ29kZS9CZXRhLWdvdXYtQWlkZXMtamV1bmVzL2FpZGVzLWpldW5lcy9kYXRhL2FsbC50c1wiO2ltcG9ydCB7IGV4aXN0c1N5bmMgfSBmcm9tIFwibm9kZTpmc1wiXG5pbXBvcnQgYmFzZSBmcm9tIFwiLi9pbmRleC5qc1wiXG5pbXBvcnQgamFtc3RhY2tMb2FkZXIgZnJvbSBcImphbXN0YWNrLWxvYWRlclwiXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiXG5cbmNvbnN0IF9fZGlybmFtZSA9IG5ldyBVUkwoXCIuXCIsIGltcG9ydC5tZXRhLnVybCkucGF0aG5hbWVcbmxldCBjb25maWdGaWxlID0gcGF0aC5qb2luKF9fZGlybmFtZSwgXCIuLi9jb250cmlidWVyL3B1YmxpYy9hZG1pbi9jb25maWcueW1sXCIpXG5sZXQgamFtc3RhY2tcbmlmIChleGlzdHNTeW5jKGNvbmZpZ0ZpbGUpKSB7XG4gIGphbXN0YWNrID0gamFtc3RhY2tMb2FkZXIuZ2V0KGNvbmZpZ0ZpbGUpXG59IGVsc2Uge1xuICBjb25maWdGaWxlID0gcGF0aC5qb2luKF9fZGlybmFtZSwgXCIuLi8uLi9jb250cmlidWVyL3B1YmxpYy9hZG1pbi9jb25maWcueW1sXCIpXG4gIGphbXN0YWNrID0gamFtc3RhY2tMb2FkZXIuZ2V0KGAke2NvbmZpZ0ZpbGV9YClcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmFzZS5nZW5lcmF0ZShqYW1zdGFjaylcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3ZhbGFuZHJpYW5pL0NvZGUvQmV0YS1nb3V2LUFpZGVzLWpldW5lcy9haWRlcy1qZXVuZXMvZGF0YS9iZW5lZml0cy9hZGRpdGlvbmFsLWF0dHJpYnV0ZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy92YWxhbmRyaWFuaS9Db2RlL0JldGEtZ291di1BaWRlcy1qZXVuZXMvYWlkZXMtamV1bmVzL2RhdGEvYmVuZWZpdHMvYWRkaXRpb25hbC1hdHRyaWJ1dGVzL2luZGV4LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy92YWxhbmRyaWFuaS9Db2RlL0JldGEtZ291di1BaWRlcy1qZXVuZXMvYWlkZXMtamV1bmVzL2RhdGEvYmVuZWZpdHMvYWRkaXRpb25hbC1hdHRyaWJ1dGVzL2luZGV4LnRzXCI7XCJ1c2Ugc3RyaWN0XCJcblxuaW1wb3J0IGRheWpzIGZyb20gXCJkYXlqc1wiXG5cbmltcG9ydCB7IGJlbmVmaXRMYXlvdXQgfSBmcm9tIFwiLi4vLi4vdHlwZXMvYmVuZWZpdHMuanNcIlxuaW1wb3J0IHsgb3BlbmZpc2NhUGFyYW1ldGVyc0xheW91dCB9IGZyb20gXCIuLi8uLi8uLi9saWIvdHlwZXMvcGFyYW1ldGVycy5qc1wiXG5pbXBvcnQgeyBzaXR1YXRpb25zTGF5b3V0IH0gZnJvbSBcIi4uLy4uLy4uL2xpYi90eXBlcy9zaXR1YXRpb25zLmpzXCJcblxuaW1wb3J0IG9jY2l0YW5pZV9jYXJ0ZV90cmFuc3BvcnRfc2NvbGFpcmVfbGlvIGZyb20gXCIuL29jY2l0YW5pZS1jYXJ0ZS10cmFuc3BvcnQtc2NvbGFpcmUtbGlvLmpzXCJcblxuZXhwb3J0IGNvbnN0IGFkZGl0aW9uYWxCZW5lZml0QXR0cmlidXRlcyA9IHtcbiAgY3NzX3BhcnRpY2lwYXRpb25fZm9yZmFpdGFpcmU6IHtcbiAgICBleHRyYTogW1xuICAgICAge1xuICAgICAgICBpZDogXCJjbXVfY1wiLFxuICAgICAgICBlbnRpdHk6IFwiZmFtaWxsZXNcIixcbiAgICAgICAgdHlwZTogXCJib29sXCIsXG4gICAgICAgIG9wZW5maXNjYVBlcmlvZDogXCJ0aGlzTW9udGhcIixcbiAgICAgIH0sXG4gICAgXSxcbiAgICBjb21wdXRlOiBmdW5jdGlvbiAocmVzdWx0LCBwZXJpb2QpIHtcbiAgICAgIHJldHVybiByZXN1bHQuY211X2M/LltwZXJpb2RdXG4gICAgICAgID8gdHJ1ZVxuICAgICAgICA6IHJlc3VsdC5jc3NfcGFydGljaXBhdGlvbl9mb3JmYWl0YWlyZT8uW3BlcmlvZF0gfHwgMFxuICAgIH0sXG4gIH0sXG4gIHJzYToge1xuICAgIGxhYmVsRnVuY3Rpb246IGZ1bmN0aW9uIChiOiBiZW5lZml0TGF5b3V0KSB7XG4gICAgICByZXR1cm4gYCR7Yi5sYWJlbH0gcG91ciB1biBtb250YW50IGRlICR7Yi5tb250YW50fSBcdTIwQUMgLyBtb2lzIHBlbmRhbnQgMyBtb2lzYFxuICAgIH0sXG4gICAgdW5jb21wdXRhYmlsaXR5OiB7XG4gICAgICB0bnM6IHtcbiAgICAgICAgcmVhc29uOiB7XG4gICAgICAgICAgdXNlcjogXCJ2b3VzIGF2ZXogZGVzIHJldmVudXMgZW4gdGFudCBxdVx1MjAxOWluZFx1MDBFOXBlbmRhbnRcdTAwQjdlXCIsXG4gICAgICAgICAgYWRtaW46IFwibGUgZGVtYW5kZXVyIGEgZGVzIHJldmVudXMgZW4gdGFudCBxdVx1MjAxOWluZFx1MDBFOXBlbmRhbnRcdTAwQjdlXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHNvbHV0aW9uOlxuICAgICAgICAgICdWb3VzIHBvdXZleiBkZW1hbmRlciBcdTAwRTAgYlx1MDBFOW5cdTAwRTlmaWNpZXIgZHUgUlNBLCBtYWlzIGNcdTIwMTllc3QgbGUgcHJcdTAwRTlzaWRlbnQgZGUgdm90cmUgY29uc2VpbCBkXHUwMEU5cGFydGVtZW50YWwgcXVpIDxhIHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vb3BlbmVyXCIgdGl0bGU9XCJBcnRpY2xlIFIyNjItMjMgZHUgY29kZSBkZSBsXHUyMDE5YWN0aW9uIHNvY2lhbGUgLSBOb3V2ZWxsZSBmZW5cdTAwRUF0cmVcIiBocmVmPVwiaHR0cHM6Ly93d3cubGVnaWZyYW5jZS5nb3V2LmZyL2FmZmljaENvZGVBcnRpY2xlLmRvP2lkQXJ0aWNsZT1MRUdJQVJUSTAwMDAyODI1MTc5OSZjaWRUZXh0ZT1MRUdJVEVYVDAwMDAwNjA3NDA2OVwiPmRcdTAwRTljaWRlcmE8L2E+IGRlIGxhIG1hbmlcdTAwRThyZSBkb250IHZvcyByZXZlbnVzIG5vbiBzYWxhcmlcdTAwRTlzIGltcGFjdGVyb250IGxlIG1vbnRhbnQgZGUgdm90cmUgYWlkZS4nLFxuICAgICAgfSxcbiAgICAgIGNvbmpvaW50X3Ruczoge1xuICAgICAgICByZWFzb246IHtcbiAgICAgICAgICB1c2VyOiBcInZvdHJlIGNvbmpvaW50XHUwMEI3ZSBhIGRlcyByZXZlbnVzIGVuIHRhbnQgcXVcdTIwMTlpbmRcdTAwRTlwZW5kYW50XHUwMEI3ZVwiLFxuICAgICAgICAgIGFkbWluOlxuICAgICAgICAgICAgXCJsZSBjb25qb2ludCBkdSBkZW1hbmRldXIgYSBkZXMgcmV2ZW51cyBlbiB0YW50IHF1XHUyMDE5aW5kXHUwMEU5cGVuZGFudFx1MDBCN2VcIixcbiAgICAgICAgfSxcbiAgICAgICAgc29sdXRpb246XG4gICAgICAgICAgJ1ZvdXMgcG91dmV6IGRlbWFuZGVyIFx1MDBFMCBiXHUwMEU5blx1MDBFOWZpY2llciBkdSBSU0EsIG1haXMgY1x1MjAxOWVzdCBsZSBwclx1MDBFOXNpZGVudCBkZSB2b3RyZSBjb25zZWlsIGRcdTAwRTlwYXJ0ZW1lbnRhbCBxdWkgPGEgdGFyZ2V0PVwiX2JsYW5rXCIgcmVsPVwibm9vcGVuZXJcIiB0aXRsZT1cIkFydGljbGUgUjI2Mi0yMyBkdSBjb2RlIGRlIGxcdTIwMTlhY3Rpb24gc29jaWFsZSAtIE5vdXZlbGxlIGZlblx1MDBFQXRyZVwiIGhyZWY9XCJodHRwczovL3d3dy5sZWdpZnJhbmNlLmdvdXYuZnIvYWZmaWNoQ29kZUFydGljbGUuZG8/aWRBcnRpY2xlPUxFR0lBUlRJMDAwMDI4MjUxNzk5JmNpZFRleHRlPUxFR0lURVhUMDAwMDA2MDc0MDY5XCI+ZFx1MDBFOWNpZGVyYTwvYT4gZGUgbGEgbWFuaVx1MDBFOHJlIGRvbnQgbGVzIHJldmVudXMgbm9uIHNhbGFyaVx1MDBFOXMgZGUgdm90cmUgY29uam9pbnRcdTAwQjdlIGltcGFjdGVyb250IGxlIG1vbnRhbnQgZGUgdm90cmUgYWlkZS4nLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGN1c3RvbWl6YXRpb246IHtcbiAgICAgIEQ5Mzoge1xuICAgICAgICBsaW5rOiBcImh0dHBzOi8vd3d3LnNlaW5lLXNhaW50LWRlbmlzLmZyL0lNRy9wZGYvZ3VpZGVfcnNhX2E1XzhwLTIwMTQucGRmXCIsXG4gICAgICB9LFxuICAgICAgRDc1OiB7XG4gICAgICAgIGZvcm06IHVuZGVmaW5lZCwgLy8gUHJldmVudCBkZWZhdWx0IGZvcm0gcmVjeWNsaW5nXG4gICAgICAgIHRlbGVzZXJ2aWNlOlxuICAgICAgICAgIFwiaHR0cHM6Ly93d3cucGFyaXMuZnIvcnNhI291LWV0LWNvbW1lbnQtZmFpcmUtdW5lLWRlbWFuZGUtZGUtcnNhXzZcIixcbiAgICAgIH0sXG4gICAgICBNMjAwMDQ2OTc3OiB7XG4gICAgICAgIGluc3RpdHV0aW9uOiB7XG4gICAgICAgICAgaW1nU3JjOiBcImltZy9sb2dvX2x5b25fbWV0cm9wb2xlLnBuZ1wiLFxuICAgICAgICB9LFxuICAgICAgICBsaW5rOiBcImh0dHBzOi8vd3d3LmdyYW5kbHlvbi5jb20vc2VydmljZXMvcnNhLW1vZGUtZC1lbXBsb2kuaHRtbFwiLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBcImNvaGVzaW9uLXRlcnJpdG9pcmVzLWNvbnNlaWxsZXJzLW51bWVyaXF1ZXMtZnJhbmNlLXNlcnZpY2VzXCI6IHtcbiAgICBpbnN0cnVjdGlvbnNHZW5lcmF0b3I6IChjb2RlUG9zdGFsKSA9PiB7XG4gICAgICBpZiAoIWNvZGVQb3N0YWwpIHtcbiAgICAgICAgcmV0dXJuIFwiaHR0cHM6Ly9jYXJ0b2dyYXBoaWUuY29uc2VpbGxlci1udW1lcmlxdWUuZ291di5mci9cIlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGBodHRwczovL2NhcnRvZ3JhcGhpZS5jb25zZWlsbGVyLW51bWVyaXF1ZS5nb3V2LmZyLz9hZGRyZXNzPSR7Y29kZVBvc3RhbH1gXG4gICAgICB9XG4gICAgfSxcbiAgfSxcbiAgYWlkZV9sb2dlbWVudDoge1xuICAgIGNvbXB1dGVVbmV4cGVjdGVkQW1vdW50OiAoc2l0dWF0aW9uOiBzaXR1YXRpb25zTGF5b3V0KSA9PiB7XG4gICAgICAvLyBub3QgaWRlYWwgYmVjYXVzZSB3ZSBhcmUgbm90IGNvbXB1dGluZyBvdGhlciBpbmNvbWVzID0+IGJ1dCBjb3ZlcnMgOTAlIG9mIHRoZSBjYXNlc1xuICAgICAgY29uc3Qgc2FsYXJ5OiBudW1iZXIgPSBzaXR1YXRpb24/LmRlbWFuZGV1cj8uc2FsYWlyZV9uZXRcbiAgICAgICAgPyBPYmplY3QudmFsdWVzKHNpdHVhdGlvbi5kZW1hbmRldXIuc2FsYWlyZV9uZXQpLnJlZHVjZShcbiAgICAgICAgICAgIChhY2MsIHZhbHVlKTogbnVtYmVyID0+IGFjYyArIHZhbHVlLFxuICAgICAgICAgICAgMFxuICAgICAgICAgIClcbiAgICAgICAgOiAwXG4gICAgICByZXR1cm4gc2l0dWF0aW9uPy5kZW1hbmRldXI/LmFjdGl2aXRlID09PSBcImV0dWRpYW50XCIgJiYgc2FsYXJ5ID49IDcwMDBcbiAgICB9LFxuICAgIHVuY29tcHV0YWJpbGl0eToge1xuICAgICAgcHJpbW9fYWNjZWRhbnQ6IHtcbiAgICAgICAgcmVhc29uOiB7XG4gICAgICAgICAgdXNlcjogJ3ZvdXMgXHUwMEVBdGVzIDxhYmJyIHRpdGxlPVwiTm9uIHByb3ByaVx1MDBFOXRhaXJlIGRlIHZvdHJlIHJcdTAwRTlzaWRlbmNlIHByaW5jaXBhbGUgZGFucyBsZXMgZGV1eCBhbm5cdTAwRTllcyBwclx1MDBFOWNcdTAwRTlkYW50IGxcdTIwMTlhY2hhdCBkZSB2b3RyZSByXHUwMEU5c2lkZW5jZSBhY3R1ZWxsZVwiPnByaW1vLWFjY1x1MDBFOWRhbnQ8L2FiYnI+IFx1MDBFMCBsYSBwcm9wcmlcdTAwRTl0XHUwMEU5IGRlIHZvdHJlIHJcdTAwRTlzaWRlbmNlIHByaW5jaXBhbGUnLFxuICAgICAgICAgIGFkbWluOiBcImxlIGRlbWFuZGV1ciBlc3QgcHJpbW8tYWNjXHUwMEU5ZGFudCBkZSBzYSByXHUwMEU5c2lkZW5jZSBwcmluY2lwYWxlXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHNvbHV0aW9uOlxuICAgICAgICAgICdMZSA8YSB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub29wZW5lclwiIHRpdGxlPVwic2ltdWxhdGV1ciBkZSBsYSBDQUYgLSBOb3V2ZWxsZSBmZW5cdTAwRUF0cmVcIiBocmVmPVwiaHR0cHM6Ly93d3dkLmNhZi5mci93cHMvcG9ydGFsL2NhZmZyL2FpZGVzZXRzZXJ2aWNlcy9sZXNzZXJ2aWNlc2VubGlnbmUvZXN0aW1lcnZvc2Ryb2l0cy9sZWxvZ2VtZW50XCI+c2ltdWxhdGV1ciBkZSBsYSBDQUY8L2E+IHBvdXJyYSBlc3RpbWVyIHZvcyBkcm9pdHMgc3VyIGxhIGJhc2UgZGUgbGEgdmFsZXVyIGRlIHZvdHJlIGJpZW4uJyxcbiAgICAgIH0sXG4gICAgICBsb2NhdGFpcmVfZm95ZXI6IHtcbiAgICAgICAgcmVhc29uOiB7XG4gICAgICAgICAgdXNlcjogXCJ2b3VzIGxvZ2V6IGRhbnMgdW4gZm95ZXJcIixcbiAgICAgICAgICBhZG1pbjogXCJsZSBkZW1hbmRldXIgbG9nZSBkYW5zIHVuIGZveWVyXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHNvbHV0aW9uOlxuICAgICAgICAgICdMZSA8YSB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub29wZW5lclwiIHRpdGxlPVwic2ltdWxhdGV1ciBkZSBsYSBDQUYgLSBOb3V2ZWxsZSBmZW5cdTAwRUF0cmVcIiBocmVmPVwiaHR0cHM6Ly93d3dkLmNhZi5mci93cHMvcG9ydGFsL2NhZmZyL2FpZGVzZXRzZXJ2aWNlcy9sZXNzZXJ2aWNlc2VubGlnbmUvZXN0aW1lcnZvc2Ryb2l0cy9sZWxvZ2VtZW50XCI+c2ltdWxhdGV1ciBkZSBsYSBDQUY8L2E+IHZvdXMgZG9ubmVyYSBkZXMgZXN0aW1hdGlvbnMgc2Vsb24gbGVzIGRpZmZcdTAwRTlyZW50ZXMgY29udmVudGlvbnMgcG9zc2libGVzIGRlIHZvdHJlIGZveWVyLicsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHBwYToge1xuICAgIGxhYmVsRnVuY3Rpb246IGZ1bmN0aW9uIChiKSB7XG4gICAgICByZXR1cm4gYCR7Yi5sYWJlbH0gcG91ciB1biBtb250YW50IGRlICR7Yi5tb250YW50fSBcdTIwQUMgLyBtb2lzIHBlbmRhbnQgMyBtb2lzYFxuICAgIH0sXG4gICAgY29tcHV0ZVVuZXhwZWN0ZWRBbW91bnQoc2l0dWF0aW9uKSB7XG4gICAgICBjb25zdCBtZW5hZ2UgPSBzaXR1YXRpb24ubWVuYWdlXG4gICAgICBjb25zdCBpc1Byb3ByaWV0YWlyZSA9IFtcInByaW1vX2FjY2VkYW50XCIsIFwicHJvcHJpZXRhaXJlXCJdLmluY2x1ZGVzKFxuICAgICAgICBtZW5hZ2Uuc3RhdHV0X29jY3VwYXRpb25fbG9nZW1lbnRcbiAgICAgIClcbiAgICAgIHJldHVybiAoXG4gICAgICAgIChpc1Byb3ByaWV0YWlyZSAmJiBtZW5hZ2UubG95ZXIgPiAwKSB8fFxuICAgICAgICAobWVuYWdlLnN0YXR1dF9vY2N1cGF0aW9uX2xvZ2VtZW50ID09PSBcImxvZ2VfZ3JhdHVpdGVtZW50XCIgJiZcbiAgICAgICAgICBtZW5hZ2UucGFydGljaXBhdGlvbl9mcmFpcylcbiAgICAgIClcbiAgICB9LFxuICB9LFxuICBjb250cmF0X2VuZ2FnZW1lbnRfamV1bmU6IHtcbiAgICBjb21wdXRlVW5leHBlY3RlZEFtb3VudDogKHNpdHVhdGlvbikgPT4ge1xuICAgICAgY29uc3QgZGVtYW5kZXVyID0gc2l0dWF0aW9uLmRlbWFuZGV1clxuICAgICAgY29uc3QgcGVyaW9kID1cbiAgICAgICAgc2l0dWF0aW9uLmRhdGVEZVZhbGV1ciAmJiBkYXlqcyhzaXR1YXRpb24uZGF0ZURlVmFsZXVyKS5mb3JtYXQoXCJZWVlZXCIpXG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIHNpdHVhdGlvbi5kZW1hbmRldXIuaGFiaXRlX2NoZXpfcGFyZW50cyAmJlxuICAgICAgICBkZW1hbmRldXIuZW5mYW50X2FfY2hhcmdlPy5bcGVyaW9kXVxuICAgICAgKVxuICAgIH0sXG4gIH0sXG4gIGxpdnJldF9lcGFyZ25lX3BvcHVsYWlyZV90YXV4OiB7XG4gICAgbGFiZWxGdW5jdGlvbjogZnVuY3Rpb24gKGIpIHtcbiAgICAgIHJldHVybiBgJHtiLmxhYmVsfSBhdmVjIHVuIHRhdXggZGUgJHtiLm1vbnRhbnR9JSBhbiAke2IubGVnZW5kfWBcbiAgICB9LFxuICAgIGxlZ2VuZDogKHBhcmFtZXRlcnM6IG9wZW5maXNjYVBhcmFtZXRlcnNMYXlvdXQpID0+XG4gICAgICBgYXUgbGlldSBkZSAke1xuICAgICAgICBwYXJhbWV0ZXJzW1widGF4YXRpb25fY2FwaXRhbC5lcGFyZ25lLmxpdnJldF9hLnRhdXhcIl0gKiAxMDBcbiAgICAgIH0lYCxcbiAgfSxcbiAgb2NjaXRhbmllX2NhcnRlX3RyYW5zcG9ydF9zY29sYWlyZV9saW8sXG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy92YWxhbmRyaWFuaS9Db2RlL0JldGEtZ291di1BaWRlcy1qZXVuZXMvYWlkZXMtamV1bmVzL2RhdGEvYmVuZWZpdHMvYWRkaXRpb25hbC1hdHRyaWJ1dGVzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvdmFsYW5kcmlhbmkvQ29kZS9CZXRhLWdvdXYtQWlkZXMtamV1bmVzL2FpZGVzLWpldW5lcy9kYXRhL2JlbmVmaXRzL2FkZGl0aW9uYWwtYXR0cmlidXRlcy9vY2NpdGFuaWUtY2FydGUtdHJhbnNwb3J0LXNjb2xhaXJlLWxpby50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvdmFsYW5kcmlhbmkvQ29kZS9CZXRhLWdvdXYtQWlkZXMtamV1bmVzL2FpZGVzLWpldW5lcy9kYXRhL2JlbmVmaXRzL2FkZGl0aW9uYWwtYXR0cmlidXRlcy9vY2NpdGFuaWUtY2FydGUtdHJhbnNwb3J0LXNjb2xhaXJlLWxpby50c1wiO2V4cG9ydCBkZWZhdWx0IHtcbiAgY3VzdG9taXphdGlvbjoge1xuICAgIEQwOToge1xuICAgICAgbGluazogXCJodHRwczovL2xpby5sYXJlZ2lvbi5mci90cmFuc3BvcnRzLWFyaWVnZS1zY29sYWlyZVwiLFxuICAgICAgdGVsZXNlcnZpY2U6IFwiaHR0cHM6Ly9tZXMtdHJhbnNwb3J0cy5sYXJlZ2lvbi5mci91dDA5L3VzYWdlci9cIixcbiAgICB9LFxuICAgIEQxMToge1xuICAgICAgbGluazogXCJodHRwczovL2xpby5sYXJlZ2lvbi5mci90cmFuc3BvcnRzLWF1ZGUtc2NvbGFpcmVcIixcbiAgICAgIHRlbGVzZXJ2aWNlOiBcImh0dHBzOi8vbWVzLXRyYW5zcG9ydHMubGFyZWdpb24uZnIvdXQxMS91c2FnZXIvXCIsXG4gICAgfSxcbiAgICBEMTI6IHtcbiAgICAgIGxpbms6IFwiaHR0cHM6Ly9saW8ubGFyZWdpb24uZnIvdHJhbnNwb3J0cy1hdmV5cm9uLXNjb2xhaXJlXCIsXG4gICAgICB0ZWxlc2VydmljZTogXCJodHRwczovL21lcy10cmFuc3BvcnRzLmxhcmVnaW9uLmZyL3V0MTIvdXNhZ2VyL1wiLFxuICAgIH0sXG4gICAgRDMwOiB7XG4gICAgICBsaW5rOiBcImh0dHBzOi8vbGlvLmxhcmVnaW9uLmZyL3RyYW5zcG9ydHMtZ2FyZC1zY29sYWlyZVwiLFxuICAgICAgdGVsZXNlcnZpY2U6IFwiaHR0cHM6Ly9tZXMtdHJhbnNwb3J0cy5sYXJlZ2lvbi5mci91dDMwL3VzYWdlci9cIixcbiAgICB9LFxuICAgIEQzMToge1xuICAgICAgbGluazogXCJodHRwczovL2xpby5sYXJlZ2lvbi5mci9UcmFuc3BvcnRzLXNjb2xhaXJlcy1lbi1IYXV0ZS1HYXJvbm5lXCIsXG4gICAgICB0ZWxlc2VydmljZTogXCJodHRwczovL3d3dy50cmFuc3BvcnRzc2NvbGFpcmVzLmhhdXRlLWdhcm9ubmUuZnIvXCIsXG4gICAgfSxcbiAgICBEMzI6IHtcbiAgICAgIGxpbms6IFwiaHR0cHM6Ly9saW8ubGFyZWdpb24uZnIvdHJhbnNwb3J0cy1nZXJzLXNjb2xhaXJlXCIsXG4gICAgICB0ZWxlc2VydmljZTogXCJodHRwczovL21lcy10cmFuc3BvcnRzLmxhcmVnaW9uLmZyL3V0MzIvdXNhZ2VyL1wiLFxuICAgIH0sXG4gICAgRDM0OiB7XG4gICAgICBsaW5rOiBcImh0dHBzOi8vbGlvLmxhcmVnaW9uLmZyL3RyYW5zcG9ydC1oZXJhdWx0LXNjb2xhaXJlXCIsXG4gICAgICB0ZWxlc2VydmljZTpcbiAgICAgICAgXCJodHRwczovL3d3dy5oZXJhdWx0LXRyYW5zcG9ydC5mci9saWduZXMtc2NvbGFpcmVzL2luc2NyaXB0aW9uc1wiLFxuICAgIH0sXG4gICAgRDQ2OiB7XG4gICAgICBsaW5rOiBcImh0dHBzOi8vbGlvLmxhcmVnaW9uLmZyL3RyYW5zcG9ydHMtbG90LXNjb2xhaXJlXCIsXG4gICAgICB0ZWxlc2VydmljZTogXCJodHRwczovL21lcy10cmFuc3BvcnRzLmxhcmVnaW9uLmZyL3V0NDYvdXNhZ2VyL1wiLFxuICAgIH0sXG4gICAgRDQ4OiB7XG4gICAgICBsaW5rOiBcImh0dHBzOi8vbGlvLmxhcmVnaW9uLmZyL3RyYW5zcG9ydHMtbG96ZXJlLXNjb2xhaXJlXCIsXG4gICAgICB0ZWxlc2VydmljZTogXCJodHRwczovL21lcy10cmFuc3BvcnRzLmxhcmVnaW9uLmZyL3V0NDgvdXNhZ2VyL1wiLFxuICAgIH0sXG4gICAgRDY1OiB7XG4gICAgICBsaW5rOiBcImh0dHBzOi8vbGlvLmxhcmVnaW9uLmZyL3RyYW5zcG9ydC1oYXV0ZXNweXJlbmVlcy1zY29sYWlyZVwiLFxuICAgICAgdGVsZXNlcnZpY2U6IFwiaHR0cHM6Ly9tZXMtdHJhbnNwb3J0cy5sYXJlZ2lvbi5mci91dDY1L3VzYWdlci9cIixcbiAgICB9LFxuICAgIEQ2Njoge1xuICAgICAgbGluazogXCJodHRwczovL2xpby5sYXJlZ2lvbi5mci90cmFuc3BvcnRzLXB5cmVuZWVzLW9yaWVudGFsZXMtc2NvbGFpcmVcIixcbiAgICAgIHRlbGVzZXJ2aWNlOiBcImh0dHBzOi8vbWVzLXRyYW5zcG9ydHMubGFyZWdpb24uZnIvdXQ2Ni91c2FnZXIvXCIsXG4gICAgfSxcbiAgICBEODE6IHtcbiAgICAgIGxpbms6IFwiaHR0cHM6Ly9saW8ubGFyZWdpb24uZnIvVHJhbnNwb3J0cy1zY29sYWlyZXMtZGFucy1sZS1UYXJuLUFubmVlLXNjb2xhaXJlLTIwMjAtMjAyMS0zNjgyMVwiLFxuICAgICAgdGVsZXNlcnZpY2U6IFwiaHR0cHM6Ly93d3cuZmVkZXJ0ZWVwLm9yZy9pbnNjcmlwdGlvblwiLFxuICAgIH0sXG4gICAgRDgyOiB7XG4gICAgICBsaW5rOiBcImh0dHBzOi8vbGlvLmxhcmVnaW9uLmZyL3RyYW5zcG9ydHMtdGFybmV0Z2Fyb25uZS1zY29sYWlyZVwiLFxuICAgICAgdGVsZXNlcnZpY2U6IFwiaHR0cHM6Ly9tZXMtdHJhbnNwb3J0cy5sYXJlZ2lvbi5mci91dDgyL3VzYWdlci9cIixcbiAgICB9LFxuICB9LFxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvdmFsYW5kcmlhbmkvQ29kZS9CZXRhLWdvdXYtQWlkZXMtamV1bmVzL2FpZGVzLWpldW5lcy9kYXRhL2JlbmVmaXRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvdmFsYW5kcmlhbmkvQ29kZS9CZXRhLWdvdXYtQWlkZXMtamV1bmVzL2FpZGVzLWpldW5lcy9kYXRhL2JlbmVmaXRzL2FpZGVzLXZlbG8tZ2VuZXJhdG9yLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy92YWxhbmRyaWFuaS9Db2RlL0JldGEtZ291di1BaWRlcy1qZXVuZXMvYWlkZXMtamV1bmVzL2RhdGEvYmVuZWZpdHMvYWlkZXMtdmVsby1nZW5lcmF0b3IudHNcIjsvLyBAdHMtaWdub3JlXG5pbXBvcnQgYWlkZXNWZWxvIGZyb20gXCJhaWRlcy12ZWxvXCJcbmltcG9ydCB7IGJlbmVmaXRWZWxvTGF5b3V0IH0gZnJvbSBcIi4uLy4uL2RhdGEvdHlwZXMvYmVuZWZpdHMuanNcIlxuY29uc3QgYmVuZWZpdHMgPSBbLi4uYWlkZXNWZWxvKCldXG5cbmZ1bmN0aW9uIGdlbmVyYXRlX2JlbmVmaXRfbGlzdChpbnN0aXR1dGlvbnMpIHtcbiAgY29uc3QgcG90ZW50aWFsSW5zdGl0dXRpb25zID0ge1xuICAgIHJcdTAwRTlnaW9uOiBpbnN0aXR1dGlvbnMuZmlsdGVyKChpKSA9PiBpLnR5cGUgPT09IFwicmVnaW9uXCIpLFxuICAgIGRcdTAwRTlwYXJ0ZW1lbnQ6IGluc3RpdHV0aW9ucy5maWx0ZXIoKGkpID0+IGkudHlwZSA9PT0gXCJkZXBhcnRlbWVudFwiKSxcbiAgICBlcGNpOiBpbnN0aXR1dGlvbnMuZmlsdGVyKChpKSA9PiBpLnR5cGUgPT09IFwiZXBjaVwiKSxcbiAgICBcImNvZGUgaW5zZWVcIjogaW5zdGl0dXRpb25zLmZpbHRlcigoaSkgPT4gaS50eXBlID09PSBcImNvbW11bmVcIiksXG4gIH1cblxuICBiZW5lZml0cy5mb3JFYWNoKChiOiBiZW5lZml0VmVsb0xheW91dCkgPT4ge1xuICAgIGlmIChiICYmIGIuY29sbGVjdGl2aXR5KSB7XG4gICAgICBzd2l0Y2ggKGIuY29sbGVjdGl2aXR5LmtpbmQpIHtcbiAgICAgICAgY2FzZSBcInBheXNcIjoge1xuICAgICAgICAgIGlmIChiLmNvbGxlY3Rpdml0eS52YWx1ZSA9PT0gXCJGcmFuY2VcIikge1xuICAgICAgICAgICAgYi5pbnN0aXR1dGlvbiA9IFwiZXRhdFwiXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGIuZGlzY2FyZCA9IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgICBjYXNlIFwiclx1MDBFOWdpb25cIjpcbiAgICAgICAgY2FzZSBcImRcdTAwRTlwYXJ0ZW1lbnRcIjpcbiAgICAgICAgY2FzZSBcImNvZGUgaW5zZWVcIjoge1xuICAgICAgICAgIGNvbnN0IGluc3RpdHV0aW9uTGlzdCA9IHBvdGVudGlhbEluc3RpdHV0aW9uc1tiLmNvbGxlY3Rpdml0eS5raW5kXVxuICAgICAgICAgIGIuaW5zdGl0dXRpb24gPSBpbnN0aXR1dGlvbkxpc3QuZmluZChcbiAgICAgICAgICAgIChpKSA9PiBpLmNvZGVfaW5zZWUgPT09IGIuY29sbGVjdGl2aXR5Py52YWx1ZVxuICAgICAgICAgICk/LnNsdWdcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgXCJlcGNpXCI6IHtcbiAgICAgICAgICBjb25zdCBpbnN0aXR1dGlvbkxpc3QgPSBwb3RlbnRpYWxJbnN0aXR1dGlvbnNbYi5jb2xsZWN0aXZpdHkua2luZF1cbiAgICAgICAgICBiLmluc3RpdHV0aW9uID0gaW5zdGl0dXRpb25MaXN0LmZpbmQoXG4gICAgICAgICAgICAoaSkgPT4gaS5jb2RlX3NpcmVuID09PSBiLmNvbGxlY3Rpdml0eT8uY29kZVxuICAgICAgICAgICk/LnNsdWdcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KVxuXG4gIHJldHVybiBiZW5lZml0c1xuICAgIC5maWx0ZXIoKGI6IGFueSkgPT4gIWIuZGlzY2FyZClcbiAgICAubWFwKChiPzogYW55KSA9PiB7XG4gICAgICBjb25zdCBkZXNjcmlwdGlvbiA9XG4gICAgICAgIGIuZGVzY3JpcHRpb24gJiYgIWIuZGVzY3JpcHRpb24ubWF0Y2goLygoXFxzXFwkKSt8KF5cXCQpKylcXHcrLylcbiAgICAgICAgICA/IGIuZGVzY3JpcHRpb25cbiAgICAgICAgICA6IGBBaWRlIFx1MDBFMCBsJ2FjaGF0IGQndW4gdlx1MDBFOWxvIDogJHtiLnRpdGxlfWBcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGxhYmVsOiBgQWlkZSBcdTAwRTAgbCdhY2hhdCBkJ3VuIHZcdTAwRTlsbyA6ICR7Yi50aXRsZX1gLFxuICAgICAgICBkZXNjcmlwdGlvbixcbiAgICAgICAgaWQ6IGBhaWRlc3ZlbG9fJHtiLmlkfWAucmVwbGFjZSgvWyAuJ10rL2csIFwiX1wiKSxcbiAgICAgICAgZXh0ZXJuYWxfaWQ6IGIuaWQsXG4gICAgICAgIGNvbGxlY3Rpdml0eTogYi5jb2xsZWN0aXZpdHksXG4gICAgICAgIHRpdGxlOiBiLnRpdGxlLFxuICAgICAgICBpbnN0aXR1dGlvbjogYi5pbnN0aXR1dGlvbixcbiAgICAgICAgcHJlZml4OiBcImwnXCIsXG4gICAgICAgIHR5cGU6IFwiZmxvYXRcIixcbiAgICAgICAgcGVyaW9kaWNpdGU6IFwicG9uY3R1ZWxsZVwiLFxuICAgICAgICBsaW5rOiBiLnVybCxcbiAgICAgIH1cbiAgICB9KVxufVxuXG5leHBvcnQgZGVmYXVsdCBnZW5lcmF0ZV9iZW5lZml0X2xpc3RcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3ZhbGFuZHJpYW5pL0NvZGUvQmV0YS1nb3V2LUFpZGVzLWpldW5lcy9haWRlcy1qZXVuZXMvZGF0YS9iZW5lZml0cy9keW5hbWljXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvdmFsYW5kcmlhbmkvQ29kZS9CZXRhLWdvdXYtQWlkZXMtamV1bmVzL2FpZGVzLWpldW5lcy9kYXRhL2JlbmVmaXRzL2R5bmFtaWMvZnNsLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy92YWxhbmRyaWFuaS9Db2RlL0JldGEtZ291di1BaWRlcy1qZXVuZXMvYWlkZXMtamV1bmVzL2RhdGEvYmVuZWZpdHMvZHluYW1pYy9mc2wudHNcIjtpbXBvcnQgeyBTdGF0dXRPY2N1cGF0aW9uTG9nZW1lbnQgfSBmcm9tIFwiLi4vLi4vLi4vbGliL2VudW1zL2xvZ2VtZW50LmpzXCJcblxuY29uc3QgREVGQVVMVF9GU0wgPSB7XG4gIHR5cGU6IFwiYm9vbFwiLFxuICBwcmVmaXg6IFwidW5lXCIsXG4gIHRvcDogNixcbiAgcGVyaW9kaWNpdGU6IFwicG9uY3R1ZWxsZVwiLFxufVxuXG5leHBvcnQgY29uc3QgRlNMX0JZX0lOU1RJVFVUSU9OX1NMVUcgPSB7XG4gIGRlcGFydGVtZW50X2Fpbjoge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZGUgbFx1MjAxOUFpblwiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly93d3cuYWluLmZyL3NvbHV0aW9ucy9mb25kLXNvbGlkYXJpdGUtbG9nZW1lbnQtbWFpbnRpZW4tZGFucy1sZS1sb2dlbWVudC9cIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfYWlzbmU6IHtcbiAgICBsYWJlbDogXCJkdSBkXHUwMEU5cGFydGVtZW50IGRlIGxcdTIwMTlBaXNuZVwiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly9haXNuZS5jb20vYWlkZXMvYWlkZS1hLWxhY2Nlcy1hdS1sb2dlbWVudC1mb25kcy1kZS1zb2xpZGFyaXRlLXBvdXItbGUtbG9nZW1lbnQtZnNsXCIsXG4gIH0sXG4gIGRlcGFydGVtZW50X2FsbGllcjoge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZGUgbFx1MjAxOUFsbGllclwiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly93d3cuYWxsaWVyLmdvdXYuZnIvZXhwbG9pdGF0aW9uLWE2MDMuaHRtbCMhL3BhcnRpY3VsaWVycy9wYWdlL0YxMzM0XCIsXG4gICAgaW5zdHJ1Y3Rpb25zOlxuICAgICAgXCJodHRwczovL3d3dy5hbGxpZXIuZ291di5mci9leHBsb2l0YXRpb24tYTYwMy5odG1sIyEvcGFydGljdWxpZXJzL3BhZ2UvRjEzMzRcIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfYWxwZXNfZGVfaGF1dGVfcHJvdmVuY2U6IHtcbiAgICBsYWJlbDogXCJkdSBkXHUwMEU5cGFydGVtZW50IGRlcyBBbHBlcy1kZS1IYXV0ZS1Qcm92ZW5jZVwiLFxuICAgIGxpbms6IFwiaHR0cDovL3d3dy5tb25kZXBhcnRlbWVudDA0LmZyL3JlY2hlcmNoZXItcGx1cy1kYWlkZXMvaGFiaXRhdC1sb2dlbWVudC11cmJhbmlzbWUvZnNsLW1hc3AvZm9uZHMtc29jaWFsLWRhaWRlLWF1LWxvZ2VtZW50LWZzbC5odG1sXCIsXG4gICAgZm9ybTogXCJodHRwOi8vd3d3Lm1vbmRlcGFydGVtZW50MDQuZnIvZmlsZWFkbWluL21lZGlhdGhlcXVlL2NnMDQvZm9ybXVsYWlyZS9JbnNlcnRpb24vQWNjJUMzJUE4c19hdV9sb2dlbWVudC9JTVBSSU1FX0ZTTF8xMi0yMDE5LnBkZlwiLFxuICAgIGluc3RydWN0aW9uczpcbiAgICAgIFwiaHR0cDovL3d3dy5tb25kZXBhcnRlbWVudDA0LmZyL3JlY2hlcmNoZXItcGx1cy1kYWlkZXMvaGFiaXRhdC1sb2dlbWVudC11cmJhbmlzbWUvZnNsLW1hc3AvbWVzdXJlLWRhY2NvbXBhZ25lbWVudC1zb2NpYWwtcGVyc29ubmFsaXNlLmh0bWwjYzYyNjZcIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfaGF1dGVzX2FscGVzOiB7XG4gICAgbGFiZWw6IFwiZHUgZFx1MDBFOXBhcnRlbWVudCBkZXMgSGF1dGVzIEFscGVzXCIsXG4gICAgbGluazogXCJodHRwczovL3d3dy5oYXV0ZXMtYWxwZXMuZnIvNDk5Ni1mb25kcy1kZS1zb2xpZGFyaXRlLXBvdXItbGUtbG9nZW1lbnQtZnNsLS5odG1cIixcbiAgICBpbnN0cnVjdGlvbnM6XG4gICAgICBcImh0dHBzOi8vd3d3LmhhdXRlcy1hbHBlcy5mci80OTk2LWZvbmRzLWRlLXNvbGlkYXJpdGUtcG91ci1sZS1sb2dlbWVudC1mc2wtLmh0bVwiLFxuICB9LFxuICBkZXBhcnRlbWVudF9hbHBlc19tYXJpdGltZXM6IHtcbiAgICBsYWJlbDogXCJkdSBkXHUwMEU5cGFydGVtZW50IGRlcyBBbHBlcyBNYXJpdGltZXNcIixcbiAgICBsaW5rOiBcImh0dHBzOi8vd3d3LmRlcGFydGVtZW50MDYuZnIvYWlkZXMtYS1sLWluc2VydGlvbi9mc2wtMjYwNy5odG1sXCIsXG4gICAgZXhjbHVkZWRFUENJOiBcIjIwMDAzMDE5NVwiLFxuICB9LFxuICBpbnRlcmNvbW11bmFsaXRlX25pY2VfY290ZV9kX2F6dXI6IHtcbiAgICBsYWJlbDogXCJkZSBsYSBNXHUwMEU5dHJvcG9sZSBOaWNlIENcdTAwRjR0ZSBkXHUyMDE5QXp1clwiLFxuICAgIGxpbms6IFwiaHR0cDovL3d3dy5uaWNlY290ZWRhenVyLm9yZy9oYWJpdGF0LXVyYmFuaXNtZS9sZS1sb2dlbWVudC9mb25kcy1kZS1zb2xpZGFyaXQlQzMlQTktcG91ci1sZS1sb2dlbWVudFwiLFxuICAgIGZvcm06IFwiaHR0cDovL3d3dy5uaWNlY290ZWRhenVyLm9yZy91cGxvYWRzL21lZGlhX2l0ZW1zL2xvY2F0YWlyZS5vcmlnaW5hbC5wZGZcIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfYXJkZWNoZToge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZGUgbFx1MjAxOUFyZFx1MDBFOGNoZVwiLFxuICAgIGxpbms6IFwiaHR0cDovL3d3dy5hcmRlY2hlLmZyLzEzMi1mb25kcy11bmlxdWUtbG9nZW1lbnQuaHRtXCIsXG4gICAgZm9ybTogXCJodHRwOi8vd3d3LmFyZGVjaGUuZnIvaW5jbHVkZS92aWV3ZmlsZXNlY3VyZS5waHA/aWR0Zj0zNjA5JnBhdGg9Y2IlMkYzNjA5Xzc2Ml9mb3JtdWxhaXJlcy1mdWwtMjAxNUJELnBkZlwiLFxuICB9LFxuICBkZXBhcnRlbWVudF9hcmRlbm5lczoge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZGUgbFx1MjAxOUFyZGVubmVzXCIsXG4gICAgbGluazogXCJodHRwczovL2NkMDguZnIvYWlkZXMtZXQtc3VidmVudGlvbnNzL2ZvbmRzLWRlLXNvbGlkYXJpdGUtbG9nZW1lbnQtZnNsLWZvcm11bGFpcmUtdW5pcXVlLWRlLWRlbWFuZGUtZGUtc3VidmVudGlvblwiLFxuICAgIGZvcm06IFwiaHR0cHM6Ly9jZDA4LmZyL3NpdGVzL2RlZmF1bHQvZmlsZXMvbWFqMjAyMF9jb21waWxhdGlvbl9mb3JtdWxhaXJlc19mc2wucGRmXCIsXG4gIH0sXG4gIGRlcGFydGVtZW50X2FyaWVnZToge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZGUgbFx1MjAxOUFyaVx1MDBFOGdlXCIsXG4gICAgbGluazogXCJodHRwOi8vd3d3LmFyaWVnZS5mci9FdHJlLXNvbGlkYWlyZS9Mb2dlbWVudC9MZS1Gb25kcy11bmlxdWUtSGFiaXRhdC1GVUhcIixcbiAgICBpbnN0cnVjdGlvbnM6XG4gICAgICBcImh0dHA6Ly93d3cuYXJpZWdlLmZyL0V0cmUtc29saWRhaXJlL0xvZ2VtZW50L1JlbmNvbnRyZXItdW4tdHJhdmFpbGxldXItc29jaWFsXCIsXG4gIH0sXG4gIGRlcGFydGVtZW50X2F1ZGU6IHtcbiAgICBsYWJlbDogXCJkdSBkXHUwMEU5cGFydGVtZW50IGRlIGxcdTIwMTlBdWRlXCIsXG4gICAgbGluazogXCJodHRwczovL3d3dy5hdWRlLmZyL2plLWJlbmVmaWNpZS1kdS1mb25kcy11bmlxdWUtbG9nZW1lbnQtZnVsXCIsXG4gIH0sXG4gIGRlcGFydGVtZW50X2F2ZXlyb246IHtcbiAgICBsYWJlbDogXCJkdSBkXHUwMEU5cGFydGVtZW50IGRlIGxcdTIwMTlBdmV5cm9uXCIsXG4gICAgbGluazogXCJodHRwczovL2F2ZXlyb24uZnIvcGFnZXMvbG9nZW1lbnQvZGVzJTIwYWlkZXMlMjBwb3VyJTIwYWNjJUMzJUE5ZGVyJTIwJUMzJUEwJTIwdW4lMjBsb2dlbWVudCUyMG91JTIwc3klMjBtYWludGVuaXJcIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfYm91Y2hlc19kdV9yaG9uZToge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgRGVzIEJvdWNoZXMtZHUtUmhcdTAwRjRuZVwiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly93d3cuZGVwYXJ0ZW1lbnQxMy5mci9ub3MtYWN0aW9ucy9sb2dlbWVudC9sZXMtZGlzcG9zaXRpZnMvbGUtZm9uZHMtZGUtc29saWRhcml0ZS1wb3VyLWxlLWxvZ2VtZW50L1wiLFxuICB9LFxuICBkZXBhcnRlbWVudF9jYWx2YWRvczoge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZHUgQ2FsdmFkb3NcIixcbiAgICBsaW5rOiBcImh0dHBzOi8vd3d3LmNhbHZhZG9zLmZyL2FjY3VlaWwvbGUtZGVwYXJ0ZW1lbnQvc29saWRhcml0ZS0tLWZhbWlsbGVzL2FpZGUtYXUtbG9nZW1lbnQvZnNsLmh0bWxcIixcbiAgICBpbnN0cnVjdGlvbnM6XG4gICAgICBcImh0dHBzOi8vd3d3LmNhbHZhZG9zLmZyL2FjY3VlaWwvbGUtZGVwYXJ0ZW1lbnQvc29saWRhcml0ZS0tLWZhbWlsbGVzL2FpZGUtYXUtbG9nZW1lbnQvZnNsLmh0bWxcIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfY2FudGFsOiB7XG4gICAgbGFiZWw6IFwiZHUgZFx1MDBFOXBhcnRlbWVudCBkdSBDYW50YWxcIixcbiAgICBsaW5rOiBcImh0dHA6Ly93d3cuY2FudGFsLmZyL2ZvbmRzLWRlLXNvbGlkYXJpdGUtcG91ci1sZS1sb2dlbWVudC9cIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfZGVfbGFfY2hhcmVudGU6IHtcbiAgICBsYWJlbDogXCJkdSBkXHUwMEU5cGFydGVtZW50IGRlIENoYXJlbnRlXCIsXG4gICAgbGluazogXCJodHRwczovL3d3dy5jaGFyZW50ZXNvbGlkYXJpdGVzLm9yZy9pbmRleC5waHAvY29tcG9uZW50L3NwcGFnZWJ1aWxkZXIvOC1sZS1mc2wuaHRtbFwiLFxuICAgIGluc3RydWN0aW9uczpcbiAgICAgIFwiaHR0cHM6Ly93d3cuY2hhcmVudGVzb2xpZGFyaXRlcy5vcmcvaW5kZXgucGhwL2NvbXBvbmVudC9zcHBhZ2VidWlsZGVyLzgtbGUtZnNsLmh0bWxcIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfY2hhcmVudGVfbWFyaXRpbWU6IHtcbiAgICBsYWJlbDogXCJkdSBkXHUwMEU5cGFydGVtZW50IGRlIENoYXJlbnRlLU1hcml0aW1lXCIsXG4gICAgbGluazogXCJodHRwczovL2xhLmNoYXJlbnRlLW1hcml0aW1lLmZyL2ZpY2hlcy1haWRlcy9mb25kcy1zb2xpZGFyaXRlLXBvdXItbG9nZW1lbnRcIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfY2hlcjoge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZHUgQ2hlclwiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly93d3cuZGVwYXJ0ZW1lbnQxOC5mci9Mb2dlbWVudC1oYWJpdGF0XCIsXG4gIH0sXG4gIGRlcGFydGVtZW50X2NvcnJlemU6IHtcbiAgICBsYWJlbDogXCJkdSBkXHUwMEU5cGFydGVtZW50IGRlIENvcnJcdTAwRTh6ZVwiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly93d3cuY29ycmV6ZS5mci9ub3MtbWlzc2lvbnMvaGFiaXRhdC9sZXMtYWlkZXMtc29jaWFsZXMtcG91ci1sZS1sb2dlbWVudFwiLFxuICAgIGluc3RydWN0aW9uczpcbiAgICAgIFwiaHR0cHM6Ly93d3cuY29ycmV6ZS5mci9zZXJ2aWNlcy1lbi1saWduZS9sZXMtYWlkZXMvYWlkZS1hdXgtdHJhdmFpbGxldXJzLWRlLWNvbmRpdGlvbi1tb2Rlc3RlXCIsXG4gIH0sXG4gIGRlcGFydGVtZW50X2NvdGVfb3I6IHtcbiAgICBsYWJlbDogXCJkdSBkXHUwMEU5cGFydGVtZW50IGRlIGxhIENcdTAwRjR0ZS1kXHUyMDE5T3JcIixcbiAgICBsaW5rOiBcImh0dHBzOi8vd3d3LmNvdGVkb3IuZnIvdm90cmUtc2VydmljZS9pbnNlcnRpb24vYWNjb21wYWduZW1lbnQtZmluYW5jaWVyL2FjY29tcGFnbmVtZW50LWV0LWFpZGVzLWxhY2Nlcy1vdS1hdS1tYWludGllbi1kYW5zXCIsXG4gIH0sXG4gIGRlcGFydGVtZW50X2RvdWJzOiB7XG4gICAgbGFiZWw6IFwiZHUgZFx1MDBFOXBhcnRlbWVudCBkdSBEb3Vic1wiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly93d3cuZG91YnMuZnIvaW5kZXgucGhwL3ZvdXMtYWNjb21wYWduZXIvMzYtcGFydGljdWxpZXJzLzIyNDItbGUtZm9uZHMtZGUtc29saWRhcml0ZS1sb2dlbWVudC1mc2xcIixcbiAgICBmb3JtOiBcImh0dHA6Ly93d3cuYWRpbDI1Lm9yZy9maWxlYWRtaW4vdXNlcl91cGxvYWQvUERBSExQRC9HcmFuZF9wdWJsaWMvaW1wcmltZV9haWRlX2ZpbmFuY2llcmVfaW5kaXZpZHVlbGxlX0ZTTF9hY3R1YWxpc2UucGRmXCIsXG4gICAgaW5zdHJ1Y3Rpb25zOlxuICAgICAgXCJodHRwOi8vd3d3LmFkaWwyNS5vcmcvbGUtcGRhbGhwZC9kb2N1bWVudGF0aW9uL2xlLXJlZ2xlbWVudC1pbnRlcmlldXItZHUtZnNsLWV0LWZvcm11bGFpcmUtZGUtZGVtYW5kZS1kYWlkZS5odG1sXCIsXG4gIH0sXG4gIGRlcGFydGVtZW50X2Ryb21lOiB7XG4gICAgbGFiZWw6IFwiZHUgZFx1MDBFOXBhcnRlbWVudCBkZSBsYSBEclx1MDBGNG1lXCIsXG4gICAgbGluazogXCJodHRwczovL3d3dy5sYWRyb21lLmZyL21vbi1xdW90aWRpZW4vbG9nZW1lbnQvZW4tY2FzLWRlLWRpZmZpY3VsdGVzL2xlcy1haWRlcy1hdXgtbG9jYXRhaXJlcy9cIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfZmluaXN0ZXJlOiB7XG4gICAgbGFiZWw6IFwiZHUgZFx1MDBFOXBhcnRlbWVudCBkdSBGaW5pc3RcdTAwRThyZVwiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly93d3cuZmluaXN0ZXJlLmZyL0Etdm90cmUtc2VydmljZS9IYWJpdGF0LUxvZ2VtZW50L0FjY2VzLWV0LW1haW50aWVuLWRhbnMtdW4tbG9nZW1lbnQtRlNMXCIsXG4gICAgZXhjbHVkZWRFUENJOiBcIjI0MjkwMDMxNFwiLFxuICB9LFxuICBicmVzdF9tZXRyb3BvbGU6IHtcbiAgICBsYWJlbDogXCJkZSBCcmVzdCBNXHUwMEU5dHJvcG9sZVwiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly9pbmZvc29jaWFsZS5maW5pc3RlcmUuZnIvZXRhYmxpc3NlbWVudC9icmVzdC1tZXRyb3BvbGUtZnNsLWZvbmRzLWRlLXNvbGlkYXJpdGUtbG9nZW1lbnQvXCIsXG4gICAgaW5zdHJ1Y3Rpb25zOlxuICAgICAgXCJodHRwczovL2luZm9zb2NpYWxlLmZpbmlzdGVyZS5mci9ldGFibGlzc2VtZW50L2JyZXN0LW1ldHJvcG9sZS1mc2wtZm9uZHMtZGUtc29saWRhcml0ZS1sb2dlbWVudC9cIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfZ2FyZDoge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZHUgR2FyZFwiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly93d3cuZ2FyZC5mci9hdS1xdW90aWRpZW4vYmllbi1zZS1sb2dlci9sb2NhdGFpcmVzL2ZvbmRzLXNvbGlkYXJpdGUtbG9nZW1lbnQuaHRtbFwiLFxuICAgIGluc3RydWN0aW9uczpcbiAgICAgIFwiaHR0cHM6Ly93d3cuZ2FyZC5mci9maWxlYWRtaW4vbWVkaWF0aGVxdWUvZG9jdW1lbnRzXzIwMjAvbG9nZW1lbnQvZG9jX2ZvbmRfc29saWRhcml0ZV9sb2dlbWVudC0yMDIwLnBkZlwiLFxuICB9LFxuICBkZXBhcnRlbWVudF9oYXV0ZV9nYXJvbm5lOiB7XG4gICAgbGFiZWw6IFwiZHUgZFx1MDBFOXBhcnRlbWVudCBkZSBsYSBIYXV0ZS1HYXJvbm5lXCIsXG4gICAgbGluazogXCJodHRwczovL3d3dy5oYXV0ZS1nYXJvbm5lLmZyL2FpZGUvZm9uZHMtZGUtc29saWRhcml0ZS1sb2dlbWVudC1mc2xcIixcbiAgICBleGNsdWRlZEVQQ0k6IFwiMjQzMTAwNTE4XCIsXG4gIH0sXG4gIHRvdWxvdXNlX21ldHJvcG9sZToge1xuICAgIGxhYmVsOiBcImRlIFRvdWxvdXNlIE1cdTAwRTl0cm9wb2xlXCIsXG4gICAgbGluazogXCJodHRwczovL3d3dy50b3Vsb3VzZS1tZXRyb3BvbGUuZnIvbWlzc2lvbnMvc29saWRhcml0ZS9mb25kcy1kZS1zb2xpZGFyaXRlLWxvZ2VtZW50LWZzbC1cIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfZ2lyb25kZToge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZGUgbGEgR2lyb25kZVwiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly93d3cuZnNsMzMub3JnL2FpZGUtZmluYW5jaWVyZS1tYWludGllbi1sb2dlbWVudC9cIixcbiAgICBpbnN0cnVjdGlvbnM6IFwiaHR0cDovL3d3dy5mc2wzMy5vcmcvYWlkZS1maW5hbmNpZXJlLW1haW50aWVuLWxvZ2VtZW50L1wiLFxuICB9LFxuICBkZXBhcnRlbWVudF9oZXJhdWx0OiB7XG4gICAgbGFiZWw6IFwiZHUgZFx1MDBFOXBhcnRlbWVudCBkZSBsXHUyMDE5SFx1MDBFOXJhdWx0XCIsXG4gICAgbGluazogXCJodHRwczovL2hlcmF1bHQuZnIvNDAyLWFpZGUtZmluYW5jaWVyZS5odG1cIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfaWxsZV9ldF92aWxhaW5lOiB7XG4gICAgbGFiZWw6IFwiZHUgZFx1MDBFOXBhcnRlbWVudCBkXHUyMDE5SWxsZS1ldC1WaWxhaW5lXCIsXG4gICAgbGluazogXCJodHRwczovL3d3dy5pbGxlLWV0LXZpbGFpbmUuZnIvZGVtYW5kZS1mc2xcIixcbiAgICBmb3JtOiBcImh0dHBzOi8vd3d3LmlsbGUtZXQtdmlsYWluZS5mci9zaXRlcy9kZWZhdWx0L2ZpbGVzL2Fzc2V0L2RvY3VtZW50L2ZvLXBzaC0wODE4LTAwMV9pbXByaW1ldW5pcXVlbWFzcXVlc19mb3JtX2V4dF8wLnBkZlwiLFxuICB9LFxuICBkZXBhcnRlbWVudF9pbmRyZToge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZGUgbFx1MjAxOUluZHJlXCIsXG4gICAgbGluazogXCJodHRwczovL3d3dy5hZGlsMzYub3JnL2FpZGVzLWxvY2FsZXMvbG9jYXRhaXJlcy1lbi1kaWZmaWN1bHRlc1wiLFxuICB9LFxuICBkZXBhcnRlbWVudF9pbmRyZV9ldF9sb2lyZToge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZGUgbFx1MjAxOUluZHJlLWV0LUxvaXJlXCIsXG4gICAgbGluazogXCJodHRwczovL3d3dy50b3VyYWluZS5mci9tZXMtc2VydmljZXMtYXUtcXVvdGlkaWVuL2VuZmFuY2UtZmFtaWxsZS9sYWlkZS1hdS1sb2dlbWVudC5odG1sXCIsXG4gICAgZm9ybTogXCJodHRwczovL3d3dy50b3VyYWluZS5mci9maWxlcy90b3VyYWluZS9kb2N1bWVudHMvZXRyZS1hY2NvbXBhZ25lL21pc3Npb25zLzYxN19pbXByX0ZTTF9DRDM3X2ludGVyYWN0aWZfTUVUUk9fanVpbGxldF8yMDIxLnBkZlwiLFxuICB9LFxuICBkZXBhcnRlbWVudF9pc2VyZToge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZFx1MjAxOUlzXHUwMEU4cmVcIixcbiAgICBsaW5rOiBcImh0dHBzOi8vd3d3LmlzZXJlLmZyL2FpZGVzLWF1LWxvZ2VtZW50XCIsXG4gICAgaW5zdHJ1Y3Rpb25zOiBcImh0dHBzOi8vd3d3LmlzZXJlLmZyL2FpZGVzLWF1LWxvZ2VtZW50XCIsXG4gIH0sXG4gIGRlcGFydGVtZW50X2xhbmRlczoge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZGVzIExhbmRlc1wiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly93d3cubGFuZGVzLmZyL2xvZ2VtZW50XCIsXG4gIH0sXG4gIGRlcGFydGVtZW50X2xvaXJfZXRfY2hlcjoge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZHUgTG9pci1ldC1DaGVyXCIsXG4gICAgbGluazogXCJodHRwczovL3d3dy5kZXBhcnRlbWVudDQxLmZyL3NlcnZpY2VzLWVuLWxpZ25lL2V0cmUtYWNjb21wYWduZS9pbnNlcnRpb24taGFiaXRhdC9haWRlLWF1LWxvZ2VtZW50L1wiLFxuICB9LFxuICBkZXBhcnRlbWVudF9sb2lyZToge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZGUgbGEgTG9pcmVcIixcbiAgICBsaW5rOiBcImh0dHBzOi8vd3d3LmxvaXJlLmZyL2pjbXMvbHdfMTAyNDcxOC9sZS1mb25kcy1kZS1zb2xpZGFyaXRlLXBvdXItbGUtbG9nZW1lbnQtZnNsXCIsXG4gIH0sXG4gIGRlcGFydGVtZW50X2xvaXJlX2F0bGFudGlxdWU6IHtcbiAgICBsYWJlbDogXCJkdSBkXHUwMEU5cGFydGVtZW50IGRlIExvaXJlIEF0bGFudGlxdWVcIixcbiAgICBsaW5rOiBcImh0dHBzOi8vd3d3LmxvaXJlLWF0bGFudGlxdWUuZnIvamNtcy9jbGFzc2VtZW50LWRlcy1jb250ZW51cy9ndWlkZXMtYWlkZXMvdm91cy1ldGVzL3BhcmVudC0vLWZhbWlsbGUvZm9uZHMtZGUtc29saWRhcml0ZS1wb3VyLWxlLWxvZ2VtZW50LWZzbC1sZXMtYWlkZXMtYS1sLWFjY2VzLW91LWF1LW1haW50aWVuLWRhbnMtdm90cmUtbG9nZW1lbnQtZnItdDFfMTYyOTFcIixcbiAgICBpbnN0cnVjdGlvbnM6XG4gICAgICBcImh0dHBzOi8vd3d3LmxvaXJlLWF0bGFudGlxdWUuZnIvNDQvaGFiaXRhdC1sb2dlbWVudC9mb25kcy1kZS1zb2xpZGFyaXRlLXBvdXItbGUtbG9nZW1lbnQtZnNsLWFpZGUtYS1sLWFjY2VzLWF1LWxvZ2VtZW50L2NfMTMwMzgyMSNpZFRpdHJlNVwiLFxuICB9LFxuICBpbnRlcmNvbW11bmFsaXRlX29ybGVhbnNfbWV0cm9wb2xlOiB7XG4gICAgbGFiZWw6IFwiZGUgT3JsXHUwMEU5YW5zIE1cdTAwRTl0cm9wb2xlXCIsXG4gICAgbGluazogXCJodHRwOi8vd3d3Lm9ybGVhbnMtbWV0cm9wb2xlLmZyLzE2NzkvZm9uZHMtdW5pZmllLWxvZ2VtZW50LWZ1bC5odG1cIixcbiAgICBmb3JtOiBcImh0dHA6Ly93d3cub3JsZWFucy1tZXRyb3BvbGUuZnIvZmlsZWFkbWluL29ybGVhbnMvTUVESUEvZG9jdW1lbnQvdXJiYW5pc21lL2hhYml0YXQvRlVMXy1mb3JtdWxhaXJlc19kZV9kZW1hbmRlLnBkZlwiLFxuICB9LFxuICBkZXBhcnRlbWVudF9tYWluZV9ldF9sb2lyZToge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZHUgTWFpbmUtZXQtTG9pcmVcIixcbiAgICBsaW5rOiBcImh0dHBzOi8vd3d3Lm1haW5lLWV0LWxvaXJlLmZyL2FpZGVzLWV0LXNlcnZpY2VzL2xvZ2VtZW50LWV0LWhhYml0YXQvZm9uZHMtc29saWRhcml0ZS1sb2dlbWVudC9haWRlcy1wb3VyLWxlLW1haW50aWVuLWRhbnMtbGUtbG9nZW1lbnRcIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfbWFuY2hlOiB7XG4gICAgbGFiZWw6IFwiZHUgZFx1MDBFOXBhcnRlbWVudCBkZSBsYSBNYW5jaGVcIixcbiAgICBsaW5rOiBcImh0dHBzOi8vd3d3Lm1hbmNoZS5mci9jb25zZWlsLWRlcGFydGVtZW50YWwvRlNMLmFzcHhcIixcbiAgICBmb3JtOiBcImh0dHBzOi8vd3d3Lm1hbmNoZS5mci9jb25zZWlsLWRlcGFydGVtZW50YWwvaXNvX2FsYnVtL2Rvc3NpZXJfZGVfZGVtYW5kZV9sb2dlbWVudC5wZGZcIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfbWFybmU6IHtcbiAgICBsYWJlbDogXCJkdSBkXHUwMEU5cGFydGVtZW50IGRlIGxhIE1hcm5lXCIsXG4gICAgbGluazogXCJodHRwOi8vd3d3Lm1hcm5lLmZyL2xlcy1hY3Rpb25zL3NhbnRlLWV0LXNvY2lhbC9sb2dlbWVudC1zb2NpYWwvYWNjZXMtZXQtbWFpbnRpZW4tZGFucy1sZS1sb2dlbWVudC1sZS1mb25kcy1zb2xpZGFyaXRlXCIsXG4gIH0sXG4gIGRlcGFydGVtZW50X21heWVubmU6IHtcbiAgICBsYWJlbDogXCJkdSBkXHUwMEU5cGFydGVtZW50IGRlIGxhIE1heWVubmVcIixcbiAgICBsaW5rOiBcImh0dHBzOi8vd3d3LmxhbWF5ZW5uZS5mci9zZXJ2aWNlL2xlLWZvbmRzLXNvbGlkYXJpdGUtcG91ci1sZS1sb2dlbWVudFwiLFxuICB9LFxuICBkZXBhcnRlbWVudF9tb3JiaWhhbjoge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZHUgTW9yYmloYW5cIixcbiAgICBsaW5rOiBcImh0dHBzOi8vd3d3Lm1vcmJpaGFuLmZyL2xlcy1zZXJ2aWNlcy9sb2dlbWVudC1oYWJpdGF0L2ZvbmRzLWRlLXNvbGlkYXJpdGUtbG9nZW1lbnQtZnNsL1wiLFxuICAgIGZvcm06IFwiaHR0cHM6Ly93d3cubW9yYmloYW4uZnIvZmlsZWFkbWluL0xlc19zZXJ2aWNlcy9BaWRlc19kZXBhcnRlbWVudGFsZXMvMjJfbW9yYmloYW5fNV9IMDhfRlNMX21haW50aWVuX2xvZ2VtZW50LnBkZlwiLFxuICAgIGluc3RydWN0aW9uczpcbiAgICAgIFwiaHR0cHM6Ly93d3cubW9yYmloYW4uZnIvbGVzLXNlcnZpY2VzL2xvZ2VtZW50LWhhYml0YXQvZm9uZHMtZGUtc29saWRhcml0ZS1sb2dlbWVudC1mc2xcIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfbW9zZWxsZToge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZGUgbGEgTW9zZWxsZVwiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly93d3cubW9zZWxsZS5mci9qY21zL3BsXzEyNTM4L2ZyL2ZvbmRzLXNvbGlkYXJpdGUtbG9nZW1lbnQtZnNsXCIsXG4gICAgZm9ybTogXCJodHRwczovL3d3dy5tb3NlbGxlLmZyL3VwbG9hZC9kb2NzL2FwcGxpY2F0aW9uL3BkZi8yMDE4LTExL2RlbWFuZGVfZGludGVydmVudGlvbl9kdV9mc2xfLV9hY2Nlc19pbXBheWVzX2xvY2F0aWZzLnBkZlwiLFxuICB9LFxuICBkZXBhcnRlbWVudF9ub3JkOiB7XG4gICAgbGFiZWw6IFwiZHUgZFx1MDBFOXBhcnRlbWVudCBkdSBOb3JkXCIsXG4gICAgbGluazogXCJodHRwczovL3NlcnZpY2VzLmxlbm9yZC5mci9mb25kcy1kZS1zb2xpZGFyaXRlLXBvdXItbGUtbG9nZW1lbnQtZnNsLS1haWRlLWZpbmFuY2llcmUtYS1saW5zdGFsbGF0aW9uXCIsXG4gICAgaW5zdHJ1Y3Rpb25zOlxuICAgICAgXCJodHRwczovL3NlcnZpY2VzLmxlbm9yZC5mci9mb25kcy1kZS1zb2xpZGFyaXRlLXBvdXItbGUtbG9nZW1lbnQtZnNsLS1haWRlLWZpbmFuY2llcmUtYS1saW5zdGFsbGF0aW9uXCIsXG4gICAgZXhjbHVkZWRFUENJOiBcIjI0NTkwMDQxMFwiLFxuICB9LFxuICBtZXRyb3BvbGVfZXVyb3BlZW5uZV9kZV9saWxsZToge1xuICAgIGxhYmVsOiBcImRlIGxhIE1cdTAwRTl0cm9wb2xlIGV1cm9wXHUwMEU5ZW5uZSBkZSBMaWxsZVwiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly93d3cubGlsbGVtZXRyb3BvbGUuZnIvdm90cmUtbWV0cm9wb2xlL2NvbXBldGVuY2VzL2FtZW5hZ2VtZW50LWR1LXRlcnJpdG9pcmUvbG9nZW1lbnQvbGUtZm9uZHMtZGUtc29saWRhcml0ZS1sb2dlbWVudFwiLFxuICAgIGZvcm06IFwiaHR0cHM6Ly93d3cubGlsbGVtZXRyb3BvbGUuZnIvc2l0ZXMvZGVmYXVsdC9maWxlcy8yMDE5LTEyL1ZvbGV0JTIwZGVtYW5kZXVyJTIwbWFpbnRpZW4ucGRmXCIsXG4gIH0sXG4gIGRlcGFydGVtZW50X29pc2U6IHtcbiAgICBsYWJlbDogXCJkdSBkXHUwMEU5cGFydGVtZW50IGRlIGxcdTIwMTlPaXNlXCIsXG4gICAgbGluazogXCJodHRwczovL3d3dy5vaXNlLmZyL2luZm9ybWF0aW9uL2d1aWRlLWRlcy1haWRlcy1kZXBhcnRlbWVudGFsZXMvZm9uZHMtZGVwYXJ0ZW1lbnRhbC1kZS1zb2xpZGFyaXRlLTMxNDVcIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfcGFzX2RlX2NhbGFpczoge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZHUgUGFzLWRlLUNhbGFpc1wiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly93d3cucGFzZGVjYWxhaXMuZnIvU29saWRhcml0ZS1TYW50ZS9SZWdsZW1lbnQtRGVwYXJ0ZW1lbnRhbC1kLUFpZGUtU29jaWFsZS9MZS1kZXZlbG9wcGVtZW50LWRlcy1zb2xpZGFyaXRlcy9MZS1sb2dlbWVudC1kZXMtcGVyc29ubmVzLWRlZmF2b3Jpc2Vlcy1ldC1sZS1Gb25kcy1kZS1Tb2xpZGFyaXRlLUxvZ2VtZW50L0wtYWlkZS1maW5hbmNpZXJlLUZvbmRzLVNvbGlkYXJpdGUtTG9nZW1lbnQtdm9sZXQtYWNjZXMtbG9nZW1lbnQtaWRlbnRpZmllXCIsXG4gIH0sXG4gIGRlcGFydGVtZW50X3B1eV9kZV9kb21lOiB7XG4gICAgbGFiZWw6IFwiZHUgZFx1MDBFOXBhcnRlbWVudCBkdSBQdXktZGUtRFx1MDBGNG1lXCIsXG4gICAgbGluazogXCJodHRwczovL3d3dy5wdXktZGUtZG9tZS5mci9zb2NpYWwvbG9nZW1lbnQtaGFiaXRhdC9mb25kcy1zb2xpZGFyaXRlLWxvZ2VtZW50Lmh0bWxcIixcbiAgICBpbnN0cnVjdGlvbnM6XG4gICAgICBcImh0dHBzOi8vd3d3LnB1eS1kZS1kb21lLmZyL2ZpbGVhZG1pbi91c2VyX3VwbG9hZC9DRDYzLTIwMjAtUkktRlNMLnBkZlwiLFxuICB9LFxuICBkZXBhcnRlbWVudF9weXJlbmVlc19hdGxhbnRpcXVlczoge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZGVzIFB5clx1MDBFOW5cdTAwRTllcy1BdGxhbnRpcXVlc1wiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly9sZTY0LmZyL3ZvdXMtYWlkZXItYWNjZWRlci11bi1sb2dlbWVudC1vdS12b3VzLXktbWFpbnRlbmlyXCIsXG4gIH0sXG4gIGRlcGFydGVtZW50X2Jhc19yaGluOiB7XG4gICAgbGFiZWw6IFwiZHUgZFx1MDBFOXBhcnRlbWVudCBkdSBCYXMtUmhpblwiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly93d3cuYmFzLXJoaW4uZnIvYWN0aW9uLXNvY2lhbGUtZXQtc2FudGUvZGlmZmljdWx0ZXMtbG9nZW1lbnQvXCIsXG4gIH0sXG4gIGRlcGFydGVtZW50X2R1X2hhdXRfcmhpbjoge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZHUgSGF1dC1SaGluXCIsXG4gICAgbGluazogXCJodHRwczovL3d3dy5oYXV0LXJoaW4uZnIvY29udGVudC9kZXMtYWlkZXMtcG91ci12b3RyZS1sb2dlbWVudFwiLFxuICB9LFxuICBkZXBhcnRlbWVudF9yaG9uZToge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZHUgUmhcdTAwRjRuZVwiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly93d3cucmhvbmUuZnIvc29saWRhcml0ZXMvbG9nZW1lbnQvYWlkZXNfYXVfbG9nZW1lbnQvbGVfZm9uZHNfZGVfc29saWRhcml0ZV9sb2dlbWVudFwiLFxuICAgIGV4Y2x1ZGVkRVBDSTogXCIyMDAwNDY5NzdcIixcbiAgfSxcbiAgaW50ZXJjb21tdW5hbGl0ZV9tZXRyb3BvbGVfbHlvbjoge1xuICAgIGxhYmVsOiBcImRlIGxhIE1cdTAwRTl0cm9wb2xlIGRlIEx5b25cIixcbiAgICBsaW5rOiBcImh0dHBzOi8vd3d3LmdyYW5kbHlvbi5jb20vc2VydmljZXMvYWlkZXMtZm9uZHMtc29saWRhcml0ZS1sb2dlbWVudC5odG1sXCIsXG4gICAgaW5zdHJ1Y3Rpb25zOlxuICAgICAgXCJodHRwczovL3d3dy5ncmFuZGx5b24uY29tL3NlcnZpY2VzL2FpZGVzLWZvbmRzLXNvbGlkYXJpdGUtbG9nZW1lbnQuaHRtbFwiLFxuICB9LFxuICBkZXBhcnRlbWVudF9zYW9uZV9ldF9sb2lyZToge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZGUgbGEgU2FcdTAwRjRuZS1ldC1Mb2lyZVwiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly93d3cuc2FvbmVldGxvaXJlNzEuZnIvcXVlLXBldXQtb24tZmFpcmUtcG91ci12b3VzL3ZvdXMtZXRlcy1wcm9wcmlldGFpcmUtbG9jYXRhaXJlL3Jlc3Rlci1kYW5zLW1vbi1sb2dlbWVudCM6fjp0ZXh0PWIlQzMlQTluJUMzJUE5ZmljaWVyJTIwcGV1dCUyRCVDMyVBQXRyZSUyMGQndW5lLCklMjAlM0ElMjBoYWJpdGF0NzElNDBjZzcxLmZyXCIsXG4gICAgZm9ybTogXCJodHRwczovL3d3dy5zYW9uZWV0bG9pcmU3MS5mci9maWxlYWRtaW4vUXVlX3BldXQtb25fZmFpcmVfcG91cl92b3VzX18vVm91c19ldGVzX3Byb3ByaWV0YWlyZV9sb2NhdGFpcmUvQWlkZXNfbG9nZW1lbnQvNzczM19ET1NTSUVSX1VOSVFVRS5wZGZcIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfc2FydGhlOiB7XG4gICAgbGFiZWw6IFwiZHUgZFx1MDBFOXBhcnRlbWVudCBkZSBsYSBTYXJ0aGVcIixcbiAgICBsaW5rOiBcImh0dHBzOi8vd3d3LnNhcnRoZS5mci9pbnNlcnRpb24tbG9nZW1lbnQvbG9nZW1lbnQtaGFiaXRhdC9mb25kcy1kZS1zb2xpZGFyaXRlLWxvZ2VtZW50XCIsXG4gIH0sXG4gIGRlcGFydGVtZW50X2hhdXRlX3Nhdm9pZToge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZGUgbGEgSGF1dGUtU2F2b2llXCIsXG4gICAgbGluazogXCJodHRwczovL3d3dy5oYXV0ZXNhdm9pZS5mci9pbmZvcm1hdGlvbnMtc2VydmljZXMvbG9nZW1lbnRcIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfcGFyaXM6IHtcbiAgICBsYWJlbDogXCJkdSBkXHUwMEU5cGFydGVtZW50IGRlIFBhcmlzXCIsXG4gICAgbGluazogXCJodHRwczovL3d3dy5wYXJpcy5mci9wYWdlcy9haWRlcy1hdS1sb2dlbWVudC0zODI3I2xlLWZvbmRzLWRlLXNvbGlkYXJpdGUtcG91ci1sZS1sb2dlbWVudC1kZS1wYXJpc1wiLFxuICB9LFxuICBkZXBhcnRlbWVudF9zZWluZV9tYXJpdGltZToge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZGUgU2VpbmUtTWFyaXRpbWVcIixcbiAgICBsaW5rOiBcImh0dHBzOi8vd3d3LnNlaW5lbWFyaXRpbWUuZnIvdm9zLXNlcnZpY2VzL2hhYml0YXQtbG9nZW1lbnQvbGUtcGxhbi1kZXBhcnRlbWVudGFsLWRhY3Rpb24tcG91ci1sZS1sb2dlbWVudC1kZXMtcGVyc29ubmVzLWRlZmF2b3Jpc2Vlcy9mb25kcy1zb2xpZGFyaXRlLWxvZ2VtZW50Lmh0bWxcIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfc2VpbmVfZXRfbWFybmU6IHtcbiAgICBsYWJlbDogXCJkdSBkXHUwMEU5cGFydGVtZW50IGRlIFNlaW5lLWV0LU1hcm5lXCIsXG4gICAgbGluazogXCJodHRwczovL3d3dy5zZWluZS1ldC1tYXJuZS5mci9mci9haWRlcy1hdS1sb2dlbWVudFwiLFxuICB9LFxuICBkZXBhcnRlbWVudF95dmVsaW5lczoge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZGVzIFl2ZWxpbmVzXCIsXG4gICAgbGluazogXCJodHRwczovL3d3dy55dmVsaW5lcy5mci9zb2xpZGFyaXRlL2FkdWx0ZXMtZW4tZGlmZmljdWx0ZS9sb2dlbWVudC9hY2Nlcy1ldC1tYWludGllbi1sb2dlbWVudC9cIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfc29tbWU6IHtcbiAgICBsYWJlbDogXCJkdSBkXHUwMEU5cGFydGVtZW50IGRlIGxhIFNvbW1lXCIsXG4gICAgbGluazogXCJodHRwczovL3d3dy5zb21tZS5mci9zZXJ2aWNlcy9yc2EtaW5zZXJ0aW9uL2xlcy1haWRlcy1hLWxpbnNlcnRpb24vbGUtZm9uZHMtZGUtc29saWRhcml0ZS1sb2dlbWVudC9cIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfdmFyOiB7XG4gICAgbGFiZWw6IFwiZHUgZFx1MDBFOXBhcnRlbWVudCBkdSBWYXJcIixcbiAgICBsaW5rOiBcImh0dHBzOi8vd3d3LnZhci5mci9zb2NpYWwvaW5zZXJ0aW9uL2ZvbmRzLWRlLXNvbGlkYXJpdGUtbG9nZW1lbnRcIixcbiAgICBmb3JtOiBcImh0dHBzOi8vd3d3LnZhci5mci9kb2N1bWVudHMvMjAxNDIvMjAyODA5NC9NQUlOVElFTitBNC5wZGYvNzYyM2M3ZWItZGFhMC1jZjBlLWFhYmYtY2Q3MDFjOGM2ZDFkXCIsXG4gIH0sXG4gIGRlcGFydGVtZW50X3ZhdWNsdXNlOiB7XG4gICAgbGFiZWw6IFwiZHUgZFx1MDBFOXBhcnRlbWVudCBkdSBWYXVjbHVzZVwiLFxuICAgIGxpbms6IFwiaHR0cDovL3d3dy52YXVjbHVzZS5mci9oYWJpdGF0LWxvZ2VtZW50L2xlcy1haWRlcy1hdXgtcGFydGljdWxpZXJzL2xlLWZvbmRzLWRlLXNvbGlkYXJpdGUtcG91ci1sZS1sb2dlbWVudC0xNTMxLmh0bWxcIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfdmVuZGVlOiB7XG4gICAgbGFiZWw6IFwiZHUgZFx1MDBFOXBhcnRlbWVudCBkZSBsYSBWZW5kXHUwMEU5ZVwiLFxuICAgIGxpbms6IFwiaHR0cDovL3d3dy52ZW5kZWUuZnIvVGVycml0b2lyZS1ldC1lbnZpcm9ubmVtZW50L0hhYml0YXQtTG9nZW1lbnQvNDIyNjQtSGFiaXRhdC1Mb2dlbWVudC9MLWFjY29tcGFnbmVtZW50LWRlcy1tZW5hZ2VzLWVuLWRpZmZpY3VsdGVzXCIsXG4gIH0sXG4gIGRlcGFydGVtZW50X3ZpZW5uZToge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZGUgbGEgVmllbm5lXCIsXG4gICAgbGluazogXCJodHRwOi8vd3d3LmZzbDg2LmZyL1wiLFxuICAgIGZvcm06IFwiaHR0cDovL3d3dy5mc2w4Ni5mci9pbWFnZXMvcGRmL2RlY2xhcmF0aW9uX2RlX3Jlc3NvdXJjZXMucGRmXCIsXG4gIH0sXG4gIGRlcGFydGVtZW50X2Vzc29ubmU6IHtcbiAgICBsYWJlbDogXCJkdSBkXHUwMEU5cGFydGVtZW50IGRlIGxcdTIwMTlFc3Nvbm5lXCIsXG4gICAgbGluazogXCJodHRwOi8vd3d3LmVzc29ubmUuZnIvbGUtZGVwYXJ0ZW1lbnQvbGVzLW9yZ2FuaXNtZXMtYXNzb2NpZXMvbGUtZm9uZHMtZGUtc29saWRhcml0ZS1wb3VyLWxlLWxvZ2VtZW50LWZzbC9cIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfaGF1dHNfZGVfc2VpbmU6IHtcbiAgICBsYWJlbDogXCJkdSBkXHUwMEU5cGFydGVtZW50IGRlcyBIYXV0cy1kZS1TZWluZVwiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly93d3cuNzgtOTIuZnIvYW5udWFpcmUvYWlkZXMtZXQtc2VydmljZXMvZGV0YWlsL2xlLWZvbmRzLWRlLXNvbGlkYXJpdGUtbG9nZW1lbnQtZnNsLTkyXCIsXG4gIH0sXG4gIGRlcGFydGVtZW50X3NlaW5lX3NhaW50X2RlbmlzOiB7XG4gICAgbGFiZWw6IFwiZHUgZFx1MDBFOXBhcnRlbWVudCBkZSBTZWluZS1TYWludC1EZW5pc1wiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly9zZWluZXNhaW50ZGVuaXMuZnIvc29saWRhcml0ZS9hY3Rpb24tc29jaWFsZS9hcnRpY2xlL2ZvbmRzLWRlLXNvbGlkYXJpdGUtbG9nZW1lbnRcIixcbiAgICBpbnN0cnVjdGlvbnM6XG4gICAgICBcImh0dHBzOi8vc2VpbmVzYWludGRlbmlzLmZyL3NvbGlkYXJpdGUvYWN0aW9uLXNvY2lhbGUvYXJ0aWNsZS9mb25kcy1kZS1zb2xpZGFyaXRlLWxvZ2VtZW50I0NvbW1lbnQtZW4tZm9ybXVsZXItbGEtZGVtYW5kZVwiLFxuICB9LFxuICBkZXBhcnRlbWVudF92YWxfZGVfbWFybmU6IHtcbiAgICBsYWJlbDogXCJkdSBkXHUwMEU5cGFydGVtZW50IGR1IFZhbC1kZS1NYXJuZVwiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly93d3cudmFsZGVtYXJuZS5mci9hLXZvdHJlLXNlcnZpY2UvaGFiaXRhdC9sb2dlbWVudC9haWRlcy1hdXgtaW1wYXllcy1sb2NhdGlmcy1mc2hcIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfdmFsX2Rfb2lzZToge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZHUgVmFsIGRcdTIwMTlPaXNlXCIsXG4gICAgbGluazogXCJodHRwczovL3d3dy52YWxkb2lzZS5mci9haWRlLWV0LXNlcnZpY2UvMTEvNi1mb25kcy1kZS1zb2xpZGFyaXRlLWxvZ2VtZW50LWFpZGUtYS1sLWFjY2VzLWF1LWxvZ2VtZW50Lmh0bVwiLFxuICB9LFxuICBkZXBhcnRlbWVudF9sYV9yZXVuaW9uOiB7XG4gICAgbGFiZWw6IFwiZHUgZFx1MDBFOXBhcnRlbWVudCBkZSBsYSBSXHUwMEU5dW5pb25cIixcbiAgICBsaW5rOiBcImh0dHBzOi8vd3d3LmRlcGFydGVtZW50OTc0LmZyL2FpZGUvYWlkZS1oYWJpdGF0LWZvbmRzLWRlLXNvbGlkYXJpdGUtcG91ci1sb2dlbWVudC1mc2wjYWlkZXNpbXBheWVzXCIsXG4gIH0sXG59XG5cbmZ1bmN0aW9uIGZvcm1hdEJlbmVmaXQoXG4gIHsgbGFiZWwsIGxpbmssIGZvcm0sIGluc3RydWN0aW9ucywgZXhjbHVkZWRFUENJIH06IGFueSxcbiAgaW5zdGl0dXRpb25JZFxuKSB7XG4gIGNvbnN0IGNvbmRpdGlvbnNfZ2VuZXJhbGVzID0gW1xuICAgIHtcbiAgICAgIHR5cGU6IFwiYXR0YWNoZWRfdG9faW5zdGl0dXRpb25cIixcbiAgICB9LFxuICAgIC4uLihleGNsdWRlZEVQQ0lcbiAgICAgID8gW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6IFwibm90XCIsXG4gICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICB0eXBlOiBcImVwY2lzXCIsXG4gICAgICAgICAgICAgIHZhbHVlczogW2V4Y2x1ZGVkRVBDSV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF1cbiAgICAgIDogW10pLFxuICAgIHtcbiAgICAgIHR5cGU6IFwic3RhdHV0X29jY3VwYXRpb25fbG9nZW1lbnRcIixcbiAgICAgIGV4Y2x1ZGVzOiBbXG4gICAgICAgIFN0YXR1dE9jY3VwYXRpb25Mb2dlbWVudC5sb2dlX2dyYXR1aXRlbWVudCxcbiAgICAgICAgU3RhdHV0T2NjdXBhdGlvbkxvZ2VtZW50LnNhbnNfZG9taWNpbGUsXG4gICAgICBdLFxuICAgIH0sXG4gIF1cbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oXG4gICAge30sXG4gICAge1xuICAgICAgaWQ6IGAke2luc3RpdHV0aW9uSWQucmVwbGFjZSgvXy9nLCBcIi1cIil9LWZzbC1lbGlnaWJpbGl0ZWAsXG4gICAgICAuLi5ERUZBVUxUX0ZTTCxcbiAgICAgIGRlc2NyaXB0aW9uOiBgRGFucyBsZSBjYWRyZSBkdSBGb25kcyBkZSBTb2xpZGFyaXRcdTAwRTkgTG9nZW1lbnQgJHtsYWJlbH0sIGRlcyBhaWRlcyBmaW5hbmNpXHUwMEU4cmVzIHNvbnQgbWlzZXMgZW4gcGxhY2UgcG91ciB2b3VzIGFpZGVyIFx1MDBFMCByZXN0ZXIgZGFucyB2b3RyZSBsb2dlbWVudCBldCBcdTAwRTAgcGF5ZXIgdm9zIGZhY3R1cmVzIGxpXHUwMEU5ZXMgXHUwMEUwIHZvdHJlIGxvZ2VtZW50IChlYXUsIFx1MDBFOWxlY3RyaWNpdFx1MDBFOSwgZXRjLikuYCxcbiAgICAgIGNvbmRpdGlvbnM6IFtcbiAgICAgICAgYE9jY3VwZXIsIFx1MDBFMCB0aXRyZSBkZSByXHUwMEU5c2lkZW5jZSBwcmluY2lwYWxlLCB1biBsb2dlbWVudCBzdXIgbGUgdGVycml0b2lyZSAke2xhYmVsfS5gLFxuICAgICAgICBcIjxzdHJvbmc+U2F0aXNmYWlyZSBsZXMgY29uZGl0aW9ucyBkZSByZXNzb3VyY2VzPC9zdHJvbmc+IGRcdTAwRTljcml0ZXMgZGFucyBsZSByXHUwMEU4Z2xlbWVudC5cIixcbiAgICAgIF0sXG4gICAgICBsaW5rLFxuICAgICAgZm9ybTogZm9ybSA/IGZvcm0gOiBudWxsLFxuICAgICAgaW5zdHJ1Y3Rpb25zOiBpbnN0cnVjdGlvbnMgPyBpbnN0cnVjdGlvbnMgOiBudWxsLFxuICAgICAgbGFiZWw6IGBBaWRlIGF1IG1haW50aWVuIGRhbnMgdm90cmUgbG9nZW1lbnQgJHtsYWJlbH1gLFxuICAgICAgaW5zdGl0dXRpb246IGluc3RpdHV0aW9uSWQsXG4gICAgICBzb3VyY2U6IFwiamF2YXNjcmlwdFwiLFxuICAgICAgY29uZGl0aW9uc19nZW5lcmFsZXMsXG4gICAgfVxuICApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZEZTTCgpIHtcbiAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKEZTTF9CWV9JTlNUSVRVVElPTl9TTFVHKS5tYXAoXG4gICAgKFtpbnN0aXR1dGlvblNsdWcsIGN1c3RvbWl6YXRpb25CZW5lZml0XSkgPT5cbiAgICAgIGZvcm1hdEJlbmVmaXQoY3VzdG9taXphdGlvbkJlbmVmaXQsIGluc3RpdHV0aW9uU2x1ZylcbiAgKVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvdmFsYW5kcmlhbmkvQ29kZS9CZXRhLWdvdXYtQWlkZXMtamV1bmVzL2FpZGVzLWpldW5lcy9kYXRhL2JlbmVmaXRzL2R5bmFtaWNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy92YWxhbmRyaWFuaS9Db2RlL0JldGEtZ291di1BaWRlcy1qZXVuZXMvYWlkZXMtamV1bmVzL2RhdGEvYmVuZWZpdHMvZHluYW1pYy9hcGEudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3ZhbGFuZHJpYW5pL0NvZGUvQmV0YS1nb3V2LUFpZGVzLWpldW5lcy9haWRlcy1qZXVuZXMvZGF0YS9iZW5lZml0cy9keW5hbWljL2FwYS50c1wiO2NvbnN0IERFRkFVTFRfQVBBID0ge1xuICB0eXBlOiBcImJvb2xcIixcbiAgcHJlZml4OiBcImxcdTIwMTlcIixcbiAgcGVyaW9kaWNpdGU6IFwicG9uY3R1ZWxsZVwiLFxufVxuXG5leHBvcnQgY29uc3QgQVBBX0JZX0NPREUgPSB7XG4gIGRlcGFydGVtZW50X2hhdXRlc19hbHBlczoge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZGVzIEhhdXRlcyBBbHBlc1wiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly93d3cuaGF1dGVzLWFscGVzLmZyLzE2NDctbC1hbGxvY2F0aW9uLXBlcnNvbm5hbGlzZWUtZC1hdXRvbm9taWUtYXBhLS5odG1cIixcbiAgICBmb3JtOiBcImh0dHBzOi8vd3d3LmhhdXRlcy1hbHBlcy5mci9pbmNsdWRlL3ZpZXdGaWxlLnBocD9pZHRmPTE2ODIzJnBhdGg9YTAlMkYxNjgyM182MzlfMS1kb3NzaWVyX2FwYV93ZWJfZWxlYy5wZGZcIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfYWxwZXNfbWFyaXRpbWVzOiB7XG4gICAgbGFiZWw6IFwiZHUgZFx1MDBFOXBhcnRlbWVudCBkZXMgQWxwZXMgTWFyaXRpbWVzXCIsXG4gICAgdGVsZXNlcnZpY2U6XG4gICAgICBcImh0dHBzOi8vd3d3LmRlcGFydGVtZW50MDYuZnIvZG9zc2llci1kZS1kZW1hbmRlLWQtYWxsb2NhdGlvbi1wZXJzb25uYWxpc2VlLWQtYXV0b25vbWllLWEtZG9taWNpbGUtMTQyNDkuaHRtbFwiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly93d3cuZGVwYXJ0ZW1lbnQwNi5mci9haWRlcy1hdXgtcGVyc29ubmVzLWFnZWVzL2FsbG9jYXRpb24tcGVyc29ubmFsaXNlZS1kLWF1dG9ub21pZS1hcGEtMjU3OC5odG1sXCIsXG4gIH0sXG4gIGRlcGFydGVtZW50X2JvdWNoZXNfZHVfcmhvbmU6IHtcbiAgICBsYWJlbDogXCJkdSBkXHUwMEU5cGFydGVtZW50IGRlcyBCb3VjaGVzIGR1IFJoXHUwMEY0bmVcIixcbiAgICBsaW5rOiBcImh0dHBzOi8vd3d3LmRlcGFydGVtZW50MTMuZnIvbGUtMTMtZW4tYWN0aW9uL3NlbmlvcnMvbGVzLWRpc3Bvc2l0aWZzL2FsbG9jYXRpb24tcGVyc29ubmFsaXNlZS1kYXV0b25vbWllLWFwYS9cIixcbiAgICBmb3JtOiBcImh0dHBzOi8vd3d3LmRlcGFydGVtZW50MTMuZnIvZmlsZWFkbWluL3VzZXJfdXBsb2FkL0ZhbWlsbGUvU2VuaW9ycy9mb3JtdWxhaXJlcy9kb3NzaWVyX0FQQS5wZGZcIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfY2FsdmFkb3M6IHtcbiAgICBsYWJlbDogXCJkdSBkXHUwMEU5cGFydGVtZW50IGR1IENhbHZhZG9zXCIsXG4gICAgdGVsZXNlcnZpY2U6IFwiaHR0cHM6Ly90ZWxlc2VydmljZXMuY2FsdmFkb3MuZnIvZGVtYW5kZXMtYXBhL1wiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly93d3cuY2FsdmFkb3MuZnIvY29udGVudHMvZmljaGUvZmljaGVzLWFpZGUtLXNlcnZpY2VzL2xhcGEtZW4tbGlnbmUuaHRtbFwiLFxuICB9LFxuICBkZXBhcnRlbWVudF9ldXJlX2V0X2xvaXI6IHtcbiAgICBsYWJlbDogXCJkdSBkXHUwMEU5cGFydGVtZW50IGQnRXVyZSBldCBMb2lyXCIsXG4gICAgbGluazogXCJodHRwczovL2V1cmVsaWVuLmZyL2d1aWRlL2F1dG9ub21pZVwiLFxuICAgIGZvcm06IFwiaHR0cHM6Ly93d3cuZXVyZWxpZW4uZnIvc2l0ZXMvZGVmYXVsdC9maWxlcy9tZGEtZG9zc2llci1kYWxsb2NhdGlvbi1wZXJzb25uYWxpc2VlLWRhdXRvbm9taWUucGRmXCIsXG4gIH0sXG4gIGRlcGFydGVtZW50X2ZpbmlzdGVyZToge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZHUgRmluaXN0XHUwMEU4cmVcIixcbiAgICBsaW5rOiBcImh0dHBzOi8vd3d3LmZpbmlzdGVyZS5mci9BLXZvdHJlLXNlcnZpY2UvUGVyc29ubmVzLWFnZS1lcy1BUEEvQWxsb2NhdGlvbi1wZXJzb25uYWxpc2VlLWQtYXV0b25vbWllXCIsXG4gICAgZm9ybTogXCJodHRwczovL3d3dy5maW5pc3RlcmUuZnIvdmFyL2ZpbmlzdGVyZS9zdG9yYWdlL29yaWdpbmFsL2FwcGxpY2F0aW9uLzFmMTA1Mzk4MTlkNzQxMjE0MjBkYTk2ODgwYjk1NzE2LnBkZlwiLFxuICB9LFxuICBkZXBhcnRlbWVudF9oYXV0ZV9nYXJvbm5lOiB7XG4gICAgbGFiZWw6IFwiZHUgZFx1MDBFOXBhcnRlbWVudCBkZSBIYXV0ZSBHYXJvbm5lXCIsXG4gICAgbGluazogXCJodHRwczovL3d3dy5oYXV0ZS1nYXJvbm5lLmZyL2d1aWRlLWRlcy1haWRlcy9hbGxvY2F0aW9uLXBlcnNvbm5hbGlzZWUtZGF1dG9ub21pZS1hcGFcIixcbiAgICBmb3JtOiBcImh0dHBzOi8vd3d3LmhhdXRlLWdhcm9ubmUuZnIvc2l0ZXMvZGVmYXVsdC9maWxlcy8yMDE3MjcwNy1mb3JtdWxhaXJlLWRlbWFuZGUtX2FwYS5wZGZcIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfZ2lyb25kZToge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZGUgR2lyb25kZVwiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly93d3cuZ2lyb25kZS5mci9oYW5kaWNhcC1ncmFuZC1hZ2UvYWlkZXMtZXQtcHJlc3RhdGlvbnMtYXBhLXBjaC1ldC1jbWkjYXBhXCIsXG4gICAgZm9ybTogXCJodHRwczovL3d3dy5naXJvbmRlLmZyL3NpdGVzL2RlZmF1bHQvZmlsZXMvMjAxNy0wNC9kZW1hbmRlX2FwYV93ZWJfMC5wZGZcIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfaGVyYXVsdDoge1xuICAgIGluc3RpdHV0aW9uOiBcImRlcGFydGVtZW50XCIsXG4gICAgbGFiZWw6IFwiZHUgZFx1MDBFOXBhcnRlbWVudCBkZSBsJ0hcdTAwRTlyYXVsdFwiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly93d3cuaGVyYXVsdC5nb3V2LmZyL0RlbWFyY2hlcy1hZG1pbmlzdHJhdGl2ZXMvVG91dGVzLWxlcy1kZW1hcmNoZXMtcG91ci1sZXMtcGFydGljdWxpZXJzL1NlcnZpY2UtUHVibGljLXBvdXItbGVzLXBhcnRpY3VsaWVycyMhL3BhcnRpY3VsaWVycy9wYWdlL0YxMDAwOVwiLFxuICAgIGluc3RydWN0aW9uczpcbiAgICAgIFwiaHR0cDovL3d3dy5oZXJhdWx0LmZyL2xhbGxvY2F0aW9uLXBlcnNvbm5hbGlzZWUtZGF1dG9ub21pZS1hcGFcIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfaWxsZV9ldF92aWxhaW5lOiB7XG4gICAgbGFiZWw6IFwiZHUgZFx1MDBFOXBhcnRlbWVudCBkJ0lsbGUgZXQgVmlsYWluZVwiLFxuICAgIGxpbms6IFwiaHR0cDovL3d3dy5pbGxlLWV0LXZpbGFpbmUuZnIvZnIvZGVtYW5kZS1hcGFcIixcbiAgICBmb3JtOiBcImh0dHA6Ly93d3cuaWxsZS1ldC12aWxhaW5lLmZyL3NpdGVzL2RlZmF1bHQvZmlsZXMvYXNzZXQvZG9jdW1lbnQvZmFpcmVfZGVtYW5kZV9hbGxvY2F0aW9uX2FwYV9qdWlsbGV0XzIwMTQucGRmXCIsXG4gIH0sXG4gIGRlcGFydGVtZW50X2lzZXJlOiB7XG4gICAgbGFiZWw6IFwiZHUgZFx1MDBFOXBhcnRlbWVudCBkZSBsJ0lzXHUwMEU4cmVcIixcbiAgICB0ZWxlc2VydmljZTpcbiAgICAgIFwiaHR0cHM6Ly93d3cuaXNlcmUuZnIvZXNwYWNlLXBlcnNvbm5lbC9QYWdlcy9jcmVlci1tb24tY29tcHRlLmFzcHhcIixcbiAgICBsaW5rOiBcImh0dHBzOi8vd3d3LmlzZXJlLmZyL21kYTM4L3BhcnRpY3VsaWVyL3BhL1BhZ2VzL2FwYS1lbi1saWduZS5hc3B4XCIsXG4gIH0sXG4gIGRlcGFydGVtZW50X2xvaXJlOiB7XG4gICAgbGFiZWw6IFwiZHUgZFx1MDBFOXBhcnRlbWVudCBkZSBsYSBMb2lyZVwiLFxuICAgIGxpbms6IFwiaHR0cDovL3d3dy5sb2lyZS5mci9qY21zL2NfMzA4MTc5L2NvbW1lbnQtYmVuZWZpY2llci1kZS1sLWFwYS1hLWRvbWljaWxlXCIsXG4gICAgZm9ybTogXCJodHRwOi8vd3d3LmxvaXJlLmZyL3VwbG9hZC9kb2NzL2FwcGxpY2F0aW9uL3BkZi9kb3NzaWVyYXBhLnBkZlwiLFxuICB9LFxuICBkZXBhcnRlbWVudF9sb2lyZV9hdGxhbnRpcXVlOiB7XG4gICAgbGFiZWw6IFwiZHUgZFx1MDBFOXBhcnRlbWVudCBkZSBMb2lyZSBBdGxhbnRpcXVlXCIsXG4gICAgbGluazogXCJodHRwczovL3d3dy5sb2lyZS1hdGxhbnRpcXVlLmZyL2pjbXMvY2xhc3NlbWVudC1kZXMtY29udGVudXMvZ3VpZGVzLWFpZGVzL3ZvdXMtZXRlcy9wZXJzb25uZS1hZ2VlL2wtYWxsb2NhdGlvbi1wZXJzb25uYWxpc2VlLWQtYXV0b25vbWllLWFwYS1hLWRvbWljaWxlLWZyLXAxXzMxNTc1Mj9wb3J0YWw9YWNhXzY5NDEmY2F0ZWdvcnk9cDJfODA3NDIxXCIsXG4gICAgZm9ybTogXCJodHRwczovL3d3dy5sb2lyZS1hdGxhbnRpcXVlLmZyL3VwbG9hZC9kb2NzL2FwcGxpY2F0aW9uL3BkZi8yMDE0LTAyL3BlcnNvbm5lc19hZ2Vlc19mb3JfYXBhXzIwMDZfMTBfMDNfXzE2XzQyXzUwXzIwMC5wZGZcIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfbG9pcmV0OiB7XG4gICAgbGFiZWw6IFwiZHUgZFx1MDBFOXBhcnRlbWVudCBkdSBMb2lyZXRcIixcbiAgICBsaW5rOiBcImh0dHBzOi8vd3d3LmxvaXJldC5mci9haWRlL2FsbG9jYXRpb24tcGVyc29ubmFsaXNlZS1kYXV0b25vbWllLWFwYS1kb21pY2lsZS1ldC1lbi1ldGFibGlzc2VtZW50LWF5YW50LW9wdGUtcG91ci1sYS0wIzp+OnRleHQ9ZXN0JTIwdW5lJTIwcHJlc3RhdGlvbiUyMGVuJTIwbmF0dXJlLGwnJUMzJUE5cXVpcGUlMjBwbHVyaWRpc2NpcGxpbmFpcmUlMjBkdSUyMEQlQzMlQTlwYXJ0ZW1lbnQuXCIsXG4gICAgZm9ybTogXCJodHRwczovL3d3dy5sb2lyZXQuZnIvc2l0ZXMvbG9pcmV0L2ZpbGVzL21lZGlhL2RvY3VtZW50cy8yMDIxLzExL2Zvcm11bGFpcmUtZGVtYW5kZS1BUEEtQ2Fyc2F0LU1EQS0wMTExMjAyMV8wLnBkZlwiLFxuICB9LFxuICBkZXBhcnRlbWVudF9tb3NlbGxlOiB7XG4gICAgbGFiZWw6IFwiZHUgZFx1MDBFOXBhcnRlbWVudCBkZSBNb3NlbGxlXCIsXG4gICAgbGluazogXCJodHRwOi8vd3d3Lm1vc2VsbGUuZnIvbW9zZWxsZWV0dm91cy9wYWdlcy9maWNoZV9zZW5pb3JfYXBhLmFzcHhcIixcbiAgICBmb3JtOiBcImh0dHA6Ly93d3cubW9zZWxsZS5mci9zaXRlY29sbGVjdGlvbmRvY3VtZW50cy9sYW1vc2VsbGVldHZvdXMvc29saWRhcml0ZS9zZW5pb3JzL2Zvcm11bGFpcmVfZGVtYW5kZV9hcGFfZG9taWNpbGUucGRmXCIsXG4gIH0sXG4gIGRlcGFydGVtZW50X25vcmQ6IHtcbiAgICBsYWJlbDogXCJkdSBkXHUwMEU5cGFydGVtZW50IGR1IE5vcmRcIixcbiAgICBsaW5rOiBcImh0dHBzOi8vbGVub3JkLmZyL2pjbXMvcHJkMl8zMzU5MjYvYWxsb2NhdGlvbi1wZXJzb25uYWxpc2VlLWQtYXV0b25vbWllLWFwYVwiLFxuICAgIGZvcm06IFwiaHR0cHM6Ly9sZW5vcmQuZnIvdXBsb2FkL2RvY3MvYXBwbGljYXRpb24vcGRmLzIwMTgtMDQvZm9ybXVsYWlyZV9hcGFfMjAxOC0wNC0yN18xNi0zMC01NV85NDkucGRmXCIsXG4gIH0sXG4gIGRlcGFydGVtZW50X3Bhc19kZV9jYWxhaXM6IHtcbiAgICBsYWJlbDogXCJkdSBkXHUwMEU5cGFydGVtZW50IGR1IFBhcyBkZSBDYWxhaXNcIixcbiAgICBsaW5rOiBcImh0dHA6Ly93d3cucGFzZGVjYWxhaXMuZnIvU29saWRhcml0ZS1TYW50ZS9SZXRyYWl0ZXMtZXQtcGVyc29ubmVzLWFnZWVzL0JlbmVmaWNpZXItZC1haWRlcy9MLUFsbG9jYXRpb24tUGVyc29ubmFsaXNlZS1kLUF1dG9ub21pZS1BUEFcIixcbiAgICBmb3JtOiBcImh0dHA6Ly93d3cucGFzZGVjYWxhaXMuZnIvY29udGVudC9kb3dubG9hZC83OTc3NC8xMjYzNTAzL2ZpbGUvRG9zc2llcitkZStkZW1hbmRlK0FQQS5wZGZcIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfcHlyZW5lZXNfYXRsYW50aXF1ZXM6IHtcbiAgICBsYWJlbDogXCJkdSBkXHUwMEU5cGFydGVtZW50IGRlcyBQeXJcdTAwRTluXHUwMEU5ZXMgQXRsYW50aXF1ZXNcIixcbiAgICBsaW5rOiBcImh0dHA6Ly93d3cubGU2NC5mci9zb2xpZGFyaXRlL2F1dG9ub21pZS9zb3V0aWVuLWEtZG9taWNpbGUvY29tcGVuc2VyLWxhLWRlcGVuZGFuY2UtcGFyLWxhcGEuaHRtbFwiLFxuICAgIGZvcm06IFwiaHR0cDovL3d3dy5sZTY0LmZyL2ZpbGVhZG1pbi9tZWRpYXRoZXF1ZS9jZzY0L2RvY3VtZW50cy9hY3R1YWxpdGVzL0FQQV8yMDE3L2Rvc3NpZXJfQVBBX21vZGlmaSVDMyVBOV9qdWluXzIwMTcucGRmXCIsXG4gIH0sXG4gIGRlcGFydGVtZW50X2Jhc19yaGluOiB7XG4gICAgbGFiZWw6IFwiZHUgZFx1MDBFOXBhcnRlbWVudCBkdSBCYXMtUmhpblwiLFxuICAgIGxpbms6IFwiaHR0cDovL3d3dy5iYXMtcmhpbi5mci9hY2Nlcy1kaXJlY3QvZ3VpZGUtYWlkZXMvZGV0YWlsLWd1aWRlLWFpZGVzLzM4MS9BbGxvY2F0aW9uLXBlcnNvbm5hbGlzZWUtZC1hdXRvbm9taWUtLUFQQS0tYS1kb21pY2lsZVwiLFxuICAgIGZvcm06IFwiaHR0cDovL3d3dy5iYXMtcmhpbi5mci9lQ29tbXVuaXR5RG9jdW1lbnRzLyU3QkUzNEM0RDk4LTYzMUQtNDU5Qi1BQTRFLTYxQzkxRDJGN0JBMCU3RC8zNzU5L2RvY3VtZW50X2NvbnNlaWwtZGVwYXJ0ZW1lbnRhbC1iYXMtcmhpbi1mb3JtdWxhaXJlLWRlbWFuZGUtYXBhLnBkZlwiLFxuICB9LFxuICBkZXBhcnRlbWVudF9kdV9oYXV0X3JoaW46IHtcbiAgICBsYWJlbDogXCJkdSBkXHUwMEU5cGFydGVtZW50IGR1IEhhdXQtUmhpblwiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly93d3cuaGF1dC1yaGluLmZyL2NvbnRlbnQvdml2cmUtJUMzJUEwLWRvbWljaWxlLTEjOn46dGV4dD1MJ0FsbG9jYXRpb24lMjBwZXJzb25uYWxpcyVDMyVBOWUlMjBkJ2F1dG9ub21pZSUyMCVDMyVBMCUyMGRvbWljaWxlJTIwKEFQQSksJUMzJUEwJTIwbGV1ciUyMHBlcnRlJTIwZCdhdXRvbm9taWUuXCIsXG4gICAgZm9ybTogXCJodHRwczovL3d3dy5oYXV0LXJoaW4uZnIvc2l0ZXMvY2VhL2ZpbGVzL0ZPUk1VTEFJUkUlMjBBUEFfMS5wZGZcIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfcGFyaXM6IHtcbiAgICBsYWJlbDogXCJkZSBQYXJpc1wiLFxuICAgIGxpbms6IFwiaHR0cHM6Ly93d3cucGFyaXMuZnIvYWlkZXNfc291dGllbl9hX2RvbWljaWxlI2FsbG9jYXRpb24tcGVyc29ubmFsaXNlZS1kLWF1dG9ub21pZS1hLWRvbWljaWxlLWFwYV8yMVwiLFxuICAgIGluc3RydWN0aW9uczogXCJodHRwczovL2FwYS5wYXJpcy5mci9wb3J0YWlsQVBBL1wiLFxuICB9LFxuICBkZXBhcnRlbWVudF9zZWluZV9tYXJpdGltZToge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZGUgU2VpbmUgTWFyaXRpbWVcIixcbiAgICBsaW5rOiBcImh0dHBzOi8vd3d3LnNlaW5lbWFyaXRpbWUuZnIvdm9zLXNlcnZpY2VzL3BlcnNvbm5lcy1hZ2Vlcy0xL2JlbmVmaWNpZXItZGFpZGVzL2xhbGxvY2F0aW9uLWF1eC1wZXJzb25uZXMtYWdlZXMuaHRtbFwiLFxuICAgIGZvcm06IFwiaHR0cHM6Ly93d3cuc2VpbmVtYXJpdGltZS5mci9kb2NzLzFfYXBhLTFlcmUtZGVtYW5kZS1kb21pY2lsZS5wZGZcIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfc2VpbmVfZXRfbWFybmU6IHtcbiAgICBsYWJlbDogXCJkdSBkXHUwMEU5cGFydGVtZW50IGRlIFNlaW5lIGV0IE1hcm5lXCIsXG4gICAgdGVsZXNlcnZpY2U6IFwiaHR0cHM6Ly9lLXNlcnZpY2Uuc2VpbmUtZXQtbWFybmUuZnIvXCIsXG4gICAgbGluazogXCJodHRwOi8vd3d3LnNlaW5lLWV0LW1hcm5lLmZyL1NvbGlkYXJpdGUvU2VuaW9ycy9NYWludGllbi1hLWRvbWljaWxlLUFQQS9BbGxvY2F0aW9uLVBlcnNvbm5hbGlzZWUtZC1BdXRvbm9taWUtQVBBXCIsXG4gIH0sXG4gIGRlcGFydGVtZW50X3Zhcjoge1xuICAgIGxhYmVsOiBcImR1IGRcdTAwRTlwYXJ0ZW1lbnQgZHUgVmFyXCIsXG4gICAgbGluazogXCJodHRwczovL3d3dy52YXIuZnIvc29jaWFsL2F1dG9ub21pZS1wZXJzb25uZXMtYWdlZXMvYXBhXCIsXG4gICAgaW5zdHJ1Y3Rpb25zOiBcImh0dHBzOi8vd3d3LnZhci5mci9zb2NpYWwvYXV0b25vbWllLXBlcnNvbm5lcy1hZ2Vlcy9hcGFcIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfaGF1dHNfZGVfc2VpbmU6IHtcbiAgICBsYWJlbDogXCJkdSBkXHUwMEU5cGFydGVtZW50IGRlIEhhdXRzIGRlIFNlaW5lXCIsXG4gICAgbGluazogXCJodHRwOi8vd3d3LmhhdXRzLWRlLXNlaW5lLmZyL3NvbGlkYXJpdGVzL3BlcnNvbm5lcy1hZ2Vlcy9tYWludGllbi1hLWRvbWljaWxlL2NvbW1lbnQtYmVuZWZpY2llci1kZS1sYXBhL1wiLFxuICAgIGZvcm06IFwiaHR0cDovL3d3dy5oYXV0cy1kZS1zZWluZS5mci9maWxlYWRtaW4vUERGL1NvbGlkYXJpdGVzL0F1dG9ub21pZS9BUEFfRG9zc2llckRlbWFuZGVEb21fZGVjMjAxOC5wZGZcIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfc2VpbmVfc2FpbnRfZGVuaXM6IHtcbiAgICBsYWJlbDogXCJkdSBkXHUwMEU5cGFydGVtZW50IGRlIFNlaW5lIFNhaW50IERlbmlzXCIsXG4gICAgbGluazogXCJodHRwczovL3NlaW5lc2FpbnRkZW5pcy5mci9BbGxvY2F0aW9uLURlcGFydGVtZW50YWxlLVBlcnNvbm5hbGlzZWUtZC1BdXRvbm9taWUuaHRtbFwiLFxuICAgIGZvcm06IFwiaHR0cHM6Ly9zZWluZXNhaW50ZGVuaXMuZnIvSU1HL3BkZi9mb3JtdWxhaXJlX2RlbWFuZGVfYWRwYS5wZGZcIixcbiAgfSxcbiAgZGVwYXJ0ZW1lbnRfdmFsX2RlX21hcm5lOiB7XG4gICAgbGFiZWw6IFwiZHUgZFx1MDBFOXBhcnRlbWVudCBkdSBWYWwgZGUgTWFybmVcIixcbiAgICBsaW5rOiBcImh0dHBzOi8vd3d3LnZhbGRlbWFybmUuZnIvYS12b3RyZS1zZXJ2aWNlL3BlcnNvbm5lcy1hZ2Vlcy9hbGxvY2F0aW9uLXBlcnNvbm5hbGlzZWUtZGF1dG9ub21pZS1hLWRvbWljaWxlLWFwYWRcIixcbiAgICBmb3JtOiBcImh0dHBzOi8vd3d3LnZhbGRlbWFybmUuZnIvZG93bmxvYWQvc2l0ZXMvZGVmYXVsdC9maWxlcy9mb3JtdWxhaXJlcy93ZWJmb3JtdWRlbWFuZGVfYXBhXy0yMDE4Xy5wZGZcIixcbiAgfSxcbiAgaW50ZXJjb21tdW5hbGl0ZV9tZXRyb3BvbGVfbHlvbjoge1xuICAgIGxhYmVsOiBcImRlIGxhIE1cdTAwRTl0cm9wb2xlIGRlIEx5b25cIixcbiAgICBsaW5rOiBcImh0dHBzOi8vd3d3LmdyYW5kbHlvbi5jb20vc2VydmljZXMvYWxsb2NhdGlvbi1wZXJzb25uYWxpc2VlLWQtYXV0b25vbWllLmh0bWxcIixcbiAgICBmb3JtOiBcImh0dHBzOi8vd3d3LmdyYW5kbHlvbi5jb20vZmlsZWFkbWluL3VzZXJfdXBsb2FkL21lZGlhL3BkZi9wYS1waC9wZXJzb25uZXMtYWdlZXMvMjAxNzA4MDJfZG9zc2llcl9kZW1hbmRlX2FwYS5wZGZcIixcbiAgfSxcbn1cblxuZnVuY3Rpb24gZm9ybWF0QmVuZWZpdChpbnN0aXR1dGlvbikge1xuICBjb25zdCBjdXN0b21pemF0aW9uQmVuZWZpdCA9IEFQQV9CWV9DT0RFW2luc3RpdHV0aW9uXVxuICByZXR1cm4ge1xuICAgIGlkOiBgJHtpbnN0aXR1dGlvbi5yZXBsYWNlKC9fL2csIFwiLVwiKX0tYXBhLWVsaWdpYmlsaXRlYCxcbiAgICAuLi5ERUZBVUxUX0FQQSxcbiAgICBkZXNjcmlwdGlvbjogYExcdTIwMTlhbGxvY2F0aW9uIHBlcnNvbm5hbGlzXHUwMEU5ZSBkXHUyMDE5YXV0b25vbWllIChBUEEpICR7Y3VzdG9taXphdGlvbkJlbmVmaXQubGFiZWx9IGVzdCB1bmUgYWlkZSByXHUwMEU5c2Vydlx1MDBFOWUgYXV4IHBsdXMgZGVcbiAgICA2MCBhbnMgZW4gcGVydGUgZFx1MjAxOWF1dG9ub21pZS4gXHUwMEMwIHRyYXZlcnMgdW4gcGxhbiBkXHUyMDE5YWN0aW9uLCBlbGxlIGZhdm9yaXNlIGxlXG4gICAgbWFpbnRpZW4gXHUwMEUwIGRvbWljaWxlIGV0IGxcdTIwMTlhbVx1MDBFOWxpb3JhdGlvbiBkZSBsYSBxdWFsaXRcdTAwRTkgZGUgdmllIGRlcyBwZXJzb25uZXMgXHUwMEUyZ1x1MDBFOWVzXG4gICAgZW4gXHUwMEU5dGFibGlzc2VtZW50IGVuIHN1YnZlbnRpb25uYW50IGRlcyBzZXJ2aWNlcyBkXHUyMDE5YWlkZXMgXHUwMEUwIGxhIHBlcnNvbm5lLiBTYVxuICAgIGdlc3Rpb24gZXN0IGNvbmZpXHUwMEU5ZSBhdXggY29uc2VpbHMgZFx1MDBFOXBhcnRlbWVudGF1eC4uLmAsXG4gICAgY29uZGl0aW9uczogW1xuICAgICAgYEZhaXJlIFx1MDBFOXZhbHVlciB2b3RyZSBwZXJ0ZSBkXHUyMDE5YXV0b25vbWllIChjbGFzc2VtZW50IEdJUikgXHUwMEUwIGRvbWljaWxlIHBhciBsZXNcbiAgICAgIHNlcnZpY2VzIHNvY2lhdXggZGUgdm90cmUgZFx1MDBFOXBhcnRlbWVudC5gLFxuICAgICAgXCJBY2NlcHRlciBsZSBwbGFuIGRcdTIwMTlhaWRlIHByb3Bvc1x1MDBFOSBwYXIgdm90cmUgZFx1MDBFOXBhcnRlbWVudC5cIixcbiAgICAgIFwiUlx1MDBFOXNpZGVyIGRlcHVpcyBwbHVzIGRlIHRyb2lzIG1vaXMgZGFucyB2b3RyZSBkXHUwMEU5cGFydGVtZW50LlwiLFxuICAgICAgJ05lIHBhcyBwZXJjZXZvaXIgPGEgdGFyZ2V0PVwiX2JsYW5rXCIgcmVsPVwibm9vcGVuZXJcIiB0aXRsZT1cIlNlcnZpY2UgUHVibGljLmZyIC0gUGV1dC1vbiBjdW11bGVyIGxcdTIwMTlBUEEgYXZlYyBkXHUyMDE5YXV0cmVzIHJldmVudXMgPyAtIE5vdXZlbGxlIGZlblx1MDBFQXRyZVwiIGhyZWY9XCJodHRwczovL3d3dy5zZXJ2aWNlLXB1YmxpYy5mci9wYXJ0aWN1bGllcnMvdm9zZHJvaXRzL0YxMTY3OFwiPmNlcnRhaW5lcyBhdXRyZXMgYWlkZXM8L2E+IG5vbiBjdW11bGFibGVzIGF2ZWMgbFx1MjAxOUFQQS4nLFxuICAgIF0sXG4gICAgLi4uY3VzdG9taXphdGlvbkJlbmVmaXQsXG4gICAgbGFiZWw6IGBBbGxvY2F0aW9uIHBlcnNvbm5hbGlzXHUwMEU5ZSBkXHUyMDE5YXV0b25vbWllICR7Y3VzdG9taXphdGlvbkJlbmVmaXQubGFiZWx9YCxcbiAgICBpbnN0aXR1dGlvbixcbiAgICBzb3VyY2U6IFwiamF2YXNjcmlwdFwiLFxuICAgIGNvbmRpdGlvbnNfZ2VuZXJhbGVzOiBbXG4gICAgICB7XG4gICAgICAgIHR5cGU6IFwiYWdlXCIsXG4gICAgICAgIG9wZXJhdG9yOiBcIj49XCIsXG4gICAgICAgIHZhbHVlOiBcIjYwXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0eXBlOiBcImF0dGFjaGVkX3RvX2luc3RpdHV0aW9uXCIsXG4gICAgICB9LFxuICAgIF0sXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkQVBBKCkge1xuICByZXR1cm4gT2JqZWN0LmtleXMoQVBBX0JZX0NPREUpLm1hcCgoY29kZSkgPT4gZm9ybWF0QmVuZWZpdChjb2RlKSlcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3ZhbGFuZHJpYW5pL0NvZGUvQmV0YS1nb3V2LUFpZGVzLWpldW5lcy9haWRlcy1qZXVuZXMvZGF0YVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3ZhbGFuZHJpYW5pL0NvZGUvQmV0YS1nb3V2LUFpZGVzLWpldW5lcy9haWRlcy1qZXVuZXMvZGF0YS9pbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvdmFsYW5kcmlhbmkvQ29kZS9CZXRhLWdvdXYtQWlkZXMtamV1bmVzL2FpZGVzLWpldW5lcy9kYXRhL2luZGV4LnRzXCI7aW1wb3J0IHsgYWRkaXRpb25hbEJlbmVmaXRBdHRyaWJ1dGVzIH0gZnJvbSBcIi4vYmVuZWZpdHMvYWRkaXRpb25hbC1hdHRyaWJ1dGVzL2luZGV4LmpzXCJcbmltcG9ydCBhaWRlc1ZlbG9HZW5lcmF0b3IgZnJvbSBcIi4vYmVuZWZpdHMvYWlkZXMtdmVsby1nZW5lcmF0b3IuanNcIlxuaW1wb3J0IHsgYnVpbGRGU0wgfSBmcm9tIFwiLi9iZW5lZml0cy9keW5hbWljL2ZzbC5qc1wiXG5pbXBvcnQgeyBidWlsZEFQQSB9IGZyb20gXCIuL2JlbmVmaXRzL2R5bmFtaWMvYXBhLmpzXCJcblxuZnVuY3Rpb24gZ2VuZXJhdGVJbnN0aXR1dGlvbklkKGluc3RpdHV0aW9uKSB7XG4gIHJldHVybiBgJHtpbnN0aXR1dGlvbi50eXBlfV8ke1xuICAgIGluc3RpdHV0aW9uLmNvZGVfaW5zZWUgfHwgaW5zdGl0dXRpb24uY29kZV9zaXJlbiB8fCBpbnN0aXR1dGlvbi5zbHVnXG4gIH1gXG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlQmVuZWZpdElkKGJlbmVmaXQpIHtcbiAgcmV0dXJuIGJlbmVmaXQuaWQgfHwgYmVuZWZpdC5zbHVnXG59XG5cbmZ1bmN0aW9uIHRyYW5zZm9ybUluc3RpdHV0aW9ucyhjb2xsZWN0aW9uOiBhbnlbXSkge1xuICByZXR1cm4gY29sbGVjdGlvbi5yZWR1Y2UoKHJlc3VsdCwgZGF0YSkgPT4ge1xuICAgIGNvbnN0IGl0ZW0gPSB7XG4gICAgICBzbHVnOiBkYXRhLnNsdWcsXG4gICAgICBpZDogZ2VuZXJhdGVJbnN0aXR1dGlvbklkKGRhdGEpLFxuICAgICAgY29kZV9zaXJlbjogZGF0YS5jb2RlX3NpcmVuLFxuICAgICAgY29kZV9pbnNlZTogZGF0YS5jb2RlX2luc2VlLFxuICAgICAgbGFiZWw6IGRhdGEubmFtZSxcbiAgICAgIGltZ1NyYzogZGF0YS5pbWdTcmMsXG4gICAgICBkZXBhcnRtZW50OiBkYXRhLmRlcGFydG1lbnQsXG4gICAgICBiZW5lZml0c0lkczogW10sXG4gICAgICB0eXBlOiBkYXRhLnR5cGUsXG4gICAgICB0b3A6IGRhdGEudG9wLFxuICAgICAgcmVwb3NpdG9yeTpcbiAgICAgICAgZGF0YS5yZXBvc2l0b3J5IHx8IChkYXRhLnR5cGUgPT09IFwibmF0aW9uYWxcIiA/IG51bGwgOiBcImZyYW5jZS1sb2NhbFwiKSxcbiAgICAgIGV0YWJsaXNzZW1lbnRzOiBkYXRhLmV0YWJsaXNzZW1lbnRzLFxuICAgIH1cbiAgICByZXN1bHRbZGF0YS5zbHVnXSA9IGl0ZW1cbiAgICByZXR1cm4gcmVzdWx0XG4gIH0sIHt9KVxufVxuXG5mdW5jdGlvbiBzZXRUb3AoYmVuZWZpdCwgaW5zdGl0dXRpb24pIHtcbiAgY29uc3QgZGVmYXVsdF90b3AgPVxuICAgIGluc3RpdHV0aW9uLnRvcCB8fFxuICAgIChpbnN0aXR1dGlvbi50eXBlID09PSBcIm5hdGlvbmFsXCJcbiAgICAgID8gM1xuICAgICAgOiBiZW5lZml0LnNvdXJjZSA9PSBcImFpZGVzLXZlbG9cIlxuICAgICAgPyAxM1xuICAgICAgOiAxNClcblxuICByZXR1cm4gYmVuZWZpdC50b3AgfHwgZGVmYXVsdF90b3Bcbn1cblxuZnVuY3Rpb24gc2V0RGVmYXVsdHMoYmVuZWZpdCwgaW5zdGl0dXRpb24pIHtcbiAgYmVuZWZpdC5pZCA9IGdlbmVyYXRlQmVuZWZpdElkKGJlbmVmaXQpXG4gIGJlbmVmaXQudG9wID0gc2V0VG9wKGJlbmVmaXQsIGluc3RpdHV0aW9uKVxuICBiZW5lZml0LmZsb29yQXQgPSBiZW5lZml0LmZsb29yQXQgfHwgMVxuICByZXR1cm4gYmVuZWZpdFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGUoXG4gIGNvbGxlY3Rpb25zLFxuICBhZGRpdGlvbmFsQmVuZWZpdEF0dHJpYnV0ZXMsXG4gIGFpZGVzVmVsb0JlbmVmaXRMaXN0R2VuZXJhdG9yLFxuICBmc2xHZW5lcmF0b3IsXG4gIGFwYUdlbmVyYXRvclxuKSB7XG4gIGNvbnNvbGUubG9nKGNvbGxlY3Rpb25zLmluc3RpdHV0aW9uX3R5cGVzLml0ZW1zKVxuICBpZiAoY29sbGVjdGlvbnMuaW5zdGl0dXRpb25zLml0ZW1zLmxlbmd0aCA9PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQXVjdW4gdHlwZSBkJ2luc3RpdHV0aW9uXCIpXG4gIH1cbiAgY29uc3QgaW5zdGl0dXRpb25zID0gdHJhbnNmb3JtSW5zdGl0dXRpb25zKGNvbGxlY3Rpb25zLmluc3RpdHV0aW9ucy5pdGVtcylcblxuICBjb2xsZWN0aW9ucy5iZW5lZml0c19qYXZhc2NyaXB0Lml0ZW1zLmZvckVhY2goKGJlbmVmaXQpID0+IHtcbiAgICBiZW5lZml0LnNvdXJjZSA9IFwiamF2YXNjcmlwdFwiXG4gIH0pXG4gIGNvbGxlY3Rpb25zLmJlbmVmaXRzX29wZW5maXNjYS5pdGVtcy5mb3JFYWNoKChiZW5lZml0KSA9PiB7XG4gICAgYmVuZWZpdC5zb3VyY2UgPSBcIm9wZW5maXNjYVwiXG4gIH0pXG5cbiAgY29uc3QgYWlkZXNWZWxvQmVuZWZpdHMgPSBhaWRlc1ZlbG9CZW5lZml0TGlzdEdlbmVyYXRvclxuICAgID8gYWlkZXNWZWxvQmVuZWZpdExpc3RHZW5lcmF0b3IoT2JqZWN0LnZhbHVlcyhpbnN0aXR1dGlvbnMpKVxuICAgIDogW11cbiAgYWlkZXNWZWxvQmVuZWZpdHMuZm9yRWFjaCgoYmVuZWZpdCkgPT4ge1xuICAgIGJlbmVmaXQuc291cmNlID0gXCJhaWRlcy12ZWxvXCJcbiAgfSlcblxuICBjb25zdCBmc2xCZW5lZml0cyA9IGZzbEdlbmVyYXRvciA/IGZzbEdlbmVyYXRvcigpIDogW11cbiAgY29uc3QgYXBhQmVuZWZpdHMgPSBhcGFHZW5lcmF0b3IgPyBhcGFHZW5lcmF0b3IoKSA6IFtdXG5cbiAgbGV0IGJlbmVmaXRzID0gW1xuICAgIC4uLmNvbGxlY3Rpb25zLmJlbmVmaXRzX2phdmFzY3JpcHQuaXRlbXMsXG4gICAgLi4uY29sbGVjdGlvbnMuYmVuZWZpdHNfb3BlbmZpc2NhLml0ZW1zLFxuICAgIC4uLmFpZGVzVmVsb0JlbmVmaXRzLmZpbHRlcigoYikgPT4gYi5pbnN0aXR1dGlvbiksXG4gICAgLi4uYXBhQmVuZWZpdHMsXG4gICAgLi4uZnNsQmVuZWZpdHMsXG4gIF0ubWFwKChiZW5lZml0KSA9PiB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGJlbmVmaXQsIGFkZGl0aW9uYWxCZW5lZml0QXR0cmlidXRlc1tiZW5lZml0LnNsdWddKVxuICB9KVxuXG4gIGNvbnN0IGJlbmVmaXRzTWFwID0ge31cblxuICBiZW5lZml0cyA9IGJlbmVmaXRzLm1hcCgoYmVuZWZpdCkgPT4ge1xuICAgIGNvbnN0IGluc3RpdHV0aW9uID0gaW5zdGl0dXRpb25zW2JlbmVmaXQuaW5zdGl0dXRpb25dXG4gICAgYmVuZWZpdCA9IHNldERlZmF1bHRzKGJlbmVmaXQsIGluc3RpdHV0aW9uKVxuICAgIGluc3RpdHV0aW9uLmJlbmVmaXRzSWRzLnB1c2goYmVuZWZpdC5pZClcbiAgICBiZW5lZml0Lmluc3RpdHV0aW9uID0gaW5zdGl0dXRpb25cbiAgICBiZW5lZml0c01hcFtiZW5lZml0LmlkXSA9IGJlbmVmaXRcbiAgICByZXR1cm4gYmVuZWZpdFxuICB9KVxuXG4gIGNvbnN0IHJlc3VsdCA9IHtcbiAgICBhbGw6IGJlbmVmaXRzLFxuICAgIGluc3RpdHV0aW9uc01hcDogaW5zdGl0dXRpb25zLFxuICAgIGJlbmVmaXRzTWFwOiBiZW5lZml0c01hcCxcbiAgfVxuXG4gIHJldHVybiByZXN1bHRcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBnZW5lcmF0ZUluc3RpdHV0aW9uSWQsXG4gIGdlbmVyYXRlQmVuZWZpdElkLFxuICBmbjogZ2VuZXJhdGUsXG4gIGdlbmVyYXRlOiAoamFtKSA9PlxuICAgIGdlbmVyYXRlKFxuICAgICAgamFtLmNvbGxlY3Rpb25zLFxuICAgICAgYWRkaXRpb25hbEJlbmVmaXRBdHRyaWJ1dGVzLFxuICAgICAgYWlkZXNWZWxvR2VuZXJhdG9yLFxuICAgICAgYnVpbGRGU0wsXG4gICAgICBidWlsZEFQQVxuICAgICksXG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy92YWxhbmRyaWFuaS9Db2RlL0JldGEtZ291di1BaWRlcy1qZXVuZXMvYWlkZXMtamV1bmVzL3JvbGx1cFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3ZhbGFuZHJpYW5pL0NvZGUvQmV0YS1nb3V2LUFpZGVzLWpldW5lcy9haWRlcy1qZXVuZXMvcm9sbHVwL2luc3RpdHV0aW9ucy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvdmFsYW5kcmlhbmkvQ29kZS9CZXRhLWdvdXYtQWlkZXMtamV1bmVzL2FpZGVzLWpldW5lcy9yb2xsdXAvaW5zdGl0dXRpb25zLnRzXCI7aW1wb3J0IGdlbmVyYXRvciBmcm9tIFwiLi4vZGF0YS9hbGwuanNcIlxuXG5pbXBvcnQgeyBjcmVhdGVSZXF1aXJlIH0gZnJvbSBcIm1vZHVsZVwiXG5jb25zdCByZXF1aXJlID0gY3JlYXRlUmVxdWlyZShpbXBvcnQubWV0YS51cmwpXG5jb25zdCBlcGNpcyA9IHJlcXVpcmUoXCJAZXRhbGFiL2RlY291cGFnZS1hZG1pbmlzdHJhdGlmL2RhdGEvZXBjaS5qc29uXCIpXG5cbmNvbnN0IGluc3RpdHV0aW9uc0JlbmVmaXRzID0ge31cblxuZm9yIChjb25zdCBiZW5lZml0IGluIGdlbmVyYXRvci5iZW5lZml0c01hcCkge1xuICBpZiAoZ2VuZXJhdG9yLmJlbmVmaXRzTWFwW2JlbmVmaXRdLnByaXZhdGUpIHtcbiAgICBjb250aW51ZVxuICB9XG4gIGNvbnN0IGluc3RpdHV0aW9uID0gZ2VuZXJhdG9yLmJlbmVmaXRzTWFwW2JlbmVmaXRdLmluc3RpdHV0aW9uLnNsdWdcbiAgaWYgKCFpbnN0aXR1dGlvbnNCZW5lZml0c1tpbnN0aXR1dGlvbl0pIHtcbiAgICBpbnN0aXR1dGlvbnNCZW5lZml0c1tpbnN0aXR1dGlvbl0gPSBbXVxuICB9XG4gIGluc3RpdHV0aW9uc0JlbmVmaXRzW2luc3RpdHV0aW9uXS5wdXNoKHtcbiAgICBsYWJlbDogZ2VuZXJhdG9yLmJlbmVmaXRzTWFwW2JlbmVmaXRdLmxhYmVsLFxuICAgIGlkOiBnZW5lcmF0b3IuYmVuZWZpdHNNYXBbYmVuZWZpdF0uaWQsXG4gIH0pXG59XG5cbmNvbnN0IGluc3RpdHV0aW9ucyA9IHtcbiAgbmF0aW9uYWw6IFtdLFxuICByZWdpb246IFtdLFxuICBkZXBhcnRlbWVudDogW10sXG4gIGVwY2k6IFtdLFxuICBjYWY6IFtdLFxuICBtc2E6IFtdLFxuICBjb21tdW5lOiBbXSxcbiAgYXV0cmU6IFtdLFxufVxuXG5mb3IgKGNvbnN0IGlkIGluIGdlbmVyYXRvci5pbnN0aXR1dGlvbnNNYXApIHtcbiAgY29uc3QgaW5zdGl0dXRpb24gPSBnZW5lcmF0b3IuaW5zdGl0dXRpb25zTWFwW2lkXVxuXG4gIC8vIEluc3RpdHV0aW9uIGhhcyBubyBhdHRhY2hlZCBiZW5lZml0XG4gIGlmICghaW5zdGl0dXRpb25zQmVuZWZpdHNbaW5zdGl0dXRpb24uc2x1Z10pIHtcbiAgICBjb250aW51ZVxuICB9XG4gIGNvbnN0IGluc3RpdHV0aW9uT2JqZWN0ID0ge1xuICAgIGlkOiBpbnN0aXR1dGlvbi5zbHVnLFxuICAgIGxhYmVsOiBpbnN0aXR1dGlvbi5sYWJlbCxcbiAgICB0eXBlOiBpbnN0aXR1dGlvbi50eXBlLFxuICAgIGJlbmVmaXRzOiBpbnN0aXR1dGlvbnNCZW5lZml0c1tpbnN0aXR1dGlvbi5zbHVnXSxcbiAgfVxuICBpZiAoaW5zdGl0dXRpb24udHlwZSA9PT0gXCJlcGNpXCIpIHtcbiAgICBpbnN0aXR1dGlvbk9iamVjdC5sb2NhdGlvbiA9XG4gICAgICBlcGNpc1xuICAgICAgICAuZmluZCgoZWxlbWVudCkgPT4gZWxlbWVudC5jb2RlID09PSBpbnN0aXR1dGlvbi5jb2RlX3NpcmVuKVxuICAgICAgICA/Lm1lbWJyZXMubWFwKChjb21tdW5lKSA9PiBjb21tdW5lLmNvZGUpIHx8IFtdXG4gIH0gZWxzZSBpZiAoaW5zdGl0dXRpb24udHlwZSA9PT0gXCJjYWZcIikge1xuICAgIGluc3RpdHV0aW9uT2JqZWN0LmxvY2F0aW9uID0gaW5zdGl0dXRpb24uZGVwYXJ0bWVudFxuICB9IGVsc2UgaWYgKFtcInJlZ2lvblwiLCBcImRlcGFydGVtZW50XCIsIFwiY29tbXVuZVwiXS5pbmNsdWRlcyhpbnN0aXR1dGlvbi50eXBlKSkge1xuICAgIGluc3RpdHV0aW9uT2JqZWN0LmxvY2F0aW9uID0gaW5zdGl0dXRpb24uY29kZV9pbnNlZVxuICB9XG4gIGlmICghaW5zdGl0dXRpb25zW2luc3RpdHV0aW9uLnR5cGVdKSB7XG4gICAgY29uc29sZS5sb2coaW5zdGl0dXRpb24pXG4gICAgY29uc3QgbXNnID0gYFRoZSBuZXcgaW5zdGl0dXRpb24gdHlwZSAnJHtpbnN0aXR1dGlvbi50eXBlfScgb2YgJyR7aW5zdGl0dXRpb24uc2x1Z30nIG5lZWRzIHRvIGJlIGFkZGVkIGluIHJvbGx1cC9pbnN0aXR1dGlvbnMudHNgXG4gICAgY29uc29sZS5lcnJvcihtc2cpXG4gICAgdGhyb3cgbmV3IEVycm9yKG1zZylcbiAgfVxuICBpbnN0aXR1dGlvbnNbaW5zdGl0dXRpb24udHlwZV0ucHVzaChpbnN0aXR1dGlvbk9iamVjdClcbn1cblxuZXhwb3J0IGRlZmF1bHQgaW5zdGl0dXRpb25zXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy92YWxhbmRyaWFuaS9Db2RlL0JldGEtZ291di1BaWRlcy1qZXVuZXMvYWlkZXMtamV1bmVzL3JvbGx1cFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3ZhbGFuZHJpYW5pL0NvZGUvQmV0YS1nb3V2LUFpZGVzLWpldW5lcy9haWRlcy1qZXVuZXMvcm9sbHVwL2JlbmVmaXRzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy92YWxhbmRyaWFuaS9Db2RlL0JldGEtZ291di1BaWRlcy1qZXVuZXMvYWlkZXMtamV1bmVzL3JvbGx1cC9iZW5lZml0cy50c1wiO2ltcG9ydCBnZW5lcmF0b3IgZnJvbSBcIi4uL2RhdGEvYWxsLmpzXCJcblxuY29uc3QgYmVuZWZpdHMgPSB7fVxuY29uc3QgZXhjbHVkZUtleXMgPSBbXG4gIFwiY29uZGl0aW9uc19nZW5lcmFsZXNcIixcbiAgXCJlbnRpdHlcIixcbiAgXCJldGFibGlzc2VtZW50c1wiLFxuICBcImZvcm1zXCIsXG4gIFwiaW50ZXJlc3RGbGFnXCIsXG4gIFwib3BlbmZpc2NhX2VsaWdpYmlsaXR5X3NvdXJjZVwiLFxuICBcIm9wZW5maXNjYVBlcmlvZFwiLFxuICBcInByb2ZpbHNcIixcbiAgXCJzZXRUb1plcm9SZWNlbnRseVwiLFxuICBcInRlbGVzZXJ2aWNlc1wiLFxuICBcInRvcFwiLFxuXVxuXG5mb3IgKGNvbnN0IGJlbmVmaXQgaW4gZ2VuZXJhdG9yLmJlbmVmaXRzTWFwKSB7XG4gIGlmIChiZW5lZml0LnByaXZhdGUpIHtcbiAgICBjb250aW51ZVxuICB9XG4gIGJlbmVmaXRzW2JlbmVmaXRdID0gZ2VuZXJhdG9yLmJlbmVmaXRzTWFwW2JlbmVmaXRdXG4gIGJlbmVmaXRzW2JlbmVmaXRdLmluc3RpdHV0aW9uID0ge1xuICAgIGxhYmVsOiBiZW5lZml0c1tiZW5lZml0XS5pbnN0aXR1dGlvbi5sYWJlbCxcbiAgICBpbWdTcmM6IGJlbmVmaXRzW2JlbmVmaXRdLmluc3RpdHV0aW9uLmltZ1NyYyxcbiAgfVxuICBmb3IgKGxldCBrZXkgb2YgZXhjbHVkZUtleXMpIHtcbiAgICBpZiAoYmVuZWZpdHNbYmVuZWZpdF1ba2V5XSkge1xuICAgICAgZGVsZXRlIGJlbmVmaXRzW2JlbmVmaXRdW2tleV1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgYmVuZWZpdHNcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3ZhbGFuZHJpYW5pL0NvZGUvQmV0YS1nb3V2LUFpZGVzLWpldW5lcy9haWRlcy1qZXVuZXMvcm9sbHVwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvdmFsYW5kcmlhbmkvQ29kZS9CZXRhLWdvdXYtQWlkZXMtamV1bmVzL2FpZGVzLWpldW5lcy9yb2xsdXAvZ2VuZXJhdG9yLnJvbGx1cC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvdmFsYW5kcmlhbmkvQ29kZS9CZXRhLWdvdXYtQWlkZXMtamV1bmVzL2FpZGVzLWpldW5lcy9yb2xsdXAvZ2VuZXJhdG9yLnJvbGx1cC50c1wiO2ltcG9ydCBpbnN0aXR1dGlvbnMgZnJvbSBcIi4vaW5zdGl0dXRpb25zLmpzXCJcbmltcG9ydCBiZW5lZml0cyBmcm9tIFwiLi9iZW5lZml0cy5qc1wiXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogXCJkYXRhIGdlbmVyYXRvclwiLFxuICByZXNvbHZlSWQ6IChzb3VyY2UpID0+IHtcbiAgICBpZiAoXG4gICAgICBzb3VyY2UgPT09IFwiZ2VuZXJhdG9yOmluc3RpdHV0aW9uc1wiIHx8XG4gICAgICBzb3VyY2UgPT09IFwiZ2VuZXJhdG9yOmJlbmVmaXRzXCJcbiAgICApIHtcbiAgICAgIHJldHVybiBzb3VyY2VcbiAgICB9XG4gICAgcmV0dXJuIG51bGxcbiAgfSxcbiAgbG9hZDogYXN5bmMgKGlkKSA9PiB7XG4gICAgaWYgKGlkID09PSBcImdlbmVyYXRvcjppbnN0aXR1dGlvbnNcIikge1xuICAgICAgcmV0dXJuIGBleHBvcnQgZGVmYXVsdCAke0pTT04uc3RyaW5naWZ5KGluc3RpdHV0aW9ucyl9YFxuICAgIH0gZWxzZSBpZiAoaWQgPT09IFwiZ2VuZXJhdG9yOmJlbmVmaXRzXCIpIHtcbiAgICAgIHJldHVybiBgZXhwb3J0IGRlZmF1bHQgJHtKU09OLnN0cmluZ2lmeShiZW5lZml0cyl9YFxuICAgIH1cbiAgfSxcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBbVcsT0FBTyxTQUFTO0FBQ25YLE9BQU8sWUFBWTtBQUNuQixTQUFTLHdCQUF3QjtBQUVqQyxPQUFPQSxXQUFVO0FBQ2pCLFNBQVMsY0FBYyxlQUFlOzs7QUNMZ04sSUFBTSwyQ0FBMkM7QUFFdlMsSUFBTSxZQUFZLElBQUksSUFBSSxLQUFLLHdDQUFlLEVBQUU7QUFFaEQsSUFBTSxNQUFNLFFBQVEsSUFBSSxZQUFZO0FBRXBDLElBQU0sTUFBMkI7QUFBQSxFQUMvQjtBQUFBLEVBQ0EsV0FBVztBQUFBLElBQ1QsT0FBTyxPQUFPLFFBQVEsSUFBSSxlQUFlLEtBQUs7QUFBQSxFQUNoRDtBQUFBLEVBQ0EsU0FDRSxRQUFRLElBQUksc0JBQ1o7QUFBQSxFQUNGLGNBQ0UsUUFBUSxJQUFJLCtCQUErQjtBQUFBLEVBQzdDLGlCQUFpQjtBQUFBLEVBQ2pCLG9CQUNFLFFBQVEsSUFBSSw2QkFDWjtBQUFBLEVBQ0Ysb0JBQW9CO0FBQUEsRUFDcEIsd0JBQ0UsUUFBUSxJQUFJLDRCQUNaO0FBQUEsRUFDRixZQUFZO0FBQUEsSUFDVixRQUFRLFFBQVEsSUFBSSw0QkFBNEI7QUFBQSxFQUNsRDtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sZ0JBQWdCO0FBQUEsSUFDaEIsa0JBQWtCO0FBQUEsSUFDbEIsbUJBQW1CO0FBQUEsSUFDbkIsZUFBZTtBQUFBLElBQ2YsZUFBZSxRQUFRLElBQUksd0JBQXdCO0FBQUEsSUFDbkQsV0FBVyxRQUFRLElBQUksb0JBQW9CO0FBQUEsSUFDM0Msa0JBQWtCO0FBQUEsTUFDaEI7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sSUFBSSxPQUFPLFFBQVEsSUFBSSxTQUFTLEtBQUs7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LFFBQ0wsS0FBS0UsTUFBSyxRQUFRRCxZQUFXLEtBQUs7QUFBQSxRQUNsQyxRQUFRQyxNQUFLLFFBQVFELFlBQVcsS0FBSztBQUFBLFFBQ3JDLFNBQVNDLE1BQUssUUFBUUQsWUFBVyxNQUFNO0FBQUEsTUFDekM7QUFBQSxJQUNGO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixlQUFlO0FBQUEsSUFDakI7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsicGF0aCIsICJfYSIsICJpbnN0aXR1dGlvbnMiLCAiX2EiLCAiZm9ybWF0QmVuZWZpdCIsICJhZGRpdGlvbmFsQmVuZWZpdEF0dHJpYnV0ZXMiLCAiaW5zdGl0dXRpb25zIiwgImJlbmVmaXRzIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwiLCAiX19kaXJuYW1lIiwgIl9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwiLCAicmVxdWlyZSIsICJiZW5lZml0cyIsICJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsIiwgIl9fZGlybmFtZSIsICJwYXRoIl0KfQo=
