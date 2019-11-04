'use strict';

var droitsDescription = {
    'prestationsNationales': {
        'assurance_retraite': {
            'label': 'Assurance retraite',
            'imgSrc': 'logo_assurance_retraite.png',
            'etablissements': ['carsat'],
            'prestations': {
                'aspa': {
                    'label': 'Allocation de solidarité aux personnes âgées',
                    'description': 'L’allocation de solidarité aux personnes âgées (Aspa) est une prestation accordée aux personnes retraitées ayant de faibles ressources. Elle est versée tous les mois par la Carsat (ou la MSA si vous dépendez du régime agricole). Elle s’ajoute, dans une certaine limite, aux revenus personnels. Elle remplace le minimum vieillesse depuis 2006.',
                    'conditions': [
                        'Résider <abbr title="Métropole, Guadeloupe, Guyane, Martinique ou Réunion">en France</abbr> plus de <abbr title="180 jours, potentiellement discontinus">6 mois</abbr> cette année.',
                        'L’ASPA n’est pas compatible avec l’AAH. Avant de faire votre demande, renseignez-vous auprès de votre MDPH : le basculement vers le régime de l’ASPA n’est plus obligatoire pour les personnes qui atteignent depuis 2017 les 62 ans.',
                        'Avoir demandé toutes les retraites (générale, réversion, complémentaire…) auxquelles vous avez droit.',
                        'Votre conjoint·e doit avoir demandé toutes les retraites (générale, réversion, complémentaire…) auxquelles il ou elle a droit.'
                    ],
                    'link': 'https://www.service-public.fr/particuliers/vosdroits/F16871',
                    'form': 'https://www.lassuranceretraite.fr/portail-info/files/live/sites/pub-bootstrap/files/Guides%20et%20formulaires/demande-aspa.pdf',
                    'forms' : {
                        'cnav': 'https://www.lassuranceretraite.fr/portail-info/files/live/sites/pub-bootstrap/files/Guides%20et%20formulaires/demande-aspa.pdf',
                        'msa': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_14953.do',
                        'rsi': 'https://www.rsi.fr/fileadmin/mediatheque/.Espace_telechargement/Formulaires/Formulaire_allocation_solidarite_personnes_agees.pdf'
                    },
                    floorAt: 10,
                },
            },
        },
        'assurance_maladie': {
            'label': 'Assurance maladie',
            'imgSrc': 'logo_assurance_maladie.png',
            'etablissements': ['cpam'],
            'prestations': {
                'css_participation_forfaitaire': {
                    'label': 'Complémentaire santé solidaire',
                    'description': 'La Complémentaire Santé Solidaire (CSS) est une protection complémentaire santé (mutuelle). Elle remplace la Complémentaire Maladie Universelle Complémentaire (CMU-C) et l’Aide au paiement d’une Complémentaire Santé (ACS) à compter du 1ᵉʳ novembre 2019. Une fois attribuée, la CSS est accordée pour un an.',
                    'conditions': [
                        'Résider <abbr title="Métropole, Guadeloupe, Guyane, Martinique ou Réunion">en France</abbr> depuis plus de 3 mois.'
                    ],
                    'link': 'https://www.service-public.fr/particuliers/vosdroits/F10027',
                    'form': 'https://www.complementaire-sante-solidaire.gouv.fr/fichier-utilisateur/fichiers/S3711%20HOMO%20COMPLEMENTAIRE%20SANTE%20SOLIDAIRE%20non%20secu%2009_2019.pdf',
                    'teleservice': 'https://assure.ameli.fr/PortailAS/appmanager/PortailAS/assure?_somtc=true&_pageID=P1_DEMANDE_CMUC',
                    'forms': {
                    },
                    extra: [{ id:'cmu_c', type:'bool' }],
                    compute: function(result, period) {
                        return (result.cmu_c && result.cmu_c[period]) ? true : (result.css_participation_forfaitaire && result.css_participation_forfaitaire[period]) || 0;
                    },
                    participation: true,
                    type: 'complex',
                },
                'asi': {
                    'label': 'Allocation supplémentaire d’invalidité',
                    'description': 'L’allocation supplémentaire d’invalidité (Asi) est une prestation accordée à certaines personnes invalides. Elle s’adresse à celles et ceux qui ont de faibles ressources et n’ont pas atteint l’âge de départ à la retraite. Elle est versée tous les mois et s’ajoute, dans une certaine limite, aux revenus personnels.',
                    'link': 'https://www.service-public.fr/particuliers/vosdroits/F16940',
                    'form': 'http://www.ameli.fr/fileadmin/user_upload/formulaires/S4151.pdf',
                    'forms' : {
                        'general': 'http://www.ameli.fr/fileadmin/user_upload/formulaires/S4151.pdf',
                        'msa': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_13435.do',
                        'rsi': 'https://www.rsi.fr/fileadmin/mediatheque/.Espace_telechargement/Formulaires/formulaire_allocation_supplementaire_invalidite.pdf',
                        'cnav': 'https://www.lassuranceretraite.fr/portail-info/files/live/sites/pub-bootstrap/files/Guides%20et%20formulaires/demande-asi.pdf'
                    },
                    'entity': 'individu', // default entity is famille
                    floorAt: 10,
                },
            },
        },
        'caf': {
            'label': 'Caisse d’allocations familiales',
            'imgSrc': 'logo_caf.png',
            'etablissements': ['caf'],
            'prestations': {
                'af': {
                    'label': 'Allocations familiales',
                    'description': 'Les allocations familiales sont réservées aux personnes ayant au moins 2 enfants de moins de 20 ans à charge. Le montant des prestations dépend des ressources, du nombre d’enfants à charge et de leurs âges. Elles sont versées tous les mois. Dans les DOM, les allocations sont versées à partir du premier enfant.',
                    'conditions': [
                        'Résider <abbr title="Métropole, Guadeloupe, Guyane, Martinique ou Réunion">en France</abbr> plus de <abbr title="180 jours, potentiellement discontinus">6 mois</abbr> cette année.'
                    ],
                    'link': 'https://www.service-public.fr/particuliers/vosdroits/F13213',
                    'form': 'https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/allocationsfamilialesouchangementdesituation',
                    'forms': {
                        'caf': 'https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/allocationsfamilialesouchangementdesituation',
                        'msa': 'http://www.msa.fr/lfr/documents/11566/132715/D%C3%A9claration+de+situation+pour+les+prestations+familiales+et+aides+au+logement.pdf'
                    },
                    'isBaseRessourcesYearMoins2': true,
                },
                'cf': {
                    'label': 'Complément familial',
                    'description': 'Le complément familial s’ajoute aux allocations familiales à partir du troisième enfant à charge âgé de plus de 3 ans et de moins de 21 ans. Il est destiné aux familles ayant de faibles ressources. Dans les DOM, le complément familial concerne tous les enfants à charge âgés entre 3 et 5 ans.',
                    'link': 'https://www.service-public.fr/particuliers/vosdroits/F13214',
                    'form': 'https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/allocationsfamilialesouchangementdesituation',
                    'forms': {
                        'caf': 'https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/allocationsfamilialesouchangementdesituation',
                        'msa': 'http://www.msa.fr/lfr/documents/11566/132715/D%C3%A9claration+de+situation+pour+les+prestations+familiales+et+aides+au+logement.pdf'
                    },
                    'isBaseRessourcesYearMoins2': true,
                },
                'asf': {
                    'label': 'Allocation de soutien familial',
                    'description': 'L’allocation de soutien familial (ASF) est destinée soit au parent qui élève seul un enfant non reconnu, privé de l’aide d’un parent ou dont l’autre parent est décédé, soit à la personne seule ou en couple qui recueille un enfant. L’ASF est versée par la Caf ou la MSA tous les mois.',
                    'conditions': [
                        'Toucher une pension alimentaire d’un montant inférieur à celui de l’ASF ou ne pas toucher en intégralité une pension alimentaire attribuée par une décision de justice. À noter : la Caf ou la MSA peut vous aider à <a target="_blank" rel="noopener" title="Agence de recouvrement des impayés de pensions alimentaires (ARIPA)" href="https://www.pension-alimentaire.caf.fr/">récupérer les sommes dues</a>.'
                    ],
                    'link': 'https://www.caf.fr/aides-et-services/s-informer-sur-les-aides/solidarite-et-insertion/l-allocation-de-soutien-familial-asf-0',
                    'form': 'https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/allocationdesoutienfamilial/!ut/p/a1/',
                    'forms': {
                        'caf': 'https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/allocationdesoutienfamilial/!ut/p/a1/',
                        'msa': 'http://www.msa.fr/lfr/documents/11566/48472/Demande+d%27allocation+de+soutien+familial+%28ASF%29.pdf'
                    },
                    floorAt: 10,
                },
                'paje_base': {
                    'label': 'Prestation d’accueil du jeune enfant – Allocation de base',
                    'description': 'L’allocation de base de la prestation d’accueil du jeune enfant (Paje) a pour objet d’aider à assurer les dépenses liées à l’entretien et l’éducation d’un enfant. Elle est destinée aux parents d’un enfant de moins de 3 ans ayant de faibles ressources. Elle est versée par la Caf ou la MSA.',
                    'conditions': [
                        'Résider <abbr title="Métropole, Guadeloupe, Guyane, Martinique ou Réunion">en France</abbr> plus de <abbr title="180 jours, potentiellement discontinus">6 mois</abbr> cette année.'
                    ],
                    'link': 'https://www.service-public.fr/particuliers/vosdroits/F13218',
                    /* Teleservice caf si naissance ; formulaire caf si adoption ; formulaire MSA tout le temps ; le cas le plus général est le formulaire de changement de situation pour la Caf et la MSA */
                    'form': 'https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/allocationsfamilialesouchangementdesituation',
                    'forms': {
                        'caf': 'https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/allocationsfamilialesouchangementdesituation',
                        'msa': 'http://www.msa.fr/lfr/documents/11566/132715/D%C3%A9claration+de+situation+pour+les+prestations+familiales+et+aides+au+logement.pdf'
                    },
                    'isBaseRessourcesYearMoins2': true,
                },
                'rsa': {
                    'label': 'Revenu de solidarité active',
                    'labelFunction': function(b) { return `${b.label} pour un montant de ${b.montant} € / mois pendant 3 mois`; },
                    'description': 'Le revenu de solidarité active (RSA) assure aux personnes sans ressources un niveau minimum de revenu variable selon la composition du foyer. Le RSA, le RSA parent isolé et le RSA jeunes parents sont simulés. Financé par les conseils départementaux, son versement se fait à travers la Caf ou la MSA. Les services sociaux de votre département vous orienteront vers l’organisme à qui adresser votre demande.',
                    'conditions': [
                        'Signer un <a target="_blank" rel="noopener" href="http://social-sante.gouv.fr/affaires-sociales/lutte-contre-l-exclusion/droits-et-aides/le-revenu-de-solidarite-active-rsa/article/quels-sont-les-droits-et-devoirs-des-beneficiaires-du-rsa" title="Détails sur les droits et devoirs des bénéficiaires du RSA">contrat d’engagement réciproque</a> (CER) avec votre département ou un <a target="_blank" rel="noopener"  href="https://www.service-public.fr/particuliers/vosdroits/F14926" title="Détails sur les droits et devoirs des bénéficiaires du RSA">Projet Personnalisé d’Accès à l’Emploi</a> (PPAE) avec Pôle emploi.',
                        'Résider en France plus de 9 mois par an.',
                    ],
                    'link': 'https://www.service-public.fr/particuliers/vosdroits/N19775',
                    'teleservice': 'https://wwwd.caf.fr/redirect/s/Redirect?page=demandeRsa',
                    'forms': {
                        'caf': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_15481.do',
                        'msa': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_15481.do'
                    },
                    'isBaseRessourcesPatrimoine': true,
                    'uncomputability': {
                        'tns': {
                            'reason': {
                                user: 'vous avez des revenus en tant qu’indépendant·e',
                                admin: 'le demandeur a des revenus en tant qu’indépendant·e',
                            },
                            'solution': 'Vous pouvez demander à bénéficier du RSA, mais c’est le président de votre conseil départemental qui <a target="_blank" rel="noopener" title="Article R262-23 du code de l’action sociale" href="https://www.legifrance.gouv.fr/affichCodeArticle.do?idArticle=LEGIARTI000028251799&cidTexte=LEGITEXT000006074069">décidera</a> de la manière dont vos revenus non salariés impacteront le montant de votre aide.'
                        },
                        'conjoint_tns': {
                            'reason': {
                                user: 'votre conjoint·e a des revenus en tant qu’indépendant·e',
                                admin: 'le conjoint du demandeur a des revenus en tant qu’indépendant·e',
                            },
                            'solution': 'Vous pouvez demander à bénéficier du RSA, mais c’est le président de votre conseil départemental qui <a target="_blank" rel="noopener" title="Article R262-23 du code de l’action sociale" href="https://www.legifrance.gouv.fr/affichCodeArticle.do?idArticle=LEGIARTI000028251799&cidTexte=LEGITEXT000006074069">décidera</a> de la manière dont les revenus non salariés de votre conjoint·e impacteront le montant de votre aide.'
                        }
                    },
                    customization: {
                        'D93-SSD': {
                            link: 'https://www.seine-saint-denis.fr/IMG/pdf/guide_rsa_a5_8p-2014.pdf',
                        },
                        'D75-PARIS': {
                            form: undefined, // Prevent default form recycling
                            teleservice: 'https://www.paris.fr/rsa#ou-et-comment-faire-une-demande-de-rsa_6',
                        },
                        'M69-LYON': {
                            provider: {
                                imgSrc: 'logo_grand_lyon.png',
                            },
                            link: 'https://www.grandlyon.com/services/rsa-mode-d-emploi.html',
                        },
                    },
                    floorAt: 10,
                },
                'aide_logement': {
                    'label': 'Aides au logement',
                    'description': 'Les aides au logement regroupent trois aides différentes non cumulables : l’aide personnalisée au logement (Apl), l’allocation de logement familiale (Alf) et l’allocation de logement sociale (Als). Elles concernent les personnes ayant de faibles ressources, locataires ou remboursant le prêt de leur résidence principale. Elles sont versées par la Caf ou la MSA.',
                    'conditions': [
                        'Résider au moins 8 mois par an dans le logement que vous avez décrit.',
                        'Le logement doit être <a target="_blank" rel="noopener" href="https://www.caf.fr/aides-et-services/connaitre-vos-droits-selon-votre-situation/vous-louez-ou-vous-achetez-un-logement/vous-occupez-un-logement-insalubre-ou-non-decent" title="9 mètres carrés par personne, fenêtre, WC, eau potable, électricité" >décent</a>.'
                    ],
                    'link': 'https://www.service-public.fr/particuliers/vosdroits/N20360',
                    'teleservice': 'https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/demanderlaideaulogement/',
                    'teleservices': {
                        'caf': 'https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/demanderlaideaulogement/',
                        'msa': 'http://www.msa.fr/lfr/c/bookmarks/open_entry?entryId=98643'
                    },
                    'isBaseRessourcesYearMoins2': true,
                    'isBaseRessourcesPatrimoine': true,
                    'uncomputability': {
                        'primo_accedant': {
                            'reason': {
                                user: 'vous êtes <abbr title="Non propriétaire de votre résidence principale dans les deux années précédant l’achat de votre résidence actuelle">primo-accédant</abbr> à la propriété de votre résidence principale',
                                admin: 'le demandeur est primo-accédant de sa résidence principale',
                            },
                            'solution': 'Le <a target="_blank" rel="noopener" href="https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/estimervosdroits/lelogement">simulateur de la CAF</a> pourra estimer vos droits sur la base de la valeur de votre bien.'
                        },
                        'locataire_foyer': {
                            'reason': {
                                user: 'vous logez dans un foyer',
                                admin: 'le demandeur loge dans un foyer',
                            },
                            'solution': 'Le <a target="_blank" rel="noopener" href="https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/estimervosdroits/lelogement">simulateur de la CAF</a> vous donnera des estimations selon les différentes conventions possibles de votre foyer.'
                        }
                    },
                    floorAt: 10,
                },
                'ppa': {
                    'label': 'Prime d’activité',
                    'labelFunction': function(b) { return `${b.label} pour un montant de ${b.montant} € / mois pendant 3 mois`; },
                    'description': 'La prime d’activité complète les revenus d’activité professionnelle des travailleurs de 18 ans ou plus, des étudiants salariés et apprentis et des non-salariés. La demande peut se faire à travers un téléservice sur, selon votre cas, le site de la Caf ou de la MSA. Elle remplace le RSA activité et la prime pour l’emploi depuis 2016.',
                    'link': 'https://www.service-public.fr/particuliers/vosdroits/F2882',
                    'teleservice': 'https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/demanderlaprimedactivite/',
                    'teleservices': {
                        'caf': 'https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/demanderlaprimedactivite/',
                        'msa': 'http://www.msa.fr/lfr/c/bookmarks/open_entry?entryId=44739105'
                    },
                    floorAt: 5,
                },
                'aah': {
                    'isMontantAnnuel': false,
                    'label': 'Allocation aux adultes handicapés',
                    'description': 'L’allocation aux adultes handicapés (AAH) est une aide financière qui permet d’assurer un revenu minimum. Cette aide est attribuée sous réserve de respecter 4 critères : le taux d’incapacité, l’âge, la nationalité et les ressources. L’AAH peut se cumuler soit avec le complément de ressources, soit avec la majoration pour la vie autonome ou, dans certains cas, l’aide à l’autonomie.',
                    'isBaseRessourcesYearMoins2': true,
                    'link': 'https://www.service-public.fr/particuliers/vosdroits/F12242',
                    'forms': {
                        'mdph': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_13788.do',
                    },
                    'entity': 'individu', // default entity is famille,
                    floorAt: 10,
                },
                'caah': {
                    'isMontantAnnuel': false,
                    'label': 'Complément à l’allocation adultes handicapés',
                    'description': 'Les personnes en situation de handicap les plus éloignées de l’emploi peuvent recevoir le complément de ressources. Il a pour objectif de compenser l’absence durable de revenus d’activité si vous êtes dans l’incapacité de travailler. Le CAAH forme, avec l’AAH, ce que l’on appelle la garantie de ressources.',
                    'conditions': [
                        'Avoir une capacité de travail (appréciée par la CADPH) inférieure à 5 % du fait de votre handicap.'
                    ],
                    'isBaseRessourcesYearMoins2': true,
                    'link': 'https://www.service-public.fr/particuliers/vosdroits/F12911',
                    'forms': {
                        'mdph': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_13788.do',
                    },
                    'entity': 'individu', // default entity is famille
                    floorAt: 1,
                },
            },
        },
        'pole_emploi': {
            'label': 'Pôle emploi',
            'imgSrc': 'logo_pole_emploi.png',
            'etablissements': ['pole_emploi'],
            'prestations': {
                'ass': {
                    'label': 'Allocation de solidarité spécifique',
                    'description': 'L’allocation de solidarité spécifique (ASS) est attribuée aux personnes ayant épuisé leurs droits au chômage sous conditions d’activité antérieure et de ressources. Elle peut être versée à taux plein ou à taux réduit. En cas de reprise d’activité, elle peut être maintenue.',
                    'link': 'https://www.service-public.fr/particuliers/vosdroits/F12484',
                    /* En principe, formulaire envoyé automatiquement ; lien vers brochure pole emploi */
                    'instructions': 'http://www.pole-emploi.fr/front/common/tools/download_file.jspz?mediaid=186108',
                    'entity': 'individu', // default entity is famille
                    floorAt: 10,
                },
            },
        },
        'cheque_energie': {
            'label': 'Chèque Énergie',
            'imgSrc': 'logo_cheque_energie.png',
            'prestations': {
                'cheque_energie': {
                    'isMontantAnnuel': true,
                    'label': 'Chèque Énergie',
                    'description': 'Le Chèque Énergie peut être utilisé pour toutes les dépenses d’énergie (électricité, gaz, fioul, bois, etc.) et les travaux de rénovation énergétique. Il est envoyé automatiquement chaque année en fonction de votre situation fiscale et de votre ménage.',
                    'conditions': [
                        'Résider en France au 1er janvier de l‘année.',
                        'Effectuer chaque année votre déclaration auprès des impôts.',
                        'Utiliser votre Chèque Énergie reçu en avril avant le 31 mars de l’année suivante.'
                    ],
                    'link': 'https://www.chequeenergie.gouv.fr/',
                    /* En principe, envoyé automatique : lien direct vers le formulaire d'utilisation en ligne */
                    'instructions': 'https://www.chequeenergie.gouv.fr/beneficiaire/paiement',
                    'isBaseRessourcesYearMoins2': true,
                    'entity': 'menage', // default entity is famille
                },
            },
        },
        'garantie_jeunes': {
            'label': 'Garantie Jeunes',
            'imgSrc': 'logo_garantie_jeunes.png',
            'etablissements': ['mission_locale'],
            'repository': 'france-local',
            'prestations': {
                'garantie_jeunes': {
                    'label': 'Garantie Jeunes',
                    'description': 'La garantie jeunes permet d’accompagner vers l’emploi ou la formation les jeunes entre 16 et 25 ans en situation difficile. C’est un parcours d´un an en partenariat avec la mission locale qui peut être prolongé jusqu’à 6 mois.',
                    'conditions': [
                        'Faire votre demande d´accompagnement auprès de <a target="_blank" rel="noopener" href="https://www.unml.info/les-missions-locales/annuaire/" title="Annuaire des missions locales" >la Mission Locale</a> dont vous dépendez.',
                        'Être indépendant.'
                    ],
                    'link': 'https://www.service-public.fr/particuliers/vosdroits/F32700',
                    'entity': 'individu', // default entity is famille
                },
            },
        },
        'departements': {
            'label': 'Les conseils départementaux',
            'imgSrc': 'logo_cd_generique.png',
            'etablissements': [
                'mds',
                'cdas',
                'centre_social',
                'edas',
                'sdsei',
            ],
            'prestations': {
                'apa_eligibilite': require('./apa_eligibilite')
            }
        },
        'banque_de_france': {
            'label': 'La Banque de France',
            'imgSrc': 'logo_banque_de_france.png',
            'prestations': {
                'livret_epargne_populaire_taux': {
                    'label': 'Livret d’épargne populaire',
                    'labelFunction': function(b) { return `${b.label} avec un taux de ${b.montant}% an ${b.legend}`; },
                    'unit': '%',
                    'description': 'Le livret d’épargne populaire (LEP) est un placement réservé aux personnes disposant de revenus modestes. Il offre de nombreux avantages parmi lesquels un taux d’intérêt garanti supérieur aux autres livrets réglementés.',
                    'conditions': [
                        'Avoir votre domicile fiscal situé en France.',
                        'Effectuer chaque année votre déclaration auprès des impôts.',
                        'Présenter à l’établissement bancaire votre avis d’imposition indiquant votre revenu fiscal.',
                    ],
                    'legend': 'au lieu de 0,75%',
                    'link': 'https://www.service-public.fr/particuliers/vosdroits/F2367',
                    'entity': 'individu', // default entity is famille
                    'isBaseRessourcesYearMoins2': true,
                    floorAt: 0.01,
                    top: 20
                },
            },
        },
        'education_nationale': {
            'label': 'Éducation nationale',
            'imgSrc': 'logo_education_nationale.png',
            'prestations': {
                'bourse_college': {
                    'isMontantAnnuel': true,
                    'label': 'Bourse de collège',
                    'description': 'La bourse de collège est une aide destinée à favoriser la scolarité des collégiens. Elle est versée aux familles ayant de faibles ressources. Son montant dépend du nombre d’enfants à charge.',
                    conditions: [
                        'Déposer votre dossier à partir de l’été 2018 pour l’année scolaire 2018-2019.',
                        'Pour les élèves scolarisés en collège public, la demande se fait en ligne sur le portail Scolarité Services de votre établissement.',
                    ],
                    'link': 'https://www.service-public.fr/particuliers/vosdroits/F984',
                    'instructions': 'http://www.education.gouv.fr/cid117994/scolarite-services-aide-a-la-premiere-connexion-des-parents.html',
                    'forms': {
                        '2017-18': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_12539.do',
                    },
                    'isBaseRessourcesYearMoins2': true,
                },
                'bourse_lycee': {
                    'isMontantAnnuel': true,
                    'label': 'Bourse de lycée',
                    'description': 'La bourse de lycée est accordée aux responsables d’un lycéen qui ont de faibles ressources. Si l’élève entre au lycée ou s’il n’a jamais touché de bourse de lycée, il pourra y prétendre selon les ressources et les charges de sa famille. Une nouvelle demande doit être effectuée en cas de redoublement ou réorientation.',
                    conditions: [
                        'Déposer votre dossier avant le 20 juin 2018 pour l’année scolaire 2018-2019.',
                        'Pour les élèves scolarisés en lycée public, la demande se fait en ligne sur le portail Scolarité-Services',
                    ],
                    'link': 'https://www.service-public.fr/particuliers/vosdroits/F616',
                    'form': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_11319.do',
                    'forms': {
                        '2017-18': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_11319.do',
                        '2018-19': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_11319.do',
                    },
                    'isBaseRessourcesYearMoins2': true,
                },
            },
        },
        'cohesion_territoires': {
            'label': 'Ministère de la Cohésion des territoires',
            'imgSrc': 'logo_ministere_cohesion_territoires.png',
            'prestations': {
                'logement_social_eligible': {
                    'type': 'bool',
                    'isBaseRessourcesYearMoins2': true,
                    'label': 'Logement social',
                    'description': 'Le logement social est destiné aux personnes et familles dont les ressources ne dépassent pas un certain seuil et répondant à certaines conditions d’accès. Aucun frais de dossier n’est réclamé lors de la demande, ni lors de la signature du bail. Il n’est pas obligatoire de résider dans une commune pour y déposer un dossier.',
                    'conditions': [
                        'Résider <abbr title="Métropole, Guadeloupe, Guyane, Martinique ou Réunion">en France</abbr> plus de <abbr title="180 jours, potentiellement discontinus">6 mois</abbr> cette année.',
                        'Vous adresser aux organismes HLM du département où vous souhaiter résider à travers le téléservice que nous présentons',
                        'Ou bien auprès de la préfecture du département, à la mairie de la ville ou des organismes collecteurs du 1% logement',
                        'Renouveler chaque année votre demande jusqu’à obtention d’un logement',
                    ],
                    'link': 'https://www.service-public.fr/particuliers/vosdroits/F869',
                    'teleservice': 'https://www.demande-logement-social.gouv.fr/creation/accesCriteresEligibilites.do',
                    'top': 10,
                },
            }
        }
    },
    'partenairesLocaux': {
        'paris': require('./paris'),
        'rennesmetropole': {
            'imgSrc': 'logo_rennes_metropole.png',
            'label': 'Rennes Métropole',
            'interactionWithNationalPrestationsHandled': true,
            'prefix': 'de',
            'prestations': {
                'rennes_metropole_transport': {
                    'isMontantAnnuel': false,
                    'unit': '%',
                    'legend': 'de l’abonnement STAR',
                    'label': 'Tarification solidaire transports',
                    'description': 'La tarification solidaire est une réduction de 50 %, 85 % ou 100 % (gratuité) de l’abonnement mensuel du réseau de transports en commun Star. La réduction s’applique également au service Handistar. Elle est accordée aux familles de Rennes Métropole ayant de faibles ressources. La tarification est accordée à tous les membres du foyer.',
                    'link': 'http://metropole.rennes.fr/pratique/infos-demarches/deplacements-stationnement-voirie/tarification-solidaire-des-transports/',
                    'instructions': 'http://metropole.rennes.fr/pratique/infos-demarches/deplacements-stationnement-voirie/tarification-solidaire-des-transports/#c33081',
                    'isBaseRessourcesYearMoins2': false,
                    'entity': 'individu', // default entity is famille
                },
            }
        },
        'brestmetropole': {
            'imgSrc': 'logo_brest_metropole.png',
            'label': 'Brest métropole',
            'interactionWithNationalPrestationsHandled': true,
            'prefix': 'de',
            'prestations': {
                'brest_metropole_transport': {
                    'legend': 'au lieu de 38.50 € / mois',
                    'label': 'Tarification solidaire transports',
                    'description': 'Les familles aux ressources modestes bénéficient de forfaits mensuels à tarif réduit pour les transports : les forfaits Tempo, Tango et Rythmo. Tous les membres du foyer peuvent en bénéficier.',
                    conditions: [
                        'Présenter un <a target="_blank" rel="noopener" href="http://www.caf.fr/allocataires/vies-de-famille/changement-de-situation/changement-familial/le-quotient-familial-c-est-quoi">justificatif de votre quotient familial</a> délivré par votre Caf.'
                    ],
                    'link': 'https://www.bibus.fr/fr/titres-tarifs/titres/forfait-solidaire-mensuel-tempo',
                    'isBaseRessourcesYearMoins2': false,
                    floorAt: 0.01,
                    'entity': 'individu', // default entity is famille
                    participation: true,
                },
            }
        },
        'alfortville': {
            'imgSrc': 'logo_alfortville.png',
            'repository': 'france-local',
            'label': 'Alfortville',
            'interactionWithNationalPrestationsHandled': true,
            'prefix': 'd’',
            'prestations': {
                'alfortville_noel_enfants': {
                    'isMontantAnnuel': true,
                    'legend': 'en chèque cadeau',
                    'label': 'Noël des enfants',
                    'description': 'La mairie d’Alfortville offre un chèque cadeau à chaque enfant de moins de 16 ans des familles aux ressources modestes. ',
                    conditions: [
                        'En cas de séparation, être le bénéficiaire des allocations familiales pour la demande.',
                        'Habiter Alfortville depuis au moins trois mois.'
                    ],
                    'link': 'https://www.alfortville.fr/le-pole-solidarite-insertion#Noel-des-enfants',
                    'instructions': 'https://www.alfortville.fr/le-pole-solidarite-insertion',
                    'isBaseRessourcesYearMoins2': false,
                    floorAt: 0.01,
                    'private': true,
                },
            },
        },
        'cotes_d_armor': {
            'imgSrc': 'logo_cd22.png',
            'repository': 'france-local',
            'label': 'Côtes d\'Armor',
            'interactionWithNationalPrestationsHandled': true,
            'prefix': 'des',
            'prestations': {
                'cotes_d_armor_fonds_solidarite_logement_energie_eligibilite': {
                    'label': 'Fonds de solidarité pour le logement - Aide au paiement des factures d’énergie',
                    'description': 'Le fonds de solidarité accorde des aides aux personnes qui rencontrent des difficultés pour assurer les dépenses de leur logement. L’aide « impayé énergie » correspond plus spécifiquement à l’aide au maintien des fournitures en eau, gaz, électricité, fioul et bois.',
                    conditions: [
                        'Occuper, à titre de résidence principale, un logement sur le territoire du département des Côtes d\'Armor'
                    ],
                    'form': 'https://cotesdarmor.fr/sites/default/files/2019-01/DOSSIER%20DE%20DEMANDE%20-%20Impay%C3%A9%20Energie%20.pdf',
                    'link': 'https://cotesdarmor.fr/vos-services/acceder-ou-se-maintenir-dans-son-logement',
                    'isBaseRessourcesYearMoins2': false,
                    'entity': 'individu',
                    'type': 'bool',
                },
            },
        }
    }
};

function setDefaults(benefit, top) {
    benefit.top = benefit.top || top;
    benefit.floorAt = benefit.floorAt || 1;
    benefit.entity = benefit.entity || 'famille';
}

var topLevels = {
    prestationsNationales: 1,
    partenairesLocaux: 5,
};

Object.keys(droitsDescription).forEach(function(levelId) {
    Object.keys(droitsDescription[levelId]).forEach(function(providerId) {
        Object.keys(droitsDescription[levelId][providerId].prestations).forEach(function(benefitId) {
            var benefit = droitsDescription[levelId][providerId].prestations[benefitId];
            setDefaults(benefit, topLevels[levelId]);
        });
    });
});

var msaAdditionProviders = [
    'assurance_retraite',
    'assurance_maladie',
    'caf'
];
msaAdditionProviders.forEach(function(providerId) {
    var prestations = droitsDescription.prestationsNationales[providerId].prestations;
    Object.keys(prestations).forEach(function(benefitId) {
        prestations[benefitId].msa = true;
    });
});
module.exports = droitsDescription;
