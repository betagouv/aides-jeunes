import { StatutOccupationLogement } from "../../../lib/logement"

const DEFAULT_FSL = {
  type: "bool",
  prefix: "une",
  top: 6,
  periodicite: "ponctuelle",
}

export const FSL_BY_CODE = {
  D01: {
    label: "du département de l’Ain",
    link: "https://www.ain.fr/solutions/fond-solidarite-logement-maintien-dans-le-logement/",
  },
  D02: {
    label: "du département de l’Aisne",
    link: "https://aisne.com/aides/aide-a-lacces-au-logement-fonds-de-solidarite-pour-le-logement-fsl",
  },
  D03: {
    label: "du département de l’Allier",
    link: "https://www.allier.gouv.fr/exploitation-a603.html#!/particuliers/page/F1334",
    instructions:
      "https://www.allier.gouv.fr/exploitation-a603.html#!/particuliers/page/F1334",
  },
  D04: {
    label: "du département des Alpes-de-Haute-Provence",
    link: "http://www.mondepartement04.fr/rechercher-plus-daides/habitat-logement-urbanisme/fsl-masp/fonds-social-daide-au-logement-fsl.html",
    form: "http://www.mondepartement04.fr/fileadmin/mediatheque/cg04/formulaire/Insertion/Acc%C3%A8s_au_logement/IMPRIME_FSL_12-2019.pdf",
    instructions:
      "http://www.mondepartement04.fr/rechercher-plus-daides/habitat-logement-urbanisme/fsl-masp/mesure-daccompagnement-social-personnalise.html#c6266",
  },
  D05: {
    label: "du département des Hautes Alpes",
    link: "https://www.hautes-alpes.fr/4996-fonds-de-solidarite-pour-le-logement-fsl-.htm",
    instructions:
      "https://www.hautes-alpes.fr/4996-fonds-de-solidarite-pour-le-logement-fsl-.htm",
  },
  D06: {
    label: "du département des Alpes Maritimes",
    link: "https://www.departement06.fr/aides-a-l-insertion/fsl-2607.html",
  },
  M200030195: {
    label: "de la Métropole Nice Côte d’Azur",
    link: "http://www.nicecotedazur.org/habitat-urbanisme/le-logement/fonds-de-solidarit%C3%A9-pour-le-logement",
    form: "http://www.nicecotedazur.org/uploads/media_items/locataire.original.pdf",
  },
  D07: {
    label: "du département de l’Ardèche",
    link: "http://www.ardeche.fr/132-fonds-unique-logement.htm",
    form: "http://www.ardeche.fr/include/viewfilesecure.php?idtf=3609&path=cb%2F3609_762_formulaires-ful-2015BD.pdf",
  },
  D08: {
    label: "du département de l’Ardennes",
    link: "https://cd08.fr/aides-et-subventionss/fonds-de-solidarite-logement-fsl-formulaire-unique-de-demande-de-subvention",
    form: "https://cd08.fr/sites/default/files/maj2020_compilation_formulaires_fsl.pdf",
  },
  D09: {
    label: "du département de l’Ariège",
    link: "http://www.ariege.fr/Etre-solidaire/Logement/Le-Fonds-unique-Habitat-FUH",
    instructions:
      "http://www.ariege.fr/Etre-solidaire/Logement/Rencontrer-un-travailleur-social",
  },
  D11: {
    label: "du département de l’Aude",
    link: "https://www.aude.fr/je-beneficie-du-fonds-unique-logement-ful",
  },
  D12: {
    label: "du département de l’Aveyron",
    link: "https://aveyron.fr/pages/logement/des%20aides%20pour%20acc%C3%A9der%20%C3%A0%20un%20logement%20ou%20sy%20maintenir",
  },
  D13: {
    label: "du département Des Bouches-du-Rhône",
    link: "https://www.departement13.fr/nos-actions/logement/les-dispositifs/le-fonds-de-solidarite-pour-le-logement/",
  },
  D14: {
    label: "du département du Calvados",
    link: "https://www.calvados.fr/accueil/le-departement/solidarite---familles/aide-au-logement/fsl.html",
    instructions:
      "https://www.calvados.fr/accueil/le-departement/solidarite---familles/aide-au-logement/fsl.html",
  },
  D15: {
    label: "du département du Cantal",
    link: "http://www.cantal.fr/fonds-de-solidarite-pour-le-logement/",
  },
  D16: {
    label: "du département de Charente",
    link: "https://www.charentesolidarites.org/index.php/component/sppagebuilder/8-le-fsl.html",
    instructions:
      "https://www.charentesolidarites.org/index.php/component/sppagebuilder/8-le-fsl.html",
  },
  D17: {
    label: "du département de Charente-Maritime",
    link: "https://la.charente-maritime.fr/fiches-aides/fonds-solidarite-pour-logement",
  },
  D18: {
    label: "du département du Cher",
    link: "https://www.departement18.fr/Logement-habitat",
  },
  D19: {
    label: "du département de Corrèze",
    link: "https://www.correze.fr/nos-missions/habitat/les-aides-sociales-pour-le-logement",
    instructions:
      "https://www.correze.fr/services-en-ligne/les-aides/aide-aux-travailleurs-de-condition-modeste",
  },
  D21: {
    label: "du département de la Côte-d’Or",
    link: "https://www.cotedor.fr/votre-service/insertion/accompagnement-financier/accompagnement-et-aides-lacces-ou-au-maintien-dans",
  },
  D25: {
    label: "du département du Doubs",
    link: "https://www.doubs.fr/index.php/vous-accompagner/36-particuliers/2242-le-fonds-de-solidarite-logement-fsl",
    form: "http://www.adil25.org/fileadmin/user_upload/PDAHLPD/Grand_public/imprime_aide_financiere_individuelle_FSL_actualise.pdf",
    instructions:
      "http://www.adil25.org/le-pdalhpd/documentation/le-reglement-interieur-du-fsl-et-formulaire-de-demande-daide.html",
  },
  D26: {
    label: "du département de la Drôme",
    link: "https://www.ladrome.fr/mon-quotidien/logement/en-cas-de-difficultes/les-aides-aux-locataires/",
  },
  D29: {
    label: "du département du Finistère",
    link: "https://www.finistere.fr/A-votre-service/Habitat-Logement/Acces-et-maintien-dans-un-logement-FSL",
  },
  M242900314: {
    label: "de Brest Métropole",
    link: "https://infosociale.finistere.fr/etablissement/brest-metropole-fsl-fonds-de-solidarite-logement/",
    instructions:
      "https://infosociale.finistere.fr/etablissement/brest-metropole-fsl-fonds-de-solidarite-logement/",
  },
  D30: {
    label: "du département du Gard",
    link: "https://www.gard.fr/au-quotidien/bien-se-loger/locataires/fonds-solidarite-logement.html",
    instructions:
      "https://www.gard.fr/fileadmin/mediatheque/documents_2020/logement/doc_fond_solidarite_logement-2020.pdf",
  },
  D31: {
    label: "du département de la Haute-Garonne",
    link: "https://www.haute-garonne.fr/aide/fonds-de-solidarite-logement-fsl",
  },
  M243100518: {
    label: "de Toulouse Métropole",
    link: "https://www.toulouse-metropole.fr/missions/solidarite/fonds-de-solidarite-logement-fsl-",
  },
  D33: {
    label: "du département de la Gironde",
    link: "https://www.fsl33.org/aide-financiere-maintien-logement/",
    instructions: "http://www.fsl33.org/aide-financiere-maintien-logement/",
  },
  D34: {
    label: "du département de l’Hérault",
    link: "https://herault.fr/402-aide-financiere.htm",
  },
  D35: {
    label: "du département d’Ille-et-Vilaine",
    link: "https://www.ille-et-vilaine.fr/demande-fsl",
    form: "https://www.ille-et-vilaine.fr/sites/default/files/asset/document/fo-psh-0818-001_imprimeuniquemasques_form_ext_0.pdf",
  },
  D36: {
    label: "du département de l’Indre",
    link: "https://www.adil36.org/aides-locales/locataires-en-difficultes",
  },
  D37: {
    label: "du département de l’Indre-et-Loire",
    link: "https://www.touraine.fr/mes-services-au-quotidien/enfance-famille/laide-au-logement.html",
    form: "https://www.touraine.fr/files/touraine/documents/etre-accompagne/missions/617_impr_FSL_CD37_interactif_METRO_juillet_2021.pdf",
  },
  D38: {
    label: "du département d’Isère",
    link: "https://www.isere.fr/aides-au-logement",
    instructions: "https://www.isere.fr/aides-au-logement",
  },
  D40: {
    label: "du département des Landes",
    link: "https://www.landes.fr/logement",
  },
  D41: {
    label: "du département du Loir-et-Cher",
    link: "https://www.departement41.fr/services-en-ligne/etre-accompagne/insertion-habitat/aide-au-logement/",
  },
  D42: {
    label: "du département de la Loire",
    link: "https://www.loire.fr/jcms/lw_1024718/le-fonds-de-solidarite-pour-le-logement-fsl",
  },
  D44: {
    label: "du département de Loire Atlantique",
    link: "https://www.loire-atlantique.fr/jcms/classement-des-contenus/guides-aides/vous-etes/parent-/-famille/fonds-de-solidarite-pour-le-logement-fsl-les-aides-a-l-acces-ou-au-maintien-dans-votre-logement-fr-t1_16291",
    instructions:
      "https://www.loire-atlantique.fr/44/habitat-logement/fonds-de-solidarite-pour-le-logement-fsl-aide-a-l-acces-au-logement/c_1303821#idTitre5",
  },
  M244500468: {
    label: "de Orléans Métropole",
    link: "http://www.orleans-metropole.fr/1679/fonds-unifie-logement-ful.htm",
    form: "http://www.orleans-metropole.fr/fileadmin/orleans/MEDIA/document/urbanisme/habitat/FUL_-formulaires_de_demande.pdf",
  },
  D49: {
    label: "du département du Maine-et-Loire",
    link: "https://www.maine-et-loire.fr/aides-et-services/logement-et-habitat/fonds-solidarite-logement/aides-pour-le-maintien-dans-le-logement",
  },
  D50: {
    label: "du département de la Manche",
    link: "https://www.manche.fr/conseil-departemental/FSL.aspx",
    form: "https://www.manche.fr/conseil-departemental/iso_album/dossier_de_demande_logement.pdf",
  },
  D51: {
    label: "du département de la Marne",
    link: "http://www.marne.fr/les-actions/sante-et-social/logement-social/acces-et-maintien-dans-le-logement-le-fonds-solidarite",
  },
  D53: {
    label: "du département de la Mayenne",
    link: "https://www.lamayenne.fr/service/le-fonds-solidarite-pour-le-logement",
  },
  D56: {
    label: "du département du Morbihan",
    link: "https://www.morbihan.fr/les-services/logement-habitat/fonds-de-solidarite-logement-fsl/",
    form: "https://www.morbihan.fr/fileadmin/Les_services/Aides_departementales/22_morbihan_5_H08_FSL_maintien_logement.pdf",
    instructions:
      "https://www.morbihan.fr/les-services/logement-habitat/fonds-de-solidarite-logement-fsl",
  },
  D57: {
    label: "du département de la Moselle",
    link: "https://www.moselle.fr/jcms/pl_12538/fr/fonds-solidarite-logement-fsl",
    form: "https://www.moselle.fr/upload/docs/application/pdf/2018-11/demande_dintervention_du_fsl_-_acces_impayes_locatifs.pdf",
  },
  D59: {
    label: "du département du Nord",
    link: "https://services.lenord.fr/fonds-de-solidarite-pour-le-logement-fsl--aide-financiere-a-linstallation",
    instructions:
      "https://services.lenord.fr/fonds-de-solidarite-pour-le-logement-fsl--aide-financiere-a-linstallation",
  },
  M200093201: {
    label: "de la Métropole européenne de Lille",
    link: "https://www.lillemetropole.fr/votre-metropole/competences/amenagement-du-territoire/logement/le-fonds-de-solidarite-logement",
    form: "https://www.lillemetropole.fr/sites/default/files/2019-12/Volet%20demandeur%20maintien.pdf",
  },
  D60: {
    label: "du département de l’Oise",
    link: "https://www.oise.fr/information/guide-des-aides-departementales/fonds-departemental-de-solidarite-3145",
  },
  D62: {
    label: "du département du Pas-de-Calais",
    link: "https://www.pasdecalais.fr/Solidarite-Sante/Reglement-Departemental-d-Aide-Sociale/Le-developpement-des-solidarites/Le-logement-des-personnes-defavorisees-et-le-Fonds-de-Solidarite-Logement/L-aide-financiere-Fonds-Solidarite-Logement-volet-acces-logement-identifie",
  },
  D63: {
    label: "du département du Puy-de-Dôme",
    link: "https://www.puy-de-dome.fr/social/logement-habitat/fonds-solidarite-logement.html",
    instructions:
      "https://www.puy-de-dome.fr/fileadmin/user_upload/CD63-2020-RI-FSL.pdf",
  },
  D64: {
    label: "du département des Pyrénées-Atlantiques",
    link: "https://le64.fr/vous-aider-acceder-un-logement-ou-vous-y-maintenir",
  },
  D67: {
    label: "du département du Bas-Rhin",
    link: "https://www.bas-rhin.fr/action-sociale-et-sante/difficultes-logement/",
  },
  D68: {
    label: "du département du Haut-Rhin",
    link: "https://www.haut-rhin.fr/content/des-aides-pour-votre-logement",
  },
  D69: {
    label: "du département du Rhône",
    link: "https://www.rhone.fr/solidarites/logement/aides_au_logement/le_fonds_de_solidarite_logement",

    excludedEPCI: "200046977",
  },
  M200046977: {
    label: "de la Métropole de Lyon",
    link: "https://www.grandlyon.com/services/aides-fonds-solidarite-logement.html",
    instructions:
      "https://www.grandlyon.com/services/aides-fonds-solidarite-logement.html",
  },
  D71: {
    label: "du département de la Saône-et-Loire",
    link: "https://www.saoneetloire71.fr/que-peut-on-faire-pour-vous/vous-etes-proprietaire-locataire/rester-dans-mon-logement#:~:text=b%C3%A9n%C3%A9ficier%20peut%2D%C3%AAtre%20d'une,)%20%3A%20habitat71%40cg71.fr",
    form: "https://www.saoneetloire71.fr/fileadmin/Que_peut-on_faire_pour_vous__/Vous_etes_proprietaire_locataire/Aides_logement/7733_DOSSIER_UNIQUE.pdf",
  },
  D72: {
    label: "du département de la Sarthe",
    link: "https://www.sarthe.fr/insertion-logement/logement-habitat/fonds-de-solidarite-logement",
  },
  D74: {
    label: "du département de la Haute-Savoie",
    link: "https://www.hautesavoie.fr/informations-services/logement",
  },
  D75: {
    label: "du département de Paris",
    link: "https://www.paris.fr/pages/aides-au-logement-3827#le-fonds-de-solidarite-pour-le-logement-de-paris",
  },
  D76: {
    label: "du département de Seine-Maritime",
    link: "https://www.seinemaritime.fr/vos-services/habitat-logement/le-plan-departemental-daction-pour-le-logement-des-personnes-defavorisees/fonds-solidarite-logement.html",
  },
  D77: {
    label: "du département de Seine-et-Marne",
    link: "https://www.seine-et-marne.fr/fr/aides-au-logement",
  },
  D78: {
    label: "du département des Yvelines",
    link: "https://www.yvelines.fr/solidarite/adultes-en-difficulte/logement/acces-et-maintien-logement/",
  },
  D80: {
    label: "du département de la Somme",
    link: "https://www.somme.fr/services/rsa-insertion/les-aides-a-linsertion/le-fonds-de-solidarite-logement/",
  },
  D83: {
    label: "du département du Var",
    link: "https://www.var.fr/social/insertion/fonds-de-solidarite-logement",
    form: "https://www.var.fr/documents/20142/2028094/MAINTIEN+A4.pdf/7623c7eb-daa0-cf0e-aabf-cd701c8c6d1d",
  },
  D84: {
    label: "du département du Vaucluse",
    link: "http://www.vaucluse.fr/habitat-logement/les-aides-aux-particuliers/le-fonds-de-solidarite-pour-le-logement-1531.html",
  },
  D85: {
    label: "du département de la Vendée",
    link: "http://www.vendee.fr/Territoire-et-environnement/Habitat-Logement/42264-Habitat-Logement/L-accompagnement-des-menages-en-difficultes",
  },
  D86: {
    label: "du département de la Vienne",
    link: "http://www.fsl86.fr/",
    form: "http://www.fsl86.fr/images/pdf/declaration_de_ressources.pdf",
  },
  D91: {
    label: "du département de l’Essonne",
    link: "http://www.essonne.fr/le-departement/les-organismes-associes/le-fonds-de-solidarite-pour-le-logement-fsl/",
  },
  D92: {
    label: "du département des Hauts-de-Seine",
    link: "https://www.78-92.fr/annuaire/aides-et-services/detail/le-fonds-de-solidarite-logement-fsl-92",
  },
  D93: {
    label: "du département de Seine-Saint-Denis",
    link: "https://seinesaintdenis.fr/solidarite/action-sociale/article/fonds-de-solidarite-logement",
    instructions:
      "https://seinesaintdenis.fr/solidarite/action-sociale/article/fonds-de-solidarite-logement#Comment-en-formuler-la-demande",
  },
  D94: {
    label: "du département du Val-de-Marne",
    link: "https://www.valdemarne.fr/a-votre-service/habitat/logement/aides-aux-impayes-locatifs-fsh",
  },
  D95: {
    label: "du département du Val d’Oise",
    link: "https://www.valdoise.fr/aide-et-service/11/6-fonds-de-solidarite-logement-aide-a-l-acces-au-logement.htm",
  },
  D974: {
    label: "du département de la Réunion",
    link: "https://www.departement974.fr/aide/aide-habitat-fonds-de-solidarite-pour-logement-fsl#aidesimpayes",
  },
}

