(function() {
    'use strict';

    var droitsDescription = {
        'prestationsNationales': {
            'assurance_retraite': {
                'label': 'Assurance retraite',
                'imgSrc': 'logo_assurance_retraite.png',
                'prestations': {
                    'aspa': {
                        'label': 'Allocation de solidarité aux personnes âgées',
                        'description': 'L’allocation de solidarité aux personnes âgées (Aspa) est une prestation accordée aux personnes retraitées ayant de faibles ressources. Elle est versée tous les mois par la Carsat (ou la MSA si vous dépendez du régime agricole). Elle s’ajoute, dans une certaine limite, aux revenus personnels. Elle remplace le minimum vieillesse depuis 2006.',
                        'conditions': [
                            'Résider <abbr title="Métropole, Guadeloupe, Guyane, Martinique ou Réunion">en France</abbr> plus de <abbr title="180 jours, potentiellement discontinus">6 mois</abbr> cette année.',
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
                    },
                },
            },
            'assurance_maladie': {
                'label': 'Assurance maladie',
                'imgSrc': 'logo_assurance_maladie.png',
                'prestations': {
                    'acs': {
                        'isMontantAnnuel': true,
                        'label': 'Aide au paiement d’une complémentaire santé',
                        'description': 'L’aide au paiement d’une assurance complémentaire santé (ACS) est une aide financière pour payer une complémentaire santé (mutuelle). L’ACS ouvre droit à d’autres avantages comme le tiers-payant. Une fois attribuée, l’ACS est accordée pour un an.',
                        'conditions': [
                            'Résider <abbr title="Métropole, Guadeloupe, Guyane, Martinique ou Réunion">en France</abbr> depuis plus de 3 mois.'
                        ],
                        'link': 'https://www.service-public.fr/particuliers/vosdroits/F13375',
                        'form': 'https://www.ameli.fr/sites/default/files/formulaires/170/s3711_homol_mai_2018_remp_non_sec_version_ameli_et_fiche_daccrf.pdf',
                        'forms': {
                            'general': 'https://www.ameli.fr/sites/default/files/formulaires/170/s3711_homol_mai_2018_remp_non_sec_version_ameli_et_fiche_daccrf.pdf',
                            'msa': 'https://www.ameli.fr/sites/default/files/formulaires/170/s3711_homol_mai_2018_remp_non_sec_version_ameli_et_fiche_daccrf.pdf',
                            'rsi': 'https://www.ameli.fr/sites/default/files/formulaires/170/s3711_homol_mai_2018_remp_non_sec_version_ameli_et_fiche_daccrf.pdf'
                        },
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
                    },
                    'cmu_c': {
                        'label': 'Couverture maladie universelle complémentaire',
                        'description': 'La couverture maladie universelle complémentaire (CMU-C) est une protection complémentaire santé (mutuelle) gratuite. Elle est destinée aux personnes qui ont de faibles ressources et résident en France de manière stable et régulière. Une fois attribuée, la CMU-C est accordée pour un an.',
                        'conditions': [
                            'Résider <abbr title="Métropole, Guadeloupe, Guyane, Martinique ou Réunion">en France</abbr> depuis plus de 3 mois.'
                        ],
                        'link': 'https://www.service-public.fr/particuliers/vosdroits/F10027',
                        'form': 'https://www.ameli.fr/sites/default/files/formulaires/170/s3711_homol_mai_2018_remp_non_sec_version_ameli_et_fiche_daccrf.pdf',
                        'forms': {
                            'general': 'https://www.ameli.fr/sites/default/files/formulaires/170/s3711_homol_mai_2018_remp_non_sec_version_ameli_et_fiche_daccrf.pdf',
                            'msa': 'https://www.ameli.fr/sites/default/files/formulaires/170/s3711_homol_mai_2018_remp_non_sec_version_ameli_et_fiche_daccrf.pdf',
                            'rsi': 'https://www.ameli.fr/sites/default/files/formulaires/170/s3711_homol_mai_2018_remp_non_sec_version_ameli_et_fiche_daccrf.pdf'
                        },
                        'type': 'bool', // default type is float
                    },
                },
            },
            'caf': {
                'label': 'Caisse d’allocations familiales',
                'imgSrc': 'logo_caf.png',
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
                        'isBaseRessourcesYearMoins2': true
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
                        'isBaseRessourcesYearMoins2': true
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
                        'isBaseRessourcesYearMoins2': true
                    },
                    'rsa': {
                        'label': 'Revenu de solidarité active',
                        'description': 'Le revenu de solidarité active (RSA) assure aux personnes sans ressources un niveau minimum de revenu variable selon la composition du foyer. Le RSA, le RSA parent isolé et le RSA jeunes parents sont simulés. Financé par les conseils départementaux, son versement se fait à travers la Caf ou la MSA. Les services sociaux de votre département vous orienteront vers l’organisme à qui adresser votre demande.',
                        'conditions': [
                            'Signer un <a target="_blank" rel="noopener" href="http://social-sante.gouv.fr/affaires-sociales/lutte-contre-l-exclusion/droits-et-aides/le-revenu-de-solidarite-active-rsa/article/quels-sont-les-droits-et-devoirs-des-beneficiaires-du-rsa" title="Détails sur les droits et devoirs des bénéficiaires du RSA">contrat d’engagement réciproque</a> (CER) avec votre département ou un <a target="_blank" rel="noopener"  href="https://www.service-public.fr/particuliers/vosdroits/F14926" title="Détails sur les droits et devoirs des bénéficiaires du RSA">Projet Personnalisé d’Accès à l’Emploi</a> (PPAE) avec Pôle emploi.',
                            'Résider en France plus de 9 mois par an.',
                            'Si vous êtes ressortissant·e d’un pays de l’UE, de l’EEE ou Suisse, résider en France depuis plus de 3 mois et remplir les conditions du droit au séjour.',
                            'Si vous êtes ressortissant·e d’un autre pays, résider en France depuis plus de 5 ans de manière continue (sous couvert de titres de séjours autorisant à travailler).'
                        ],
                        'link': 'https://www.service-public.fr/particuliers/vosdroits/N19775',
                        'teleservice': 'https://wwwd.caf.fr/redirect/s/Redirect?page=demandeRsa',
                        'forms': {
                            'caf': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_15481.do',
                            'msa': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_15481.do'
                        },
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
                        }
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
                        }
                    },
                    'ppa': {
                        'label': 'Prime d’activité',
                        'description': 'La prime d’activité complète les revenus d’activité professionnelle des travailleurs de 18 ans ou plus, des étudiants salariés et apprentis et des non-salariés. La demande peut se faire à travers un téléservice sur, selon votre cas, le site de la Caf ou de la MSA. Elle remplace le RSA activité et la prime pour l’emploi depuis 2016.',
                        'link': 'https://www.service-public.fr/particuliers/vosdroits/F2882',
                        'teleservice': 'https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/demanderlaprimedactivite/',
                        'teleservices': {
                            'caf': 'https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/demanderlaprimedactivite/',
                            'msa': 'http://www.msa.fr/lfr/c/bookmarks/open_entry?entryId=44739105'
                        }
                    },
                    'aah': {
                        'isMontantAnnuel': false,
                        'label': 'Allocation aux adultes handicapés',
                        'description': 'L’allocation aux adultes handicapés (AAH) est une aide financière qui permet d’assurer un revenu minimum. Cette aide est attribuée sous réserve de respecter 4 critères : le taux d’incapacité, l’âge, la nationalité et les ressources. L’AAH peut se cumuler soit avec le complément de ressources, soit avec la majoration pour la vie autonome ou, dans certains cas, l’aide à l’autonomie.',
                        'isBaseRessourcesYearMoins2': true,
                        'link': 'https://www.service-public.fr/particuliers/vosdroits/F12242',
                        //  'form': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_13788.do',
                        'forms': {
                            'mdph': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_13788.do',
                        },
                        'entity': 'individu', // default entity is famille
                        'isExperimental': true,
                        'internalLink': 'aah-en-test'
                    },
                },
            },
            'pole_emploi': {
                'label': 'Pôle emploi',
                'imgSrc': 'logo_pole_emploi.png',
                'prestations': {
                    'ass': {
                        'label': 'Allocation de solidarité spécifique',
                        'description': 'L’allocation de solidarité spécifique (ASS) est attribuée aux personnes ayant épuisé leurs droits au chômage sous conditions d’activité antérieure et de ressources. Elle peut être versée à taux plein ou à taux réduit. En cas de reprise d’activité, elle peut être maintenue.',
                        'link': 'https://www.service-public.fr/particuliers/vosdroits/F12484',
                        /* En principe, formulaire envoyé automatiquement ; lien vers brochure pole emploi */
                        'instructions': 'http://www.pole-emploi.fr/front/common/tools/download_file.jspz?mediaid=186108',
                        'entity': 'individu', // default entity is famille
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
                        'roundToNearest10': false,
                        'entity': 'menage', // default entity is famille
                    },
                },
            },
            'departements': {
                label: 'Les conseils départementaux',
                'imgSrc': 'logo_cd_generique.png',
                prestations: {
                    apa_eligibilite: {
                        label: 'Allocation personnalisée d‘autonomie',
                        description: 'L’allocation personnalisée d’autonomie (APA) est une aide réservée aux plus de 60 ans en perte d’autonomie. À travers un plan d’action, elle favorise le maintien à domicile et l’amélioration de la qualité de vie des personnes âgées en établissement en subventionnant des services d’aides à la personne. Sa gestion est confiée aux conseils départementaux.',
                        conditions: [
                            'Faire évaluer votre perte d’autonomie (classement GIR) à domicile par les services sociaux de votre département.',
                            'Accepter le plan d’aide proposé par votre département.',
                            'Résider depuis plus de trois mois dans votre département.',
                            'Ne pas percevoir <a target="_blank" rel="noopener" title="Service Public.fr - Peut-on cumuler l‘Apa avec d‘autres revenus ?" href="https://www.service-public.fr/particuliers/vosdroits/F11678">certaines autres aides à l‘autonomie</a> non cumulables avec l‘APA',
                        ],
                        link: 'http://www.pour-les-personnes-agees.gouv.fr/beneficier-daides/lapa-est-lallocation-personnalisee-dautonomie/facile-a-lire',
                        instructions: 'http://www.pour-les-personnes-agees.gouv.fr/annuaire-conseils-departementaux',
                        type: 'bool',
                        customization: {
                            'D05-HAUTES_ALPES': {
                                provider: {
                                    imgSrc: 'logo_cd05.png',
                                },
                                instructions: undefined, // Prevent default instructions recycling
                                form: 'https://www.hautes-alpes.fr/include/viewFile.php?idtf=16823&path=a0%2F16823_639_1-dossier_apa_web_elec.pdf',
                                teleservice: undefined, // Prevent default instructions recycling
                                link: 'https://www.hautes-alpes.fr/1647-l-allocation-personnalisee-d-autonomie-apa-.htm',
                            },
                            'D06-ALPES_MARITIMES': {
                                provider: {
                                    imgSrc: 'logo_cd06.png',
                                },
                                instructions: undefined, // Prevent default instructions recycling
                                form: undefined, // Prevent default instructions recycling
                                teleservice: 'https://www.departement06.fr/dossier-de-demande-d-allocation-personnalisee-d-autonomie-a-domicile-14249.html',
                                link: 'https://www.departement06.fr/aides-aux-personnes-agees/allocation-personnalisee-d-autonomie-apa-2578.html',
                            },
                            'D13-BDR': {
                                provider: {
                                    imgSrc: 'logo_cd13.png',
                                },
                                instructions: undefined, // Prevent default instructions recycling
                                form: 'https://www.departement13.fr/fileadmin/user_upload/Famille/Seniors/formulaires/dossier_APA.pdf',
                                teleservice: undefined, // Prevent default instructions recycling
                                link: 'https://www.departement13.fr/le-13-en-action/seniors/les-dispositifs/allocation-personnalisee-dautonomie-apa/',
                            },
                            'D14-CALVADOS': {
                                provider: {
                                    imgSrc: 'logo_cd14.png',
                                },
                                instructions: undefined, // Prevent default instructions recycling
                                form: undefined, // Prevent default form recycling
                                teleservice: 'https://teleservices.calvados.fr/demandes-apa/',
                                link: 'https://www.calvados.fr/contents/fiche/fiches-aide--services/lapa-en-ligne.html',
                            },
                            'D29-FINISTERE': {
                                provider: {
                                    imgSrc: 'logo_cd29.png',
                                },
                                instructions: undefined, // Prevent default instructions recycling
                                form: 'https://www.finistere.fr/var/finistere/storage/original/application/1f10539819d74121420da96880b95716.pdf',
                                teleservice: undefined, // Prevent default instructions recycling
                                link: 'https://www.finistere.fr/A-votre-service/Personnes-age-es-APA/Allocation-personnalisee-d-autonomie',
                            },
                            'D31-HAUTE_GARONNE': {
                                provider: {
                                    imgSrc: 'logo_cd31.png',
                                },
                                instructions: undefined, // Prevent default instructions recycling
                                form: 'https://www.haute-garonne.fr/sites/default/files/20172707-formulaire-demande-_apa.pdf',
                                teleservice: undefined, // Prevent default form recycling
                                link: 'https://www.haute-garonne.fr/guide-des-aides/allocation-personnalisee-dautonomie-apa',
                            },
                            'D33-GIRONDE': {
                                provider: {
                                    imgSrc: 'logo_cd33.png',
                                },
                                instructions: undefined, // Prevent default instructions recycling
                                form: 'https://www.gironde.fr/sites/default/files/2017-04/demande_apa_web_0.pdf',
                                teleservice: undefined, // Prevent default form recycling
                                link: 'https://www.gironde.fr/handicap-grand-age/aides-et-prestations-apa-pch-et-cmi#apa',
                            },
                            'D34-HERAULT': {
                                provider: {
                                    imgSrc: 'logo_cd34.png',
                                },
                                instructions: 'http://www.herault.fr/lallocation-personnalisee-dautonomie-apa',
                                form: undefined, // Prevent default form recycling
                                teleservice: undefined, // Prevent default form recycling
                                link: undefined,
                            },
                            'D35-ILLE_ET_VILAINE': {
                                provider: {
                                    imgSrc: 'logo_cd35.png',
                                },
                                instructions: undefined, // Prevent default form recycling
                                form: 'http://www.ille-et-vilaine.fr/sites/default/files/asset/document/faire_demande_allocation_apa_juillet_2014.pdf',
                                teleservice: undefined, // Prevent default form recycling
                                link: 'http://www.ille-et-vilaine.fr/fr/demande-apa',
                            },
                            'D38-ISERE': {
                                provider: {
                                    imgSrc: 'logo_cd38.png',
                                },
                                instructions: undefined, // Prevent default instructions recycling
                                form: undefined, // Prevent default instructions recycling
                                teleservice: 'https://www.isere.fr/espace-personnel/Pages/creer-mon-compte.aspx',
                                link: 'https://www.isere.fr/mda38/particulier/pa/Pages/apa-en-ligne.aspx',
                            },
                            'D42-LOIRE': {
                                provider: {
                                    imgSrc: 'logo_cd42.png',
                                },
                                instructions: undefined, // Prevent default form recycling
                                form: 'http://www.loire.fr/upload/docs/application/pdf/dossierapa.pdf',
                                teleservice: undefined, // Prevent default form recycling
                                link: 'http://www.loire.fr/jcms/c_308179/comment-beneficier-de-l-apa-a-domicile',
                            },
                            'D44-LOIRE_ATLANTIQUE': {
                                provider: {
                                    imgSrc: 'logo_cd44.png',
                                },
                                instructions: undefined, // Prevent default instructions recycling
                                form: 'https://www.loire-atlantique.fr/upload/docs/application/pdf/2014-02/personnes_agees_for_apa_2006_10_03__16_42_50_200.pdf',
                                teleservice: undefined, // Prevent default instructions recycling
                                link: 'https://www.loire-atlantique.fr/jcms/classement-des-contenus/guides-aides/vous-etes/personne-agee/l-allocation-personnalisee-d-autonomie-apa-a-domicile-fr-p1_315752?portal=aca_6941&category=p2_807421',
                            },
                            'D57-MOSELLE': {
                                provider: {
                                    imgSrc: 'logo_cd57.png',
                                },
                                instructions: undefined, // Prevent default instructions recycling
                                form: 'http://www.moselle.fr/sitecollectiondocuments/lamoselleetvous/solidarite/seniors/formulaire_demande_apa_domicile.pdf',
                                teleservice: undefined, // Prevent default instructions recycling
                                link: 'http://www.moselle.fr/moselleetvous/pages/fiche_senior_apa.aspx',
                            },
                            'D59-NORD': {
                                provider: {
                                    imgSrc: 'logo_cd59.png',
                                },
                                instructions: undefined, // Prevent default instructions recycling
                                form: 'https://lenord.fr/upload/docs/application/pdf/2018-04/formulaire_apa_2018-04-27_16-30-55_949.pdf',
                                teleservice: undefined, // Prevent default instructions recycling
                                link: 'https://lenord.fr/jcms/prd2_335926/allocation-personnalisee-d-autonomie-apa',
                            },
                            'D62-PDC': {
                                provider: {
                                    imgSrc: 'logo_cd62.png',
                                },
                                instructions: undefined, // Prevent default instructions recycling
                                form: 'http://www.pasdecalais.fr/content/download/79774/1263503/file/Dossier+de+demande+APA.pdf',
                                teleservice: undefined, // Prevent default form recycling
                                link: 'http://www.pasdecalais.fr/Solidarite-Sante/Retraites-et-personnes-agees/Beneficier-d-aides/L-Allocation-Personnalisee-d-Autonomie-APA',
                            },
                            'D67-BAS_RHIN': {
                                provider: {
                                    imgSrc: 'logo_cd67.png',
                                },
                                instructions: undefined, // Prevent default instructions recycling
                                form: 'http://www.bas-rhin.fr/eCommunityDocuments/%7BE34C4D98-631D-459B-AA4E-61C91D2F7BA0%7D/3759/document_conseil-departemental-bas-rhin-formulaire-demande-apa.pdf',
                                teleservice: undefined, // Prevent default form recycling
                                link: 'http://www.bas-rhin.fr/acces-direct/guide-aides/detail-guide-aides/381/Allocation-personnalisee-d-autonomie--APA--a-domicile',
                            },
                            'D75-PARIS': {
                                provider: {
                                    imgSrc: 'logo_paris.png',
                                },
                                instructions: 'https://apa.paris.fr/portailAPA/',
                                form: undefined, // Prevent default form recycling
                                teleservice: undefined, // Prevent default form recycling
                                link: 'https://www.paris.fr/aides_soutien_a_domicile#allocation-personnalisee-d-autonomie-a-domicile-apa_21',
                            },
                            'D76-SEINE_MARITIME': {
                                provider: {
                                    imgSrc: 'logo_cd76.png',
                                },
                                instructions: undefined, // Prevent default instructions recycling
                                form: 'https://www.seinemaritime.fr/docs/1_apa-1ere-demande-domicile.pdf',
                                teleservice: undefined, // Prevent default form recycling
                                link: 'https://www.seinemaritime.fr/vos-services/personnes-agees-1/beneficier-daides/lallocation-aux-personnes-agees.html',
                            },
                            'D77-SEINE_ET_MARNE': {
                                provider: {
                                    imgSrc: 'logo_cd77.png',
                                },
                                instructions: undefined, // Prevent default instructions recycling
                                form: 'http://www.seine-et-marne.fr/content/download/84288/750532/version/1/file/17-DGAS-Allocation%20personnalisee%20d%2527autonomie%20a%20domicile.pdf',
                                teleservice: undefined, // Prevent default form recycling
                                link: 'http://www.seine-et-marne.fr/Solidarite/Seniors/Maintien-a-domicile-APA/Allocation-Personnalisee-d-Autonomie-APA',
                            },
                            'D83-VAR': {
                                provider: {
                                    imgSrc: 'logo_cd83.png',
                                },
                                instructions: 'https://www.var.fr/social/autonomie-personnes-agees/apa',
                                form: undefined, // Prevent default instructions recycling
                                teleservice: undefined, // Prevent default instructions recycling
                            },
                            'D92-HAUTS_DE_SEINE': {
                                provider: {
                                    imgSrc: 'logo_cd92.png',
                                },
                                instructions: undefined, // Prevent default instructions recycling
                                form: 'http://www.hauts-de-seine.fr/fileadmin/PDF/Solidarites/Autonomie/DossierAPADomJuillet2018.pdf',
                                teleservice: undefined, // Prevent default form recycling
                                link: 'http://www.hauts-de-seine.fr/solidarites/personnes-agees/maintien-a-domicile/comment-beneficier-de-lapa/',
                            },
                            'D93-SSD': {
                                provider: {
                                    imgSrc: 'logo_cd93.png',
                                },
                                instructions: undefined, // Prevent default instructions recycling
                                form: 'https://seinesaintdenis.fr/IMG/pdf/formulaire_demande_adpa.pdf',
                                teleservice: undefined, // Prevent default form recycling
                                link: 'https://seinesaintdenis.fr/Allocation-Departementale-Personnalisee-d-Autonomie.html',
                            },
                            'D94-VAL_DE_MARNE': {
                                provider: {
                                    imgSrc: 'logo_cd94.png',
                                },
                                instructions: undefined, // Prevent default instructions recycling
                                form: 'https://www.valdemarne.fr/download/sites/default/files/formulaires/webformudemande_apa_-2018_.pdf',
                                teleservice: undefined, // Prevent default form recycling
                                link: 'https://www.valdemarne.fr/a-votre-service/personnes-agees/allocation-personnalisee-dautonomie-a-domicile-apad',
                            },
                            'M69-LYON': {
                                provider: {
                                    imgSrc: 'logo_grand_lyon.png',
                                },
                                instructions: undefined, // Prevent default form recycling
                                form: 'https://www.grandlyon.com/fileadmin/user_upload/media/pdf/pa-ph/personnes-agees/20170802_dossier_demande_apa.pdf',
                                teleservice: undefined, // Prevent default form recycling
                                link: 'https://www.grandlyon.com/services/allocation-personnalisee-d-autonomie.html',
                            },
                        },
                        'entity': 'individu', // default entity is famille
                    }
                }
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
                        'isBaseRessourcesYearMoins2': true
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
                        'isBaseRessourcesYearMoins2': true
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
                        'form': 'https://www.demande-logement-social.gouv.fr/creation/accesCriteresEligibilites.do',
                    },
                }
            }
        },
        'partenairesLocaux': {
            'paris': {
                'imgSrc': 'logo_paris.png',
                'label': 'Ville de Paris',
                'prefix': 'de la',
                'prestations': {
                    'paris_logement_familles': {
                        'isMontantAnnuel': false,
                        'label': 'Paris Logement Famille',
                        'description': 'L’allocation Paris Logement Famille est destinée aux familles d’au moins deux enfants ou ayant un enfant handicapé. Elle leur permet de mieux supporter leurs dépenses de logement. L’aide est accordée pour une durée maximale d’un an. Elle peut être renouvelée en présentant un nouveau dossier.',
                        'conditions': [
                            'Avoir demandé le versements des aides logement auxquelles vous avez droit auprès de la CAF.',
                            'Ne toucher aucune autre prestation logement de la part de la mairie de Paris ou du département.'
                        ],
                        'link': 'http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#paris-logement-famille_7',
                        'form': 'https://api-site.paris.fr/images/73485',
                        'isBaseRessourcesYearMoins2': false,
                        'roundToNearest10': false,
                    },
                    'paris_forfait_famille': {
                        'isMontantAnnuel': true,
                        'label': 'Paris Forfait Famille',
                        'description': 'Paris Forfait Famille est une aide destinée aux familles nombreuses avec au moins trois enfants à charge. Elle peut se cumuler avec l’Allocation de Soutien aux Parents d’Enfants Handicapés. L’aide est accordée pour une durée maximale d’un an. Elle peut être renouvelée en présentant un nouveau dossier.',
                        'link': 'http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#paris-forfait-famille_2',
                        'form': 'https://api-site-cdn.paris.fr/images/97066',
                        'isBaseRessourcesYearMoins2': false,
                        'roundToNearest10': false
                    },
                    'paris_logement_psol': {
                        'label': 'Paris Solidarité',
                        'description': 'Paris Solidarité est destinée aux personnes âgées de 65 ans ou plus et aux personnes en situation de handicap. L’aide peut être versée tous les mois à partir de 60 ans pour les personnes reconnus inaptes au travail. Elle a pour but de garantir aux foyers modestes un minimum de ressources. L’aide est accordée pour une durée maximale d’un an. À partir du 2<sup>e</sup> renouvellement, Paris Solidarité peut être accordée pour une durée maximale de deux ans.',
                        'conditions': [
                            'Percevoir tous les avantages légaux auxquels vous pouvez prétendre.',
                        ],
                        'link': 'http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#paris-solidarite_3',
                        'form': 'https://api-site-cdn.paris.fr/images/97049',
                        'isBaseRessourcesYearMoins2': false,
                        'roundToNearest10': false
                    },
                    'paris_logement': {
                        'label': 'Paris Logement',
                        'description': 'L’allocation Paris Logement est destinée aux personnes seules ou en couple sans ou avec un enfant. Elle leur permet de mieux supporter leurs dépenses de logement. Ils doivent être locataires en titre et titulaires du bail du logement occupé à titre principal. L’aide est accordée pour une durée maximale d’un an. À partir du 2<sup>e</sup> renouvellement, Paris Logement peut être accordée pour une durée maximale de deux ans.',
                        'conditions': [
                            'Avoir demandé le versement des aides logement auxquelles vous avez droit auprès de la CAF.',
                            'Ne toucher aucune autre prestation logement de la part de la mairie de Paris ou du département.'
                        ],
                        'link': 'http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#paris-logement_6',
                        'form': 'https://api-site-cdn.paris.fr/images/97085',
                        'isBaseRessourcesYearMoins2': false,
                        'roundToNearest10': false
                    },
                    'paris_logement_aspeh': {
                        'label': 'Allocation de Soutien aux Parents d’Enfants Handicapés',
                        'description': 'L’Allocation de Soutien aux Parents d’Enfants Handicapés est réservée aux familles ayant à charge un ou plusieurs enfants handicapés. Si l’enfant handicapé vit au domicile, l’aide est versée tous les mois et accordée pour un an. Elle peut être renouvelée en présentant un nouveau dossier. Si l’enfant est placé dans un établissement spécialisé, le montant dépend du nombre de jours passés par le ou les enfants au domicile.',
                        'link': 'http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#allocation-de-soutien-aux-parents-d-enfants-handicapes_9',
                        'form': 'https://api-site-cdn.paris.fr/images/97060',
                        'isBaseRessourcesYearMoins2': false,
                        'roundToNearest10': false
                    },
                    'paris_logement_plfm': {
                        'label': 'Paris Logement Familles Monoparentales',
                        'description': 'L’allocation Paris Logement Famille Monoparentale est destinée aux parents seuls, ayant un ou plusieurs enfants à charge. Elle leur permet de mieux supporter leurs dépenses de logement. Elle est ouverte aux locataires, aux propriétaires et aux personnes accédant à la propriété. L’aide est accordée pour un an. Elle peut être renouvelée en présentant un nouveau dossier.',
                        'conditions': [
                            'Avoir demandé le versement des aides logement auxquelles vous avez droit auprès de la CAF.',
                            'Ne toucher aucune autre prestation logement de la part de la mairie de Paris ou du département.'
                        ],
                        'link': 'http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#paris-logement-famille-monoparentale_5',
                        'form': 'https://api-site-cdn.paris.fr/images/90099',
                        'isBaseRessourcesYearMoins2': false,
                        'roundToNearest10': false
                    },
                    'paris_energie_famille': {
                        'isMontantAnnuel': true,
                        'label': 'Paris Énergie Familles',
                        'description': 'L’allocation Paris Énergie Famille est réservée aux familles ayant un ou plusieurs enfants à charge, sous condition d’imposition. Cette aide permet de les soutenir dans leurs dépenses d’électricité et/ou de gaz. Paris Énergie Famille est directement versée aux fournisseurs d’énergie. L’aide est accordée pour un an. Elle peut être renouvelée en présentant un nouveau dossier.',
                        'link': 'http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#paris-energie-famille_8',
                        'form': 'https://api-site-cdn.paris.fr/images/97093',
                        'isBaseRessourcesYearMoins2': false,
                        'roundToNearest10': false
                    },
                    'paris_complement_sante': {
                        'isMontantAnnuel': true,
                        'label': 'Complément Santé Paris',
                        'description': 'Le Complément Santé Paris est destiné aux personnes âgées de 65 ans ou plus et aux personnes en situation de handicap. L’aide peut être versée à partir de 60 ans pour les personnes reconnues inaptes au travail. Elle a pour but d’aider les foyers modestes à régler leurs frais de mutuelle. L’aide est accordée pour une durée maximale d’un an. À partir du 2<sup>e</sup> renouvellement, le Complément Santé Paris peut être accordé pour une durée maximale de deux ans.',
                        'link': 'http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#complement-sante-paris_10',
                        'form': 'https://api-site.paris.fr/images/78343',
                        'isBaseRessourcesYearMoins2': false,
                        'roundToNearest10': false
                    }
                }
            },
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
                        'isMontantAnnuel': false,
                        'legend': 'au lieu de 38.50 €',
                        'label': 'Tarification solidaire transports',
                        'description': 'Les familles aux ressources modestes bénéficient de forfaits mensuels à tarif réduit pour les transports : les forfaits Tempo, Tango et Rythmo. Tous les membres du foyer peuvent en bénéficier.',
                        conditions: [
                            'Présenter un <a target="_blank" rel="noopener" href="http://www.caf.fr/allocataires/vies-de-famille/changement-de-situation/changement-familial/le-quotient-familial-c-est-quoi">justificatif de votre quotient familial</a> délivré par votre Caf.'
                        ],
                        'link': 'https://www.bibus.fr/titres-tarifs/titres-tarifs-bibus/les-abonnements/les-forfaits-solidaires/',
                        'instructions': 'https://www.bibus.fr/fileadmin/Sites/Bibus/Titres_et_tarifs/Forfaits_solidaires_2018.jpg',
                        'isBaseRessourcesYearMoins2': false,
                        'roundToNearestCent': true,
                        'entity': 'individu', // default entity is famille
                    },
                }
            },
            'alfortville': {
                'imgSrc': 'logo_alfortville.png',
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
                        'roundToNearestCent': true,
                        'private': true,
                    },
                },
                repository: 'bacASable'
            }
        }
    };

    /* Export either through Angular loader or CommonJS */
    if (typeof global != 'undefined') {  // we're in Node
        module.exports = droitsDescription;
    } else {  // we're in the browser
        angular.module('ddsCommon').constant('droitsDescription', droitsDescription);
    }
/* End of export */
})();
