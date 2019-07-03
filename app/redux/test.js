import store from '.'
import {
	modifyIndividu,
	modifyDateOfBirth,
	modifyMaritalStatus,
	modifyHousingStatus,
	persist,
	simulate
} from './actions'

const unsubscribe = store.subscribe(() => {
	let state = store.getState();
	console.log('NEW STATE', JSON.stringify(state));
})

store.dispatch(modifyDateOfBirth('demandeur', '1983-06-06T00:00:00.000Z'));
store.dispatch(modifyMaritalStatus('demandeur', 'celibataire'));
store.dispatch(modifyHousingStatus('locataire_vide'));
store.dispatch(persist())

setTimeout(() => store.dispatch(simulate()), 5000)
