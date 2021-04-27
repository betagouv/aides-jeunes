const financial_requirement = '<strong>Satisfaire les conditions de ressources</strong> décrites dans le règlement.'

const provider_commun_attributes = {
    repository: 'france-local',
}

const aid_common_attributes = {
    label: 'aide au maintien dans votre logement',
    entity: 'menages',
    type: 'bool',
    prefix: 'une',
    symbol: 'fa-exclamation-triangle',
    top: 6,
}

function fsl_generator({ prefix, label, code, resources }) {
    return {
        imgSrc: `logo_cd${code}.png`,
        ...provider_commun_attributes,
        label: `Département ${label}`,
        interactionWithNationalPrestationsHandled: true,
        prefix: 'de',
        prestations: {
            [`${prefix}_fonds_solidarite_logement_aide_maintien_eligibilite`]: {
                ...aid_common_attributes,
                ...resources,
                conditions: [
                    `Occuper, à titre de résidence principale, un logement sur le territoire du département ${label}.`,
                    financial_requirement,
                ],
                description: `Dans le cadre du Fonds de Solidarité Logement du département ${label}, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).`,
            },
        },
    }
}

function fsl_generator_metropole({ prefix, label, code, resources }) {
    return {
        imgSrc: `logo_${code}_metropole.png`,
        ...provider_commun_attributes,
        label,
        interactionWithNationalPrestationsHandled: true,
        prefix,
        prestations: {
            [`${code}_metropole_fonds_solidarite_logement_aide_maintien_eligibilite`]: {
                ...aid_common_attributes,
                ...resources,
                conditions: [
                    `Occuper, à titre de résidence principale, un logement sur le territoire ${prefix} ${label}.`,
                    financial_requirement,
                ],
                description: `Dans le cadre du Fonds de Solidarité Logement ${prefix} ${label}, des aides financières sont mises en place pour vous aider à rester dans votre logement et à payer vos factures liées à votre logement (eau, électricité, etc.).`,
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
    nice_metropole: fsl_generator_metropole({
        prefix: 'de la',
        label: 'Métropole Nice Côte d’Azur',
        code: 'nice',
        resources: {
            link: 'http://www.nicecotedazur.org/habitat-urbanisme/le-logement/fonds-de-solidarit%C3%A9-pour-le-logement',
            form: 'http://www.nicecotedazur.org/uploads/media_items/locataire.original.pdf',
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
    departement_ariege: fsl_generator({
        prefix: 'ariege',
        label: 'de l’Ariège',
        code: '09',
        resources: {
            link: 'http://www.ariege.fr/Etre-solidaire/Logement/Le-Fonds-unique-Habitat-FUH',
            instructions: 'http://www.ariege.fr/Etre-solidaire/Logement/Rencontrer-un-travailleur-social',
        }
    }),
    departement_aude: fsl_generator({
        prefix: 'aude',
        label: 'de l’Aude',
        code: '11',
        resources: {
            link: 'https://www.aude.fr/je-beneficie-du-fonds-unique-logement-ful',
        }
    }),
    departement_aveyron: fsl_generator({
        prefix: 'aveyron',
        label: 'de l’Aveyron',
        code: '12',
        resources: {
            link: 'https://aveyron.fr/pages/logement/des%20aides%20pour%20acc%C3%A9der%20%C3%A0%20un%20logement%20ou%20sy%20maintenir',
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
    departement_cantal: fsl_generator({
        prefix: 'cantal',
        label: 'du Cantal',
        code: '15',
        resources: {
            link: 'http://www.cantal.fr/fonds-de-solidarite-pour-le-logement/',
        }
    }),
    departement_charente: fsl_generator({
        prefix: 'charente',
        label: 'de Charente',
        code: '16',
        resources: {
            link: 'https://www.charentesolidarites.org/index.php/component/sppagebuilder/8-le-fsl.html',
            instructions: 'https://www.charentesolidarites.org/index.php/component/sppagebuilder/8-le-fsl.html',
        }
    }),
    departement_charente_maritime: fsl_generator({
        prefix: 'charente_maritime',
        label: 'de Charente-Maritime',
        code: '17',
        resources: {
            link: 'https://la.charente-maritime.fr/fiches-aides/fonds-solidarite-pour-logement',
        }
    }),
    departement_cher: fsl_generator({
        prefix: 'cher',
        label: 'du Cher',
        code: '18',
        resources: {
            link: 'https://www.departement18.fr/Logement-habitat',
        }
    }),
    departement_correze: fsl_generator({
        prefix: 'correze',
        label: 'de Corrèze',
        code: '19',
        resources: {
            link: 'https://www.correze.fr/nos-missions/habitat/les-aides-sociales-pour-le-logement',
            instructions: 'https://www.correze.fr/services-en-ligne/les-aides/aide-aux-travailleurs-de-condition-modeste',
        }
    }),
    departement_cotes_d_or: fsl_generator({
        prefix: 'cotes_d_or',
        label: 'de la Côte-d’Or',
        code: '21',
        resources: {
            link: 'https://www.cotedor.fr/votre-service/insertion/accompagnement-financier/accompagnement-et-aides-lacces-ou-au-maintien-dans',
        }
    }),
    departement_dordogne: fsl_generator({
        prefix: 'dordogne',
        label: 'de la Dordogne',
        code: '24',
        resources: {
            link: 'https://www.dordogne.fr/servir_les_citoyens/solidarite/logement_/_rsa/logement/aide_financiere_du_fsl_pour_l_acces_au_logement/262-2',
            instructions: 'https://www.dordogne.fr/logement/aide_financiere_du_fsl_pour_des_impayes_de_loyer_ou_de_charges/262-3',
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
    departement_drome: fsl_generator({
        prefix: 'drome',
        label: 'de la Drôme',
        code: '26',
        resources: {
            link: 'https://www.ladrome.fr/mon-quotidien/logement/en-cas-de-difficultes/les-aides-aux-locataires/',
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
    brest_metropole: fsl_generator_metropole({
        prefix: 'de',
        label: 'Brest Métropole',
        code: 'brest',
        resources: {
            link: 'https://infosociale.finistere.fr/etablissement/brest-metropole-fsl-fonds-de-solidarite-logement/',
            form: 'https://infosociale.finistere.fr/wp-content/uploads/2018/06/CD29_imprime_unique_jlt2019.pdf',
            instructions: 'https://infosociale.finistere.fr/wp-content/uploads/2019/07/pb_R%C3%A8glement-FSL-m%C3%A9tropolitain-2019.pdf',
        }
    }),
    departement_gard: fsl_generator({
        prefix: 'gard',
        label: 'du Gard',
        code: '30',
        resources: {
            link: 'https://www.gard.fr/au-quotidien/bien-se-loger/locataires/fonds-solidarite-logement.html',
            instructions: 'https://www.gard.fr/fileadmin/mediatheque/documents_2020/logement/doc_fond_solidarite_logement-2020.pdf',
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
    toulouse_metropole: fsl_generator_metropole({
        prefix: 'de',
        label: 'Toulouse Métropole',
        code: 'toulouse',
        resources: {
            link: 'https://www.toulouse-metropole.fr/missions/solidarite/fonds-de-solidarite-logement-fsl-',
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
    departement_indre: fsl_generator({
        prefix: 'indre',
        label: 'de l’Indre',
        code: '36',
        resources: {
            link: 'https://www.adil36.org/aides-locales/locataires-en-difficultes',
        }
    }),
    departement_indre_et_loire: fsl_generator({
        prefix: 'indre_et_loire',
        label: 'de l’Indre-et-Loire',
        code: '37',
        resources: {
            link: 'https://www.touraine.fr/mes-services-au-quotidien/enfance-famille/lacces-au-logement.html',
            form: 'https://www.touraine.fr/files/touraine/documents/etre-accompagne/missions/impr_FSL_interactif_departement.pdf',
        }
    }),
    tours_metropole: fsl_generator_metropole({
        prefix: 'de',
        label: 'Tours Métropole Val de Loire',
        code: 'tours',
        resources: {
            link: 'https://www.touraine.fr/mes-services-au-quotidien/enfance-famille/lacces-au-logement.html',
            form: 'https://www.touraine.fr/files/touraine/documents/etre-accompagne/missions/impr_FSL_interactif_departement.pdf',
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
    departement_landes: fsl_generator({
        prefix: 'landes',
        label: 'des Landes',
        code: '40',
        resources: {
            link: 'https://www.landes.fr/logement',
        }
    }),
    departement_loir_et_cher: fsl_generator({
        prefix: 'loir_et_cher',
        label: 'du Loir-et-Cher',
        code: '41',
        resources: {
            link: 'https://www.departement41.fr/services-en-ligne/etre-accompagne/insertion-habitat/aide-au-logement/',
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
    orleans_metropole: fsl_generator_metropole({
        prefix: 'de',
        label: 'Orléans Métropole',
        code: 'orleans',
        resources: {
            link: 'http://www.orleans-metropole.fr/1679/fonds-unifie-logement-ful.htm',
            form: 'http://www.orleans-metropole.fr/fileadmin/orleans/MEDIA/document/urbanisme/habitat/FUL_-formulaires_de_demande.pdf',
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
    departement_manche: fsl_generator({
        prefix: 'manche',
        label: 'de la Manche',
        code: '50',
        resources: {
            link: 'https://www.manche.fr/conseil-departemental/FSL.aspx',
            form: 'https://www.manche.fr/conseil-departemental/iso_album/dossier_de_demande_logement.pdf',
        }
    }),
    departement_marne: fsl_generator({
        prefix: 'marne',
        label: 'de la Marne',
        code: '51',
        resources: {
            link: 'http://www.marne.fr/les-actions/sante-et-social/logement-social/acces-et-maintien-dans-le-logement-le-fonds-solidarite',
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
    departement_morbihan: fsl_generator({
        prefix: 'morbihan',
        label: 'du Morbihan',
        code: '56',
        resources: {
            link: 'https://www.morbihan.fr/les-services/logement-habitat/fonds-de-solidarite-logement-fsl/',
            form: 'https://www.morbihan.fr/fileadmin/Les_services/Aides_departementales/20_morbihan_5_H08_FSL_maintien_logement.pdf',
            instructions: 'https://www.morbihan.fr/les-services/aides-departementales/toutes-nos-aides/toutes-nos-aides/?tx_cg56aidesdep_guidedesaides[selectMotsCles]=fsl&tx_cg56aidesdep_guidedesaides[action]=resultsNoCache&tx_cg56aidesdep_guidedesaides[controller]=Aide#hautDePage',
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
    departement_nord: fsl_generator({
        prefix: 'nord',
        label: 'du Nord',
        code: '59',
        resources: {
            link: 'https://lenord.fr/jcms/preprd1_145072/le-fonds-de-solidarite-pour-le-logement',
            instructions: 'https://lenord.fr/jcms/prd1_334245/aide-au-maintien-dans-le-logement?thematique=&typePublic=&motsCles=maintien',
        }
    }),
    lille_metropole: fsl_generator_metropole({
        prefix: 'de la',
        label: 'Métropole européenne de Lille',
        code: 'lille',
        resources: {
            link: 'https://www.lillemetropole.fr/votre-metropole/competences/amenagement-du-territoire/logement/le-fonds-de-solidarite-logement',
            form: 'https://www.lillemetropole.fr/sites/default/files/2019-12/Volet%20demandeur%20maintien.pdf',
        }
    }),
    departement_oise: fsl_generator({
        prefix: 'oise',
        label: 'de l’Oise',
        code: '60',
        resources: {
            link: 'http://www.oise.fr/guide-des-aides/aide/fonds-departemental-de-solidarite/',
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
    departement_pyrenees_atlantiques: fsl_generator({
        prefix: 'pyrenees_atlantiques',
        label: 'des Pyrénées-Atlantiques',
        code: '64',
        resources: {
            link: 'http://www.le64.fr/solidarite/logement-et-habitat/accompagnement-des-publics/favoriser-lacces-et-le-maintien-dans-les-lieux.html',
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
    departement_haut_rhin: fsl_generator({
        prefix: 'haut_rhin',
        label: 'du Haut-Rhin',
        code: '68',
        resources: {
            link: 'https://www.haut-rhin.fr/content/des-aides-pour-votre-logement',
        }
    }),
    departement_rhone: fsl_generator({
        prefix: 'rhone',
        label: 'du Rhône',
        code: '69',
        resources: {
            link: 'https://www.rhone.fr/solidarites/insertion/logement/le_fonds_de_solidarite_logement',
        }
    }),
    lyon_metropole: fsl_generator_metropole({
        prefix: 'de la',
        label: 'Métropole de Lyon',
        code: 'lyon',
        resources: {
            link: 'https://www.grandlyon.com/services/aides-fonds-solidarite-logement.html',
            instructions: 'https://www.grandlyon.com/services/aides-fonds-solidarite-logement.html',
        }
    }),
    departement_saone_et_loire: fsl_generator({
        prefix: 'saone_et_loire',
        label: 'de la Saône-et-Loire',
        code: '71',
        resources: {
            link: 'https://www.saoneetloire71.fr/accueil/vous-etes-proprietaire/locataire/rester-dans-mon-logement',
            form: 'https://www.saoneetloire71.fr/fileadmin/Que_peut-on_faire_pour_vous__/Vous_etes_proprietaire_locataire/Aides_logement/7733_DOSSIER_UNIQUE.pdf',
        }
    }),
    departement_sarthe: fsl_generator({
        prefix: 'sarthe',
        label: 'de la Sarthe',
        code: '72',
        resources: {
            link: 'https://www.sarthe.fr/insertion-logement/logement-habitat/fonds-de-solidarite-logement',
        }
    }),
    departement_haute_savoie: fsl_generator({
        prefix: 'haute_savoie',
        label: 'de la Haute-Savoie',
        code: '74',
        resources: {
            link: 'https://www.hautesavoie.fr/informations-services/logement',
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
    departement_yvelines: fsl_generator({
        prefix: 'yvelines',
        label: 'des Yvelines',
        code: '78',
        resources: {
            link: 'https://www.yvelines.fr/solidarite/adultes-en-difficulte/logement/acces-et-maintien-logement/',
        }
    }),
    departement_somme: fsl_generator({
        prefix: 'somme',
        label: 'de la Somme',
        code: '80',
        resources: {
            link: 'https://www.somme.fr/services/rsa-insertion/les-aides-a-linsertion/le-fonds-de-solidarite-logement/',
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
    departement_vaucluse: fsl_generator({
        prefix: 'vaucluse',
        label: 'du Vaucluse',
        code: '84',
        resources: {
            link: 'http://www.vaucluse.fr/habitat-logement/les-aides-aux-particuliers/le-fonds-de-solidarite-pour-le-logement-1531.html',
        }
    }),
    departement_vendee: fsl_generator({
        prefix: 'vendee',
        label: 'de la Vendée',
        code: '85',
        resources: {
            link: 'http://www.vendee.fr/Territoire-et-environnement/Habitat-Logement/42264-Habitat-Logement/L-accompagnement-des-menages-en-difficultes',
        }
    }),
    departement_vienne: fsl_generator({
        prefix: 'vienne',
        label: 'de la Vienne',
        code: '86',
        resources: {
            link: 'http://www.fsl86.fr/',
            form: 'http://www.fsl86.fr/images/pdf/declaration_de_ressources.pdf',
        }
    }),
    departement_essonne: fsl_generator({
        prefix: 'essonne',
        label: 'de l’Essonne',
        code: '91',
        resources: {
            link: 'http://www.essonne.fr/le-departement/les-organismes-associes/le-fonds-de-solidarite-pour-le-logement-fsl/',
        }
    }),
    departement_hauts_de_seine: fsl_generator({
        prefix: 'hauts_de_seine',
        label: 'des Hauts-de-Seine',
        code: '92',
        resources: {
            link: 'https://www.78-92.fr/annuaire/aides-et-services/detail/fonds-de-solidarite-logement-fsl',
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
