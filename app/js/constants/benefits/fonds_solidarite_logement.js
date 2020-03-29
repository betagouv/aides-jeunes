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

module.exports = {
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
    departement_seine_saint_denis: fsl_generator({
        prefix: 'seine_saint_denis',
        label: 'de Seine-Saint-Denis',
        code: '93',
        resources: {
            link: 'https://seinesaintdenis.fr/Fonds-de-solidarite-logement.html',
        }
    }),
    departement_var_de_marne: fsl_generator({
        prefix: 'var_de_marne',
        label: 'du Val-de-Marne',
        code: '94',
        resources: {
            link: 'https://www.valdemarne.fr/a-votre-service/habitat/logement/aides-aux-impayes-locatifs-fsh',
        }
    }),
}
