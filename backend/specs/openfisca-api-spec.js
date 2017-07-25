module.exports = {
    'definitions': {
        'Brackets': {
            'additionalProperties': {
                'format': 'float',
                'type': 'number'
            },
            'type': 'object'
        },
        'Famille': {
            'additionalProperties': false,
            'properties': {
                'parisien': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'adpa': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'paris_complement_sante': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'paris_energie_famille': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'paris_logement_plfm': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'paris_logement_aspeh': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'paris_logement': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'paris_logement_psol': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'paris_forfait_famille': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'paris_logement_familles': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aah_base_ressources': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'acs': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'acs_montant': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'acs_plafond': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ada': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aeeh': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aefa': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'af': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'af_age_aine': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'af_allocation_forfaitaire': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'af_allocation_forfaitaire_complement_degressif': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'af_allocation_forfaitaire_nb_enfants': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'af_allocation_forfaitaire_taux_modulation': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'af_base': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'af_coeff_garde_alternee': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'af_complement_degressif': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'af_eligibilite_base': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'af_eligibilite_dom': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'af_majoration': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'af_nbenf': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'af_nbenf_fonc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'af_taux_modulation': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aide_logement': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aide_logement_R0': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aide_logement_base_ressources': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aide_logement_base_ressources_defaut': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aide_logement_base_ressources_eval_forfaitaire': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aide_logement_charges': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aide_logement_loyer_plafond': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aide_logement_loyer_reel': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aide_logement_loyer_retenu': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aide_logement_loyer_seuil_degressivite': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aide_logement_loyer_seuil_suppression': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aide_logement_montant': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aide_logement_montant_brut': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aide_logement_montant_brut_avant_degressivite': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aide_logement_neutralisation_rsa': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aide_logement_non_calculable': {
                    'additionalProperties': {
                        'type': 'Enumeration'
                    },
                    'type': 'object'
                },
                'aide_logement_participation_personnelle': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aide_logement_taux_famille': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aide_logement_taux_loyer': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aides_logement': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'al_couple': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'al_nb_personnes_a_charge': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'alf': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'als': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'als_etudiant': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'als_non_etudiant': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ape': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ape_avant_cumul': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'api': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'apje': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'apje_avant_cumul': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'apl': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ars': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'asf': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'asf_elig': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'asi': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'asi_aspa_base_ressources': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'asi_aspa_nb_alloc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'asile_demandeur': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'aspa': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aspa_couple': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'ass': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ass_base_ressources': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ass_mat': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'biactivite': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'bourse_college': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'bourse_college_echelon': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'bourse_lycee': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'bourse_lycee_echelon': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'bourse_lycee_nombre_parts': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'bourse_lycee_points_de_charge': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cf': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cf_eligibilite_base': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'cf_eligibilite_dom': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'cf_majore_avant_cumul': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cf_majore_plafond': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cf_montant': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cf_non_majore_avant_cumul': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cf_plafond': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cf_ressources': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cmu_acs_eligibilite': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'cmu_base_ressources': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cmu_c': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'cmu_c_plafond': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cmu_eligible_majoration_dom': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'cmu_forfait_logement_al': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cmu_forfait_logement_base': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cmu_nb_pac': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'cmu_nbp_foyer': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'crds_logement': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'crds_mini': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'crds_pfam': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'empl_dir': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'en_couple': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'enceinte_fam': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'enfants': {
                    'items': {
                        'type': 'string'
                    },
                    'type': 'array'
                },
                'gar_dom': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'inactif': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'maries': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'minima_sociaux': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'minimum_vieillesse': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'nb_parents': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'opt_colca': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'paje': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'paje_base': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'paje_clca': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'paje_clca_taux_partiel': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'paje_clca_taux_plein': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'paje_cmg': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'paje_colca': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'paje_naissance': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'paje_prepare': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'parents': {
                    'items': {
                        'type': 'string'
                    },
                    'type': 'array'
                },
                'partiel1': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'partiel2': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'place_hebergement': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'ppa': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ppa_base_ressources': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ppa_base_ressources_prestations_familiales': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ppa_eligibilite': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'ppa_eligibilite_etudiants': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'ppa_fictive': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ppa_montant_forfaitaire_familial_majore': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ppa_montant_forfaitaire_familial_non_majore': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ppa_ressources_hors_activite': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ppa_revenu_activite': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'prestations_familiales': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'prestations_familiales_base_ressources': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'prestations_sociales': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'proprietaire_proche_famille': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'psa': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rmi': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rsa': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rsa_activite': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rsa_base_ressources': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rsa_base_ressources_minima_sociaux': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rsa_base_ressources_prestations_familiales': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rsa_eligibilite': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'rsa_eligibilite_tns': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'rsa_fictif': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rsa_forfait_asf': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rsa_forfait_logement': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rsa_isolement_recent': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'rsa_majore_eligibilite': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'rsa_montant': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rsa_nb_enfants': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'rsa_non_calculable': {
                    'additionalProperties': {
                        'type': 'Enumeration'
                    },
                    'type': 'object'
                },
                'rsa_revenu_activite': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rsa_socle': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rsa_socle_majore': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                }
            },
            'type': 'object'
        },
        'Formula': {
            'properties': {
                'content': {
                    'type': 'string'
                },
                'source': {
                    'type': 'string'
                }
            },
            'type': 'object'
        },
        'Foyer_Fiscal': {
            'additionalProperties': false,
            'properties': {
                'abat_spe': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'accult': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'acqgpl': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'adhcga': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aidmob': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aidper': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ass_isf': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'assiette_proflib': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'assiette_service': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'assiette_vente': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'assloy': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'assvie': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'autent': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'avantage_qf': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'avf': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'b1ab': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'b1ac': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'b1bc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'b1be': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'b1bh': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'b1bk': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'b1cb': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'b1cd': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'b1ce': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'b1cf': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'b1cg': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'b1cl': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'b1co': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'b2gh': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'b2mt': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'b2mv': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'b2mx': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'b2na': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'b2nc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'b2ne': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'b2nf': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'b4rs': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'bouclier_fiscal': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'bouclier_imp_gen': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'bouclier_rev': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'bouclier_sumimp': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cappme': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'caseE': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'caseF': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'caseG': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'caseH': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'caseK': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'caseL': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'caseN': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'caseP': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'caseS': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'caseT': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'caseW': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'cd1': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cd2': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cd_acc75a': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cd_deddiv': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cd_doment': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cd_eparet': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cd_sofipe': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cehr': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'celibataire_ou_divorce': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'charges_deduc': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ci_garext': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cont_rev_loc': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cotsoc_bar': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cotsoc_lib': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cotsyn': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'crds_cap_bar': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'crds_cap_lib': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'crds_fon': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'crds_pv_immo': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'crds_pv_mo': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'creaen': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'credits_impot': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'creimp': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'creimp_exc_2008': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'csg_cap_bar': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'csg_cap_lib': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'csg_deduc': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'csg_deduc_patrimoine': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'csg_deduc_patrimoine_simulated': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'csg_fon': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'csg_pv_immo': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'csg_pv_mo': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'daepad': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'declarants': {
                    'items': {
                        'type': 'string'
                    },
                    'type': 'array'
                },
                'decote': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'decote_gain_fiscal': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'decote_isf': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'defacc': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'deffor': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'deficit_ante': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'deficit_rcm': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'defmeu': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'defncn': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'defrag': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'dfppce': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'direpa': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'divide': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'doment': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'domlog': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'domsoc': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'donapd': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'drbail': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'duflot': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ecodev': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ecpess': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'elig_creimp_exc_2008': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'epargne_codeveloppement': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'f1ar': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'f1aw': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f1br': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'f1bw': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f1cr': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'f1cw': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f1dr': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'f1dw': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f1er': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'f2aa': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f2ab': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f2al': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f2am': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f2an': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f2aq': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f2ar': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f2as': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f2bg': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f2bh': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f2ca': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f2cg': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f2ch': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f2ck': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f2da': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f2dc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f2dh': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f2dm': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f2ee': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f2fu': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f2go': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f2gr': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f2tr': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f2ts': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f3sa': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f3sd': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f3sf': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f3si': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f3vc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f3ve': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f3vg': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f3vh': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f3vl': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f3vm': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f3vt': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f3vu': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f3vv': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f3vv_end_2010': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f3vz': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f4ba': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f4bb': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f4bc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f4bd': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f4be': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f4bf': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f4bl': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f4tq': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f5ga': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f5gb': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f5gc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f5gd': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f5ge': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f5gf': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f5gg': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f5gh': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f5gi': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f5gj': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f5ht': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f5it': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f5jt': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f5kt': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f5lt': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f5mt': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f5qf': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f5qg': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f5qn': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f5qo': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f5qp': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f5qq': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f5rn': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f5ro': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f5rp': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f5rq': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f5rr': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f5rw': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f6aa': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f6cb': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f6cc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f6da': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f6dd': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f6de': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f6eh': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f6el': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f6em': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f6eu': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f6ev': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f6fa': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f6fb': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f6fc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f6fd': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f6fe': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f6fl': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f6gh': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f6gi': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f6gj': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f6gp': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f6gu': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f6hj': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f6hk': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f6hl': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f6hm': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7cc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7cd': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ce': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7cf': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7cl': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7cm': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7cn': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7cq': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7cu': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7db': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7df': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7dg': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'f7dl': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7dq': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'f7ea': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7eb': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ec': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ed': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ef': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7eg': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7fa': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7fb': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7fc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7fd': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ff': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7fg': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7fh': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7fl': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7fm': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7fn': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7fq': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7fy': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ga': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7gb': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7gc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ge': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7gf': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7gg': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7gh': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7gi': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7gj': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7gk': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7gl': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7gn': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7gp': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7gq': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7gs': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7gt': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7gu': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7gv': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7gw': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7gx': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7gy': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7gz': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ha': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7hb': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7hd': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7he': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7hf': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7hg': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7hh': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7hj': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7hk': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7hl': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7hm': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7hn': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ho': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7hr': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7hs': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ht': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7hu': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7hv': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7hw': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7hx': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7hy': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7hz': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ia': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ib': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ic': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7id': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ie': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7if': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ig': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ih': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ij': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ik': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7il': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7im': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7in': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7io': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ip': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7iq': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ir': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7is': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7it': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7iu': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7iv': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7iw': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ix': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7iy': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7iz': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ja': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7jb': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7jc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7jd': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7je': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7jf': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7jg': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7jh': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ji': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7jj': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7jk': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7jl': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7jm': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7jn': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7jo': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7jp': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7jq': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7jr': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7js': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7jt': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ju': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7jv': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7jw': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7jx': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7jy': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ka': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7kb': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7kc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7kd': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7kg': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7kh': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ki': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ks': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7kt': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ku': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ky': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7la': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7lb': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7lc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ld': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7le': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7lf': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7lg': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7lh': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7li': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7lm': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ls': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ly': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7lz': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ma': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7mb': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7mc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7mg': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7mm': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7mn': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7my': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7na': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7nb': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7nc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7nd': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ne': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7nf': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ng': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7nh': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ni': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7nj': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7nk': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7nl': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7nm': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7nn': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7no': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7np': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7nq': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7nr': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ns': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7nt': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7nu': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7nv': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7nw': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7nx': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ny': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7nz': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7oa': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ob': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7oc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7oh': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7oi': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7oj': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ok': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ol': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7om': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7on': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7oo': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7op': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7oq': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7or': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7os': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ot': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ou': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ov': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ow': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7oz': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7pa': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7pb': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7pc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7pd': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7pe': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7pf': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7pg': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ph': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7pi': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7pj': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7pk': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7pl': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7pm': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7pn': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7po': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7pp': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7pq': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7pr': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ps': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7pt': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7pu': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7pv': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7pw': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7px': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7py': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7pz': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7qb': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7qc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7qd': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7qe': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7qf': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7qg': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7qh': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7qi': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7qj': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7qk': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ql': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7qm': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7qn': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7qo': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7qp': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7qq': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7qr': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7qs': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7qt': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7qu': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7qv': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7qw': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7qx': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7qz': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ra': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7rb': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7rc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7rd': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7re': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7rf': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7rg': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7rh': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ri': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7rj': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7rk': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7rl': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7rm': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7rn': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ro': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7rp': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7rq': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7rr': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7rs': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7rt': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ru': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7rv': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7rw': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7rx': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ry': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7rz': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7sb': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7sc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7sd': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7se': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7sf': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7sg': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7sh': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7si': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7sj': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7sk': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7sl': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7sm': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7sn': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7so': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7sp': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7sq': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7sr': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ss': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7st': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7su': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7sv': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7sw': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7sx': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7sy': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7sz': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7td': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7te': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7tf': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7tg': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7th': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7tt': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7tu': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7tv': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7tw': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7tx': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ty': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ua': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ub': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7uc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ud': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7uf': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7uh': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7uh_2007': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ui': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7uj': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7uk': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ul': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7um': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7un': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7uo': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7up': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7uq': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ur': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7us': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ut': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7uu': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7uv': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7uw': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ux': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7uy': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7uz': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7va': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7vc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ve': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7vf': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7vg': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7vo': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7vt': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7vu': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7vv': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7vw': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7vx': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7vy': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7vz': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7wa': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7wb': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7wc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7we': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'f7wf': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'f7wg': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'f7wh': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'f7wi': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7wj': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7wk': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'f7wl': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7wm': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7wn': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7wo': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7wp': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7wq': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'f7wr': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ws': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'f7wt': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'f7wu': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'f7wv': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'f7ww': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'f7wx': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'f7xa': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7xb': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7xc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7xd': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'f7xe': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'f7xf': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7xg': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7xh': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7xi': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7xj': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7xk': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7xl': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7xm': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7xn': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7xo': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7xp': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7xq': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7xr': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7xs': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7xt': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7xu': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7xv': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7xw': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7xx': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7xy': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7xz': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f8ta': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f8tb': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f8tc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f8td': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'f8td_2002_2005': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f8te': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f8tf': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f8tg': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f8th': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f8ti': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f8tk': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f8tl': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f8to': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f8tp': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f8ts': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f8tz': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f8uw': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f8uy': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f8uz': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f8wa': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f8wb': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f8wc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f8wc__2008': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f8wd': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f8we': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f8wr': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f8ws': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f8wt': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f8wu': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f8wv': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f8wx': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhod': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhoe': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhof': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhog': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhox': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhoy': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhoz': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhra': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhrb': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhrc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhrd': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhsa': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhsb': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhsc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhsd': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhse': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhsf': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhsg': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhsh': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhsi': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhsj': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhsk': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhsl': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhsm': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhsn': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhso': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhsp': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhsq': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhsr': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhss': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhst': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhsu': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhsv': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhsw': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhsx': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhsy': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhsz': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhta': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhtb': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhtc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fhtd': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'fon': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'foyer_impose': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'garext': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'grosses_reparations': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'iai': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'iaidrdi': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'imp_lib': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'indu_plaf_abat_pen': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'intagr': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'intcon': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'intemp': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'inthab': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'invfor': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'invlst': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'invrev': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ip_net': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ir_brut': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ir_plaf_qf': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ir_pv_immo': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ir_ss_qf': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'irpp': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'isf_actions_sal': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'isf_apres_plaf': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'isf_avant_plaf': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'isf_avant_reduction': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'isf_droits_sociaux': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'isf_iai': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'isf_imm_bati': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'isf_imm_non_bati': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'isf_inv_pme': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'isf_org_int_gen': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'isf_reduc_pac': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'isf_tot': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'jeune_veuf': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'jeunes': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'jour_xyz': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'locmeu': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'macc_mvct': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'maries_ou_pacses': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'mbic_mvct': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'mecena': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'microentreprise': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'microsocial': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'mncn_mvct': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'mohist': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'nat_imp': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'nbF': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'nbG': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'nbH': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'nbI': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'nbJ': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'nbN': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'nbR': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'nb_adult': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'nb_pac': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'nb_pac2': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'nbptr': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'patnat': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'pensions_alimentaires_deduites': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'pensions_alimentaires_versees': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'percvm': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'personnes_a_charge': {
                    'items': {
                        'type': 'string'
                    },
                    'type': 'array'
                },
                'pertes_capital_societes_nouvelles': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'plus_values': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ppe': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ppe_brute': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ppe_coef': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ppe_elig': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'prcomp': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'preetu': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'prelsoc_cap_bar': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'prelsoc_cap_lib': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'prelsoc_fon': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'prelsoc_pv_immo': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'prelsoc_pv_mo': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'prlire': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'quaenv': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'quaenv_bouquet': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'rbg': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rbg_int': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'reduction_impot_exceptionnelle': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'reductions': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'repsoc': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'resimm': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'restit_imp': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'restitutions': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'retraite_titre_onereux': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'retraite_titre_onereux_net': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rev_cap_bar': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rev_cap_lib': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rev_cat': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rev_cat_pv': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rev_cat_rfon': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rev_cat_rpns': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rev_cat_rvcm': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rev_cat_tspr': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rev_coll': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rev_exo': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'rev_microsocial': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rev_or': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'revetproduits': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rfr': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rfr_cd': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rfr_rvcm': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rng': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rni': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rsceha': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rvcm_plus_abat': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'saldom': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'saldom2': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'scelli': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'sofica': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'sofipe': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'souscriptions_cinema_audiovisuel': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'spfcpi': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'taux_effectif': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'taux_moyen_imposition': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'tax_fonc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'teicaa': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'tot_impot': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'veuf': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                }
            },
            'type': 'object'
        },
        'Individu': {
            'additionalProperties': false,
            'properties': {
                'perte_autonomie': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'rennes_metropole_transport': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'id': {
                    'type': 'string',
                },
                'aacc_defn': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'aacc_defs': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'aacc_exon': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'aacc_gits': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'aacc_impn': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'aacc_imps': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'aacc_pvce': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'aah': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aah_base': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aah_base_ressources_eval_annuelle': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aah_base_ressources_eval_trimestrielle': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aah_eligible': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'aah_non_calculable': {
                    'additionalProperties': {
                        'type': 'Enumeration'
                    },
                    'type': 'object'
                },
                'abattement_salaires_pensions': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'abic_defm': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'abic_defn': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'abic_defs': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'abic_exon': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'abic_impm': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'abic_impn': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'abic_imps': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'abic_pvce': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'abnc_defi': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'abnc_exon': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'abnc_impo': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'abnc_proc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'abnc_pvce': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'accident_du_travail': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'acs_montant_i': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'activite': {
                    'additionalProperties': {
                        'type': 'Enumeration'
                    },
                    'type': 'object'
                },
                'adoption': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'aeeh_niveau_handicap': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'aer': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'af_majoration_enfant': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'age': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'age_en_mois': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'agff_employeur': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'agff_salarie': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'agirc_employeur': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'agirc_gmp_assiette': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'agirc_gmp_employeur': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'agirc_gmp_salarie': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'agirc_salarie': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ags': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aide_embauche_pme': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aide_logement_abattement_chomage_indemnise': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aide_logement_abattement_depart_retraite': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aide_logement_assiette_abattement_chomage': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'aide_premier_salarie': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'allegement_cotisation_allocations_familiales': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'allegement_cotisation_allocations_familiales_mode_recouvrement': {
                    'additionalProperties': {
                        'type': 'Enumeration'
                    },
                    'type': 'object'
                },
                'allegement_fillon': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'allegement_fillon_mode_recouvrement': {
                    'additionalProperties': {
                        'type': 'Enumeration'
                    },
                    'type': 'object'
                },
                'allocation_aide_retour_emploi': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'allocation_securisation_professionnelle': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'allocations_temporaires_invalidite': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'alnp_defs': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'alnp_imps': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'apec_employeur': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'apec_salarie': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'apprenti': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'apprentissage_contrat_debut': {
                    'additionalProperties': {
                        'type': 'Date'
                    },
                    'type': 'object'
                },
                'arag_defi': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'arag_exon': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'arag_impg': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'arag_pvce': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'arag_sjag': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'arrco_employeur': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'arrco_salarie': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'arrco_tranche_a_taux_employeur': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'arrco_tranche_a_taux_salarie': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'asf_elig_enfant': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'asi_aspa_base_ressources_individu': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'asi_aspa_condition_nationalite': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'asi_eligibilite': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'aspa_eligibilite': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'ass_base_ressources_conjoint': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ass_base_ressources_individu': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ass_eligibilite_individu': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'ass_precondition_remplie': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'assiette_allegement': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'assiette_cotisations_sociales': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'assiette_cotisations_sociales_prive': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'assiette_cotisations_sociales_public': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'assiette_csg_abattue': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'assiette_csg_non_abattue': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'assujettie_taxe_salaires': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'autonomie_financiere': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'avantage_en_nature': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'avantage_en_nature_valeur_forfaitaire': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'avantage_en_nature_valeur_reelle': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'bassin_emploi_redynamiser': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'bourse_enseignement_sup': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'bourse_recherche': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'boursier': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'caah': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'casa': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'categorie_salarie': {
                    'additionalProperties': {
                        'type': 'Enumeration'
                    },
                    'type': 'object'
                },
                'cbnc_assc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'cf_dom_enfant_eligible': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'cf_dom_enfant_trop_jeune': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'cf_enfant_a_charge': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'cf_enfant_eligible': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'cf_ressources_individu': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'chomage_brut': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'chomage_employeur': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'chomage_imposable': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'chomage_net': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'chomage_salarie': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'chomeur_longue_duree': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'cmu_base_ressources_individu': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cncn_adef': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'cncn_aimp': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'cncn_bene': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'cncn_defi': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'cncn_exon': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'cncn_info': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'cncn_jcre': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'cncn_pvce': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'code_postal_entreprise': {
                    'additionalProperties': {
                        'type': 'String'
                    },
                    'type': 'object'
                },
                'coefficient_proratisation': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'complementaire_sante_employeur': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'complementaire_sante_montant': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'complementaire_sante_salarie': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'complementaire_sante_taux_employeur': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'conge_individuel_formation_cdd': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'contrat_de_travail': {
                    'additionalProperties': {
                        'type': 'Enumeration'
                    },
                    'type': 'object'
                },
                'contrat_de_travail_debut': {
                    'additionalProperties': {
                        'type': 'Date'
                    },
                    'type': 'object'
                },
                'contrat_de_travail_duree': {
                    'additionalProperties': {
                        'type': 'Enumeration'
                    },
                    'type': 'object'
                },
                'contrat_de_travail_fin': {
                    'additionalProperties': {
                        'type': 'Date'
                    },
                    'type': 'object'
                },
                'contribution_developpement_apprentissage': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'contribution_exceptionnelle_solidarite': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'contribution_solidarite_autonomie': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'contribution_supplementaire_apprentissage': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cotisation_exceptionnelle_temporaire_employeur': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cotisation_exceptionnelle_temporaire_salarie': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cotisation_sociale_mode_recouvrement': {
                    'additionalProperties': {
                        'type': 'Enumeration'
                    },
                    'type': 'object'
                },
                'cotisations_employeur': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cotisations_employeur_contributives': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cotisations_employeur_main_d_oeuvre': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cotisations_employeur_non_contributives': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cotisations_non_contributives': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cotisations_salariales': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cotisations_salariales_contributives': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cotisations_salariales_non_contributives': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cout_differe': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'cout_du_travail': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'crds': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'crds_chomage': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'crds_retraite': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'crds_salaire': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'credit_impot_competitivite_emploi': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'csg': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'csg_deductible_chomage': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'csg_deductible_retraite': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'csg_deductible_salaire': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'csg_imposable_chomage': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'csg_imposable_retraite': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'csg_imposable_salaire': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'date_arret_de_travail': {
                    'additionalProperties': {
                        'type': 'Date'
                    },
                    'type': 'object'
                },
                'date_naissance': {
                    'additionalProperties': {
                        'type': 'Date'
                    },
                    'type': 'object'
                },
                'dedommagement_victime_amiante': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'depcom_entreprise': {
                    'additionalProperties': {
                        'type': 'String'
                    },
                    'type': 'object'
                },
                'depense_cantine_titre_restaurant_employe': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'depense_cantine_titre_restaurant_employeur': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'div': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'div_ms': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'duree_possession_titre_sejour': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'ebic_imps': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'ebic_impv': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'ebnc_impo': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'echelon_bourse': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'effectif_entreprise': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'elig_creimp_jeunes': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'enceinte': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'enfant_a_charge': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'enfant_majeur_celibataire_sans_enfant': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'enfant_place': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'entreprise_assujettie_cet': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'entreprise_assujettie_is': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'entreprise_benefice': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'entreprise_bilan': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'entreprise_chiffre_affaire': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'entreprise_creation': {
                    'additionalProperties': {
                        'type': 'Date'
                    },
                    'type': 'object'
                },
                'entreprise_est_association_non_lucrative': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'epargne_non_remuneree': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'est_enfant_dans_famille': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'etr': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'etudiant': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'exoneration_cotisations_employeur_apprenti': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'exoneration_cotisations_employeur_geographiques': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'exoneration_cotisations_employeur_jei': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'exoneration_cotisations_employeur_professionnalisation': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'exoneration_cotisations_employeur_stagiaire': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'exoneration_cotisations_employeur_zfu': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'exoneration_cotisations_employeur_zrd': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'exoneration_cotisations_employeur_zrr': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'exoneration_cotisations_salariales_apprenti': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'exoneration_cotisations_salarie_stagiaire': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'exoneration_is_creation_zrr': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'exonerations_et_allegements': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'exposition_accident': {
                    'additionalProperties': {
                        'type': 'Enumeration'
                    },
                    'type': 'object'
                },
                'exposition_penibilite': {
                    'additionalProperties': {
                        'type': 'Enumeration'
                    },
                    'type': 'object'
                },
                'f1tv': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f1tw': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f1tx': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f3va': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f3vd': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f3vf': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f3vi': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f3vj': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f5qm': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f5sq': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f6ps': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f6rs': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f6ss': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'f7ac': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'famille': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'financement_organisations_syndicales': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'fnal': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'fnal_tranche_a': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'fnal_tranche_a_plus_20': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'fonds_emploi_hospitalier': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'forfait_heures_remunerees_volume': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'forfait_jours_remuneres_volume': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'forfait_social': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'formation_professionnelle': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'frag_exon': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'frag_fore': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'frag_impo': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'frag_pvce': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'frag_pvct': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'frais_reels': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'gains_exceptionnels': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'garde_alternee': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'gipa': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'glo': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'habite_chez_parents': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'handicap': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'heures_duree_collective_entreprise': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'heures_non_remunerees_volume': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'heures_remunerees_volume': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'hsup': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'inapte_travail': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'indemnite_fin_contrat': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'indemnite_fin_contrat_due': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'indemnite_fin_contrat_net': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'indemnite_residence': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'indemnites_chomage_partiel': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'indemnites_compensatrices_conges_payes': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'indemnites_forfaitaires': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'indemnites_journalieres': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'indemnites_journalieres_accident_travail': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'indemnites_journalieres_adoption': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'indemnites_journalieres_imposables': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'indemnites_journalieres_maladie': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'indemnites_journalieres_maladie_professionnelle': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'indemnites_journalieres_maternite': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'indemnites_journalieres_paternite': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'indemnites_stage': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'indemnites_volontariat': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'indice_majore': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'interets_epargne_sur_livrets': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'invalidite': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'ircantec_employeur': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ircantec_salarie': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'jei_date_demande': {
                    'additionalProperties': {
                        'type': 'Date'
                    },
                    'type': 'object'
                },
                'jeune_entreprise_innovante': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'jeunes_ind': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'macc_exon': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'macc_imps': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'macc_impv': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'macc_mvlt': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'macc_pvce': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'macc_pvct': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'maj_cga': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'mbic_exon': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'mbic_imps': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'mbic_impv': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'mbic_mvlt': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'mbic_pvce': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'mbic_pvct': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'mbnc_exon': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'mbnc_impo': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'mbnc_mvct': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'mbnc_mvlt': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'mbnc_pvce': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'mbnc_pvct': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'mhsup': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'mmid_employeur': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'mmid_salarie': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'mmida_employeur': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'mncn_exon': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'mncn_impo': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'mncn_mvlt': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'mncn_pvce': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'mncn_pvct': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'mva': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'nacc_defn': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'nacc_defs': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'nacc_exon': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'nacc_impn': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'nacc_meup': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'nacc_pvce': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'nbic_apch': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'nbic_defn': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'nbic_defs': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'nbic_exon': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'nbic_impm': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'nbic_impn': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'nbic_imps': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'nbic_mvct': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'nbic_pvce': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'nbnc_defi': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'nbnc_exon': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'nbnc_impo': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'nbnc_proc': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'nbnc_pvce': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'nlnp_defs': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'nombre_jours_calendaires': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'nombre_tickets_restaurant': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'nouvelle_bonification_indiciaire': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'nrag_ajag': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'nrag_defi': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'nrag_exon': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'nrag_impg': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'nrag_pvce': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'paje_base_enfant_eligible_apres_reforme_2014': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'paje_base_enfant_eligible_avant_reforme_2014': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'participation_effort_construction': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'pch': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'penibilite': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'pension_civile_employeur': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'pension_civile_salarie': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'pensions': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'pensions_alimentaires_percues': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'pensions_alimentaires_percues_decl': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'pensions_alimentaires_versees_individu': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'pensions_invalidite': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'plafond_securite_sociale': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ppa_bonification': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ppa_ressources_hors_activite_individu': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ppa_revenu_activite_individu': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ppa_rsa_derniers_revenus_tns_annuels_connus': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ppe_base': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ppe_coef_tp': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ppe_du_ns': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'ppe_du_sa': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'ppe_elig_individu': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'ppe_rev': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ppe_tp_ns': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'ppe_tp_sa': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'prelsoc_cap': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'prestation_compensatoire': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'prestations_familiales_base_ressources_individu': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'prestations_familiales_enfant_a_charge': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'prevoyance_obligatoire_cadre': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'prevoyance_obligatoire_cadre_taux_employe': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'prevoyance_obligatoire_cadre_taux_employeur': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'prime_apprentissage': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'prime_forfaitaire_mensuelle_reprise_activite': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'primes_fonction_publique': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'primes_salaires': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'primes_salaires_net': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'prise_en_charge_employeur_prevoyance_complementaire': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'prise_en_charge_employeur_retraite_complementaire': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'prise_en_charge_employeur_retraite_supplementaire': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'professionnalisation': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'pveximpres': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'pvtaimpres': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'rac': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rafp_employeur': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rafp_salarie': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rag': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ratio_alternants': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'redevable_taxe_apprentissage': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'reintegration_titre_restaurant_employeur': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'remboursement_transport': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'remboursement_transport_base': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rempli_obligation_scolaire': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'remuneration_apprenti': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'remuneration_principale': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'remuneration_professionnalisation': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'ressortissant_eee': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'retraite_brute': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'retraite_combattant': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'retraite_imposable': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'retraite_nette': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'revenu_activite': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'revenu_activite_non_salariee': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'revenu_activite_salariee': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'revenu_assimile_pension': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'revenu_assimile_pension_apres_abattements': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'revenu_assimile_salaire': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'revenu_assimile_salaire_apres_abattements': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'revenu_initial_individu': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'revenu_net_individu': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'revenus_capital': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'revenus_du_capital': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'revenus_du_travail': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'revenus_fonciers_minima_sociaux': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'revenus_locatifs': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'revenus_stage_formation_pro': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'revimpres': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'ric': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rnc': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rpns': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rpns_exon': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rpns_individu': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rpns_mvct': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rpns_mvlt': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rpns_pvce': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rpns_pvct': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rsa_activite_individu': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rsa_base_ressources_individu': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rsa_base_ressources_patrimoine_individu': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rsa_condition_nationalite': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'rsa_enfant_a_charge': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'rsa_has_ressources_substitution': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'rsa_indemnites_journalieres_activite': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rsa_indemnites_journalieres_hors_activite': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'rsa_non_calculable_tns_individu': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'rsa_revenu_activite_individu': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'sal_pen_exo_etr': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'salaire_de_base': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'salaire_imposable': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'salaire_net': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'salaire_net_a_payer': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'salaire_net_hors_revenus_exceptionnels': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'salaire_super_brut': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'salaire_super_brut_hors_allegements': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'salarie_regime_alsace_moselle': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'scolarite': {
                    'additionalProperties': {
                        'type': 'Enumeration'
                    },
                    'type': 'object'
                },
                'smic_proratise': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'stage_duree_heures': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'stage_gratification': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'stage_gratification_reintegration': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'stage_gratification_taux': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'stagiaire': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'statut_marital': {
                    'additionalProperties': {
                        'type': 'Enumeration'
                    },
                    'type': 'object'
                },
                'supp_familial_traitement': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'taille_entreprise': {
                    'additionalProperties': {
                        'type': 'Enumeration'
                    },
                    'type': 'object'
                },
                'taux_accident_travail': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'taux_csg_remplacement': {
                    'additionalProperties': {
                        'type': 'Enumeration'
                    },
                    'type': 'object'
                },
                'taux_incapacite': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'taux_versement_transport': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'taxe_apprentissage': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'taxe_salaires': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'tehr': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'titre_restaurant_taux_employeur': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'titre_restaurant_valeur_unitaire': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'titre_restaurant_volume': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'tns_auto_entrepreneur_benefice': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'tns_auto_entrepreneur_chiffre_affaires': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'tns_auto_entrepreneur_revenus_net': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'tns_auto_entrepreneur_type_activite': {
                    'additionalProperties': {
                        'type': 'Enumeration'
                    },
                    'type': 'object'
                },
                'tns_autres_revenus': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'tns_autres_revenus_chiffre_affaires': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'tns_autres_revenus_type_activite': {
                    'additionalProperties': {
                        'type': 'Enumeration'
                    },
                    'type': 'object'
                },
                'tns_avec_employe': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'tns_benefice_exploitant_agricole': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'tns_micro_entreprise_benefice': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'tns_micro_entreprise_chiffre_affaires': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'tns_micro_entreprise_revenus_net': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'tns_micro_entreprise_type_activite': {
                    'additionalProperties': {
                        'type': 'Enumeration'
                    },
                    'type': 'object'
                },
                'traitement_indiciaire_brut': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'traitements_salaires_pensions_rentes': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'travailleur_non_salarie': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'valeur_locative_immo_non_loue': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'valeur_locative_terrains_non_loue': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'versement_transport': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'vieillesse_deplafonnee_employeur': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'vieillesse_deplafonnee_salarie': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'vieillesse_plafonnee_employeur': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'vieillesse_plafonnee_salarie': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'volume_jours_ijss': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'zone_franche_urbaine': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'zone_restructuration_defense': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'zone_revitalisation_rurale': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                }
            },
            'type': 'object'
        },
        'Menage': {
            'additionalProperties': false,
            'properties': {
                'personne_de_reference': {
                    'type': 'string',
                },
                'conjoint': {
                    'type': 'string',
                },
                'charges_locatives': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'check_crds': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'check_csg': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'check_csk': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'coloc': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'depcom': {
                    'additionalProperties': {
                        'type': 'String'
                    },
                    'type': 'object'
                },
                'eligibilite_anah': {
                    'additionalProperties': {
                        'type': 'Enumeration'
                    },
                    'type': 'object'
                },
                'enfants': {
                    'items': {
                        'type': 'string'
                    },
                    'type': 'array'
                },
                'exonere_taxe_habitation': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'impots_directs': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'logement_chambre': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'loyer': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'niveau_de_vie': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'niveau_de_vie_initial': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'niveau_de_vie_net': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'nombre_enfants_majeurs_celibataires_sans_enfant': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'participation_frais': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'residence_dom': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'residence_guadeloupe': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'residence_guyane': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'residence_martinique': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'residence_mayotte': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'residence_reunion': {
                    'additionalProperties': {
                        'type': 'Boolean'
                    },
                    'type': 'object'
                },
                'revenu_disponible': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'revenu_initial': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'revenu_net': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'statut_occupation_logement': {
                    'additionalProperties': {
                        'type': 'Enumeration'
                    },
                    'type': 'object'
                },
                'taxe_habitation': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'type_menage': {
                    'additionalProperties': {
                        'type': 'Integer'
                    },
                    'type': 'object'
                },
                'uc': {
                    'additionalProperties': {
                        'type': 'Float'
                    },
                    'type': 'object'
                },
                'zone_apl': {
                    'additionalProperties': {
                        'type': 'Enumeration'
                    },
                    'type': 'object'
                }
            },
            'type': 'object'
        },
        'Parameter': {
            'example': {
                'description': 'SMIC horaire brut',
                'id': 'cotsoc.gen.smic_h_b',
                'values': {
                    '2001-08-01': 6.67,
                    '2002-07-01': 6.83,
                    '2003-07-01': 7.19,
                    '2004-07-01': 7.61,
                    '2005-07-01': 8.03,
                    '2006-07-01': 8.27,
                    '2007-07-01': 8.44,
                    '2008-05-01': 8.63,
                    '2008-07-01': 8.71,
                    '2009-07-01': 8.82,
                    '2010-01-01': 8.86,
                    '2011-01-01': 9.0,
                    '2011-12-01': 9.19,
                    '2012-01-01': 9.22,
                    '2012-07-01': 9.4,
                    '2013-01-01': 9.43,
                    '2014-01-01': 9.53,
                    '2015-01-01': 9.61,
                    '2016-01-01': 9.67,
                    '2017-01-01': 9.76
                }
            },
            'properties': {
                'brackets': {
                    'additionalProperties': {
                        '$ref': '#/definitions/Brackets'
                    },
                    'type': 'object'
                },
                'description': {
                    'type': 'string'
                },
                'id': {
                    'format': 'string',
                    'type': 'integer'
                },
                'values': {
                    '$ref': '#/definitions/Values'
                }
            },
            'type': 'object'
        },
        'Parameters': {
            'additionalProperties': {
                'properties': {
                    'definition': {
                        'type': 'string'
                    }
                },
                'type': 'object'
            },
            'type': 'object'
        },
        'SituationInput': {
            'additionalProperties': false,
            'example': {
                'households': {
                    'first_household': {
                        'accomodation_size': {
                            '2017-01': 300,
                            '2017-02': 300,
                            '2017-03': 300,
                            '2017-04': 300,
                            '2017-05': 300
                        },
                        'children': [
                            'Janet'
                        ],
                        'housing_tax': {
                            '2017': null
                        },
                        'parents': [
                            'Bill',
                            'Bob'
                        ]
                    }
                },
                'persons': {
                    'Bill': {
                        'income_tax': {
                            '2017-01': null,
                            '2017-02': null,
                            '2017-03': null,
                            '2017-04': null,
                            '2017-05': null
                        },
                        'salary': {
                            '2017-01': 2000,
                            '2017-02': 300,
                            '2017-03': 5000,
                            '2017-04': 4000,
                            '2017-05': 2000
                        }
                    },
                    'Bob': {
                        'salary': {
                            '2017-01': 2000,
                            '2017-02': 2000,
                            '2017-03': 2000,
                            '2017-04': 2000,
                            '2017-05': 2000
                        }
                    },
                    'Janet': { }
                }
            },
            'properties': {
                'familles': {
                    'additionalProperties': {
                        '$ref': '#/definitions/Famille'
                    },
                    'type': 'object'
                },
                'foyers_fiscaux': {
                    'additionalProperties': {
                        '$ref': '#/definitions/Foyer_Fiscal'
                    },
                    'type': 'object'
                },
                'individus': {
                    'additionalProperties': {
                        '$ref': '#/definitions/Individu'
                    },
                    'type': 'object'
                },
                'menages': {
                    'additionalProperties': {
                        '$ref': '#/definitions/Menage'
                    },
                    'type': 'object'
                }
            },
            'type': 'object'
        },
        'SituationOutput': {
            'additionalProperties': false,
            'example': {
                'households': {
                    'first_household': {
                        'accomodation_size': {
                            '2017-01': 300,
                            '2017-02': 300,
                            '2017-03': 300,
                            '2017-04': 300,
                            '2017-05': 300
                        },
                        'children': [
                            'Janet'
                        ],
                        'housing_tax': {
                            '2017': 345
                        },
                        'parents': [
                            'Bill',
                            'Bob'
                        ]
                    }
                },
                'persons': {
                    'Bill': {
                        'income_tax': {
                            '2017-01': 200,
                            '2017-02': 0,
                            '2017-03': 700,
                            '2017-04': 500,
                            '2017-05': 200
                        },
                        'salary': {
                            '2017-01': 2000,
                            '2017-02': 300,
                            '2017-03': 5000,
                            '2017-04': 4000,
                            '2017-05': 2000
                        }
                    },
                    'Bob': {
                        'salary': {
                            '2017-01': 2000,
                            '2017-02': 2000,
                            '2017-03': 2000,
                            '2017-04': 2000,
                            '2017-05': 2000
                        }
                    },
                    'Janet': null
                }
            },
            'properties': {
                'familles': {
                    'additionalProperties': {
                        '$ref': '#/definitions/Famille'
                    },
                    'type': 'object'
                },
                'foyers_fiscaux': {
                    'additionalProperties': {
                        '$ref': '#/definitions/Foyer_Fiscal'
                    },
                    'type': 'object'
                },
                'individus': {
                    'additionalProperties': {
                        '$ref': '#/definitions/Individu'
                    },
                    'type': 'object'
                },
                'menages': {
                    'additionalProperties': {
                        '$ref': '#/definitions/Menage'
                    },
                    'type': 'object'
                }
            },
            'type': 'object'
        },
        'Values': {
            'additionalProperties': {
                'format': 'float',
                'type': 'number'
            },
            'type': 'object'
        },
        'Variable': {
            'example': {
                'defaultValue': '0,',
                'definitionPeriod': 'MONTH',
                'description': 'Aide à l‘embauche d‘un salarié pour les PME',
                'entity': 'individu',
                'formulas': {
                    '2016-01-18': {
                        'content': 'def function(self, simulation, period):\n    effectif_entreprise = simulation.calculate(‘effectif_entreprise‘, period)\n    apprenti = simulation.calculate(‘apprenti‘, period)\n    contrat_de_travail_duree = simulation.calculate(‘contrat_de_travail_duree‘, period)\n    contrat_de_travail_debut = simulation.calculate(‘contrat_de_travail_debut‘, period)\n    contrat_de_travail_fin = simulation.calculate(‘contrat_de_travail_fin‘, period)\n    coefficient_proratisation = simulation.calculate(‘coefficient_proratisation‘, period)\n    smic_proratise = simulation.calculate(‘smic_proratise‘, period)\n    salaire_de_base = simulation.calculate(‘salaire_de_base‘, period)\n    exoneration_cotisations_employeur_jei = simulation.calculate(‘exoneration_cotisations_employeur_jei‘, period)\n    aide_premier_salarie = simulation.calculate(‘aide_premier_salarie‘, period)\n\n    # Cette aide est temporaire.\n    # Si toutefois elle est reconduite et modifiée, les dates et le montant seront à implémenter comme\n    # des params xml.\n\n    # jusqu’à 1,3 fois le Smic\n    eligible_salaire = salaire_de_base <= (1.3 * smic_proratise)\n\n    # pour les PME\n    eligible_effectif = effectif_entreprise < 250\n\n    non_cumulee = and_(\n        # non cumulable avec l‘aide pour la première embauche\n        # qui est identique, si ce n‘est qu‘elle couvre tous les salaires\n        aide_premier_salarie == 0,\n        # non cumul avec le dispositif Jeune Entreprise Innovante (JEI)\n        not_(exoneration_cotisations_employeur_jei)\n        )\n\n\n    eligible_contrat = and_(\n        contrat_de_travail_debut >= datetime64(\'2016-01-18\'),\n        contrat_de_travail_debut <= datetime64(\'2017-06-30\')\n    )\n\n    # Si CDD, durée du contrat doit être > 1 an\n    eligible_duree = or_(\n        # durée indéterminée\n        contrat_de_travail_duree == 0,\n        # durée déterminée supérieure à 1 an\n        and_(\n            # CDD\n            contrat_de_travail_duree == 1,\n            # > 6 mois\n            (contrat_de_travail_fin - contrat_de_travail_debut).astype(‘timedelta64[M]‘) >= timedelta64(6, ‘M‘)\n            )\n        )\n\n    # Valable 2 ans seulement\n    eligible_date = datetime64(period.offset(-24, ‘month‘).start) < contrat_de_travail_debut\n\n    eligible = (\n        eligible_salaire * eligible_effectif * non_cumulee * eligible_contrat * eligible_duree *\n        eligible_date * not_(apprenti)\n    )\n    # somme sur 24 mois, à raison de 500 € maximum par trimestre\n    montant_max = 4000\n\n    # Si le salarié est embauché à temps partiel,\n    # l’aide est proratisée en fonction de sa durée de travail.\n    # TODO cette multiplication par le coefficient de proratisation suffit-elle pour le cas du temps partiel ?\n    # A tester\n\n    return eligible * (montant_max / 24) * coefficient_proratisation\n',
                        'source': 'https://github.com/openfisca/openfisca-france/blob/18.2.5/openfisca_france/model/prelevements_obligatoires/prelevements_sociaux/cotisations_sociales/allegements.py#L223-L287'
                    }
                },
                'id': 'aide_embauche_pme',
                'references': [
                    'http://travail-emploi.gouv.fr/grands-dossiers/embauchepme'
                ],
                'source': 'https://github.com/openfisca/openfisca-france/blob/18.2.5/openfisca_france/model/prelevements_obligatoires/prelevements_sociaux/cotisations_sociales/allegement.py#L214-L287',
                'valueType': 'Float'
            },
            'properties': {
                'defaultValue': {
                    'type': 'string'
                },
                'definitionPeriod': {
                    'enum': [
                        'MONTH',
                        'YEAR',
                        'ETERNITY'
                    ],
                    'type': 'string'
                },
                'description': {
                    'type': 'string'
                },
                'entity': {
                    'type': 'string'
                },
                'formulas': {
                    'additionalProperties': {
                        '$ref': '#/definitions/Formula'
                    },
                    'type': 'object'
                },
                'id': {
                    'type': 'string'
                },
                'reference': {
                    'items': {
                        'type': 'string'
                    },
                    'type': 'array'
                },
                'source': {
                    'type': 'string'
                },
                'valueType': {
                    'type': 'string'
                }
            },
            'type': 'object'
        },
        'Variables': {
            'additionalProperties': {
                'properties': {
                    'definition': {
                        'type': 'string'
                    }
                },
                'type': 'object'
            },
            'type': 'object'
        }
    },
    'host': 'api-test.openfisca.fr',
    'info': {
        'contact': {
            'email': 'contact@openfisca.fr'
        },
        'description': 'The OpenFisca Web API lets you get up-to-date information and formulas included in the Openfisca-France legislation.',
        'license': {
            'name': 'AGPL',
            'url': 'https://www.gnu.org/licenses/agpl-3.0.html'
        },
        'termsOfService': 'https://doc.openfisca.fr/publishing.html',
        'title': 'Openfisca-France Web API',
        'version': '0.1.0'
    },
    'paths': {
        '/calculate': {
            'post': {
                'consumes': [
                    'application/json'
                ],
                'operationId': 'calculate',
                'parameters': [
                    {
                        'description': 'Describe the situation (persons and entities). Add the variable you wish to calculate in the proper entity, with null as the value.',
                        'in': 'body',
                        'name': 'Situation',
                        'required': true,
                        'schema': {
                            '$ref': '#/definitions/SituationInput'
                        }
                    }
                ],
                'produces': [
                    'application/json'
                ],
                'responses': {
                    '200': {
                        'description': 'The calculation result is sent back in the response body',
                        'headers': {
                            'Country-Package': {
                                'description': 'The name of the country package currently loaded in this API server',
                                'type': 'string'
                            },
                            'Country-Package-Version': {
                                'description': 'The version of the country package currently loaded in this API server',
                                'type': 'string'
                            }
                        },
                        'schema': {
                            '$ref': '#/definitions/SituationOutput'
                        }
                    },
                    '400': {
                        'description': 'The request is invalid. Details about the error are sent back in the response body',
                        'headers': {
                            'Country-Package': {
                                'description': 'The name of the country package currently loaded in this API server',
                                'type': 'string'
                            },
                            'Country-Package-Version': {
                                'description': 'The version of the country package currently loaded in this API server',
                                'type': 'string'
                            }
                        }
                    },
                    '404': {
                        'description': 'A variable mentioned in the input siutation does not exist in the loaded tax and benefit system. Details are sent back in the response body',
                        'headers': {
                            'Country-Package': {
                                'description': 'The name of the country package currently loaded in this API server',
                                'type': 'string'
                            },
                            'Country-Package-Version': {
                                'description': 'The version of the country package currently loaded in this API server',
                                'type': 'string'
                            }
                        },
                        'schema': {
                            '$ref': '#/definitions/SituationInput'
                        }
                    }
                },
                'summary': 'Run a simulation',
                'tags': [
                    'Calculations'
                ]
            }
        },
        '/parameter/{parameterID}': {
            'get': {
                'operationId': 'getParameter',
                'parameters': [
                    {
                        'description': 'ID of parameter. IDs can be obtained by enumerating the /parameters endpoint',
                        'in': 'path',
                        'name': 'parameterID',
                        'required': true,
                        'type': 'string'
                    }
                ],
                'produces': [
                    'application/json'
                ],
                'responses': {
                    '200': {
                        'description': 'The requested parameter‘s information is sent back in the response body',
                        'headers': {
                            'Country-Package': {
                                'description': 'The name of the country package currently loaded in this API server',
                                'type': 'string'
                            },
                            'Country-Package-Version': {
                                'description': 'The version of the country package currently loaded in this API server',
                                'type': 'string'
                            }
                        },
                        'schema': {
                            '$ref': '#/definitions/Parameter'
                        }
                    },
                    '404': {
                        'description': 'The requested parameter does not exist',
                        'headers': {
                            'Country-Package': {
                                'description': 'The name of the country package currently loaded in this API server',
                                'type': 'string'
                            },
                            'Country-Package-Version': {
                                'description': 'The version of the country package currently loaded in this API server',
                                'type': 'string'
                            }
                        }
                    }
                },
                'summary': 'Get information about a specific parameter',
                'tags': [
                    'Parameters'
                ]
            }
        },
        '/parameters': {
            'get': {
                'operationId': 'getParameters',
                'produces': [
                    'application/json'
                ],
                'responses': {
                    '200': {
                        'description': 'The list of parameters is sent back in the response body',
                        'headers': {
                            'Country-Package': {
                                'description': 'The name of the country package currently loaded in this API server',
                                'type': 'string'
                            },
                            'Country-Package-Version': {
                                'description': 'The version of the country package currently loaded in this API server',
                                'type': 'string'
                            }
                        },
                        'schema': {
                            '$ref': '#/definitions/Parameters'
                        }
                    }
                },
                'summary': 'List all available parameters',
                'tags': [
                    'Parameters'
                ]
            }
        },
        '/variable/{variableID}': {
            'get': {
                'operationId': 'getVariable',
                'parameters': [
                    {
                        'description': 'ID of a variable. IDs can be obtained by enumerating the /variables endpoint.',
                        'in': 'path',
                        'name': 'variableID',
                        'required': true,
                        'type': 'string'
                    }
                ],
                'produces': [
                    'application/json'
                ],
                'responses': {
                    '200': {
                        'description': 'The requested variable‘s information is sent back in the response body',
                        'headers': {
                            'Country-Package': {
                                'description': 'The name of the country package currently loaded in this API server',
                                'type': 'string'
                            },
                            'Country-Package-Version': {
                                'description': 'The version of the country package currently loaded in this API server',
                                'type': 'string'
                            }
                        },
                        'schema': {
                            '$ref': '#/definitions/Variable'
                        }
                    },
                    '404': {
                        'description': 'The requested variable does not exist',
                        'headers': {
                            'Country-Package': {
                                'description': 'The name of the country package currently loaded in this API server',
                                'type': 'string'
                            },
                            'Country-Package-Version': {
                                'description': 'The version of the country package currently loaded in this API server',
                                'type': 'string'
                            }
                        }
                    }
                },
                'summary': 'Get information about a specific variable',
                'tags': [
                    'Variables'
                ]
            }
        },
        '/variables': {
            'get': {
                'operationId': 'getVariables',
                'produces': [
                    'application/json'
                ],
                'responses': {
                    '200': {
                        'description': 'The list of variables is sent back in the response body',
                        'headers': {
                            'Country-Package': {
                                'description': 'The name of the country package currently loaded in this API server',
                                'type': 'string'
                            },
                            'Country-Package-Version': {
                                'description': 'The version of the country package currently loaded in this API server',
                                'type': 'string'
                            }
                        },
                        'schema': {
                            '$ref': '#/definitions/Variables'
                        }
                    }
                },
                'summary': 'List all available variables',
                'tags': [
                    'Variables'
                ]
            }
        }
    },
    'schemes': [
        'https'
    ],
    'swagger': '2.0',
    'tags': [
        {
            'description': 'A parameter is a numeric property of the legislation that can evolve over time.',
            'externalDocs': {
                'description': 'Parameter official documentation',
                'url': 'https://doc.openfisca.fr/parameters.html'
            },
            'name': 'Parameters'
        },
        {
            'description': 'A variable depends on a person, or an entity (e.g. zip code, salary, income tax).',
            'externalDocs': {
                'description': 'Variable official documentation',
                'url': 'https://doc.openfisca.fr/variables.html'
            },
            'name': 'Variables'
        },
        {
            'name': 'Calculations'
        }
    ]

};
