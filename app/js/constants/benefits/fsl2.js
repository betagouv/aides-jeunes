
build = function(code, name, base) {
  return {
    ...base,
    provider: {
      imgSrc: `logo_cd${code}.png`,
    },
    label: `Aide au maintien dans votre logement de ${name}`,
    conditions: [
      "Occuper, à titre de résidence principale, un logement sur le territoire du département de .",
      "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
    ],
    description:
      "Dans le cadre du Fonds de Solidarité Logement du département de l’Ain, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
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
  customization: {
    D01: build("01", "l’Ain", {
      link: "https://www.ain.fr/solutions/fond-solidarite-logement-maintien-dans-le-logement/",
    }),
    D02: {
      provider: {
        imgSrc: "logo_cd02.png",
      },
      label: "Aide au maintien dans votre logement de l’Aisne",
      link: "https://aisne.com/aides/aide-a-lacces-au-logement-fonds-de-solidarite-pour-le-logement-fsl",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de l’Aisne.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de l’Aisne, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D03: {
      provider: {
        imgSrc: "logo_cd03.png",
      },
      label: "Aide au maintien dans votre logement de l’Allier",
      link: "http://www.caf.fr/allocataires/caf-de-l-allier/offre-de-service/logement-et-cadre-de-vie/le-fonds-de-solidarite-pour-le-logement-fsl",
      instructions:
        "http://modules.allier.fr/guide3/contenu.asp?iddossier=11612",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de l’Allier.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de l’Allier, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D04: {
      provider: {
        imgSrc: "logo_cd04.png",
      },
      label: "Aide au maintien dans votre logement des Alpes-de-Haute-Provence",
      link: "http://www.mondepartement04.fr/rechercher-plus-daides/habitat-logement-urbanisme/fsl-masp/fonds-social-daide-au-logement-fsl.html",
      form: "http://www.mondepartement04.fr/fileadmin/mediatheque/cg04/formulaire/Insertion/Acc%C3%A8s_au_logement/IMPRIME_FSL_12-2019.pdf",
      instructions:
        "http://www.mondepartement04.fr/rechercher-plus-daides/habitat-logement-urbanisme/fsl-masp/mesure-daccompagnement-social-personnalise.html#c6266",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département des Alpes-de-Haute-Provence.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département des Alpes-de-Haute-Provence, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D05: {
      provider: {
        imgSrc: "logo_cd05.png",
      },
      label: "Aide au maintien dans votre logement des Hautes Alpes",
      link: "https://www.hautes-alpes.fr/4996-fonds-de-solidarite-pour-le-logement-fsl-.htm",
      instructions:
        "https://www.hautes-alpes.fr/4996-fonds-de-solidarite-pour-le-logement-fsl-.htm",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département des Hautes Alpes.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département des Hautes Alpes, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D06: {
      provider: {
        imgSrc: "logo_cd06.png",
      },
      label: "Aide au maintien dans votre logement des Alpes Maritimes",
      link: "https://www.departement06.fr/aides-a-l-insertion/fsl-2607.html",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département des Alpes Maritimes.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département des Alpes Maritimes, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    M200030195: {
      provider: {
        imgSrc: "logo_nice_metropole.png",
      },
      label:
        "Aide au maintien dans votre logement de la métropole Nice Côte d’Azur",
      link: "http://www.nicecotedazur.org/habitat-urbanisme/le-logement/fonds-de-solidarit%C3%A9-pour-le-logement",
      form: "http://www.nicecotedazur.org/uploads/media_items/locataire.original.pdf",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire de la Métropole Nice Côte d’Azur.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement de la Métropole Nice Côte d’Azur, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D07: {
      provider: {
        imgSrc: "logo_cd07.png",
      },
      label: "Aide au maintien dans votre logement de l’Ardèche",
      link: "http://www.ardeche.fr/132-fonds-unique-logement.htm",
      form: "http://www.ardeche.fr/include/viewfilesecure.php?idtf=3609&path=cb%2F3609_762_formulaires-ful-2015BD.pdf",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de l’Ardèche.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de l’Ardèche, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D08: {
      provider: {
        imgSrc: "logo_cd08.png",
      },
      label: "Aide au maintien dans votre logement de l’Ardennes",
      link: "https://cd08.fr/aides-et-subventionss/fonds-de-solidarite-logement-fsl-formulaire-unique-de-demande-de-subvention",
      form: "https://cd08.fr/sites/default/files/maj2020_compilation_formulaires_fsl.pdf",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de l’Ardennes.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de l’Ardennes, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D09: {
      provider: {
        imgSrc: "logo_cd09.png",
      },
      label: "Aide au maintien dans votre logement de l’Ariège",
      link: "http://www.ariege.fr/Etre-solidaire/Logement/Le-Fonds-unique-Habitat-FUH",
      instructions:
        "http://www.ariege.fr/Etre-solidaire/Logement/Rencontrer-un-travailleur-social",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de l’Ariège.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de l’Ariège, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D11: {
      provider: {
        imgSrc: "logo_cd11.png",
      },
      label: "Aide au maintien dans votre logement de l’Aude",
      link: "https://www.aude.fr/je-beneficie-du-fonds-unique-logement-ful",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de l’Aude.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de l’Aude, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D12: {
      provider: {
        imgSrc: "logo_cd12.png",
      },
      label: "Aide au maintien dans votre logement de l’Aveyron",
      link: "https://aveyron.fr/pages/logement/des%20aides%20pour%20acc%C3%A9der%20%C3%A0%20un%20logement%20ou%20sy%20maintenir",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de l’Aveyron.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de l’Aveyron, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D13: {
      provider: {
        imgSrc: "logo_cd13.png",
      },
      label: "Aide au maintien dans votre logement Des Bouches-du-Rhône",
      link: "https://www.departement13.fr/nos-actions/logement/les-dispositifs/le-fonds-de-solidarite-pour-le-logement/",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département Des Bouches-du-Rhône.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département Des Bouches-du-Rhône, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D14: {
      provider: {
        imgSrc: "logo_cd14.png",
      },
      label: "Aide au maintien dans votre logement du Calvados",
      link: "https://www.calvados.fr/accueil/le-departement/solidarite---familles/aide-au-logement/fsl.html",
      instructions:
        "https://www.calvados.fr/contents/fiche/fiches-aide--services/aides-financieres-pour-le-mainti.html",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département du Calvados.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département du Calvados, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D15: {
      provider: {
        imgSrc: "logo_cd15.png",
      },
      label: "Aide au maintien dans votre logement du Cantal",
      link: "http://www.cantal.fr/fonds-de-solidarite-pour-le-logement/",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département du Cantal.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département du Cantal, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D16: {
      provider: {
        imgSrc: "logo_cd16.png",
      },
      label: "Aide au maintien dans votre logement de Charente",
      link: "https://www.charentesolidarites.org/index.php/component/sppagebuilder/8-le-fsl.html",
      instructions:
        "https://www.charentesolidarites.org/index.php/component/sppagebuilder/8-le-fsl.html",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de Charente.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de Charente, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D17: {
      provider: {
        imgSrc: "logo_cd17.png",
      },
      label: "Aide au maintien dans votre logement de Charente-Maritime",
      link: "https://la.charente-maritime.fr/fiches-aides/fonds-solidarite-pour-logement",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de Charente-Maritime.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de Charente-Maritime, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D18: {
      provider: {
        imgSrc: "logo_cd18.png",
      },
      label: "Aide au maintien dans votre logement du Cher",
      link: "https://www.departement18.fr/Logement-habitat",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département du Cher.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département du Cher, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D19: {
      provider: {
        imgSrc: "logo_cd19.png",
      },
      label: "Aide au maintien dans votre logement de Corrèze",
      link: "https://www.correze.fr/nos-missions/habitat/les-aides-sociales-pour-le-logement",
      instructions:
        "https://www.correze.fr/services-en-ligne/les-aides/aide-aux-travailleurs-de-condition-modeste",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de Corrèze.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de Corrèze, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D21: {
      provider: {
        imgSrc: "logo_cd21.png",
      },
      label: "Aide au maintien dans votre logement de la Côte-d’Or",
      link: "https://www.cotedor.fr/votre-service/insertion/accompagnement-financier/accompagnement-et-aides-lacces-ou-au-maintien-dans",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de la Côte-d’Or.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de la Côte-d’Or, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D24: {
      provider: {
        imgSrc: "logo_cd24.png",
      },
      label: "Aide au maintien dans votre logement de la Dordogne",
      link: "https://www.dordogne.fr/servir_les_citoyens/solidarite/logement_/_rsa/logement/aide_financiere_du_fsl_pour_l_acces_au_logement/262-2",
      instructions:
        "https://www.dordogne.fr/logement/aide_financiere_du_fsl_pour_des_impayes_de_loyer_ou_de_charges/262-3",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de la Dordogne.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de la Dordogne, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D25: {
      provider: {
        imgSrc: "logo_cd25.png",
      },
      label: "Aide au maintien dans votre logement du Doubs",
      link: "https://www.doubs.fr/index.php/vous-accompagner/36-particuliers/2242-le-fonds-de-solidarite-logement-fsl",
      form: "http://www.adil25.org/fileadmin/user_upload/PDAHLPD/Grand_public/imprime_aide_financiere_individuelle_FSL_actualise.pdf",
      instructions:
        "http://www.adil25.org/le-pdalhpd/documentation/le-reglement-interieur-du-fsl-et-formulaire-de-demande-daide.html",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département du Doubs.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département du Doubs, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D26: {
      provider: {
        imgSrc: "logo_cd26.png",
      },
      label: "Aide au maintien dans votre logement de la Drôme",
      link: "https://www.ladrome.fr/mon-quotidien/logement/en-cas-de-difficultes/les-aides-aux-locataires/",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de la Drôme.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de la Drôme, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D29: {
      provider: {
        imgSrc: "logo_cd29.png",
      },
      label: "Aide au maintien dans votre logement du Finistère",
      link: "https://www.finistere.fr/A-votre-service/Habitat-Logement/Acces-et-maintien-dans-un-logement-FSL",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département du Finistère.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département du Finistère, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    M242900314: {
      provider: {
        imgSrc: "logo_brest_metropole.png",
      },
      label: "Aide au maintien dans votre logement de brest Métropole",
      link: "https://infosociale.finistere.fr/etablissement/brest-metropole-fsl-fonds-de-solidarite-logement/",
      form: "https://infosociale.finistere.fr/wp-content/uploads/2018/06/CD29_imprime_unique_jlt2019.pdf",
      instructions:
        "https://infosociale.finistere.fr/wp-content/uploads/2019/07/pb_R%C3%A8glement-FSL-m%C3%A9tropolitain-2019.pdf",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire de Brest Métropole.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement de Brest Métropole, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D30: {
      provider: {
        imgSrc: "logo_cd30.png",
      },
      label: "Aide au maintien dans votre logement du Gard",
      link: "https://www.gard.fr/au-quotidien/bien-se-loger/locataires/fonds-solidarite-logement.html",
      instructions:
        "https://www.gard.fr/fileadmin/mediatheque/documents_2020/logement/doc_fond_solidarite_logement-2020.pdf",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département du Gard.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département du Gard, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D31: {
      provider: {
        imgSrc: "logo_cd31.png",
      },
      label: "Aide au maintien dans votre logement de la Haute-Garonne",
      link: "https://www.haute-garonne.fr/aide/fonds-de-solidarite-logement-fsl",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de la Haute-Garonne.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de la Haute-Garonne, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    M243100518: {
      provider: {
        imgSrc: "logo_toulouse_metropole.png",
      },
      label: "Aide au maintien dans votre logement de toulouse Métropole",
      link: "https://www.toulouse-metropole.fr/missions/solidarite/fonds-de-solidarite-logement-fsl-",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire de Toulouse Métropole.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement de Toulouse Métropole, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D33: {
      provider: {
        imgSrc: "logo_cd33.png",
      },
      label: "Aide au maintien dans votre logement de la Gironde",
      link: "http://www.fsl33.org/html/aide_maitien.htm",
      instructions: "http://www.fsl33.org/pdf/FormNoticeMaintien2016.pdf",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de la Gironde.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de la Gironde, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D34: {
      provider: {
        imgSrc: "logo_cd34.png",
      },
      label: "Aide au maintien dans votre logement de l’Hérault",
      link: "http://www.herault.fr/aides-financieres-fsl",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de l’Hérault.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de l’Hérault, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D35: {
      provider: {
        imgSrc: "logo_cd35.png",
      },
      label: "Aide au maintien dans votre logement d’Ille-et-Vilaine",
      link: "https://www.ille-et-vilaine.fr/demande-fsl",
      form: "https://www.ille-et-vilaine.fr/sites/default/files/asset/document/fo-psh-0818-001_imprimeuniquemasques_form_ext_0.pdf",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département d’Ille-et-Vilaine.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département d’Ille-et-Vilaine, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D36: {
      provider: {
        imgSrc: "logo_cd36.png",
      },
      label: "Aide au maintien dans votre logement de l’Indre",
      link: "https://www.adil36.org/aides-locales/locataires-en-difficultes",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de l’Indre.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de l’Indre, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D37: {
      provider: {
        imgSrc: "logo_cd37.png",
      },
      label: "Aide au maintien dans votre logement de l’Indre-et-Loire",
      link: "https://www.touraine.fr/mes-services-au-quotidien/enfance-famille/lacces-au-logement.html",
      form: "https://www.touraine.fr/files/touraine/documents/etre-accompagne/missions/impr_FSL_interactif_departement.pdf",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de l’Indre-et-Loire.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de l’Indre-et-Loire, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    M243700754: {
      provider: {
        imgSrc: "logo_tours_metropole.png",
      },
      label:
        "Aide au maintien dans votre logement de tours Métropole Val de Loire",
      link: "https://www.touraine.fr/mes-services-au-quotidien/enfance-famille/lacces-au-logement.html",
      form: "https://www.touraine.fr/files/touraine/documents/etre-accompagne/missions/impr_FSL_interactif_departement.pdf",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire de Tours Métropole Val de Loire.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement de Tours Métropole Val de Loire, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D38: {
      provider: {
        imgSrc: "logo_cd38.png",
      },
      label: "Aide au maintien dans votre logement d’Isère",
      link: "https://www.isere.fr/aides-au-logement",
      form: "https://www.isere.fr/sites/default/files/demande-directe.pdf",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département d’Isère.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département d’Isère, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D40: {
      provider: {
        imgSrc: "logo_cd40.png",
      },
      label: "Aide au maintien dans votre logement des Landes",
      link: "https://www.landes.fr/logement",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département des Landes.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département des Landes, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D41: {
      provider: {
        imgSrc: "logo_cd41.png",
      },
      label: "Aide au maintien dans votre logement du Loir-et-Cher",
      link: "https://www.departement41.fr/services-en-ligne/etre-accompagne/insertion-habitat/aide-au-logement/",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département du Loir-et-Cher.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département du Loir-et-Cher, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D42: {
      provider: {
        imgSrc: "logo_cd42.png",
      },
      label: "Aide au maintien dans votre logement de la Loire",
      link: "https://www.loire.fr/jcms/lw_1024718/le-fonds-de-solidarite-pour-le-logement-fsl",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de la Loire.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de la Loire, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D44: {
      provider: {
        imgSrc: "logo_cd44.png",
      },
      label: "Aide au maintien dans votre logement de Loire Atlantique",
      description: `Dans le cadre du Fonds de Solidarité Logement du département de Loire Atlantique,
      des aides financières sont mises en place pour vous aider à rester dans votre logement et
      à payer vos factures liées à votre logement (eau, électricité, etc.).`,
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de Loire Atlantique.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      link: "https://www.loire-atlantique.fr/jcms/classement-des-contenus/guides-aides/vous-etes/parent-/-famille/fonds-de-solidarite-pour-le-logement-fsl-les-aides-a-l-acces-ou-au-maintien-dans-votre-logement-fr-t1_16291",
      form: "https://www.loire-atlantique.fr/upload/docs/application/pdf/2020-03/formulaire_de_demande_daide_au_logement_2020-03-09_14-37-8_451.pdf",
    },
    M244500468: {
      provider: {
        imgSrc: "logo_orleans_metropole.png",
      },
      label: "Aide au maintien dans votre logement de orléans Métropole",
      link: "http://www.orleans-metropole.fr/1679/fonds-unifie-logement-ful.htm",
      form: "http://www.orleans-metropole.fr/fileadmin/orleans/MEDIA/document/urbanisme/habitat/FUL_-formulaires_de_demande.pdf",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire de Orléans Métropole.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement de Orléans Métropole, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D49: {
      provider: {
        imgSrc: "logo_cd49.png",
      },
      label: "Aide au maintien dans votre logement du Maine-et-Loire",
      link: "https://www.maine-et-loire.fr/aides-et-services/logement-et-habitat/fonds-solidarite-logement/aides-pour-le-maintien-dans-le-logement",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département du Maine-et-Loire.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département du Maine-et-Loire, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D50: {
      provider: {
        imgSrc: "logo_cd50.png",
      },
      label: "Aide au maintien dans votre logement de la Manche",
      link: "https://www.manche.fr/conseil-departemental/FSL.aspx",
      form: "https://www.manche.fr/conseil-departemental/iso_album/dossier_de_demande_logement.pdf",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de la Manche.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de la Manche, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D51: {
      provider: {
        imgSrc: "logo_cd51.png",
      },
      label: "Aide au maintien dans votre logement de la Marne",
      link: "http://www.marne.fr/les-actions/sante-et-social/logement-social/acces-et-maintien-dans-le-logement-le-fonds-solidarite",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de la Marne.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de la Marne, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D53: {
      provider: {
        imgSrc: "logo_cd53.png",
      },
      label: "Aide au maintien dans votre logement de la Mayenne",
      link: "https://www.lamayenne.fr/service/le-fonds-solidarite-pour-le-logement",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de la Mayenne.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de la Mayenne, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D56: {
      provider: {
        imgSrc: "logo_cd56.png",
      },
      label: "Aide au maintien dans votre logement du Morbihan",
      link: "https://www.morbihan.fr/les-services/logement-habitat/fonds-de-solidarite-logement-fsl/",
      form: "https://www.morbihan.fr/fileadmin/Les_services/Aides_departementales/20_morbihan_5_H08_FSL_maintien_logement.pdf",
      instructions:
        "https://www.morbihan.fr/les-services/aides-departementales/toutes-nos-aides/toutes-nos-aides/?tx_cg56aidesdep_guidedesaides[selectMotsCles]=fsl&tx_cg56aidesdep_guidedesaides[action]=resultsNoCache&tx_cg56aidesdep_guidedesaides[controller]=Aide#hautDePage",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département du Morbihan.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département du Morbihan, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D57: {
      provider: {
        imgSrc: "logo_cd57.png",
      },
      label: "Aide au maintien dans votre logement de la Moselle",
      link: "https://www.moselle.fr/jcms/pl_12538/fr/fonds-solidarite-logement-fsl",
      form: "https://www.moselle.fr/upload/docs/application/pdf/2018-11/demande_dintervention_du_fsl_-_acces_impayes_locatifs.pdf",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de la Moselle.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de la Moselle, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D59: {
      provider: {
        imgSrc: "logo_cd59.png",
      },
      label: "Aide au maintien dans votre logement du Nord",
      link: "https://lenord.fr/jcms/preprd1_145072/le-fonds-de-solidarite-pour-le-logement",
      instructions:
        "https://lenord.fr/jcms/prd1_334245/aide-au-maintien-dans-le-logement?thematique=&typePublic=&motsCles=maintien",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département du Nord.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département du Nord, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    M245900410: {
      provider: {
        imgSrc: "logo_lille_metropole.png",
      },
      label:
        "Aide au maintien dans votre logement de la métropole européenne de Lille",
      link: "https://www.lillemetropole.fr/votre-metropole/competences/amenagement-du-territoire/logement/le-fonds-de-solidarite-logement",
      form: "https://www.lillemetropole.fr/sites/default/files/2019-12/Volet%20demandeur%20maintien.pdf",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire de la Métropole européenne de Lille.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement de la Métropole européenne de Lille, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D60: {
      provider: {
        imgSrc: "logo_cd60.png",
      },
      label: "Aide au maintien dans votre logement de l’Oise",
      link: "http://www.oise.fr/guide-des-aides/aide/fonds-departemental-de-solidarite/",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de l’Oise.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de l’Oise, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D62: {
      provider: {
        imgSrc: "logo_cd62.png",
      },
      label: "Aide au maintien dans votre logement du Pas-de-Calais",
      link: "https://www.pasdecalais.fr/Solidarite-Sante/Reglement-Departemental-d-Aide-Sociale/Le-developpement-des-solidarites/Le-logement-des-personnes-defavorisees-et-le-Fonds-de-Solidarite-Logement/L-aide-financiere-Fonds-Solidarite-Logement-volet-acces-logement-identifie",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département du Pas-de-Calais.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département du Pas-de-Calais, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D63: {
      provider: {
        imgSrc: "logo_cd63.png",
      },
      label: "Aide au maintien dans votre logement du Puy-de-Dôme",
      link: "https://www.puy-de-dome.fr/social/logement-habitat/fonds-solidarite-logement.html",
      instructions:
        "https://www.puy-de-dome.fr/fileadmin/user_upload/CD63-2020-RI-FSL.pdf",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département du Puy-de-Dôme.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département du Puy-de-Dôme, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D64: {
      provider: {
        imgSrc: "logo_cd64.png",
      },
      label: "Aide au maintien dans votre logement des Pyrénées-Atlantiques",
      link: "https://le64.fr/vous-aider-acceder-un-logement-ou-vous-y-maintenir",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département des Pyrénées-Atlantiques.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département des Pyrénées-Atlantiques, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D67: {
      provider: {
        imgSrc: "logo_cd67.png",
      },
      label: "Aide au maintien dans votre logement du Bas-Rhin",
      link: "https://www.bas-rhin.fr/action-sociale-et-sante/difficultes-logement/",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département du Bas-Rhin.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département du Bas-Rhin, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D68: {
      provider: {
        imgSrc: "logo_cd68.png",
      },
      label: "Aide au maintien dans votre logement du Haut-Rhin",
      link: "https://www.haut-rhin.fr/content/des-aides-pour-votre-logement",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département du Haut-Rhin.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département du Haut-Rhin, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D69: {
      provider: {
        imgSrc: "logo_cd69.png",
      },
      label: "Aide au maintien dans votre logement du Rhône",
      link: "https://www.rhone.fr/solidarites/insertion/logement/le_fonds_de_solidarite_logement",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département du Rhône.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département du Rhône, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    M200046977: {
      provider: {
        imgSrc: "logo_lyon_metropole.png",
      },
      label: "Aide au maintien dans votre logement de la métropole de Lyon",
      link: "https://www.grandlyon.com/services/aides-fonds-solidarite-logement.html",
      instructions:
        "https://www.grandlyon.com/services/aides-fonds-solidarite-logement.html",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire de la Métropole de Lyon.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement de la Métropole de Lyon, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D71: {
      provider: {
        imgSrc: "logo_cd71.png",
      },
      label: "Aide au maintien dans votre logement de la Saône-et-Loire",
      link: "https://www.saoneetloire71.fr/accueil/vous-etes-proprietaire/locataire/rester-dans-mon-logement",
      form: "https://www.saoneetloire71.fr/fileadmin/Que_peut-on_faire_pour_vous__/Vous_etes_proprietaire_locataire/Aides_logement/7733_DOSSIER_UNIQUE.pdf",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de la Saône-et-Loire.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de la Saône-et-Loire, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D72: {
      provider: {
        imgSrc: "logo_cd72.png",
      },
      label: "Aide au maintien dans votre logement de la Sarthe",
      link: "https://www.sarthe.fr/insertion-logement/logement-habitat/fonds-de-solidarite-logement",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de la Sarthe.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de la Sarthe, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D74: {
      provider: {
        imgSrc: "logo_cd74.png",
      },
      label: "Aide au maintien dans votre logement de la Haute-Savoie",
      link: "https://www.hautesavoie.fr/informations-services/logement",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de la Haute-Savoie.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de la Haute-Savoie, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D75: {
      provider: {
        imgSrc: "logo_cd75.png",
      },
      label: "Aide au maintien dans votre logement de Paris",
      link: "https://www.paris.fr/pages/aides-au-logement-3827#le-fonds-de-solidarite-pour-le-logement-de-paris",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de Paris.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de Paris, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D76: {
      provider: {
        imgSrc: "logo_cd76.png",
      },
      label: "Aide au maintien dans votre logement de Seine-Maritime",
      link: "https://www.seinemaritime.fr/vos-services/habitat-logement/le-plan-departemental-daction-pour-le-logement-des-personnes-defavorisees/fonds-solidarite-logement.html",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de Seine-Maritime.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de Seine-Maritime, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D77: {
      provider: {
        imgSrc: "logo_cd77.png",
      },
      label: "Aide au maintien dans votre logement de Seine-et-Marne",
      link: "https://www.seine-et-marne.fr/Solidarite/Logement/Aides-au-logement",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de Seine-et-Marne.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de Seine-et-Marne, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D78: {
      provider: {
        imgSrc: "logo_cd78.png",
      },
      label: "Aide au maintien dans votre logement des Yvelines",
      link: "https://www.yvelines.fr/solidarite/adultes-en-difficulte/logement/acces-et-maintien-logement/",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département des Yvelines.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département des Yvelines, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D80: {
      provider: {
        imgSrc: "logo_cd80.png",
      },
      label: "Aide au maintien dans votre logement de la Somme",
      link: "https://www.somme.fr/services/rsa-insertion/les-aides-a-linsertion/le-fonds-de-solidarite-logement/",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de la Somme.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de la Somme, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D83: {
      provider: {
        imgSrc: "logo_cd83.png",
      },
      label: "Aide au maintien dans votre logement du Var",
      link: "https://www.var.fr/social/insertion/fonds-de-solidarite-logement",
      form: "https://www.var.fr/documents/20142/2028094/MAINTIEN+A4.pdf/7623c7eb-daa0-cf0e-aabf-cd701c8c6d1d",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département du Var.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département du Var, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D84: {
      provider: {
        imgSrc: "logo_cd84.png",
      },
      label: "Aide au maintien dans votre logement du Vaucluse",
      link: "http://www.vaucluse.fr/habitat-logement/les-aides-aux-particuliers/le-fonds-de-solidarite-pour-le-logement-1531.html",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département du Vaucluse.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département du Vaucluse, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D85: {
      provider: {
        imgSrc: "logo_cd85.png",
      },
      label: "Aide au maintien dans votre logement de la Vendée",
      link: "http://www.vendee.fr/Territoire-et-environnement/Habitat-Logement/42264-Habitat-Logement/L-accompagnement-des-menages-en-difficultes",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de la Vendée.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de la Vendée, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D86: {
      provider: {
        imgSrc: "logo_cd86.png",
      },
      label: "Aide au maintien dans votre logement de la Vienne",
      link: "http://www.fsl86.fr/",
      form: "http://www.fsl86.fr/images/pdf/declaration_de_ressources.pdf",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de la Vienne.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de la Vienne, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D91: {
      provider: {
        imgSrc: "logo_cd91.png",
      },
      label: "Aide au maintien dans votre logement de l’Essonne",
      link: "http://www.essonne.fr/le-departement/les-organismes-associes/le-fonds-de-solidarite-pour-le-logement-fsl/",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de l’Essonne.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de l’Essonne, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D92: {
      provider: {
        imgSrc: "logo_cd92.png",
      },
      label: "Aide au maintien dans votre logement des Hauts-de-Seine",
      link: "https://www.78-92.fr/annuaire/aides-et-services/detail/fonds-de-solidarite-logement-fsl",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département des Hauts-de-Seine.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département des Hauts-de-Seine, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D93: {
      provider: {
        imgSrc: "logo_cd93.png",
      },
      label: "Aide au maintien dans votre logement de Seine-Saint-Denis",
      description: `Dans le cadre du Fonds de Solidarité Logement du département de Seine-Saint-Denis, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).`,
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de Seine-Saint-Denis.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      link: "https://seinesaintdenis.fr/Fonds-de-solidarite-logement.html",
      instructions:
        "https://seinesaintdenis.fr/Fonds-de-solidarite-logement.html#comment_en_formuler_la_demande",
    },
    D94: {
      provider: {
        imgSrc: "logo_cd94.png",
      },
      label: "Aide au maintien dans votre logement du Val-de-Marne",
      link: "https://www.valdemarne.fr/a-votre-service/habitat/logement/aides-aux-impayes-locatifs-fsh",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département du Val-de-Marne.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département du Val-de-Marne, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D95: {
      provider: {
        imgSrc: "logo_cd95.png",
      },
      label: "Aide au maintien dans votre logement du Val d’Oise",
      link: "https://www.valdoise.fr/aide-et-service/11/6-fonds-de-solidarite-logement-aide-a-l-acces-au-logement.htm",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département du Val d’Oise.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département du Val d’Oise, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
    D974: {
      provider: {
        imgSrc: "logo_cd974.png",
      },
      label: "Aide au maintien dans votre logement de la Réunion",
      link: "https://www.departement974.fr/aide/aide-habitat-fonds-de-solidarite-pour-logement-fsl#aidesimpayes",
      conditions: [
        "Occuper, à titre de résidence principale, un logement sur le territoire du département de la Réunion.",
        "<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.",
      ],
      description:
        "Dans le cadre du Fonds de Solidarité Logement du département de la Réunion, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).",
    },
  },
}
