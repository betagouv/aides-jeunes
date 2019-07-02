import store from '.'
import {
	modifyIndividu,
	modifyDateOfBirth,
	persist,
	simulate
} from './actions'

const unsubscribe = store.subscribe(() => {
	let state = store.getState();
	console.log('NEW STATE', JSON.stringify(state));
})

store.dispatch(modifyDateOfBirth('demandeur', '1983-06-06T00:00:00.000Z'));
store.dispatch(persist())

setTimeout(() => store.dispatch(simulate()), 5000)
