const DEFAULT_APA = {
  type: "bool",
  prefix: "l’",
  periodicite: "ponctuelle",
}

export const APA_BY_CODE = {
  departement_hautes_alpes: {
    label: "du département des Hautes Alpes",
    link: "https://www.hautes-alpes.fr/1647-l-allocation-personnalisee-d-autonomie-apa-.htm",
    form: "https://www.hautes-alpes.fr/include/viewFile.php?idtf=16823&path=a0%2F16823_639_1-dossier_apa_web_elec.pdf",
  },
  departement_alpes_maritimes: {
    label: "du département des Alpes Maritimes",
    link: "https://www.departement06.fr/laide-aux-seniors-vous-accompagne-au-quotidien-dans-de-multiples-demarches/l-apa-dans-les-alpes-maritimes-2578.html",
    teleservice: "https://mesdemarches06.fr/solidarite-social/",
  },
  departement_bouches_du_rhone: {
    label: "du département des Bouches du Rhône",
    link: "https://www.departement13.fr/le-13-en-action/seniors/les-dispositifs/allocation-personnalisee-dautonomie-apa/",
    form: "https://www.departement13.fr/fileadmin/user_upload/Famille/Seniors/formulaires/dossier_APA.pdf",
  },
  departement_calvados: {
    label: "du département du Calvados",
    teleservice:
      "https://portail.teleservices.calvados.fr/action-sociale/allocation-personnalisee-dautonomie-apa/",
    link: "https://www.calvados.fr/contents/fiche/fiches-aide--services/lallocation-personnalisee-dauton.html",
  },
  departement_eure_et_loir: {
    label: "du département d'Eure et Loir",
    link: "https://eurelien.fr/mon-quotidien/seniors/",
  },
  departement_finistere: {
    label: "du département du Finistère",
    link: "https://www.finistere.fr/A-votre-service/Personnes-age-es-APA/Allocation-personnalisee-d-autonomie",
    form: "https://www.finistere.fr/var/finistere/storage/original/application/1f10539819d74121420da96880b95716.pdf",
  },
  departement_haute_garonne: {
    label: "du département de Haute Garonne",
    link: "https://www.haute-garonne.fr/guide-des-aides/allocation-personnalisee-dautonomie-apa",
    form: "https://www.haute-garonne.fr/cd31/dl/997",
  },
  departement_gironde: {
    label: "du département de Gironde",
    link: "https://www.gironde.fr/handicap-grand-age/aides-et-prestations-apa-pch-et-cmi#apa",
    form: "https://www.gironde.fr/sites/default/files/2017-04/demande_apa_web_0.pdf",
  },
  departement_herault: {
    institution: "departement",
    label: "du département de l'Hérault",
    link: "https://www.herault.gouv.fr/Demarches-administratives/Toutes-les-demarches-pour-les-particuliers/Service-Public-pour-les-particuliers#!/particuliers/page/F10009",
    instructions:
      "http://www.herault.fr/lallocation-personnalisee-dautonomie-apa",
  },
  departement_ille_et_vilaine: {
    label: "du département d'Ille et Vilaine",
    link: "https://www.ille-et-vilaine.fr/actualite/bien-vieillir-chez-soi-avec-l-apa",
    form: "https://www.ille-et-vilaine.fr/sites/default/files/asset/document/depliant_allocation_personnalisee_autonomie_apa_2022.pdf",
  },
  departement_isere: {
    label: "du département de l'Isère",
    teleservice:
      "https://www.isere.fr/espace-personnel/Pages/creer-mon-compte.aspx",
    link: "https://www.isere.fr/mda38/particulier/pa/Pages/apa-en-ligne.aspx",
  },
  departement_loire: {
    label: "du département de la Loire",
    link: "http://www.loire.fr/jcms/c_308179/comment-beneficier-de-l-apa-a-domicile",
    form: "http://www.loire.fr/upload/docs/application/pdf/dossierapa.pdf",
  },
  departement_loire_atlantique: {
    label: "du département de Loire Atlantique",
    link: "https://www.loire-atlantique.fr/44/seniors-personnes-agees/l-allocation-personnalisee-d-autonomie-apa-a-domicile/c_1273554",
    form: "https://www.loire-atlantique.fr/upload/docs/application/pdf/2020-09/formulaire_de_demande_daide_2018.pdf",
  },
  departement_loiret: {
    label: "du département du Loiret",
    link: "https://www.loiret.fr/aide/allocation-personnalisee-dautonomie-apa-domicile-et-en-etablissement-ayant-opte-pour-la-0#:~:text=est%20une%20prestation%20en%20nature,l'%C3%A9quipe%20pluridisciplinaire%20du%20D%C3%A9partement.",
    form: "https://www.loiret.fr/sites/loiret/files/media/documents/2021/11/formulaire-demande-APA-Carsat-MDA-01112021_0.pdf",
  },
  departement_moselle: {
    label: "du département de Moselle",
    link: "http://www.moselle.fr/moselleetvous/pages/fiche_senior_apa.aspx",
    form: "http://www.moselle.fr/sitecollectiondocuments/lamoselleetvous/solidarite/seniors/formulaire_demande_apa_domicile.pdf",
  },
  departement_nord: {
    label: "du département du Nord",
    link: "https://lenord.fr/jcms/prd2_335926/allocation-personnalisee-d-autonomie-apa",
    form: "https://info.lenord.fr/upload/attachments/demande_daides_a_lautonomie_interactif-62b03b42368e9.pdf",
  },
  departement_pas_de_calais: {
    label: "du département du Pas de Calais",
    link: "https://www.pasdecalais.fr/Solidarite-Sante/Retraites-et-personnes-agees/Beneficier-d-aides/L-Allocation-Personnalisee-d-Autonomie-APA",
    form: "https://www.pasdecalais.fr/content/download/16113/164597/file/NOM+SUR+TRANCHE-DEMANDE+APA+Bleu+Prusse+REF+KIMOCE+760254+BLEU+Derni%C3%A8re+version.pdf",
  },
  departement_pyrenees_atlantiques: {
    label: "du département des Pyrénées Atlantiques",
    link: "http://www.le64.fr/solidarite/autonomie/soutien-a-domicile/compenser-la-dependance-par-lapa.html",
    form: "http://www.le64.fr/fileadmin/mediatheque/cg64/documents/actualites/APA_2017/dossier_APA_modifi%C3%A9_juin_2017.pdf",
  },
  departement_bas_rhin: {
    label: "du département du Bas-Rhin",
    link: "http://www.bas-rhin.fr/acces-direct/guide-aides/detail-guide-aides/381/Allocation-personnalisee-d-autonomie--APA--a-domicile",
    form: "http://www.bas-rhin.fr/eCommunityDocuments/%7BE34C4D98-631D-459B-AA4E-61C91D2F7BA0%7D/3759/document_conseil-departemental-bas-rhin-formulaire-demande-apa.pdf",
  },
  departement_du_haut_rhin: {
    label: "du département du Haut-Rhin",
    link: "https://www.haut-rhin.fr/content/vivre-%C3%A0-domicile-1#:~:text=L'Allocation%20personnalis%C3%A9e%20d'autonomie%20%C3%A0%20domicile%20(APA),%C3%A0%20leur%20perte%20d'autonomie.",
    form: "https://www.haut-rhin.fr/sites/cea/files/FORMULAIRE%20APA_1.pdf",
  },
  departement_paris: {
    label: "de Paris",
    link: "https://www.paris.fr/aides_soutien_a_domicile#allocation-personnalisee-d-autonomie-a-domicile-apa_21",
    instructions: "https://apa.paris.fr/portailAPA/",
  },
  departement_seine_maritime: {
    label: "du département de Seine Maritime",
    link: "https://www.seinemaritime.fr/vos-services/personnes-agees-1/beneficier-daides/lallocation-aux-personnes-agees.html",
    form: "https://www.seinemaritime.fr/docs/1_apa-1ere-demande-domicile.pdf",
  },
  departement_seine_et_marne: {
    label: "du département de Seine et Marne",
    teleservice: "https://e-service.seine-et-marne.fr/",
    link: "http://www.seine-et-marne.fr/Solidarite/Seniors/Maintien-a-domicile-APA/Allocation-Personnalisee-d-Autonomie-APA",
  },
  departement_var: {
    label: "du département du Var",
    link: "https://www.var.fr/social/autonomie-personnes-agees/apa",
    instructions: "https://www.var.fr/social/autonomie-personnes-agees/apa",
  },
  departement_hauts_de_seine: {
    label: "du département de Hauts de Seine",
    link: "http://www.hauts-de-seine.fr/solidarites/personnes-agees/maintien-a-domicile/comment-beneficier-de-lapa/",
    form: "http://www.hauts-de-seine.fr/fileadmin/PDF/Solidarites/Autonomie/APA_DossierDemandeDom_dec2018.pdf",
  },
  departement_seine_saint_denis: {
    label: "du département de Seine Saint Denis",
    link: "https://seinesaintdenis.fr/Allocation-Departementale-Personnalisee-d-Autonomie.html",
    form: "https://seinesaintdenis.fr/IMG/pdf/formulaire_demande_adpa.pdf",
  },
  departement_val_de_marne: {
    label: "du département du Val de Marne",
    link: "https://www.valdemarne.fr/a-votre-service/personnes-agees/allocation-personnalisee-dautonomie-a-domicile-apad",
    form: "https://www.valdemarne.fr/download/sites/default/files/formulaires/webformudemande_apa_-2018_.pdf",
  },
  intercommunalite_metropole_lyon: {
    label: "de la Métropole de Lyon",
    link: "https://www.grandlyon.com/services/allocation-personnalisee-d-autonomie.html",
    form: "https://www.grandlyon.com/fileadmin/user_upload/media/pdf/pa-ph/personnes-agees/20170802_dossier_demande_apa.pdf",
  },
}

