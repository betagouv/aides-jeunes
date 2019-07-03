import store from '.'
import {
	modifyIndividu,
	modifyDateOfBirth,
	modifyMaritalStatus,
	modifyHousingStatus,
	modifyRentAmount,
	modifyPostalCode,
	persist,
	simulate
} from './actions'

const unsubscribe = store.subscribe(() => {
	let state = store.getState();
	console.log('NEW STATE', JSON.stringify(state));
})

// Individu
store.dispatch(modifyDateOfBirth('demandeur', '1983-06-06T00:00:00.000Z'));
store.dispatch(modifyMaritalStatus('demandeur', 'celibataire'));

// Menage
store.dispatch(modifyHousingStatus('locataire_vide'));
store.dispatch(modifyRentAmount(900));
store.dispatch(modifyPostalCode('75010'));

// store.dispatch(persist())
// setTimeout(() => store.dispatch(simulate()), 5000)

setTimeout(() => store.dispatch(persist()), 5000)
setTimeout(() => store.dispatch(simulate()), 10000)
