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
                    'shortLabel': 'Aspa',
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
                    'entity': 'famille',
                    'type': 'float',
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
                    'shortLabel': 'ACS',
                    'description': 'L’aide au paiement d’une assurance complémentaire santé (ACS) est une aide financière pour payer une complémentaire santé (mutuelle). L’ACS ouvre droit à d’autres avantages comme le tiers-payant. Une fois attribuée, l’ACS est accordée pour un an.',
                    'conditions': [
                        'Résider <abbr title="Métropole, Guadeloupe, Guyane, Martinique ou Réunion">en France</abbr> depuis plus de 3 mois.'
                    ],
                    'link': 'https://www.service-public.fr/particuliers/vosdroits/F13375',
                    'form': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_12504.do',
                    'forms': {
                        'general': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_12504.do',
                        'msa': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_12504.do',
                        'rsi': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_12504.do'
                    },
                    'entity': 'famille',
                    'type': 'float',
                },
                'asi': {
                    'label': 'Allocation supplémentaire d’invalidité',
                    'shortLabel': 'Asi',
                    'description': 'L’allocation supplémentaire d’invalidité (Asi) est une prestation accordée à certaines personnes invalides. Elle s’adresse à celles et ceux qui ont de faibles ressources et n’ont pas atteint l’âge de départ à la retraite. Elle est versée tous les mois et s’ajoute, dans une certaine limite, aux revenus personnels.',
                    'link': 'https://www.service-public.fr/particuliers/vosdroits/F16940',
                    'form': 'http://www.ameli.fr/fileadmin/user_upload/formulaires/S4151.pdf',
                    'forms' : {
                        'general': 'http://www.ameli.fr/fileadmin/user_upload/formulaires/S4151.pdf',
                        'msa': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_13435.do',
                        'rsi': 'https://www.rsi.fr/fileadmin/mediatheque/.Espace_telechargement/Formulaires/formulaire_allocation_supplementaire_invalidite.pdf',
                        'cnav': 'https://www.lassuranceretraite.fr/portail-info/files/live/sites/pub-bootstrap/files/Guides%20et%20formulaires/demande-asi.pdf'
                    },
                    'entity': 'famille',
                    'type': 'float',
                },
                'cmu_c': {
                    'label': 'Couverture maladie universelle complémentaire',
                    'shortLabel': 'CMU-C',
                    'description': 'La couverture maladie universelle complémentaire (CMU-C) est une protection complémentaire santé (mutuelle) gratuite. Elle est destinée aux personnes qui ont de faibles ressources et résident en France de manière stable et régulière. Une fois attribuée, la CMU-C est accordée pour un an.',
                    'conditions': [
                        'Résider <abbr title="Métropole, Guadeloupe, Guyane, Martinique ou Réunion">en France</abbr> depuis plus de 3 mois.'
                    ],
                    'link': 'https://www.service-public.fr/particuliers/vosdroits/F10027',
                    'form': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_12504.do',
                    'forms': {
                        'general': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_12504.do',
                        'msa': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_12504.do',
                        'rsi': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_12504.do'
                    },
                    'entity': 'famille',
                    'type': 'bool',
                },
            },
        },
        'caf': {
            'label': 'Caisse d’allocations familiales',
            'imgSrc': 'logo_caf.png',
            'prestations': {
                'af': {
                    'label': 'Allocations familiales',
                    'shortLabel': 'AF',
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
                    'entity': 'famille',
                    'isBaseRessourcesYearMoins2': true,
                    'type': 'float',
                },
                'cf': {
                    'label': 'Complément familial',
                    'shortLabel': 'CF',
                    'description': 'Le complément familial s’ajoute aux allocations familiales à partir du troisième enfant à charge âgé de plus de 3 ans et de moins de 21 ans. Il est destiné aux familles ayant de faibles ressources. Dans les DOM, le complément familial concerne tous les enfants à charge âgés entre 3 et 5 ans.',
                    'link': 'https://www.service-public.fr/particuliers/vosdroits/F13214',
                    'form': 'https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/allocationsfamilialesouchangementdesituation',
                    'forms': {
                        'caf': 'https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/allocationsfamilialesouchangementdesituation',
                        'msa': 'http://www.msa.fr/lfr/documents/11566/132715/D%C3%A9claration+de+situation+pour+les+prestations+familiales+et+aides+au+logement.pdf'
                    },
                    'entity': 'famille',
                    'isBaseRessourcesYearMoins2': true,
                    'type': 'float',
                },
                'asf': {
                    'label': 'Allocation de soutien familial',
                    'shortLabel': 'ASF',
                    'description': 'L’allocation de soutien familial (ASF) est destinée soit au parent qui élève seul un enfant non reconnu, privé de l’aide d’un parent ou dont l’autre parent est décédé, soit à la personne seule ou en couple qui recueille un enfant. L’ASF est versée par la Caf ou la MSA tous les mois.',
                    'conditions': [
                        'Ne pas toucher l’intégralité d’une pension alimentaire qui vous aurait été attribuée par une décision de justice, ou que cette pension soit d’un montant inférieur à celui de l’ASF.'
                    ],
                    'link': 'https://www.caf.fr/aides-et-services/s-informer-sur-les-aides/solidarite-et-insertion/l-allocation-de-soutien-familial-asf-0',
                    'form': 'https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/allocationdesoutienfamilial/!ut/p/a1/',
                    'forms': {
                        'caf': 'https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/allocationdesoutienfamilial/!ut/p/a1/',
                        'msa': 'http://www.msa.fr/lfr/documents/11566/48472/Demande+d%27allocation+de+soutien+familial+%28ASF%29.pdf'
                    },
                    'entity': 'famille',
                    'type': 'float',
                },
                'paje_base': {
                    'label': 'Prestation d’accueil du jeune enfant – Allocation de base',
                    'shortLabel': 'Paje-base',
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
                    'entity': 'famille',
                    'isBaseRessourcesYearMoins2': true,
                    'type': 'float',
                },
                'rsa': {
                    'label': 'Revenu de solidarité active',
                    'shortLabel': 'RSA',
                    'description': 'Le revenu de solidarité active (RSA) assure aux personnes sans ressources un niveau minimum de revenu variable selon la composition du foyer. Le RSA, le RSA parent isolé et le RSA jeunes parents sont simulés. Financé par les conseils départementaux, son versement se fait à travers la Caf ou la MSA.',
                    'conditions': [
                        'Signer un <a target="_blank" rel="noopener" href="http://social-sante.gouv.fr/affaires-sociales/lutte-contre-l-exclusion/droits-et-aides/le-revenu-de-solidarite-active-rsa/article/quels-sont-les-droits-et-devoirs-des-beneficiaires-du-rsa" title="Détails sur les droits et devoirs des bénéficiaires du RSA">contrat d’engagement réciproque</a> avec votre département.',
                        'Résider en France plus de 9 mois par an.',
                        'Si vous êtes ressortissant·e d’un pays de l’UE, de l’EEE ou Suisse, résider en France depuis plus de 3 mois.',
                        'Si vous êtes ressortissant·e d’un autre pays, résider en France depuis plus de 5 ans.'
                    ],
                    'link': 'https://www.service-public.fr/particuliers/vosdroits/N19775',
                    'form': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_15481.do',
                    'forms': {
                        'caf': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_15481.do',
                        'msa': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_15481.do'
                    },
                    'entity': 'famille',
                    'type': 'float',
                    'uncomputability': {
                        'tns': {
                            'reason': {
                                'secondPerson': 'vous avez des revenus en tant qu’indépendant·e',
                                'thirdPerson': 'le demandeur a des revenus en tant qu’indépendant·e',
                            },
                            'solution': 'Vous pouvez demander à bénéficier du RSA, mais c’est le président de votre conseil départemental qui <a target="_blank" rel="noopener" title="Article R262-23 du code de l’action sociale" href="https://www.legifrance.gouv.fr/affichCodeArticle.do?idArticle=LEGIARTI000028251799&cidTexte=LEGITEXT000006074069">décidera</a> de la manière dont vos revenus non salariés impacteront le montant de votre aide.',
                        },
                        'conjoint_tns': {
                            'reason': {
                                'secondPerson': 'votre conjoint·e a des revenus en tant qu’indépendant·e',
                                'thirdPerson': 'le conjoint du demandeur a des revenus en tant qu’indépendant·e',
                            },
                            'solution': 'Vous pouvez demander à bénéficier du RSA, mais c’est le président de votre conseil départemental qui <a target="_blank" rel="noopener" title="Article R262-23 du code de l’action sociale" href="https://www.legifrance.gouv.fr/affichCodeArticle.do?idArticle=LEGIARTI000028251799&cidTexte=LEGITEXT000006074069">décidera</a> de la manière dont les revenus non salariés de votre conjoint·e impacteront le montant de votre aide.',
                        }
                    }
                },
                'aide_logement': {
                    'label': 'Aides au logement',
                    'shortLabel': 'AL',
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
                    'entity': 'famille',
                    'isBaseRessourcesYearMoins2': true,
                    'type': 'float',
                    'uncomputability': {
                        'primo_accedant': {
                            'reason': {
                                'secondPerson': 'vous êtes <abbr title="Non propriétaire de votre résidence principale dans les deux années précédant l’achat de votre résidence actuelle">primo-accédant</abbr> à la propriété de votre résidence principale',
                                'thirdPerson': 'le demandeur est primo-accédant à la propriété de votre résidence principale',
                            },
                            'solution': 'Le <a target="_blank" rel="noopener" href="https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/estimervosdroits/lelogement">simulateur de la CAF</a> pourra estimer vos droits sur la base de la valeur de votre bien.',
                        },
                        'locataire_foyer': {
                            'reason': {
                                'secondPerson': 'vous logez dans un foyer',
                                'thirdPerson': 'le demandeur loge dans un foyer',
                            },
                            'solution': 'Le <a target="_blank" rel="noopener" href="https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/estimervosdroits/lelogement">simulateur de la CAF</a> vous donnera des estimations selon les différentes conventions possibles de votre foyer.',
                        }
                    }
                },
                'ppa': {
                    'label': 'Prime d’activité',
                    'shortLabel': 'PPA',
                    'description': 'La prime d’activité complète les revenus d’activité professionnelle des travailleurs de 18 ans ou plus, des étudiants salariés et apprentis et des non-salariés. La demande peut se faire à travers un téléservice sur, selon votre cas, le site de la Caf ou de la MSA. Elle remplace le RSA activité et la prime pour l’emploi depuis 2016.',
                    'link': 'https://www.service-public.fr/particuliers/vosdroits/F2882',
                    'teleservice': 'https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/demanderlaprimedactivite/',
                    'teleservices': {
                        'caf': 'https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/demanderlaprimedactivite/',
                        'msa': 'http://www.msa.fr/lfr/c/bookmarks/open_entry?entryId=44739105'
                    },
                    'entity': 'famille',
                    'type': 'float',
                },
                'aah': {
                    'isMontantAnnuel': false,
                    'label': 'Allocation aux adultes handicapés',
                    'shortLabel': 'AAH',
                    'description': 'L’allocation aux adultes handicapés (AAH) est une aide financière qui permet d’assurer un revenu minimum. Cette aide est attribuée sous réserve de respecter 4 critères : le taux d’incapacité, l’âge, la nationalité et les ressources. L’AAH peut se cumuler soit avec le complément de ressources, soit avec la majoration pour la vie autonome ou, dans certains cas, l’aide à l’autonomie.',
                    'link': 'https://www.service-public.fr/particuliers/vosdroits/F12242',
                    'form': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_13788.do',
                    'forms': {
                        'mdph': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_13788.do',
                    },
                    'isBaseRessourcesYearMoins2': true,
                    'entity': 'individu',
                    'type': 'float',
                    'uncomputability': {
                        'intervention_CDAPH_necessaire': {
                            'reason': {
                                'secondPerson': 'votre taux d’incapacité sera déterminé par la <abbr title="Commission des droits et de l’autonomie des personnes handicapées">CDAPH</abbr> après le dépôt de votre demande',
                                'thirdPerson': 'le taux d’incapacité du demandeur doit être déterminé par la CDAPH',
                            },
                            'solution': 'Contactez <a target="_blank" rel="noopener" href="https://informations.handicap.fr/carte-france-mdph.php">la <abbr title="Maison départementale des personnes handicapées">MDPH</abbr> la plus proche</a> pour faire établir ce taux. Attention, votre éligibilité à l’AAH peut impacter vos droits au RSA et à la CMU-C.',
                        }
                    },
                },
            },
        },
        'pole_emploi': {
            'label': 'Pôle emploi',
            'imgSrc': 'logo_pole_emploi.png',
            'prestations': {
                'ass': {
                    'label': 'Allocation de solidarité spécifique',
                    'shortLabel': 'ASS',
                    'description': 'L’allocation de solidarité spécifique (ASS) est attribuée aux personnes ayant épuisé leurs droits au chômage sous conditions d’activité antérieure et de ressources. Elle peut être versée à taux plein ou à taux réduit. En cas de reprise d’activité, elle peut être maintenue.',
                    'link': 'https://www.service-public.fr/particuliers/vosdroits/F12484',
                    /* En principe, formulaire envoyé automatiquement ; lien vers brochure pole emploi */
                    'instructions': 'http://www.pole-emploi.fr/front/common/tools/download_file.jspz?mediaid=186108',
                    'entity': 'famille',
                    'type': 'float',
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
                    'shortLabel': 'Bourse col',
                    'description': 'La bourse de collège est une aide destinée à favoriser la scolarité des collégiens. Elle est versée aux familles ayant de faibles ressources. Son montant dépend du nombre d’enfants à charge. Vous devez déposer votre dossier de demande entre la rentrée scolaire et la fin du mois de septembre.',
                    'link': 'https://www.service-public.fr/particuliers/vosdroits/F984',
                    'form': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_12539.do',
                    'forms': {
                        '2016-17': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_12539.do'
                    },
                    'entity': 'famille',
                    'isBaseRessourcesYearMoins2': true,
                    'type': 'float',
                },
                'bourse_lycee': {
                    'isMontantAnnuel': true,
                    'label': 'Bourse de lycée',
                    'shortLabel': 'Bourse lyc',
                    'description': 'La bourse de lycée est accordée aux responsables d’un lycéen qui ont de faibles ressources. Si l’élève entre au lycée ou s’il n’a jamais touché de bourse de lycée, il pourra y prétendre selon les ressources et les charges de sa famille. Une nouvelle demande doit être effectuée en cas de redoublement ou réorientation.',
                    'link': 'https://www.service-public.fr/particuliers/vosdroits/F616',
                    'form': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_11319.do',
                    'forms': {
                        '2017-18': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_11319.do'
                    },
                    'entity': 'famille',
                    'isBaseRessourcesYearMoins2': true,
                    'type': 'float',
                },
            },
        },
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
                    'shortLabel': 'PLF',
                    'description': 'L’allocation Paris Logement Famille est destinée aux familles d’au moins deux enfants ou ayant un enfant handicapé. Elle leur permet de mieux supporter leurs dépenses de logement. L’aide est accordée pour une durée maximale d’un an. Elle peut être renouvelée en présentant un nouveau dossier.',
                    'conditions': [
                        'Avoir demandé le versements des aides logement auxquelles vous avez droit auprès de la CAF.',
                        'Ne toucher aucune autre prestation logement de la part de la mairie de Paris ou du département.'
                    ],
                    'link': 'http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#paris-logement-famille_7',
                    'form': 'https://api-site.paris.fr/images/73485',
                    'entity': 'famille',
                    'isBaseRessourcesYearMoins2': false,
                    'roundToNearest10': false,
                    'type': 'float',
                },
                'paris_forfait_famille': {
                    'isMontantAnnuel': true,
                    'label': 'Paris Forfait Famille',
                    'shortLabel': 'PFF',
                    'description': 'Paris Forfait Famille est une aide destinée aux familles nombreuses avec au moins trois enfants à charge. Elle peut se cumuler avec l’Allocation de Soutien aux Parents d’Enfants Handicapés. L’aide est accordée pour une durée maximale d’un an. Elle peut être renouvelée en présentant un nouveau dossier.',
                    'link': 'http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#paris-forfait-famille_2',
                    'form': 'https://api-site.paris.fr/images/74809',
                    'entity': 'famille',
                    'isBaseRessourcesYearMoins2': false,
                    'roundToNearest10': false,
                    'type': 'float',
                },
                'paris_logement_psol': {
                    'label': 'Paris Solidarité',
                    'shortLabel': 'PSOL',
                    'description': 'Paris Solidarité est destinée aux personnes âgées de 65 ans ou plus. L’aide peut être versée tous les mois à partir de 60 ans pour les personnes reconnus inaptes au travail. Elle a pour but de garantir aux foyers modestes un minimum de ressources. L’aide est accordée pour une durée maximale d’un an. À partir du 2<sup>e</sup> renouvellement, Paris Solidarité peut être accordée pour une durée maximale de deux ans.',
                    'conditions': [
                        'Percevoir tous les avantages légaux auxquels vous pouvez prétendre.',
                    ],
                    'link': 'http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#paris-solidarite_3',
                    'form': 'http://api-site-cdn.paris.fr/images/154848.pdf',
                    'entity': 'famille',
                    'isBaseRessourcesYearMoins2': false,
                    'roundToNearest10': false,
                    'type': 'float',
                },
                'paris_logement': {
                    'label': 'Paris Logement',
                    'shortLabel': 'PL',
                    'description': 'L’allocation Paris Logement est destinée aux personnes seules ou en couple sans ou avec un enfant. Elle leur permet de mieux supporter leurs dépenses de logement. Ils doivent être locataires en titre et titulaires du bail du logement occupé à titre principal. L’aide est accordée pour une durée maximale d’un an. À partir du 2<sup>e</sup> renouvellement, Paris Logement peut être accordée pour une durée maximale de deux ans.',
                    'conditions': [
                        'Avoir demandé le versement des aides logement auxquelles vous avez droit auprès de la CAF.',
                        'Ne toucher aucune autre prestation logement de la part de la mairie de Paris ou du département.'
                    ],
                    'link': 'http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#paris-logement_6',
                    'form': 'http://api-site-cdn.paris.fr/images/98406.pdf',
                    'entity': 'famille',
                    'isBaseRessourcesYearMoins2': false,
                    'roundToNearest10': false,
                    'type': 'float',
                },
                'paris_logement_aspeh': {
                    'label': 'Allocation de Soutien aux Parents d’Enfants Handicapés',
                    'shortLabel': 'ASPEH',
                    'description': 'L’Allocation de Soutien aux Parents d’Enfants Handicapés est réservée aux familles ayant à charge un ou plusieurs enfants handicapés. Son montant dépend du nombre de jours passés par le ou les enfants au domicile. L’aide est versée tous les mois et accordée pour un an. Elle peut être renouvelée en présentant un nouveau dossier.',
                    'link': 'http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#allocation-de-soutien-aux-parents-d-enfants-handicapes_9',
                    'form': 'http://api-site-cdn.paris.fr/images/132126.pdf',
                    'entity': 'famille',
                    'isBaseRessourcesYearMoins2': false,
                    'roundToNearest10': false,
                    'type': 'float',
                },
                'paris_logement_plfm': {
                    'label': 'Paris Logement Familles Monoparentales',
                    'shortLabel': 'PLFM',
                    'description': 'L’allocation Paris Logement Famille Monoparentale est destinée aux parents seuls, ayant un ou plusieurs enfants à charge. Elle leur permet de mieux supporter leurs dépenses de logement. Elle est ouverte aux locataires, aux propriétaires et aux personnes accédant à la propriété. L’aide est accordée pour un an. Elle peut être renouvelée en présentant un nouveau dossier.',
                    'conditions': [
                        'Avoir demandé le versement des aides logement auxquelles vous avez droit auprès de la CAF.',
                        'Ne toucher aucune autre prestation logement de la part de la mairie de Paris ou du département.'
                    ],
                    'link': 'http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#paris-logement-famille-monoparentale_5',
                    'form': 'https://api-site.paris.fr/images/72423',
                    'entity': 'famille',
                    'isBaseRessourcesYearMoins2': false,
                    'roundToNearest10': false,
                    'type': 'float',
                },
                'paris_energie_famille': {
                    'isMontantAnnuel': true,
                    'label': 'Paris Énergie Familles',
                    'shortLabel': 'PEF',
                    'description': 'L’allocation Paris Énergie Famille est réservée aux familles ayant un ou plusieurs enfants à charge, sous condition d’imposition. Cette aide permet de les soutenir dans leurs dépenses d’électricité et/ou de gaz. Paris Énergie Famille est directement versée aux fournisseurs d’énergie. L’aide est accordée pour un an. Elle peut être renouvelée en présentant un nouveau dossier.',
                    'link': 'http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#paris-energie-famille_8',
                    'form': 'https://api-site.paris.fr/images/154764.pdf',
                    'entity': 'famille',
                    'isBaseRessourcesYearMoins2': false,
                    'roundToNearest10': false,
                    'type': 'float',
                },
                'paris_complement_sante': {
                    'isMontantAnnuel': true,
                    'label': 'Complément Santé Paris',
                    'shortLabel': 'CSP',
                    'description': 'Le Complément Santé Paris est destiné aux personnes âgées de 65 ans ou plus. L’aide peut être versée à partir de 60 ans pour les personnes reconnues inaptes au travail. Elle a pour but d’aider les foyers modestes à obtenir une mutuelle. L’aide est accordée pour une durée maximale d’un an. À partir du 2<sup>e</sup> renouvellement, le Complément Santé Paris peut être accordé pour une durée maximale de deux ans.',
                    'link': 'http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#complement-sante-paris_10',
                    'form': 'https://api-site.paris.fr/images/78343',
                    'entity': 'famille',
                    'isBaseRessourcesYearMoins2': false,
                    'roundToNearest10': false,
                    'type': 'float',
                }
            }
        },
        'cd93': {
            'imgSrc': 'logo_cd93.png',
            'label': 'Département de Seine-Saint-Denis',
            'prefix': 'du',
            'prestations': {
                'adpa': {
                    'isMontantAnnuel': false,
                    'unit': '%',
                    'legend': 'des frais de dépendance',
                    'label': 'Allocation départementale personnalisée d’autonomie',
                    'shortLabel': 'ADPA',
                    'description': 'L’Allocation Départementale Personnalisée d’Autonomie (ADPA) permet de financer une partie des dépenses nécessaires à votre maintien à domicile ou de couvrir une partie des frais liés à votre accueil en établissement. Elle est versée aux personnes âgées de 60 ans ou plus en perte d’autonomie.',
                    'conditions': [],
                    'link': 'https://www.seine-saint-denis.fr/ADPA.html',
                    'form': 'https://www.seine-saint-denis.fr/IMG/pdf/formulaire_demande_adpa_mai_2016_vdef.pdf',
                    'entity': 'famille',
                    'isBaseRessourcesYearMoins2': false,
                    'type': 'float',
                },
            }
        },
        'rennes_metropole': {
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
                    'shortLabel': 'Transport',
                    'description': 'La tarification solidaire est une réduction de 50 %, 85 % ou 100 % (gratuité) de l’abonnement mensuel du réseau de transports en commun Star. La réduction s’applique également au service Handistar. Elle est accordée aux familles de Rennes Métropole ayant de faibles ressources. La tarification est accordée à tous les membres du foyer.',
                    'link': 'http://metropole.rennes.fr/pratique/infos-demarches/deplacements-stationnement-voirie/tarification-solidaire-des-transports/',
                    'instructions': 'http://metropole.rennes.fr/pratique/infos-demarches/deplacements-stationnement-voirie/tarification-solidaire-des-transports/#c33081',
                    'entity': 'individu',
                    'isBaseRessourcesYearMoins2': false,
                    'type': 'float',
                },
            }
        }
    }
};

/* Export either through Angular loader or CommonJS */
if (typeof module != 'undefined') {  // we're in Node
    module.exports = droitsDescription;
} else {  // we're in the browser
    angular.module('ddsCommon').constant('droitsDescription', droitsDescription);
}
/* End of export */
})();
