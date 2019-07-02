import _ from 'lodash'

import {
  PERSIST_SUCCESS,
  MODIFY_INDIVIDU,
  MODIFY_DATE_OF_BIRTH,
  MODIFY_NATIONALITY,
} from './actions'

// var DEFAULT_INDIVIDU = {
//     id: individuRole,
//     nationalite: 'fr',
//     aah_restriction_substantielle_durable_acces_emploi: true,
//     ass_precondition_remplie: false,
//     scolarite: 'college',
//     taux_incapacite: 0.9,
//     echelon_bourse: -1,
//     enfant_a_charge: {},
//     enfant_place: false,
//     gir: 'gir_6',
//     role: individuRole,
//     tns_autres_revenus_type_activite: 'bic',
//     tns_micro_entreprise_type_activite: 'bic',
//     tns_auto_entrepreneur_type_activite: 'bic',
//     specificSituations: []
// };

// {
//   "_id":"5d1b574a4b897200254c907f",
//   "token":"gsbKia4z73R_aQ7s6KuFzKnl_thI6hW9GhIRHh--Yrjw7bJ5cqwAguKRiuFVZXkX",
//   "__v":0,
//   "dateDeValeur":"2019-07-01T09:48:12.000Z",
//   "version":9,
//   "modifiedFrom":"5d1b57284b897200254c907e",
//   "status":"new",
//   "menage":{
//     "aide_logement_date_pret_conventionne":"2017-12-31",
//     "loyer":900,
//     "coloc":false,
//     "logement_chambre":false,
//     "code_postal":"75010",
//     "depcom":"75056",
//     "nom_commune":"Paris",
//     "statut_occupation_logement":"locataire_vide"
//   },
//   "individus":[
//     {
//       "id":"demandeur",
//       "nationalite":"fr",
//       "echelon_bourse":-1,
//       "enfant_a_charge":{
//         "2019":false
//       },
//       "enfant_place":false,
//       "role":"demandeur",
//       "tns_autres_revenus_type_activite":"bic",
//       "tns_micro_entreprise_type_activite":"bic",
//       "tns_auto_entrepreneur_type_activite":"bic",
//       "date_naissance":"1983-06-05T22:00:00.000Z",
//       "statut_marital":"celibataire",
//       "salaire_net":{
//         "2018-07":1400,
//         "2018-08":1400,
//         "2018-09":1400,
//         "2018-10":1400,
//         "2018-11":1400,
//         "2018-12":1400,
//         "2019-01":1400,
//         "2019-02":1400,
//         "2019-03":1400,
//         "2019-04":1400,
//         "2019-05":1400,
//         "2019-06":1400,
//         "2019-07":1400
//       },
//       "specificSituations":[
//       ],
//       "gir":"gir_6",
//       "hasRessources":true
//     },
//     {
//       "id":"enfant_0",
//       "nationalite":"fr",
//       "echelon_bourse":-1,
//       "enfant_a_charge":{
//         "2019":true
//       },
//       "enfant_place":false,
//       "role":"enfant",
//       "tns_autres_revenus_type_activite":"bic",
//       "tns_micro_entreprise_type_activite":"bic",
//       "tns_auto_entrepreneur_type_activite":"bic",
//       "firstName":"Votre 1ᵉʳ enfant",
//       "date_naissance":"2013-12-31T23:00:00.000Z",
//       "specificSituations":[
//       ],
//       "gir":"gir_6",
//       "hasRessources":false
//     },
//     {
//       "id":"enfant_1",
//       "nationalite":"fr",
//       "echelon_bourse":-1,
//       "enfant_a_charge":{
//         "2019":true
//       },
//       "enfant_place":false,
//       "role":"enfant",
//       "tns_autres_revenus_type_activite":"bic",
//       "tns_micro_entreprise_type_activite":"bic",
//       "tns_auto_entrepreneur_type_activite":"bic",
//       "firstName":"Votre 2ᵉ enfant",
//       "date_naissance":"2015-12-31T23:00:00.000Z",
//       "specificSituations":[
//       ],
//       "gir":"gir_6",
//       "hasRessources":false
//     },
//     {
//       "id":"enfant_2",
//       "nationalite":"fr",
//       "echelon_bourse":-1,
//       "enfant_a_charge":{
//         "2019":true
//       },
//       "enfant_place":false,
//       "role":"enfant",
//       "tns_autres_revenus_type_activite":"bic",
//       "tns_micro_entreprise_type_activite":"bic",
//       "tns_auto_entrepreneur_type_activite":"bic",
//       "firstName":"Votre 3ᵉ enfant",
//       "date_naissance":"2013-12-31T23:00:00.000Z",
//       "specificSituations":[
//       ],
//       "gir":"gir_6",
//       "hasRessources":false
//     }
//   ],
//   "foyer_fiscal":{
//   },
//   "famille":{
//     "proprietaire_proche_famille":false,
//     "parisien":true
//   }
// }

const initialState = {
  situation: {
  	individus: []
  },
  resultat: {}
}

const createIndividu = (id, props) => ({ id, ...props })

const replaceIndividu = (state, id, payload) => {
  const newState = state.slice(0);
  let index = _.findIndex(newState, item => item.id === id);
  if (-1 !== index) {
    newState.splice(index, 1, Object.assign({}, newState[index], payload))
  } else {
    newState.push(createIndividu(id, payload));
  }

  return newState;
}

export default (state = initialState, action = {}) => {
  let individus;
  switch (action.type) {
    case MODIFY_INDIVIDU:

      individus = state.situation.individus.slice(0);
      let index = _.findIndex(individus, individu => individu.role === action.payload.role);

      if (-1 !== index) {
        individus.splice(index, 1, Object.assign({}, individus[index], action.payload.props))
      } else {
        individus.push(createIndividu(action.payload.role, action.payload.props));
      }

      const situation = {
        ...state.situation,
        individus
      }

      return {
        ...state,
        situation,
      }

    case MODIFY_DATE_OF_BIRTH:

      individus = replaceIndividu(
        state.situation.individus,
        action.payload.id,
        {
          date_naissance: action.payload.dateOfBirth
        }
      )

      return {
        ...state,
        situation: {
          ...state.situation,
          individus
        }
      }

    case MODIFY_NATIONALITY:

      individus = replaceIndividu(
        state.situation.individus,
        action.payload.id,
        {
          nationalite: action.payload.nationality
        }
      )

      return {
        ...state,
        situation: {
          ...state.situation,
          individus
        }
      }

    case PERSIST_SUCCESS:

      return {
        ...state,
        situation: {
          ...state.situation,
          ...action.payload
        }
      }

    default:
      return { ...state }
  }
}
