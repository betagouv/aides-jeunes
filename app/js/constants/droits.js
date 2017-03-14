'use strict';

angular.module('ddsCommon').constant('droitsDescription', {
    'prestationsNationales': {
        'assurance_retraite': {
            'label': 'Assurance retraite',
            'imgSrc': 'logo_assurance_retraite.png',
            'prestations': {
                'aspa': {
                    'label': 'Allocation de solidarité aux personnes âgées',
                    'shortLabel': 'ASPA',
                    'description': 'L’allocation de solidarité aux personnes âgées (Aspa) est une allocation destinée aux personnes âgées disposant de faibles revenus en vue de leur assurer un niveau minimum de ressources. Elle remplace le minimum vieillesse depuis 2006.',
                    'conditions': [
                        'Résider <abbr title="Métropole, Guadeloupe, Guyane, Martinique ou Réunion">en France</abbr> plus de <abbr title="180 jours, potentiellement discontinus">6 mois</abbr> cette année.',
                        'Avoir demandé toutes les retraites (générale, réversion, complémentaire…) auxquelles vous avez droit.',
                        'Votre conjoint·e doit avoir demandé toutes les retraites (générale, réversion, complémentaire…) auxquelles il ou elle a droit.'
                    ],
                    'link': 'https://www.service-public.fr/particuliers/vosdroits/F16871',
                    'form': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_14957.do'
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
                    'description': 'L’aide pour l’acquisition d’une assurance complémentaire santé, dite ACS, est une aide financière pour payer une complémentaire santé (exemple : une mutuelle).',
                    'conditions': [
                        'Résider <abbr title="Métropole, Guadeloupe, Guyane, Martinique ou Réunion">en France</abbr> depuis plus de 3 mois.'
                    ],
                    'link': 'https://www.cmu.fr/acs.php',
                    'form': 'http://www.ameli.fr/fileadmin/user_upload/formulaires/S3711.pdf'
                },
                'asi': {
                    'label': 'Allocation supplémentaire d’invalidité',
                    'shortLabel': 'ASI',
                    'description': 'L’allocation supplémentaire d’invalidité (Asi) est une prestation versée sous certaines conditions aux personnes invalides titulaires d’une pension de retraite ou d’invalidité qui n’ont pas atteint l’âge légal de départ à la retraite pour bénéficier de l’allocation de solidarité aux personnes âgées (Aspa)',
                    'link': 'https://www.service-public.fr/particuliers/vosdroits/F16940'
                },
                'cmu_c': {
                    'label': 'Couverture maladie universelle complémentaire',
                    'shortLabel': 'CMU-C',
                    'description': 'La CMU-C est une protection complémentaire santé gratuite.',
                    'conditions': [
                        'Résider <abbr title="Métropole, Guadeloupe, Guyane, Martinique ou Réunion">en France</abbr> depuis plus de 3 mois.'
                    ],
                    'link': 'https://www.cmu.fr/cmu-complementaire.php',
                    'form': 'http://www.ameli.fr/fileadmin/user_upload/formulaires/S3711.pdf'
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
                    'description': 'Les allocations familiales sont versées aux personnes ayant au moins 2 enfants de moins de 20 ans à charge en métropole et dès le premier enfant dans les DOM. Le montant des prestations dépend du nombre d’enfants à charge, de leur âge et des ressources de la famille.',
                    'conditions': [
                        'Résider <abbr title="Métropole, Guadeloupe, Guyane, Martinique ou Réunion">en France</abbr> plus de <abbr title="180 jours, potentiellement discontinus">6 mois</abbr> cette année.'
                    ],
                    'link': 'https://www.caf.fr/aides-et-services/s-informer-sur-les-aides/petite-enfance/les-allocations-familiales-af-0',
                    'isBaseRessourcesYearMoins2': true
                },
                'cf': {
                    'label': 'Complément familial',
                    'shortLabel': 'CF',
                    'description': 'Le complément familial est versé, sous certaines conditions, aux personnes ayant au moins 3 enfants à charge.',
                    'link': 'https://www.caf.fr/aides-et-services/s-informer-sur-les-aides/enfance-et-jeunesse/le-complement-familialcf',
                    'isBaseRessourcesYearMoins2': true
                },
                'asf': {
                    'label': 'Allocation de soutien familial',
                    'shortLabel': 'ASF',
                    'description': 'L’ASF est versée par la CAF ou la MSA au parent qui élève seul son enfant ou à la personne qui a recueilli un enfant, qu’elle vive seule ou en couple.',
                    'conditions': [
                        'Ne pas toucher l’intégralité d’une pension alimentaire qui vous aurait été attribuée par une décision de justice, ou que cette pension soit d’un montant inférieur à celui de l’ASF.'
                    ],
                    'link': 'https://www.caf.fr/aides-et-services/s-informer-sur-les-aides/solidarite-et-insertion/l-allocation-de-soutien-familial-asf-0'
                },
                'paje_base': {
                    'label': 'Prestation d’accueil du jeune enfant – Allocation de base',
                    'shortLabel': 'PAJE-BASE',
                    'description': 'L’allocation de base vous aide à assurer les dépenses liées à l’entretien et à l’éducation de votre enfant.',
                    'link': 'https://www.caf.fr/aides-et-services/s-informer-sur-les-aides/petite-enfance/l-allocation-de-base',
                    'isBaseRessourcesYearMoins2': true
                },
                'rsa': {
                    'label': 'Revenu de solidarité active',
                    'shortLabel': 'RSA',
                    'description': 'Le revenu de solidarité active (RSA) assure aux personnes sans ressources un niveau minimum de revenu variable selon la composition du foyer. Mes Aides permet de simuler le RSA, le RSA parent isolé et le RSA jeunes parents. Géré par les conseils départementaux, son versement se fait à travers la Caf ou la MSA.',
                    'conditions': [
                        'Signer un <a target="_blank" rel="noopener" href="http://social-sante.gouv.fr/affaires-sociales/lutte-contre-l-exclusion/droits-et-aides/le-revenu-de-solidarite-active-rsa/article/quels-sont-les-droits-et-devoirs-des-beneficiaires-du-rsa" title="Détails sur les droits et devoirs des bénéficiaires du RSA">contrat d’engagement réciproque</a> avec votre département.',
                        'Résider en France plus de 9 mois par an.',
                        'Si vous êtes ressortissant·e d’un pays de l’UE, de l’EEE ou Suisse, résider en France depuis plus de 3 mois.',
                        'Si vous êtes ressortissant·e d’un autre pays, résider en France depuis plus de 5 ans.'
                    ],
                    'link': 'https://www.service-public.fr/particuliers/vosdroits/N19775',
                    'form': 'https://www.formulaires.modernisation.gouv.fr/gf/cerfa_15481.do',
                    'uncomputability': {
                        'tns': {
                            'reason': 'vous avez des revenus en tant qu’indépendant·e',
                            'solution': 'Vous pouvez demander à bénéficier du RSA, mais c’est le président de votre conseil départemental qui <a target="_blank" rel="noopener" title="Article R262-23 du code de l’action sociale" href="https://www.legifrance.gouv.fr/affichCodeArticle.do?idArticle=LEGIARTI000028251799&cidTexte=LEGITEXT000006074069">décidera</a> de la manière dont vos revenus non salariés impacteront le montant de votre aide.'
                        },
                        'conjoint_tns': {
                            'reason': 'votre conjoint·e a des revenus en tant qu’indépendant·e',
                            'solution': 'Vous pouvez demander à bénéficier du RSA, mais c’est le président de votre conseil départemental qui <a target="_blank" rel="noopener" title="Article R262-23 du code de l’action sociale" href="https://www.legifrance.gouv.fr/affichCodeArticle.do?idArticle=LEGIARTI000028251799&cidTexte=LEGITEXT000006074069">décidera</a> de la manière dont les revenus non salariés de votre conjoint·e impacteront le montant de votre aide.'
                        }
                    }
                },
                'aide_logement': {
                    'label': 'Aides au logement',
                    'shortLabel': 'AL',
                    'description': 'L’aide au logement est une aide financière destinée à réduire le montant de votre loyer ou votre mensualité d’emprunt immobilier. Elle est attribuée selon la nature de votre logement et la composition de votre famille.',
                    'conditions': [
                        'Résider au moins 8 mois par an dans le logement que vous avez décrit.',
                        'Le logement doit être <a target="_blank" rel="noopener" href="https://www.caf.fr/aides-et-services/connaitre-vos-droits-selon-votre-situation/vous-louez-ou-vous-achetez-un-logement/vous-occupez-un-logement-insalubre-ou-non-decent" title="9 mètres carrés par personne, fenêtre, WC, eau potable, électricité" >décent</a>.'
                    ],
                    'link': 'https://www.caf.fr/aides-et-services/s-informer-sur-les-aides/logement-et-cadre-de-vie/les-aides-au-logement-0',
                    'teleservice': 'https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/demanderlaideaulogement/',
                    'isBaseRessourcesYearMoins2': true,
                    'uncomputability': {
                        'primo_accedant': {
                            'reason': 'vous êtes <abbr title="Non propriétaire de votre résidence principale dans les deux années précédant l’achat de votre résidence actuelle">primo-accédant</abbr> à la propriété de votre résidence principale',
                            'solution': 'Le <a target="_blank" rel="noopener" href="https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/estimervosdroits/lelogement">simulateur de la CAF</a> pourra estimer vos droits sur la base de la valeur de votre bien.'
                        },
                        'locataire_foyer': {
                            'reason': 'vous logez dans un foyer',
                            'solution': 'Le <a target="_blank" rel="noopener" href="https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/estimervosdroits/lelogement">simulateur de la CAF</a> vous donnera des estimations selon les différentes conventions possibles de votre foyer.'
                        }
                    }
                },
                'ppa': {
                    'label': 'Prime d’activité',
                    'description': 'La Prime d’activité remplace le RSA activité et la prime pour l’emploi depuis janvier 2016. Elle complète les ressources des personnes qui travaillent et ont des revenus modestes, salariées ou non.',
                    'link': 'https://www.caf.fr/actualites/2015/une-nouvelle-prestation-a-l-horizon-2016-la-prime-d-activite',
                    'teleservice': 'https://wwwd.caf.fr/wps/portal/caffr/aidesetservices/lesservicesenligne/faireunedemandedeprestation/demanderlaprimedactivite/'
                },
                'aah': {
                    'isMontantAnnuel': false,
                    'label': 'Allocation aux adultes handicapés',
                    'shortLabel': 'AAH',
                    'description': 'L’AAH est une aide financière qui permet d’assurer un revenu minimum aux adultes handicapés.',
                    'isBaseRessourcesYearMoins2': true,
                    'uncomputability': {
                        'intervention_CDAPH_necessaire': {
                            'reason': 'votre taux d’incapacité sera déterminé par la <abbr title="Commission des droits et de l’autonomie des personnes handicapées">CDAPH</abbr> après le dépôt de votre demande',
                            'solution': 'Contactez <a target="_blank" rel="noopener" href="https://informations.handicap.fr/carte-france-mdph.php">la <abbr title="Maison départementale des personnes handicapées">MDPH</abbr> la plus proche</a> pour faire établir ce taux. Attention, votre éligibilité à l’AAH peut impacter vos droits au RSA et à la CMU-C.'
                        }
                    },
                    'link': 'https://www.service-public.fr/particuliers/vosdroits/F12242'
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
                    'description': 'L’allocation de solidarité spécifique (ASS) est une aide financière destinée aux personnes ayant épuisé leurs droits aux allocations chômage.',
                    'link': 'https://www.service-public.fr/particuliers/vosdroits/F12484'
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
                    'shortLabel': 'Bourse collège',
                    'description': 'La bourse des collèges est une aide destinée à favoriser la scolarité des collégiens. Elle est versée sous conditions de ressources.',
                    'link': 'http://www.education.gouv.fr/cid88/les-aides-financieres-au-college.html#Les%20bourses%20de%20coll%C3%A8ge',
                    'isBaseRessourcesYearMoins2': true
                },
                'bourse_lycee': {
                    'isMontantAnnuel': true,
                    'label': 'Bourse de lycée',
                    'shortLabel': 'Bourse lycée',
                    'description': 'La bourse des lycées est accordée, sous condition de ressources, à la famille d’un lycéen. Son montant dépend des ressources et des charges de la famille. Cette bourse peut être accompagnée de diverses primes (prime d’équipement, prime à la qualification, bourse au mérite au lycée, prime à l’internat...).',
                    'link': 'http://www.education.gouv.fr/cid151/aides-financieres-au-lycee.html#Les%20bourses%20de%20lycée',
                    'isBaseRessourcesYearMoins2': true
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
                    'label': 'Paris Logement Familles',
                    'shortLabel': 'PLF',
                    'description': 'L’allocation Paris Logement Familles permet aux familles parisiennes de mieux supporter leurs dépenses de logement.',
                    'conditions': [
                        'Avoir demandé le versements des aides logement auxquelles vous avez droit auprès de la CAF.',
                        'Ne toucher aucune autre prestation logement de la part de la mairie de Paris ou du département.'
                    ],
                    'link': 'http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#paris-logement-famille_7',
                    'form': '/documents/Formulaire_demande_PLF.pdf',
                    'isBaseRessourcesYearMoins2': false,
                    'roundToNearest10': false,
                },
                'paris_forfait_famille': {
                    'isMontantAnnuel': true,
                    'label': 'Paris Forfait Familles',
                    'shortLabel': 'PFF',
                    'description': 'Paris Forfait Familles est une aide annuelle destinée aux familles nombreuses.',
                    'link': 'http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#paris-forfait-famille_2',
                    'form': 'https://api-site.paris.fr/images/74809',
                    'isBaseRessourcesYearMoins2': false,
                    'roundToNearest10': false
                },
                'paris_logement_psol': {
                    'label': 'Paris Solidarité',
                    'shortLabel': 'PSOL',
                    'description': 'Paris Solidarité est un complément de ressources mensuelles',
                    'conditions': [
                        'Percevoir tous les avantages légaux auxquels vous pouvez prétendre.',
                    ],
                    'link': 'http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#paris-solidarite_3',
                    'form': 'http://api-site-cdn.paris.fr/images/154848.pdf',
                    'isBaseRessourcesYearMoins2': false,
                    'roundToNearest10': false
                },
                'paris_logement': {
                    'label': 'Paris Logement',
                    'shortLabel': 'PL',
                    'description': 'Paris Logement est une aide mensuelle destinée à aider les parisiens à mieux supporter leurs dépenses de logement.',
                    'conditions': [
                        'Avoir demandé le versement des aides logement auxquelles vous avez droit auprès de la CAF.',
                        'Ne toucher aucune autre prestation logement de la part de la mairie de Paris ou du département.'
                    ],
                    'link': 'http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#paris-logement_6',
                    'form': 'http://api-site-cdn.paris.fr/images/98406.pdf',
                    'isBaseRessourcesYearMoins2': false,
                    'roundToNearest10': false
                },
                'paris_logement_aspeh': {
                    'label': 'Allocation de Soutien aux Parents d’Enfants Handicapés',
                    'shortLabel': 'ASPEH',
                    'description': 'L’Allocation de Soutien aux Parents d’Enfants Handicapés est une aide mensuelle permettant de soutenir les familles ayant un ou plusieurs enfants handicapés à charge.',
                    'link': 'http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#allocation-de-soutien-aux-parents-d-enfants-handicapes_9',
                    'form': 'http://api-site-cdn.paris.fr/images/132126.pdf',
                    'isBaseRessourcesYearMoins2': false,
                    'roundToNearest10': false
                },
                'paris_logement_plfm': {
                    'label': 'Paris Logement Familles Monoparentales',
                    'shortLabel': 'PLFM',
                    'description': 'L’allocation Paris Logement Familles Monoparentales permet aux parents seuls, ayant un ou plusieurs enfants à charge, de mieux supporter leurs dépenses de logement.',
                    'conditions': [
                        'Avoir demandé le versement des aides logement auxquelles vous avez droit auprès de la CAF.',
                        'Ne toucher aucune autre prestation logement de la part de la mairie de Paris ou du département.'
                    ],
                    'link': 'http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#paris-logement-famille-monoparentale_5',
                    'form': 'https://api-site.paris.fr/images/72423',
                    'isBaseRessourcesYearMoins2': false,
                    'roundToNearest10': false
                },
                'paris_energie_famille': {
                    'isMontantAnnuel': true,
                    'label': 'Paris Énergie Familles',
                    'shortLabel': 'PEF',
                    'description': 'Paris Énergie Familles est une aide annuelle permettant aux familles d’alléger leurs dépenses de consommation d’électricité et de gaz.',
                    'link': 'http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#paris-energie-famille_8',
                    'form': 'https://api-site.paris.fr/images/154764.pdf',
                    'isBaseRessourcesYearMoins2': false,
                    'roundToNearest10': false
                },
                'paris_complement_sante': {
                    'isMontantAnnuel': true,
                    'label': 'Complément Santé Paris',
                    'shortLabel': 'CSP',
                    'description': 'Le Complément Santé Paris est une allocation qui permet de participer aux frais d’adhésion à une couverture complémentaire santé (mutuelle ou autre organisme analogue)',
                    'link': 'http://www.paris.fr/services-et-infos-pratiques/aides-et-demarches/aides-allocations-et-subventions/simulateur-mes-aides-gouv-fr-pour-la-ville-de-paris-3626#complement-sante-paris_10',
                    'form': 'https://api-site.paris.fr/images/78343',
                    'isBaseRessourcesYearMoins2': false,
                    'roundToNearest10': false
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
                    'description': 'Allocation versée aux personnes dépendantes âgées de plus de 60 ans. Elle a pour objectif de financer des services d’aide à la personne favorisant leur autonomie dans les gestes quotidiens.',
                    'conditions': [],
                    'link': 'https://www.seine-saint-denis.fr/ADPA.html',
                    'form': 'https://www.seine-saint-denis.fr/IMG/pdf/formulaire_demande_adpa_mai_2016_vdef.pdf',
                    'isBaseRessourcesYearMoins2': false
                },
            }
        }
    }
});
