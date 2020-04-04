function fsl_generator({ prefix, label, code, resources }) {
    return {
        imgSrc: `logo_cd${code}.png`,
        repository: 'france-local',
        label: `Département ${label}`,
        interactionWithNationalPrestationsHandled: true,
        prefix: 'de',
        prestations: {
            [`${prefix}_fonds_solidarite_logement_aide_maintien_eligibilite`]: {
                ...resources,
                label: 'aide au maintien dans votre logement',
                conditions: [
                    `Occuper, à titre de résidence principale, un logement sur le territoire du département ${label}.`,
                    'Satisfaire les conditions financières décrites dans le règlement.',
                ],
                description: `Dans le cadre du Fonds de Solidarité Logement du département ${label}, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).`,
                entity: 'menage',
                type: 'bool',
                prefix: 'une',
            },
        },
    }
}

function fsl_generator_metropole({ prefix, label, code, resources }) {
    return {
        imgSrc: 'logo_cd06.png',//`logo_${code}_metropole.png`,
        repository: 'france-local',
        label,
        interactionWithNationalPrestationsHandled: true,
        prefix,
        prestations: {
            [`${code}_metropole_fonds_solidarite_logement_aide_maintien_eligibilite`]: {
                ...resources,
                label: 'aide au maintien dans votre logement',
                conditions: [
                    `Occuper, à titre de résidence principale, un logement sur le territoire ${prefix} ${label}.`,
                    'Satisfaire les conditions financières décrites dans le règlement.',
                ],
                description: `Dans le cadre du Fonds de Solidarité Logement ${prefix} ${label}, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).`,
                entity: 'menage',
                type: 'bool',
                prefix: 'une',
            },
        },
    }
}

