import { createAction } from 'redux-actions';
import axios from 'axios';
import _ from 'lodash';

export const MODIFY_INDIVIDU = 'MODIFY_INDIVIDU';
export const MODIFY_DATE_OF_BIRTH = 'MODIFY_DATE_OF_BIRTH';
export const MODIFY_NATIONALITY = 'MODIFY_NATIONALITY';
export const MODIFY_MARITAL_STATUS = 'MODIFY_MARITAL_STATUS';
export const MODIFY_HOUSING_STATUS = 'MODIFY_HOUSING_STATUS';

export const modifyIndividu = createAction(MODIFY_INDIVIDU, (role, props = {}) => ({ role, props }))
export const modifyNationality   = createAction(MODIFY_NATIONALITY, (id, nationality) => ({ id, nationality }))
export const modifyDateOfBirth   = createAction(MODIFY_DATE_OF_BIRTH, (id, dateOfBirth) => ({ id, dateOfBirth }))
export const modifyMaritalStatus = createAction(MODIFY_MARITAL_STATUS, (id, maritalStatus) => ({ id, maritalStatus }))
export const modifyHousingStatus = createAction(MODIFY_HOUSING_STATUS)

export const PERSIST_REQUEST = 'PERSIST_REQUEST';
export const PERSIST_SUCCESS = 'PERSIST_SUCCESS';

export const persistRequest = createAction(PERSIST_REQUEST)
export const persistSuccess = createAction(PERSIST_SUCCESS)

export const SIMULATE_REQUEST = 'SIMULATE_REQUEST';
export const SIMULATE_SUCCESS = 'SIMULATE_SUCCESS';

export const simulateRequest = createAction(SIMULATE_REQUEST)
export const simulateSuccess = createAction(SIMULATE_SUCCESS)

const httpClient = axios.create({
  baseURL: 'http://localhost:9000',
});

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
		.then(response => {
			// console.log(response.data)
			dispatch(simulateSuccess(response.data))
		})
		.catch(e => console.log(e));
  }
}
