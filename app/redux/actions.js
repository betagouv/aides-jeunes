import { createAction } from 'redux-actions';
import axios from 'axios';
import _ from 'lodash';

const httpClient = axios.create({
  baseURL: 'http://localhost:9000',
});

export const MODIFY_DATE_OF_BIRTH  = 'MODIFY_DATE_OF_BIRTH';
export const MODIFY_NATIONALITY    = 'MODIFY_NATIONALITY';
export const MODIFY_MARITAL_STATUS = 'MODIFY_MARITAL_STATUS';

export const MODIFY_HOUSING_STATUS = 'MODIFY_HOUSING_STATUS';
export const MODIFY_RENT_AMOUNT    = 'MODIFY_RENT_AMOUNT';
export const MODIFY_POSTAL_CODE    = 'MODIFY_POSTAL_CODE';
export const MODIFY_CITY           = 'MODIFY_CITY';

// Individu
export const modifyNationality   = createAction(MODIFY_NATIONALITY, (id, nationality) => ({ id, nationality }))
export const modifyDateOfBirth   = createAction(MODIFY_DATE_OF_BIRTH, (id, dateOfBirth) => ({ id, dateOfBirth }))
export const modifyMaritalStatus = createAction(MODIFY_MARITAL_STATUS, (id, maritalStatus) => ({ id, maritalStatus }))

// Menage
export const modifyHousingStatus = createAction(MODIFY_HOUSING_STATUS)
export const modifyRentAmount    = createAction(MODIFY_RENT_AMOUNT)

const _modifyPostalCode = createAction(MODIFY_POSTAL_CODE)
const _modifyCity       = createAction(MODIFY_CITY)

export function modifyPostalCode(postalCode) {

  return function(dispatch, getState) {

    httpClient.get('/api/outils/communes/' + postalCode)
      .then(response => {

        const cities = response.data;
        const city = _.maxBy(cities, 'population') || (cities.length && cities[0]) || {};

        dispatch(_modifyPostalCode(postalCode));
        dispatch(_modifyCity(city));

      })
      .catch(e => console.log(e));
  }

}

export const PERSIST_REQUEST = 'PERSIST_REQUEST';
export const PERSIST_SUCCESS = 'PERSIST_SUCCESS';

export const persistRequest = createAction(PERSIST_REQUEST)
export const persistSuccess = createAction(PERSIST_SUCCESS)

export const SIMULATE_REQUEST = 'SIMULATE_REQUEST';
export const SIMULATE_SUCCESS = 'SIMULATE_SUCCESS';

export const simulateRequest = createAction(SIMULATE_REQUEST)
export const simulateSuccess = createAction(SIMULATE_SUCCESS)

export function persist() {

  return function(dispatch, getState) {

  	let { situation } = getState();

  	dispatch(persistRequest());

  	httpClient.post('/api/situations/', _.omit(situation, '_id'))
		.then(response => dispatch(persistSuccess(response.data)))
		.catch(e => console.log(e));
  }
}

export function simulate() {

  return function(dispatch, getState) {

  	let { situation } = getState();

  	dispatch(simulateRequest());

  	httpClient.get('api/situations/' + situation._id + '/openfisca-response', {
  		headers: {
  			'Authorization': situation.token
  		}
  	})
		.then(response => dispatch(simulateSuccess(response.data)))
		.catch(e => console.log(e));
  }
}
