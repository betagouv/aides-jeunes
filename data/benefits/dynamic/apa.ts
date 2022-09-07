const DEFAULT_APA = {
  type: "bool",
  prefix: "l’",
  periodicite: "autre",
}

export const APA_BY_CODE = {
  D05: {
    label: "du département des Hautes Alpes",
    institution: {
      imgSrc: "img/logo_cd05.png",
    },
    instructions: undefined, // Prevent default instructions recycling
    form: "https://www.hautes-alpes.fr/include/viewFile.php?idtf=16823&path=a0%2F16823_639_1-dossier_apa_web_elec.pdf",
    teleservice: undefined, // Prevent default instructions recycling
    ressources: {
      link: "https://www.hautes-alpes.fr/1647-l-allocation-personnalisee-d-autonomie-apa-.htm",
    },
  },
  D06: {
    label: "du département des Alpes Maritimes",
    institution: {
      imgSrc: "img/logo_cd06.png",
    },
    instructions: undefined, // Prevent default instructions recycling
    form: undefined, // Prevent default instructions recycling
    teleservice:
      "https://www.departement06.fr/dossier-de-demande-d-allocation-personnalisee-d-autonomie-a-domicile-14249.html",
    ressources: {
      link: "https://www.departement06.fr/aides-aux-personnes-agees/allocation-personnalisee-d-autonomie-apa-2578.html",
    },
  },
  D13: {
    label: "du département des Bouches du Rhône",
    institution: {
      imgSrc: "img/logo_cd13.png",
    },
    instructions: undefined, // Prevent default instructions recycling
    form: "https://www.departement13.fr/fileadmin/user_upload/Famille/Seniors/formulaires/dossier_APA.pdf",
    teleservice: undefined, // Prevent default instructions recycling
    ressources: {
      link: "https://www.departement13.fr/le-13-en-action/seniors/les-dispositifs/allocation-personnalisee-dautonomie-apa/",
    },
  },
  D14: {
    label: "du département du Calvados",
    institution: {
      imgSrc: "img/logo_cd14.png",
    },
    instructions: undefined, // Prevent default instructions recycling
    form: undefined, // Prevent default form recycling
    teleservice: "https://teleservices.calvados.fr/demandes-apa/",
    ressources: {
      link: "https://www.calvados.fr/contents/fiche/fiches-aide--services/lapa-en-ligne.html",
    },
  },
  D28: {
    label: "du département d'Eure et Loir",
    institution: {
      imgSrc: "img/logo_cd28.png",
    },
    instructions: undefined, // Prevent default instructions recycling
    form: "https://www.eurelien.fr/sites/default/files/mda-dossier-dallocation-personnalisee-dautonomie.pdf", // Prevent default form recycling
    teleservice: undefined,
    ressources: { link: "https://eurelien.fr/guide/autonomie" },
  },
  D29: {
    label: "du département du Finistère",
    institution: {
      imgSrc: "img/logo_cd29.png",
    },
    instructions: undefined, // Prevent default instructions recycling
    form: "https://www.finistere.fr/var/finistere/storage/original/application/1f10539819d74121420da96880b95716.pdf",
    teleservice: undefined, // Prevent default instructions recycling
    ressources: {
      link: "https://www.finistere.fr/A-votre-service/Personnes-age-es-APA/Allocation-personnalisee-d-autonomie",
    },
  },
  D31: {
    label: "du département de Haute Garonne",
    institution: {
      imgSrc: "img/logo_cd31.png",
    },
    instructions: undefined, // Prevent default instructions recycling
    form: "https://www.haute-garonne.fr/sites/default/files/20172707-formulaire-demande-_apa.pdf",
    teleservice: undefined, // Prevent default form recycling
    ressources: {
      link: "https://www.haute-garonne.fr/guide-des-aides/allocation-personnalisee-dautonomie-apa",
    },
  },
  D33: {
    label: "du département de Gironde",
    institution: {
      imgSrc: "img/logo_cd33.png",
    },
    instructions: undefined, // Prevent default instructions recycling
    form: "https://www.gironde.fr/sites/default/files/2017-04/demande_apa_web_0.pdf",
    teleservice: undefined, // Prevent default form recycling
    ressources: {
      link: "https://www.gironde.fr/handicap-grand-age/aides-et-prestations-apa-pch-et-cmi#apa",
    },
  },
  D34: {
    label: "du département de l'Hérault",
    institution: {
      imgSrc: "img/logo_cd34.png",
    },
    instructions:
      "http://www.herault.fr/lallocation-personnalisee-dautonomie-apa",
    form: undefined, // Prevent default form recycling
    teleservice: undefined, // Prevent default form recycling
    ressources: { link: undefined },
  },
  D35: {
    label: "du département d'Ille et Vilaine",
    institution: {
      imgSrc: "img/logo_cd35.png",
    },
    instructions: undefined, // Prevent default form recycling
    form: "http://www.ille-et-vilaine.fr/sites/default/files/asset/document/faire_demande_allocation_apa_juillet_2014.pdf",
    teleservice: undefined, // Prevent default form recycling
    ressources: { link: "http://www.ille-et-vilaine.fr/fr/demande-apa" },
  },
  D38: {
    label: "du département de l'Isère",
    institution: {
      imgSrc: "img/logo_cd38.png",
    },
    instructions: undefined, // Prevent default instructions recycling
    form: undefined, // Prevent default instructions recycling
    teleservice:
      "https://www.isere.fr/espace-personnel/Pages/creer-mon-compte.aspx",
    ressources: {
      link: "https://www.isere.fr/mda38/particulier/pa/Pages/apa-en-ligne.aspx",
    },
  },
  D42: {
    label: "du département du Loire",
    institution: {
      imgSrc: "img/logo_cd42.png",
    },
    instructions: undefined, // Prevent default form recycling
    form: "http://www.loire.fr/upload/docs/application/pdf/dossierapa.pdf",
    teleservice: undefined, // Prevent default form recycling
    ressources: {
      link: "http://www.loire.fr/jcms/c_308179/comment-beneficier-de-l-apa-a-domicile",
    },
  },
  D44: {
    label: "du département de Loire Atlantique",
    institution: {
      imgSrc: "img/logo_cd44.png",
    },
    instructions: undefined, // Prevent default instructions recycling
    form: "https://www.loire-atlantique.fr/upload/docs/application/pdf/2014-02/personnes_agees_for_apa_2006_10_03__16_42_50_200.pdf",
    teleservice: undefined, // Prevent default instructions recycling
    ressources: {
      link: "https://www.loire-atlantique.fr/jcms/classement-des-contenus/guides-aides/vous-etes/personne-agee/l-allocation-personnalisee-d-autonomie-apa-a-domicile-fr-p1_315752?portal=aca_6941&category=p2_807421",
    },
  },
  D45: {
    label: "du département du Loiret",
    institution: {
      imgSrc: "img/logo_cd45.jpg",
    },
    instructions: undefined, // Prevent default instructions recycling
    form: undefined, // Prevent default form recycling
    teleservice: {
      state: "redirection", // TODO
      params: { vers: "loiret_APA" },
    },
  },
  D57: {
    label: "du département de Moselle",
    institution: {
      imgSrc: "img/logo_cd57.png",
    },
    instructions: undefined, // Prevent default instructions recycling
    form: "http://www.moselle.fr/sitecollectiondocuments/lamoselleetvous/solidarite/seniors/formulaire_demande_apa_domicile.pdf",
    teleservice: undefined, // Prevent default instructions recycling
    ressources: {
      link: "http://www.moselle.fr/moselleetvous/pages/fiche_senior_apa.aspx",
    },
  },
  D59: {
    label: "du département du Nord",
    institution: {
      imgSrc: "img/logo_cd59.png",
    },
    instructions: undefined, // Prevent default instructions recycling
    form: "https://lenord.fr/upload/docs/application/pdf/2018-04/formulaire_apa_2018-04-27_16-30-55_949.pdf",
    teleservice: undefined, // Prevent default instructions recycling
    ressources: {
      link: "https://lenord.fr/jcms/prd2_335926/allocation-personnalisee-d-autonomie-apa",
    },
  },
  D62: {
    label: "du département du Pas de Calais",
    institution: {
      imgSrc: "img/logo_cd62.png",
    },
    instructions: undefined, // Prevent default instructions recycling
    form: "http://www.pasdecalais.fr/content/download/79774/1263503/file/Dossier+de+demande+APA.pdf",
    teleservice: undefined, // Prevent default form recycling
    ressources: {
      link: "http://www.pasdecalais.fr/Solidarite-Sante/Retraites-et-personnes-agees/Beneficier-d-aides/L-Allocation-Personnalisee-d-Autonomie-APA",
    },
  },
  D64: {
    label: "du département des Pyrénées Atlantiques",
    institution: {
      imgSrc: "img/logo_cd64.png",
    },
    instructions: undefined, // Prevent default instructions recycling
    form: "http://www.le64.fr/fileadmin/mediatheque/cg64/documents/actualites/APA_2017/dossier_APA_modifi%C3%A9_juin_2017.pdf",
    teleservice: undefined, // Prevent default form recycling
    ressources: {
      link: "http://www.le64.fr/solidarite/autonomie/soutien-a-domicile/compenser-la-dependance-par-lapa.html",
    },
  },
  D67: {
    label: "du département du Bas-Rhin",
    institution: {
      imgSrc: "img/logo_cd67.png",
    },
    instructions: undefined, // Prevent default instructions recycling
    form: "http://www.bas-rhin.fr/eCommunityDocuments/%7BE34C4D98-631D-459B-AA4E-61C91D2F7BA0%7D/3759/document_conseil-departemental-bas-rhin-formulaire-demande-apa.pdf",
    teleservice: undefined, // Prevent default form recycling
    ressources: {
      link: "http://www.bas-rhin.fr/acces-direct/guide-aides/detail-guide-aides/381/Allocation-personnalisee-d-autonomie--APA--a-domicile",
    },
  },
  D75: {
    label: "de Paris",
    institution: {
      imgSrc: "img/logo_paris.png",
    },
    instructions: "https://apa.paris.fr/portailAPA/",
    form: undefined, // Prevent default form recycling
    teleservice: undefined, // Prevent default form recycling
    ressources: {
      link: "https://www.paris.fr/aides_soutien_a_domicile#allocation-personnalisee-d-autonomie-a-domicile-apa_21",
    },
  },
  D76: {
    label: "du département de Seine Maritime",
    institution: {
      imgSrc: "img/logo_cd76.png",
    },
    instructions: undefined, // Prevent default instructions recycling
    form: "https://www.seinemaritime.fr/docs/1_apa-1ere-demande-domicile.pdf",
    teleservice: undefined, // Prevent default form recycling
    ressources: {
      link: "https://www.seinemaritime.fr/vos-services/personnes-agees-1/beneficier-daides/lallocation-aux-personnes-agees.html",
    },
  },
  D77: {
    label: "du département de Seine et Marne",
    institution: {
      imgSrc: "img/logo_cd77.png",
    },
    instructions: undefined, // Prevent default instructions recycling
    form: undefined, // Prevent default form recycling
    teleservice: "https://e-service.seine-et-marne.fr/",
    ressources: {
      link: "http://www.seine-et-marne.fr/Solidarite/Seniors/Maintien-a-domicile-APA/Allocation-Personnalisee-d-Autonomie-APA",
    },
  },
  D83: {
    label: "du département du Var",
    institution: {
      imgSrc: "img/logo_cd83.png",
    },
    instructions: "https://www.var.fr/social/autonomie-personnes-agees/apa",
    form: undefined, // Prevent default instructions recycling
    teleservice: undefined, // Prevent default instructions recycling
  },
  D92: {
    label: "du département de Hauts de Seine",
    institution: {
      imgSrc: "img/logo_cd92.png",
    },
    instructions: undefined, // Prevent default instructions recycling
    form: "http://www.hauts-de-seine.fr/fileadmin/PDF/Solidarites/Autonomie/APA_DossierDemandeDom_dec2018.pdf",
    teleservice: undefined, // Prevent default form recycling
    ressources: {
      link: "http://www.hauts-de-seine.fr/solidarites/personnes-agees/maintien-a-domicile/comment-beneficier-de-lapa/",
    },
  },
  D93: {
    label: "du département de Seine Saint Denis",
    institution: {
      imgSrc: "img/logo_cd93.png",
    },
    instructions: undefined, // Prevent default instructions recycling
    form: "https://seinesaintdenis.fr/IMG/pdf/formulaire_demande_adpa.pdf",
    teleservice: undefined, // Prevent default form recycling
    ressources: {
      link: "https://seinesaintdenis.fr/Allocation-Departementale-Personnalisee-d-Autonomie.html",
    },
  },
  D94: {
    label: "du département du Val de Marne",
    institution: {
      imgSrc: "img/logo_cd94.png",
    },
    instructions: undefined, // Prevent default instructions recycling
    form: "https://www.valdemarne.fr/download/sites/default/files/formulaires/webformudemande_apa_-2018_.pdf",
    teleservice: undefined, // Prevent default form recycling
    ressources: {
      link: "https://www.valdemarne.fr/a-votre-service/personnes-agees/allocation-personnalisee-dautonomie-a-domicile-apad",
    },
  },
  M200046977: {
    label: "de la Métropole de Lyon",
    institution: {
      imgSrc: "img/logo_lyon_metropole.png",
    },
    instructions: undefined, // Prevent default form recycling
    form: "https://www.grandlyon.com/fileadmin/user_upload/media/pdf/pa-ph/personnes-agees/20170802_dossier_demande_apa.pdf",
    teleservice: undefined, // Prevent default form recycling
    ressources: {
      link: "https://www.grandlyon.com/services/allocation-personnalisee-d-autonomie.html",
    },
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
    id: `${institution.replace(/_/g, "-")}-apa-eligibilite`,
    ...DEFAULT_APA,
    label: `Allocation personnalisée d’autonomie ${customizationBenefit.label}`,
    description: `L’allocation personnalisée d’autonomie (APA) ${customizationBenefit.label} est une aide réservée aux plus de
    60 ans en perte d’autonomie. À travers un plan d’action, elle favorise le
    maintien à domicile et l’amélioration de la qualité de vie des personnes âgées
    en établissement en subventionnant des services d’aides à la personne. Sa
    gestion est confiée aux conseils départementaux..`,
    conditions: [
      `Faire évaluer votre perte d’autonomie (classement GIR) à domicile par les
      services sociaux de votre département.`,
      "Accepter le plan d’aide proposé par votre département.",
      "Résider depuis plus de trois mois dans votre département.",
      'Ne pas percevoir <a target="_blank" rel="noopener" title="Service Public.fr - Peut-on cumuler l’APA avec d’autres revenus ? - Nouvelle fenêtre" href="https://www.service-public.fr/particuliers/vosdroits/F11678">certaines autres aides à l’</a> non cumulables avec l’APA.',
    ],
    ...customizationBenefit.resources,
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

export function buildAPA(institutionsMap) {
  const result: any = Object.keys(APA_BY_CODE).reduce(
    (accum: any, code: string) => {
      const customizationBenefit = APA_BY_CODE[code]
      const institutionName = getInstitutionName(institutionsMap, code)

      if (!institutionName) {
        console.warn(`No institution for metropole apa ${code}`)
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