function getDepartmentInstitutionByInseeCode(institutionsMap, inseeCode) {
  return Object.keys(institutionsMap)
    .filter(
      (institutionName) =>
        institutionsMap[institutionName].type === "departement"
    )
    .find((institutionName) => {
      const institution = institutionsMap[institutionName]
      return institution.code_insee === inseeCode
    })
}

function getMetropoleInstitutionBySirenCode(institutionsMap, sirenCode) {
  return Object.keys(institutionsMap).find((institutionName) => {
    const institution = institutionsMap[institutionName]
    return institution.code_siren === sirenCode
  })
}

function formatBenefit(customizationBenefit, institution) {
  return {
    id: `${institution.replace(/_/g, "-")}-fsl-eligibilite`,
    ...DEFAULT_FSL,
    description: `Dans le cadre du Fonds de Solidarité Logement ${customizationBenefit.label}, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).`,
    conditions: [
      `Occuper, à titre de résidence principale, un logement sur le territoire ${customizationBenefit.label}.`,
      "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
    ],
    ...customizationBenefit,
    label: `Aide au maintien dans votre logement ${customizationBenefit.label}`,
    institution,
    source: "javascript",
    conditions_generales: [
      {
        type: "attached_to_institution",
      },
      ...(customizationBenefit.excludedEPCI
        ? [
            {
              type: "invert",
              value: {
                type: "epcis",
                values: [customizationBenefit.excludedEPCI],
              },
            },
          ]
        : []),
      {
        type: "statut_occupation_logement",
        excludes: [
          StatutOccupationLogement.loge_gratuitement,
          StatutOccupationLogement.sans_domicile,
        ],
      },
    ],
  }
}

export function getInstitutionName(institutionsMap, code) {
  // D = département ; M = métropole
  const geographicalEntity = code[0]
  // code Insee pour le département ou code Siren pour la métropole
  const geographicalCode = code.slice(1)
  let institutionName

  if (geographicalEntity === "D") {
    institutionName = getDepartmentInstitutionByInseeCode(
      institutionsMap,
      geographicalCode
    )
  } else {
    institutionName = getMetropoleInstitutionBySirenCode(
      institutionsMap,
      geographicalCode
    )
  }
  return institutionName
}

export function build(institutionsMap) {
  const result: any = Object.keys(FSL_BY_CODE).reduce(
    (accum: any, code: string) => {
      const customizationBenefit = FSL_BY_CODE[code]
      const institutionName = getInstitutionName(institutionsMap, code)

      if (!institutionName) {
        console.warn(`No institution for metropole fsl ${code}`)
        return accum
      }
      const benefit = formatBenefit(customizationBenefit, institutionName)

      accum.push(benefit)
      return accum
    },
    []
  )
  return result
}
