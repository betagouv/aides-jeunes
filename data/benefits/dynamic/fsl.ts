import { StatutOccupationLogement } from "../../../lib/enums/logement.js"

const DEFAULT_FSL = {
  type: "bool",
  prefix: "une",
  top: 6,
  periodicite: "ponctuelle",
}

export const FSL_BY_INSTITUTION_SLUG = {
  departement_ain: {
    label: "du département de l’Ain",
    link: "https://www.ain.fr/solutions/fond-solidarite-logement-maintien-dans-le-logement/",
  },
  departement_aisne: {
    label: "du département de l’Aisne",
    link: "https://aisne.com/aides/aide-a-lacces-au-logement-fonds-de-solidarite-pour-le-logement-fsl",
  },
  departement_alpes_de_haute_provence: {
    label: "du département des Alpes-de-Haute-Provence",
    link: "https://www.mondepartement04.fr/insertion/le-fonds-de-solidarite-pour-le-logement",
    form: "https://www.mondepartement04.fr/fileadmin/mediatheque/cg04/document/03-services-habitants/FSL/FSL_FORMULAIRE_01-2022.pdf",
  },
  departement_hautes_alpes: {
    label: "du département des Hautes Alpes",
    link: "https://www.hautes-alpes.fr/4996-fonds-de-solidarite-pour-le-logement-fsl-.htm",
    instructions:
      "https://www.hautes-alpes.fr/4996-fonds-de-solidarite-pour-le-logement-fsl-.htm",
  },
  departement_alpes_maritimes: {
    label: "du département des Alpes Maritimes",
    link: "https://www.departement06.fr/fonds-de-solidarite-pour-le-logement-fsl",
    excludedEPCI: "200030195",
  },
  intercommunalite_nice_cote_d_azur: {
    label: "de la Métropole Nice Côte d’Azur",
    link: "https://www.nicecotedazur.org/habitat-urbanisme/le-logement/fonds-de-solidarit%C3%A9-pour-le-logement",
    form: "https://www.nicecotedazur.org/wp-content/uploads/2020/12/Dossier_de_demande_aide_au_maintien_des_locataires.pdf",
  },
  departement_ardeche: {
    label: "du département de l’Ardèche",
    link: "http://www.ardeche.fr/132-fonds-unique-logement.htm",
    form: "http://www.ardeche.fr/include/viewfilesecure.php?idtf=3609&path=cb%2F3609_762_formulaires-ful-2015BD.pdf",
  },
  departement_ardennes: {
    label: "du département de l’Ardennes",
    link: "https://www.cd08.fr/aides-et-subventions/fonds-de-solidarite-logement-fsl-pour-les-particuliers",
  },
  departement_ariege: {
    label: "du département de l’Ariège",
    link: "https://ariege.fr/nos-actions/solidarites/logement/les-aides-financieres-relatives-au-logement/",
  },
  departement_aude: {
    label: "du département de l’Aude",
    link: "https://www.aude.fr/je-beneficie-du-fonds-unique-logement-ful",
  },
  departement_aveyron: {
    label: "du département de l’Aveyron",
    link: "https://aveyron.fr/pages/logement/des-aides-pour-acceder-a-un-logement-ou-s-y-maintenir",
  },
  departement_bouches_du_rhone: {
    label: "du département Des Bouches-du-Rhône",
    link: "https://www.departement13.fr/nos-actions/logement/les-dispositifs/le-fonds-de-solidarite-pour-le-logement/",
  },
  departement_calvados: {
    label: "du département du Calvados",
    link: "https://www.calvados.fr/accueil/le-departement/solidarite---familles/aide-au-logement/fsl.html",
    instructions:
      "https://www.calvados.fr/contents/fiche/fiches-aide--services/maintien-dans-votre-logement--la.html",
  },
  departement_cantal: {
    label: "du département du Cantal",
    link: "http://www.cantal.fr/fonds-de-solidarite-pour-le-logement/",
  },
  departement_de_la_charente: {
    label: "du département de Charente",
    link: "https://www.charentesolidarites.org/index.php/component/sppagebuilder/8-le-fsl.html",
    instructions:
      "https://www.charentesolidarites.org/index.php/component/sppagebuilder/8-le-fsl.html",
  },
  departement_charente_maritime: {
    label: "du département de Charente-Maritime",
    link: "https://la.charente-maritime.fr/fiches-aides/fonds-solidarite-pour-logement",
  },
  departement_cher: {
    label: "du département du Cher",
    link: "https://www.departement18.fr/Logement-habitat",
  },
  departement_correze: {
    label: "du département de Corrèze",
    link: "https://www.correze.fr/nos-missions/habitat/les-aides-sociales-pour-le-logement",
    instructions:
      "https://www.correze.fr/services-en-ligne/les-aides/aide-aux-travailleurs-de-condition-modeste",
  },
  departement_cote_or: {
    label: "du département de la Côte-d’Or",
    link: "https://www.cotedor.fr/votre-service/insertion/accompagnement-financier/accompagnement-et-aides-lacces-ou-au-maintien-dans",
  },
  departement_doubs: {
    label: "du département du Doubs",
    link: "https://www.doubs.fr/a-votre-service/habitat-logement/",
    instructions: "https://www.doubs.fr/a-votre-service/habitat-logement/",
  },
  departement_drome: {
    label: "du département de la Drôme",
    link: "https://www.ladrome.fr/mon-quotidien/logement/en-cas-de-difficultes/les-aides-aux-locataires/",
  },
  departement_finistere: {
    label: "du département du Finistère",
    link: "https://www.finistere.fr/aides-et-services/habitat-logement/finistere-solidarite-logement-fsl/",
    excludedEPCI: "242900314",
  },
  intercommunalite_brest_metropole: {
    label: "de Brest Métropole",
    link: "https://brest.fr/gerer-mon-quotidien/logement/demander-le-fonds-de-solidarite-logement-fsl",
  },
  departement_gard: {
    label: "du département du Gard",
    link: "https://www.gard.fr/le-gard-pour-vous/des-difficultes-a-faire-face-a-son-loyer/",
    instructions:
      "https://www.gard.fr/le-gard-pour-vous/des-difficultes-a-faire-face-a-son-loyer/",
  },
  departement_haute_garonne: {
    label: "du département de la Haute-Garonne",
    link: "https://www.haute-garonne.fr/aide/fonds-de-solidarite-logement-fsl",
    excludedEPCI: "243100518",
  },
  toulouse_metropole: {
    label: "de Toulouse Métropole",
    link: "https://metropole.toulouse.fr/mon-environnement/logement-et-urbanisme/se-loger/louer-un-logement#obtenir-une-aide-au-logement",
  },
  departement_gironde: {
    label: "du département de la Gironde",
    link: "https://www.fsl33.org/aide-financiere-maintien-logement/",
    instructions: "http://www.fsl33.org/aide-financiere-maintien-logement/",
  },
  departement_herault: {
    label: "du département de l’Hérault",
    link: "https://herault.fr/402-aide-financiere.htm",
  },
  departement_ille_et_vilaine: {
    label: "du département d’Ille-et-Vilaine",
    link: "https://www.ille-et-vilaine.fr/demande-fsl",
    form: "https://www.ille-et-vilaine.fr/sites/iev/files/2023-12/BAT-FA-INS21-1223_Formulaire-FSLmaintien-Janvier2024.pdf",
  },
  departement_indre: {
    label: "du département de l’Indre",
    link: "https://www.adil36.org/aides-locales/locataires-en-difficultes",
  },
  departement_indre_et_loire: {
    label: "du département de l’Indre-et-Loire",
    link: "https://www.touraine.fr/mes-services-au-quotidien/enfance-famille/laide-au-logement.html",
    form: "https://www.touraine.fr/files/touraine/documents/etre-accompagne/missions/617_impr_FSL_CD37_interactif_METRO_juillet_2021.pdf",
  },
  departement_isere: {
    label: "du département d’Isère",
    link: "https://www.isere.fr/action-sociale-insertion-logement/fonds-solidarite-pour-le-logement-fsl",
    instructions:
      "https://www.isere.fr/action-sociale-insertion-logement/fonds-solidarite-pour-le-logement-fsl",
  },
  departement_landes: {
    label: "du département des Landes",
    link: "https://www.landes.fr/logement",
  },
  departement_loir_et_cher: {
    label: "du département du Loir-et-Cher",
    link: "https://www.departement41.fr/services-en-ligne/etre-accompagne/insertion-habitat/aide-au-logement/",
  },
  departement_loire: {
    label: "du département de la Loire",
    link: "https://www.loire.fr/jcms/lw_1024718/le-fonds-de-solidarite-pour-le-logement-fsl",
  },
  departement_loire_atlantique: {
    label: "du département de Loire Atlantique",
    link: "https://www.loire-atlantique.fr/44/habitat-logement/fonds-de-solidarite-pour-le-logement-fsl-aide-a-l-acces-au-logement/c_1303821",
    instructions:
      "https://www.loire-atlantique.fr/44/habitat-logement/fonds-de-solidarite-pour-le-logement-fsl-aide-a-l-acces-au-logement/c_1303821#idTitre5",
  },
  intercommunalite_orleans_metropole: {
    label: "de Orléans Métropole",
    link: "https://www.orleans-metropole.fr/urbanisme-habitat/fonds-unifie-logement-ful",
    instructions:
      "https://www.orleans-metropole.fr/urbanisme-habitat/fonds-unifie-logement-ful",
  },
  departement_maine_et_loire: {
    label: "du département du Maine-et-Loire",
    link: "https://www.maine-et-loire.fr/aides-et-services/logement-et-habitat/fonds-solidarite-logement/aides-pour-le-maintien-dans-le-logement",
  },
  departement_manche: {
    label: "du département de la Manche",
    link: "https://www.manche.fr/conseil-departemental/FSL.aspx",
    form: "https://www.manche.fr/conseil-departemental/iso_album/dossier_de_demande_logement.pdf",
  },
  departement_marne: {
    label: "du département de la Marne",
    link: "https://www.marne.fr/missions-et-actions-du-departement/insertion/fonds-de-solidarite-pour-le-logement-fsl/",
  },
  departement_mayenne: {
    label: "du département de la Mayenne",
    link: "https://www.lamayenne.fr/service/le-fonds-solidarite-pour-le-logement",
  },
  departement_morbihan: {
    label: "du département du Morbihan",
    link: "https://www.morbihan.fr/nos-actions/cadre-de-vie-et-mobilite/logement-et-habitat/fonds-de-solidarite-logement-fsl",
    form: "https://www.morbihan.fr/fileadmin/24_morbihan_5_H08_FSL_eau_energie.pdf",
    instructions:
      "https://www.morbihan.fr/nos-actions/cadre-de-vie-et-mobilite/logement-et-habitat/fonds-de-solidarite-logement-fsl",
  },
  departement_moselle: {
    label: "du département de la Moselle",
    link: "https://www.moselle.fr/jcms/pl_12538/fr/fonds-solidarite-logement-fsl",
    form: "https://www.moselle.fr/upload/docs/application/pdf/2018-11/demande_dintervention_du_fsl_-_acces_impayes_locatifs.pdf",
  },
  departement_nord: {
    label: "du département du Nord",
    link: "https://services.lenord.fr/fonds-de-solidarite-pour-le-logement-fsl--aide-financiere-a-linstallation",
    instructions:
      "https://services.lenord.fr/fonds-de-solidarite-pour-le-logement-fsl--aide-financiere-a-linstallation",
    excludedEPCI: "200093201",
  },
  metropole_europeenne_de_lille: {
    label: "de la Métropole européenne de Lille",
    link: "https://www.lillemetropole.fr/votre-metropole/competences/amenagement-du-territoire/logement/le-fonds-de-solidarite-logement",
    form: "https://www.lillemetropole.fr/sites/default/files/2019-12/Volet%20demandeur%20maintien.pdf",
  },
  departement_oise: {
    label: "du département de l’Oise",
    link: "https://www.oise.fr/information/guide-des-aides-departementales/fonds-departemental-de-solidarite-3145",
  },
  departement_pas_de_calais: {
    label: "du département du Pas-de-Calais",
    link: "https://www.pasdecalais.fr/le-fonds-de-solidarite-logement",
  },
  departement_puy_de_dome: {
    label: "du département du Puy-de-Dôme",
    link: "https://www.puy-de-dome.fr/social/logement-habitat/fonds-solidarite-logement.html",
    instructions:
      "https://www.puy-de-dome.fr/fileadmin/user_upload/CD63-2020-RI-FSL.pdf",
  },
  departement_pyrenees_atlantiques: {
    label: "du département des Pyrénées-Atlantiques",
    link: "https://le64.fr/vous-aider-acceder-un-logement-ou-vous-y-maintenir",
  },
  departement_bas_rhin: {
    label: "du département du Bas-Rhin",
    link: "https://www.alsace.eu/aides-et-services/habitat/vous-rencontrez-difficultes-avec-votre-logement/",
    excludedEPCI: "246700488",
  },
  strasbourg_eurometropole: {
    label: "de l'Eurométropole de Strasbourg",
    link: "https://www.strasbourg.eu/fond-de-solidarite-pour-le-logement",
  },
  departement_du_haut_rhin: {
    label: "du département du Haut-Rhin",
    link: "https://www.alsace.eu/aides-et-services/habitat/vous-rencontrez-difficultes-avec-votre-logement/",
  },
  departement_rhone: {
    label: "du département du Rhône",
    link: "https://www.rhone.fr/jcms/pl01_2012545/fr/etre-aide-ou-accompagne-pour-rester-dans-mon-logement",
    excludedEPCI: "200046977",
  },
  intercommunalite_metropole_lyon: {
    label: "de la Métropole de Lyon",
    link: "https://www.grandlyon.com/services/aides-fonds-solidarite-logement.html",
    instructions:
      "https://www.grandlyon.com/services/aides-fonds-solidarite-logement.html",
  },
  departement_saone_et_loire: {
    label: "du département de la Saône-et-Loire",
    link: "https://www.saoneetloire.fr/guide-des-aides/fonds-de-solidarite-logement-fsl/",
  },
  departement_sarthe: {
    label: "du département de la Sarthe",
    link: "https://www.sarthe.fr/insertion-logement/logement-habitat/fonds-de-solidarite-logement",
  },
  departement_haute_savoie: {
    label: "du département de la Haute-Savoie",
    link: "https://hautesavoie.fr/subvention/fonds-de-solidarite-logement-fsl-aide-au-maintien-dans-les-lieux-impayes-de-loyers/",
  },
  departement_paris: {
    label: "du département de Paris",
    link: "https://www.paris.fr/pages/aides-au-logement-3827#le-fonds-de-solidarite-pour-le-logement-de-paris",
  },
  departement_seine_maritime: {
    label: "du département de Seine-Maritime",
    link: "https://www.seinemaritime.fr/mon-quotidien/habitat-logement/les-aides-a-lacces-et-au-maintien-dans-le-logement.html",
  },
  departement_seine_et_marne: {
    label: "du département de Seine-et-Marne",
    link: "https://www.seine-et-marne.fr/fr/aides-au-logement",
  },
  departement_yvelines: {
    label: "du département des Yvelines",
    link: "https://www.yvelines.fr/solidarite/adultes-en-difficulte/logement/acces-et-maintien-logement/",
  },
  departement_somme: {
    label: "du département de la Somme",
    link: "https://www.somme.fr/services/rsa-insertion/les-aides-a-linsertion/le-fonds-de-solidarite-logement/",
  },
  departement_var: {
    label: "du département du Var",
    link: "https://www.var.fr/social/insertion/fonds-de-solidarite-logement",
    form: "https://www.var.fr/documents/d/departement-du-var/maintien-a4-1-pdf",
    excludedEPCI: "248300543",
  },
  intercommunalite_toulon_provence_mediterranee: {
    label: "de la Métropole de Toulon Provence Méditerrannée",
    link: "https://metropoletpm.fr/service/article/fonds-de-solidarite-logement-fsl",
    form: "https://metropoletpm.fr/sites/new.tpm-agglo.fr/files/maintien_a4.pdf",
  },
  departement_vaucluse: {
    label: "du département du Vaucluse",
    link: "http://www.vaucluse.fr/habitat-logement/les-aides-aux-particuliers/le-fonds-de-solidarite-pour-le-logement-1531.html",
  },
  departement_vendee: {
    label: "du département de la Vendée",
    link: "http://www.vendee.fr/Territoire-et-environnement/Habitat-Logement/42264-Habitat-Logement/L-accompagnement-des-menages-en-difficultes",
  },
  departement_vienne: {
    label: "du département de la Vienne",
    link: "http://www.fsl86.fr/",
    form: "http://www.fsl86.fr/images/pdf/declaration_de_ressources.pdf",
  },
  departement_essonne: {
    label: "du département de l’Essonne",
    link: "http://www.essonne.fr/le-departement/les-organismes-associes/le-fonds-de-solidarite-pour-le-logement-fsl/",
  },
  departement_hauts_de_seine: {
    label: "du département des Hauts-de-Seine",
    link: "https://www.78-92.fr/annuaire/aides-et-services/detail/le-fonds-de-solidarite-logement-fsl-92",
  },
  departement_seine_saint_denis: {
    label: "du département de Seine-Saint-Denis",
    link: "https://seinesaintdenis.fr/solidarite/action-sociale/article/fonds-de-solidarite-logement",
    instructions:
      "https://seinesaintdenis.fr/solidarite/action-sociale/article/fonds-de-solidarite-logement#Comment-en-formuler-la-demande",
  },
  departement_val_de_marne: {
    label: "du département du Val-de-Marne",
    link: "https://www.valdemarne.fr/a-votre-service/habitat/logement/aides-aux-impayes-locatifs-fsh",
  },
  departement_val_d_oise: {
    label: "du département du Val d’Oise",
    link: "https://www.valdoise.fr/aideEtService/21/176-fonds-de-solidarite-logement-aide-aux-impayes-de-loyers.htm",
  },
  departement_la_reunion: {
    label: "du département de la Réunion",
    link: "https://www.departement974.fr/aide/aide-habitat-fonds-de-solidarite-pour-logement-fsl#aidesimpayes",
  },
}

function formatBenefit(
  { label, link, form, instructions, excludedEPCI }: any,
  institutionId,
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
        StatutOccupationLogement.LogeGratuitement,
        StatutOccupationLogement.SansDomicile,
      ],
    },
    {
      type: "difficultes_acces_ou_frais_logement",
    },
  ]
  return Object.assign(
    {},
    {
      id: `${institutionId.replace(/_/g, "-")}-fsl-eligibilite`,
      ...DEFAULT_FSL,
      description: `Dans le cadre du Fonds de Solidarité Logement ${label}, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures d'énergie et d'eau.`,
      conditions: [
        `Occuper, à titre de résidence principale, un logement sur le territoire ${label}.`,
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      link,
      form: form ? form : null,
      instructions: instructions ? instructions : null,
      label: `Aide au maintien dans votre logement ${label}`,
      institution: institutionId,
      source: "javascript",
      conditions_generales,
    },
  )
}

export function buildFSL() {
  return Object.entries(FSL_BY_INSTITUTION_SLUG).map(
    ([institutionSlug, customizationBenefit]) =>
      formatBenefit(customizationBenefit, institutionSlug),
  )
}