module.exports = {
    departement_ain: fsl_generator({
        prefix: 'ain',
        label: 'de l’Ain',
        code: '01',
        resources: {
            link: 'https://www.ain.fr/solutions/fond-solidarite-logement-maintien-dans-le-logement/',
        }
    }),
    departement_aisne: fsl_generator({
        prefix: 'aisne',
        label: 'de l’Aisne',
        code: '02',
        resources: {
            link: 'https://aisne.com/aides/aide-a-lacces-au-logement-fonds-de-solidarite-pour-le-logement-fsl',
        }
    }),
    departement_allier: fsl_generator({
        prefix: 'allier',
        label: 'de l’Allier',
        code: '03',
        resources: {
            link: 'http://www.caf.fr/allocataires/caf-de-l-allier/offre-de-service/logement-et-cadre-de-vie/le-fonds-de-solidarite-pour-le-logement-fsl',
            instructions: 'http://modules.allier.fr/guide3/contenu.asp?iddossier=11612',
        }
    }),
    departement_alpes_de_haute_provence: fsl_generator({
        prefix: 'alpes_de_haute_provence',
        label: 'des Alpes-de-Haute-Provence',
        code: '04',
        resources: {
            link: 'http://www.mondepartement04.fr/rechercher-plus-daides/habitat-logement-urbanisme/fsl-masp/fonds-social-daide-au-logement-fsl.html',
            form: 'http://www.mondepartement04.fr/fileadmin/mediatheque/cg04/formulaire/Insertion/Acc%C3%A8s_au_logement/IMPRIME_FSL_12-2019.pdf',
            instructions: 'http://www.mondepartement04.fr/rechercher-plus-daides/habitat-logement-urbanisme/fsl-masp/mesure-daccompagnement-social-personnalise.html#c6266',
        }
    }),
    departement_hautes_alpes: fsl_generator({
        prefix: 'hautes_alpes',
        label: 'des Hautes Alpes',
        code: '05',
        resources: {
            link: 'https://www.hautes-alpes.fr/4996-fonds-de-solidarite-pour-le-logement-fsl-.htm',
            instructions: 'https://www.hautes-alpes.fr/4996-fonds-de-solidarite-pour-le-logement-fsl-.htm',
        }
    }),
    departement_alpes_maritimes: fsl_generator({
        prefix: 'alpes_maritimes',
        label: 'des Alpes Maritimes',
        code: '06',
        resources: {
            link: 'https://www.departement06.fr/aides-a-l-insertion/fsl-2607.html',
        }
    }),
    departement_ardeche: fsl_generator({
        prefix: 'ardeche',
        label: 'de l’Ardèche',
        code: '07',
        resources: {
            link: 'http://www.ardeche.fr/132-fonds-unique-logement.htm',
            form: 'http://www.ardeche.fr/include/viewfilesecure.php?idtf=3609&path=cb%2F3609_762_formulaires-ful-2015BD.pdf',
        }
    }),
    departement_ardennes: fsl_generator({
        prefix: 'ardennes',
        label: 'de l’Ardennes',
        code: '08',
        resources: {
            link: 'https://cd08.fr/aides-et-subventionss/fonds-de-solidarite-logement-fsl-formulaire-unique-de-demande-de-subvention',
            form: 'https://cd08.fr/sites/default/files/maj2020_compilation_formulaires_fsl.pdf',
        }
    }),
    departement_bouches_du_rhone: fsl_generator({
        prefix: 'bouches_du_rhone',
        label: 'Des Bouches-du-Rhône',
        code: '13',
        resources: {
            link: 'https://www.departement13.fr/nos-actions/logement/les-dispositifs/le-fonds-de-solidarite-pour-le-logement/',
        }
    }),
    departement_calvados: fsl_generator({
        prefix: 'calvados',
        label: 'du Calvados',
        code: '14',
        resources: {
            link: 'https://www.calvados.fr/accueil/le-departement/solidarite---familles/aide-au-logement/fsl.html',
            instructions: 'https://www.calvados.fr/contents/fiche/fiches-aide--services/aides-financieres-pour-le-mainti.html',
        }
    }),
    departement_doubs: fsl_generator({
        prefix: 'doubs',
        label: 'du Doubs',
        code: '25',
        resources: {
            link: 'https://www.doubs.fr/index.php/vous-accompagner/36-particuliers/2242-le-fonds-de-solidarite-logement-fsl',
            form: 'http://www.adil25.org/fileadmin/user_upload/PDAHLPD/Grand_public/imprime_aide_financiere_individuelle_FSL_actualise.pdf',
            instructions: 'http://www.adil25.org/le-pdalhpd/documentation/le-reglement-interieur-du-fsl-et-formulaire-de-demande-daide.html',
        }
    }),
    departement_finistere: fsl_generator({
        prefix: 'finistere',
        label: 'du Finistère',
        code: '29',
        resources: {
            link: 'https://www.finistere.fr/A-votre-service/Habitat-Logement/Acces-et-maintien-dans-un-logement-FSL',
        }
    }),
    departement_haute_garonne: fsl_generator({
        prefix: 'haute_garonne',
        label: 'de la Haute-Garonne',
        code: '31',
        resources: {
            link: 'https://www.haute-garonne.fr/aide/fonds-de-solidarite-logement-fsl',
        }
    }),
    departement_gironde: fsl_generator({
        prefix: 'gironde',
        label: 'de la Gironde',
        code: '33',
        resources: {
            link: 'http://www.fsl33.org/html/aide_maitien.htm',
            instructions: 'http://www.fsl33.org/pdf/FormNoticeMaintien2016.pdf',
        }
    }),
    departement_herault: fsl_generator({
        prefix: 'herault',
        label: 'de l’Hérault',
        code: '34',
        resources: {
            link: 'http://www.herault.fr/aides-financieres-fsl',
        }
    }),
    departement_ille_et_vilaine: fsl_generator({
        prefix: 'ille_et_vilaine',
        label: 'd’Ille-et-Vilaine',
        code: '35',
        resources: {
            link: 'https://www.ille-et-vilaine.fr/demande-fsl',
            form: 'https://www.ille-et-vilaine.fr/sites/default/files/asset/document/fo-psh-0818-001_imprimeuniquemasques_form_ext_0.pdf',
        }
    }),
    departement_isere: fsl_generator({
        prefix: 'isere',
        label: 'd’Isère',
        code: '38',
        resources: {
            link: 'https://www.isere.fr/aides-au-logement',
            form: 'https://www.isere.fr/sites/default/files/demande-directe.pdf',
        }
    }),
    departement_loire: fsl_generator({
        prefix: 'loire',
        label: 'de la Loire',
        code: '42',
        resources: {
            link: 'https://www.loire.fr/jcms/lw_1024718/le-fonds-de-solidarite-pour-le-logement-fsl',
        }
    }),
    departement_loire_atlantique: fsl_generator({
        prefix: 'loire_atlantique',
        label: 'de la Loire Atlantique',
        code: '44',
        resources: {
            link: 'https://www.loire-atlantique.fr/jcms/classement-des-contenus/guides-aides/vous-etes/parent-/-famille/fonds-de-solidarite-pour-le-logement-fsl-les-aides-a-l-acces-ou-au-maintien-dans-votre-logement-fr-t1_16291',
            form: 'https://www.loire-atlantique.fr/upload/docs/application/pdf/2020-03/formulaire_de_demande_daide_au_logement_2020-03-09_14-37-8_451.pdf',
        }
    }),
    departement_maine_et_loire: fsl_generator({
        prefix: 'maine_et_loire',
        label: 'du Maine-et-Loire',
        code: '49',
        resources: {
            link: 'https://www.maine-et-loire.fr/aides-et-services/logement-et-habitat/fonds-solidarite-logement/aides-pour-le-maintien-dans-le-logement',
        }
    }),
    departement_mayenne: fsl_generator({
        prefix: 'mayenne',
        label: 'de la Mayenne',
        code: '53',
        resources: {
            link: 'https://www.lamayenne.fr/service/le-fonds-solidarite-pour-le-logement',
        }
    }),
    departement_moselle: fsl_generator({
        prefix: 'moselle',
        label: 'de la Moselle',
        code: '57',
        resources: {
            link: 'https://www.moselle.fr/jcms/pl_12538/fr/fonds-solidarite-logement-fsl',
            form: 'https://www.moselle.fr/upload/docs/application/pdf/2018-11/demande_dintervention_du_fsl_-_acces_impayes_locatifs.pdf',
        }
    }),
    departement_pas_de_calais: fsl_generator({
        prefix: 'pas_de_calais',
        label: 'du Pas-de-Calais',
        code: '62',
        resources: {
            link: 'https://www.pasdecalais.fr/Solidarite-Sante/Reglement-Departemental-d-Aide-Sociale/Le-developpement-des-solidarites/Le-logement-des-personnes-defavorisees-et-le-Fonds-de-Solidarite-Logement/L-aide-financiere-Fonds-Solidarite-Logement-volet-acces-logement-identifie',
        }
    }),
    departement_puy_de_dôme: fsl_generator({
        prefix: 'puy_de_dôme',
        label: 'du Puy-de-Dôme',
        code: '63',
        resources: {
            link: 'https://www.puy-de-dome.fr/social/logement-habitat/fonds-solidarite-logement.html',
            instructions: 'https://www.puy-de-dome.fr/fileadmin/user_upload/CD63-2020-RI-FSL.pdf',
        }
    }),
    departement_bas_rhin: fsl_generator({
        prefix: 'bas_rhin',
        label: 'du Bas-Rhin',
        code: '67',
        resources: {
            link: 'https://www.bas-rhin.fr/action-sociale-et-sante/difficultes-logement/',
        }
    }),
    departement_rhone: fsl_generator({
        prefix: 'rhone',
        label: 'du Rhône',
        code: '69',
        resources: {
            link: 'https://www.rhone.fr/solidarites/insertion/logement/le_fonds_de_solidarite_logement',
            form: '',
            teleservice: '',
            instructions: '',
        }
    }),
    departement_paris: fsl_generator({
        prefix: 'paris',
        label: 'de Paris',
        code: '75',
        resources: {
            link: 'https://www.paris.fr/pages/aides-au-logement-3827#le-fonds-de-solidarite-pour-le-logement-de-paris',
        }
    }),
    departement_seine_maritime: fsl_generator({
        prefix: 'seine_maritime',
        label: 'de Seine-Maritime',
        code: '76',
        resources: {
            link: 'https://www.seinemaritime.fr/vos-services/habitat-logement/le-plan-departemental-daction-pour-le-logement-des-personnes-defavorisees/fonds-solidarite-logement.html',
        }
    }),
    departement_seine_et_marne: fsl_generator({
        prefix: 'seine_et_marne',
        label: 'de Seine-et-Marne',
        code: '77',
        resources: {
            link: 'https://www.seine-et-marne.fr/Solidarite/Logement/Aides-au-logement',
        }
    }),
    departement_var: fsl_generator({
        prefix: 'var',
        label: 'du Var',
        code: '83',
        resources: {
            link: 'https://www.var.fr/social/insertion/fonds-de-solidarite-logement',
            form: 'https://www.var.fr/documents/20142/2028094/MAINTIEN+A4.pdf/7623c7eb-daa0-cf0e-aabf-cd701c8c6d1d',
        }
    }),
    departement_vendee: fsl_generator({
        prefix: 'vendee',
        label: 'de la Vendée',
        code: '85',
        resources: {
            link: 'http://www.vendee.fr/Territoire-et-environnement/Habitat-Logement/42264-Habitat-Logement/L-accompagnement-des-menages-en-difficultes',
            instructions: '',
        }
    }),
    departement_vienne: fsl_generator({
        prefix: 'vienne',
        label: 'de la Vienne',
        code: '86',
        resources: {
            link: 'http://www.fsl86.fr/',
            form: 'http://www.fsl86.fr/images/pdf/declaration_de_ressources.pdf',
            instructions: '',
        }
    }),
    departement_seine_saint_denis: fsl_generator({
        prefix: 'seine_saint_denis',
        label: 'de Seine-Saint-Denis',
        code: '93',
        resources: {
            link: 'https://seinesaintdenis.fr/Fonds-de-solidarite-logement.html',
        }
    }),
    departement_val_de_marne: fsl_generator({
        prefix: 'val_de_marne',
        label: 'du Val-de-Marne',
        code: '94',
        resources: {
            link: 'https://www.valdemarne.fr/a-votre-service/habitat/logement/aides-aux-impayes-locatifs-fsh',
        }
    }),
    departement_val_d_oise: fsl_generator({
        prefix: 'val_d_oise',
        label: 'du Val d’Oise',
        code: '95',
        resources: {
            link: 'https://www.valdoise.fr/aide-et-service/11/6-fonds-de-solidarite-logement-aide-a-l-acces-au-logement.htm',
        }
    }),
    departement_la_reunion: fsl_generator({
        prefix: 'la_reunion',
        label: 'de la Réunion',
        code: '974',
        resources: {
            link: 'https://www.departement974.fr/aide/aide-habitat-fonds-de-solidarite-pour-logement-fsl#aidesimpayes',
        }
    }),
}
