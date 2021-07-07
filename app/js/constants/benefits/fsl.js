function build({ codeImg, label, resources }) {
  return {
    label: `Aide au maintien dans votre logement ${label}`,
    provider: {
      imgSrc: `logo_${codeImg}.png`,
    },
    conditions: [
      `Occuper, à titre de résidence principale, un logement sur le territoire du département ${label}.`,
      "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
    ],
    ...resources,
    description: `Dans le cadre du Fonds de Solidarité Logement ${label}, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).`,
  }
}

module.exports = {
  label: "Aide au maintien dans votre logement",
  description:
    "Dans le cadre du Fonds de Solidarité Logement, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
  entity: "menages",
  type: "bool",
  prefix: "une",
  symbol: "fa-exclamation-triangle",
  top: 6,
  link: "https://www.service-public.fr/particuliers/vosdroits/F1334",
  customization: Object.entries({
    D01: {
      codeImg: "01",
      label: "du département de l’Ain",
      resources: {
        link: "https://www.ain.fr/solutions/fond-solidarite-logement-maintien-dans-le-logement/",
      },
    },
    D02: {
      codeImg: "02",
      label: "du département de l’Aisne",
      resources: {
        link: "https://aisne.com/aides/aide-a-lacces-au-logement-fonds-de-solidarite-pour-le-logement-fsl",
      },
    },
    D03: {
      codeImg: "03",
      label: "du département de l’Allier",
      resources: {
        link: "http://www.caf.fr/allocataires/caf-de-l-allier/offre-de-service/logement-et-cadre-de-vie/le-fonds-de-solidarite-pour-le-logement-fsl",
        instructions:
          "http://modules.allier.fr/guide3/contenu.asp?iddossier=11612",
      },
    },
    D04: {
      codeImg: "04",
      label: "du département des Alpes-de-Haute-Provence",
      resources: {
        link: "http://www.mondepartement04.fr/rechercher-plus-daides/habitat-logement-urbanisme/fsl-masp/fonds-social-daide-au-logement-fsl.html",
        form: "http://www.mondepartement04.fr/fileadmin/mediatheque/cg04/formulaire/Insertion/Acc%C3%A8s_au_logement/IMPRIME_FSL_12-2019.pdf",
        instructions:
          "http://www.mondepartement04.fr/rechercher-plus-daides/habitat-logement-urbanisme/fsl-masp/mesure-daccompagnement-social-personnalise.html#c6266",
      },
    },
    D05: {
      codeImg: "05",
      label: "du département des Hautes Alpes",
      resources: {
        link: "https://www.hautes-alpes.fr/4996-fonds-de-solidarite-pour-le-logement-fsl-.htm",
        instructions:
          "https://www.hautes-alpes.fr/4996-fonds-de-solidarite-pour-le-logement-fsl-.htm",
      },
    },
    D06: {
      codeImg: "06",
      label: "du département des Alpes Maritimes",
      resources: {
        link: "https://www.departement06.fr/aides-a-l-insertion/fsl-2607.html",
      },
    },
    M200030195: {
      codeImg: "nice_metropole",
      label: "de la Métropole Nice Côte d’Azur",
      resources: {
        link: "http://www.nicecotedazur.org/habitat-urbanisme/le-logement/fonds-de-solidarit%C3%A9-pour-le-logement",
        form: "http://www.nicecotedazur.org/uploads/media_items/locataire.original.pdf",
      },
    },
    D07: {
      codeImg: "07",
      label: "du département de l’Ardèche",
      resources: {
        link: "http://www.ardeche.fr/132-fonds-unique-logement.htm",
        form: "http://www.ardeche.fr/include/viewfilesecure.php?idtf=3609&path=cb%2F3609_762_formulaires-ful-2015BD.pdf",
      },
    },
    D08: {
      codeImg: "08",
      label: "du département de l’Ardennes",
      resources: {
        link: "https://cd08.fr/aides-et-subventionss/fonds-de-solidarite-logement-fsl-formulaire-unique-de-demande-de-subvention",
        form: "https://cd08.fr/sites/default/files/maj2020_compilation_formulaires_fsl.pdf",
      },
    },
    D09: {
      codeImg: "09",
      label: "du département de l’Ariège",
      resources: {
        link: "http://www.ariege.fr/Etre-solidaire/Logement/Le-Fonds-unique-Habitat-FUH",
        instructions:
          "http://www.ariege.fr/Etre-solidaire/Logement/Rencontrer-un-travailleur-social",
      },
    },
    D11: {
      codeImg: "11",
      label: "du département de l’Aude",
      resources: {
        link: "https://www.aude.fr/je-beneficie-du-fonds-unique-logement-ful",
      },
    },
    D12: {
      codeImg: "12",
      label: "du département de l’Aveyron",
      resources: {
        link: "https://aveyron.fr/pages/logement/des%20aides%20pour%20acc%C3%A9der%20%C3%A0%20un%20logement%20ou%20sy%20maintenir",
      },
    },
    D13: {
      codeImg: "13",
      label: "du département Des Bouches-du-Rhône",
      resources: {
        link: "https://www.departement13.fr/nos-actions/logement/les-dispositifs/le-fonds-de-solidarite-pour-le-logement/",
      },
    },
    D14: {
      codeImg: "14",
      label: "du département du Calvados",
      resources: {
        link: "https://www.calvados.fr/accueil/le-departement/solidarite---familles/aide-au-logement/fsl.html",
        instructions:
          "https://www.calvados.fr/contents/fiche/fiches-aide--services/aides-financieres-pour-le-mainti.html",
      },
    },
    D15: {
      codeImg: "15",
      label: "du département du Cantal",
      resources: {
        link: "http://www.cantal.fr/fonds-de-solidarite-pour-le-logement/",
      },
    },
    D16: {
      codeImg: "16",
      label: "du département de Charente",
      resources: {
        link: "https://www.charentesolidarites.org/index.php/component/sppagebuilder/8-le-fsl.html",
        instructions:
          "https://www.charentesolidarites.org/index.php/component/sppagebuilder/8-le-fsl.html",
      },
    },
    D17: {
      codeImg: "17",
      label: "du département de Charente-Maritime",
      resources: {
        link: "https://la.charente-maritime.fr/fiches-aides/fonds-solidarite-pour-logement",
      },
    },
    D18: {
      codeImg: "18",
      label: "du département du Cher",
      resources: {
        link: "https://www.departement18.fr/Logement-habitat",
      },
    },
    D19: {
      codeImg: "19",
      label: "du département de Corrèze",
      resources: {
        link: "https://www.correze.fr/nos-missions/habitat/les-aides-sociales-pour-le-logement",
        instructions:
          "https://www.correze.fr/services-en-ligne/les-aides/aide-aux-travailleurs-de-condition-modeste",
      },
    },
    D21: {
      codeImg: "21",
      label: "du département de la Côte-d’Or",
      resources: {
        link: "https://www.cotedor.fr/votre-service/insertion/accompagnement-financier/accompagnement-et-aides-lacces-ou-au-maintien-dans",
      },
    },
    D25: {
      codeImg: "25",
      label: "du département du Doubs",
      resources: {
        link: "https://www.doubs.fr/index.php/vous-accompagner/36-particuliers/2242-le-fonds-de-solidarite-logement-fsl",
        form: "http://www.adil25.org/fileadmin/user_upload/PDAHLPD/Grand_public/imprime_aide_financiere_individuelle_FSL_actualise.pdf",
        instructions:
          "http://www.adil25.org/le-pdalhpd/documentation/le-reglement-interieur-du-fsl-et-formulaire-de-demande-daide.html",
      },
    },
    D26: {
      codeImg: "26",
      label: "du département de la Drôme",
      resources: {
        link: "https://www.ladrome.fr/mon-quotidien/logement/en-cas-de-difficultes/les-aides-aux-locataires/",
      },
    },
    D29: {
      codeImg: "29",
      label: "du département du Finistère",
      resources: {
        link: "https://www.finistere.fr/A-votre-service/Habitat-Logement/Acces-et-maintien-dans-un-logement-FSL",
      },
    },
    M242900314: {
      codeImg: "brest_metropole",
      label: "de Brest Métropole",
      resources: {
        link: "https://infosociale.finistere.fr/etablissement/brest-metropole-fsl-fonds-de-solidarite-logement/",
        form: "https://infosociale.finistere.fr/wp-content/uploads/2018/06/CD29_imprime_unique_jlt2019.pdf",
        instructions:
          "https://infosociale.finistere.fr/wp-content/uploads/2019/07/pb_R%C3%A8glement-FSL-m%C3%A9tropolitain-2019.pdf",
      },
    },
    D30: {
      codeImg: "30",
      label: "du département du Gard",
      resources: {
        link: "https://www.gard.fr/au-quotidien/bien-se-loger/locataires/fonds-solidarite-logement.html",
        instructions:
          "https://www.gard.fr/fileadmin/mediatheque/documents_2020/logement/doc_fond_solidarite_logement-2020.pdf",
      },
    },
    D31: {
      codeImg: "31",
      label: "du département de la Haute-Garonne",
      resources: {
        link: "https://www.haute-garonne.fr/aide/fonds-de-solidarite-logement-fsl",
      },
    },
    M243100518: {
      codeImg: "toulouse_metropole",
      label: "de Toulouse Métropole",
      resources: {
        link: "https://www.toulouse-metropole.fr/missions/solidarite/fonds-de-solidarite-logement-fsl-",
      },
    },
    D33: {
      codeImg: "33",
      label: "du département de la Gironde",
      resources: {
        link: "http://www.fsl33.org/html/aide_maitien.htm",
        instructions: "http://www.fsl33.org/pdf/FormNoticeMaintien2016.pdf",
      },
    },
    D34: {
      codeImg: "34",
      label: "du département de l’Hérault",
      resources: {
        link: "http://www.herault.fr/aides-financieres-fsl",
      },
    },
    D35: {
      codeImg: "35",
      label: "du département d’Ille-et-Vilaine",
      resources: {
        link: "https://www.ille-et-vilaine.fr/demande-fsl",
        form: "https://www.ille-et-vilaine.fr/sites/default/files/asset/document/fo-psh-0818-001_imprimeuniquemasques_form_ext_0.pdf",
      },
    },
    D36: {
      codeImg: "36",
      label: "du département de l’Indre",
      resources: {
        link: "https://www.adil36.org/aides-locales/locataires-en-difficultes",
      },
    },
    D37: {
      codeImg: "37",
      label: "du département de l’Indre-et-Loire",
      resources: {
        link: "https://www.touraine.fr/mes-services-au-quotidien/enfance-famille/lacces-au-logement.html",
        form: "https://www.touraine.fr/files/touraine/documents/etre-accompagne/missions/impr_FSL_interactif_departement.pdf",
      },
    },
    M243700754: {
      codeImg: "tours_metropole",
      label: "de Tours Métropole Val de Loire",
      resources: {
        link: "https://www.touraine.fr/mes-services-au-quotidien/enfance-famille/lacces-au-logement.html",
        form: "https://www.touraine.fr/files/touraine/documents/etre-accompagne/missions/impr_FSL_interactif_departement.pdf",
      },
    },
    D38: {
      codeImg: "38",
      label: "du département d’Isère",
      resources: {
        link: "https://www.isere.fr/aides-au-logement",
        form: "https://www.isere.fr/sites/default/files/demande-directe.pdf",
      },
    },
    D40: {
      codeImg: "40",
      label: "du département des Landes",
      resources: {
        link: "https://www.landes.fr/logement",
      },
    },
    D41: {
      codeImg: "41",
      label: "du département du Loir-et-Cher",
      resources: {
        link: "https://www.departement41.fr/services-en-ligne/etre-accompagne/insertion-habitat/aide-au-logement/",
      },
    },
    D42: {
      codeImg: "42",
      label: "du département de la Loire",
      resources: {
        link: "https://www.loire.fr/jcms/lw_1024718/le-fonds-de-solidarite-pour-le-logement-fsl",
      },
    },
    D44: {
      codeImg: "44",
      label: "du département de Loire Atlantique",
      resources: {
        link: "https://www.loire-atlantique.fr/jcms/classement-des-contenus/guides-aides/vous-etes/parent-/-famille/fonds-de-solidarite-pour-le-logement-fsl-les-aides-a-l-acces-ou-au-maintien-dans-votre-logement-fr-t1_16291",
        form: "https://www.loire-atlantique.fr/upload/docs/application/pdf/2020-03/formulaire_de_demande_daide_au_logement_2020-03-09_14-37-8_451.pdf",
      },
    },
    M244500468: {
      codeImg: "orleans_metropole",
      label: "de Orléans Métropole",
      resources: {
        link: "http://www.orleans-metropole.fr/1679/fonds-unifie-logement-ful.htm",
        form: "http://www.orleans-metropole.fr/fileadmin/orleans/MEDIA/document/urbanisme/habitat/FUL_-formulaires_de_demande.pdf",
      },
    },
    D49: {
      codeImg: "49",
      label: "du département du Maine-et-Loire",
      resources: {
        link: "https://www.maine-et-loire.fr/aides-et-services/logement-et-habitat/fonds-solidarite-logement/aides-pour-le-maintien-dans-le-logement",
      },
    },
    D50: {
      codeImg: "50",
      label: "du département de la Manche",
      resources: {
        link: "https://www.manche.fr/conseil-departemental/FSL.aspx",
        form: "https://www.manche.fr/conseil-departemental/iso_album/dossier_de_demande_logement.pdf",
      },
    },
    D51: {
      codeImg: "51",
      label: "du département de la Marne",
      resources: {
        link: "http://www.marne.fr/les-actions/sante-et-social/logement-social/acces-et-maintien-dans-le-logement-le-fonds-solidarite",
      },
    },
    D53: {
      codeImg: "53",
      label: "du département de la Mayenne",
      resources: {
        link: "https://www.lamayenne.fr/service/le-fonds-solidarite-pour-le-logement",
      },
    },
    D56: {
      codeImg: "56",
      label: "du département du Morbihan",
      resources: {
        link: "https://www.morbihan.fr/les-services/logement-habitat/fonds-de-solidarite-logement-fsl/",
        form: "https://www.morbihan.fr/fileadmin/Les_services/Aides_departementales/20_morbihan_5_H08_FSL_maintien_logement.pdf",
        instructions:
          "https://www.morbihan.fr/les-services/aides-departementales/toutes-nos-aides/toutes-nos-aides/?tx_cg56aidesdep_guidedesaides[selectMotsCles]=fsl&tx_cg56aidesdep_guidedesaides[action]=resultsNoCache&tx_cg56aidesdep_guidedesaides[controller]=Aide#hautDePage",
      },
    },
    D57: {
      codeImg: "57",
      label: "du département de la Moselle",
      resources: {
        link: "https://www.moselle.fr/jcms/pl_12538/fr/fonds-solidarite-logement-fsl",
        form: "https://www.moselle.fr/upload/docs/application/pdf/2018-11/demande_dintervention_du_fsl_-_acces_impayes_locatifs.pdf",
      },
    },
    D59: {
      codeImg: "59",
      label: "du département du Nord",
      resources: {
        link: "https://lenord.fr/jcms/preprd1_145072/le-fonds-de-solidarite-pour-le-logement",
        instructions:
          "https://lenord.fr/jcms/prd1_334245/aide-au-maintien-dans-le-logement?thematique=&typePublic=&motsCles=maintien",
      },
    },
    M245900410: {
      codeImg: "lille_metropole",
      label: "de la Métropole européenne de Lille",
      resources: {
        link: "https://www.lillemetropole.fr/votre-metropole/competences/amenagement-du-territoire/logement/le-fonds-de-solidarite-logement",
        form: "https://www.lillemetropole.fr/sites/default/files/2019-12/Volet%20demandeur%20maintien.pdf",
      },
    },
    D60: {
      codeImg: "60",
      label: "du département de l’Oise",
      resources: {
        link: "http://www.oise.fr/guide-des-aides/aide/fonds-departemental-de-solidarite/",
      },
    },
    D62: {
      codeImg: "62",
      label: "du département du Pas-de-Calais",
      resources: {
        link: "https://www.pasdecalais.fr/Solidarite-Sante/Reglement-Departemental-d-Aide-Sociale/Le-developpement-des-solidarites/Le-logement-des-personnes-defavorisees-et-le-Fonds-de-Solidarite-Logement/L-aide-financiere-Fonds-Solidarite-Logement-volet-acces-logement-identifie",
      },
    },
    D63: {
      codeImg: "63",
      label: "du département du Puy-de-Dôme",
      resources: {
        link: "https://www.puy-de-dome.fr/social/logement-habitat/fonds-solidarite-logement.html",
        instructions:
          "https://www.puy-de-dome.fr/fileadmin/user_upload/CD63-2020-RI-FSL.pdf",
      },
    },
    D64: {
      codeImg: "64",
      label: "du département des Pyrénées-Atlantiques",
      resources: {
        link: "https://le64.fr/vous-aider-acceder-un-logement-ou-vous-y-maintenir",
      },
    },
    D67: {
      codeImg: "67",
      label: "du département du Bas-Rhin",
      resources: {
        link: "https://www.bas-rhin.fr/action-sociale-et-sante/difficultes-logement/",
      },
    },
    D68: {
      codeImg: "68",
      label: "du département du Haut-Rhin",
      resources: {
        link: "https://www.haut-rhin.fr/content/des-aides-pour-votre-logement",
      },
    },
    D69: {
      codeImg: "69",
      label: "du département du Rhône",
      resources: {
        link: "https://www.rhone.fr/solidarites/insertion/logement/le_fonds_de_solidarite_logement",
      },
    },
    M200046977: {
      codeImg: "lyon_metropole",
      label: "de la Métropole de Lyon",
      resources: {
        link: "https://www.grandlyon.com/services/aides-fonds-solidarite-logement.html",
        instructions:
          "https://www.grandlyon.com/services/aides-fonds-solidarite-logement.html",
      },
    },
    D71: {
      codeImg: "71",
      label: "du département de la Saône-et-Loire",
      resources: {
        link: "https://www.saoneetloire71.fr/accueil/vous-etes-proprietaire/locataire/rester-dans-mon-logement",
        form: "https://www.saoneetloire71.fr/fileadmin/Que_peut-on_faire_pour_vous__/Vous_etes_proprietaire_locataire/Aides_logement/7733_DOSSIER_UNIQUE.pdf",
      },
    },
    D72: {
      codeImg: "72",
      label: "du département de la Sarthe",
      resources: {
        link: "https://www.sarthe.fr/insertion-logement/logement-habitat/fonds-de-solidarite-logement",
      },
    },
    D74: {
      codeImg: "74",
      label: "du département de la Haute-Savoie",
      resources: {
        link: "https://www.hautesavoie.fr/informations-services/logement",
      },
    },
    D75: {
      codeImg: "75",
      label: "du département de Paris",
      resources: {
        link: "https://www.paris.fr/pages/aides-au-logement-3827#le-fonds-de-solidarite-pour-le-logement-de-paris",
      },
    },
    D76: {
      codeImg: "76",
      label: "du département de Seine-Maritime",
      resources: {
        link: "https://www.seinemaritime.fr/vos-services/habitat-logement/le-plan-departemental-daction-pour-le-logement-des-personnes-defavorisees/fonds-solidarite-logement.html",
      },
    },
    D77: {
      codeImg: "77",
      label: "du département de Seine-et-Marne",
      resources: {
        link: "https://www.seine-et-marne.fr/Solidarite/Logement/Aides-au-logement",
      },
    },
    D78: {
      codeImg: "78",
      label: "du département des Yvelines",
      resources: {
        link: "https://www.yvelines.fr/solidarite/adultes-en-difficulte/logement/acces-et-maintien-logement/",
      },
    },
    D80: {
      codeImg: "80",
      label: "du département de la Somme",
      resources: {
        link: "https://www.somme.fr/services/rsa-insertion/les-aides-a-linsertion/le-fonds-de-solidarite-logement/",
      },
    },
    D83: {
      codeImg: "83",
      label: "du département du Var",
      resources: {
        link: "https://www.var.fr/social/insertion/fonds-de-solidarite-logement",
        form: "https://www.var.fr/documents/20142/2028094/MAINTIEN+A4.pdf/7623c7eb-daa0-cf0e-aabf-cd701c8c6d1d",
      },
    },
    D84: {
      codeImg: "84",
      label: "du département du Vaucluse",
      resources: {
        link: "http://www.vaucluse.fr/habitat-logement/les-aides-aux-particuliers/le-fonds-de-solidarite-pour-le-logement-1531.html",
      },
    },
    D85: {
      codeImg: "85",
      label: "du département de la Vendée",
      resources: {
        link: "http://www.vendee.fr/Territoire-et-environnement/Habitat-Logement/42264-Habitat-Logement/L-accompagnement-des-menages-en-difficultes",
      },
    },
    D86: {
      codeImg: "86",
      label: "du département de la Vienne",
      resources: {
        link: "http://www.fsl86.fr/",
        form: "http://www.fsl86.fr/images/pdf/declaration_de_ressources.pdf",
      },
    },
    D91: {
      codeImg: "91",
      label: "du département de l’Essonne",
      resources: {
        link: "http://www.essonne.fr/le-departement/les-organismes-associes/le-fonds-de-solidarite-pour-le-logement-fsl/",
      },
    },
    D92: {
      codeImg: "92",
      label: "du département des Hauts-de-Seine",
      resources: {
        link: "https://www.78-92.fr/annuaire/aides-et-services/detail/fonds-de-solidarite-logement-fsl",
      },
    },
    D93: {
      codeImg: "93",
      label: "du département de Seine-Saint-Denis",
      resources: {
        link: "https://seinesaintdenis.fr/Fonds-de-solidarite-logement.html",
        instructions:
          "https://seinesaintdenis.fr/Fonds-de-solidarite-logement.html#comment_en_formuler_la_demande",
      },
    },
    D94: {
      codeImg: "94",
      label: "du département du Val-de-Marne",
      resources: {
        link: "https://www.valdemarne.fr/a-votre-service/habitat/logement/aides-aux-impayes-locatifs-fsh",
      },
    },
    D95: {
      codeImg: "95",
      label: "du département du Val d’Oise",
      resources: {
        link: "https://www.valdoise.fr/aide-et-service/11/6-fonds-de-solidarite-logement-aide-a-l-acces-au-logement.htm",
      },
    },
    D974: {
      codeImg: "974",
      label: "du département de la Réunion",
      resources: {
        link: "https://www.departement974.fr/aide/aide-habitat-fonds-de-solidarite-pour-logement-fsl#aidesimpayes",
      },
    },
  }).reduce((accum, [key, value]) => {
    accum[key] = build(value)
    return accum
  }, {}),
}