function formatBenefit(institution) {
  const customizationBenefit = APA_BY_CODE[institution]
  return {
    id: `${institution.replace(/_/g, "-")}-apa-eligibilite`,
    ...DEFAULT_APA,
    description: `L’allocation personnalisée d’autonomie (APA) ${customizationBenefit.label} est une aide réservée aux plus de
    60 ans en perte d’autonomie. À travers un plan d’action, elle favorise le
    maintien à domicile et l’amélioration de la qualité de vie des personnes âgées
    en établissement en subventionnant des services d’aides à la personne. Sa
    gestion est confiée aux conseils départementaux...`,
    conditions: [
      `Faire évaluer votre perte d’autonomie (classement GIR) à domicile par les
      services sociaux de votre département.`,
      "Accepter le plan d’aide proposé par votre département.",
      "Résider depuis plus de trois mois dans votre département.",
      'Ne pas percevoir <a target="_blank" rel="noopener" title="Service Public.fr - Peut-on cumuler l’APA avec d’autres revenus ? - Nouvelle fenêtre" href="https://www.service-public.fr/particuliers/vosdroits/F11678">certaines autres aides</a> non cumulables avec l’APA.',
    ],
    ...customizationBenefit,
    label: `Allocation personnalisée d’autonomie ${customizationBenefit.label}`,
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

export function buildAPA() {
  return Object.keys(APA_BY_CODE).map((code) => formatBenefit(code))
}
