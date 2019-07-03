import Vorpal from 'vorpal';
import ora from 'ora';

import {
	modifyDateOfBirth,
	modifyMaritalStatus,
	modifyHousingStatus,
	modifyRentAmount,
	modifyPostalCode,
	persist,
	simulate,
  SIMULATE_REQUEST,
  SIMULATE_SUCCESS
} from './actions'

import moment from 'moment';

import { create } from '.'

const spinner = ora('Calcul de vos droits…')

const decorator = store => next => action => {

  // console.log('dispatching', action)

  if (action.type === SIMULATE_REQUEST) {
    spinner.start()
  }

  let result = next(action)

  if (action.type === SIMULATE_SUCCESS) {
    spinner.stop()
    const { resultat } = store.getState()
    console.log(JSON.stringify(resultat, null, 2))
  }

  // console.log('next state', store.getState())

  return result
}

const store = create(decorator)

// const unsubscribe = store.subscribe(() => {
// 	let state = store.getState();
// 	console.log('NEW STATE', JSON.stringify(state));
// })

// // Individu
// store.dispatch(modifyDateOfBirth('demandeur', '1983-06-06T00:00:00.000Z'));
// store.dispatch(modifyMaritalStatus('demandeur', 'celibataire'));

// // Menage
// store.dispatch(modifyHousingStatus('locataire_vide'));
// store.dispatch(modifyRentAmount(900));
// store.dispatch(modifyPostalCode('75010'));

const vorpal = new Vorpal();

vorpal
  .command('simulateur', 'Lancer le simulateur')
  .action(function(args, callback) {

    // const self = this;
    // const log = this.log

    this.prompt([
      {
        type: 'input',
        name: 'dateOfBirth',
        message: 'Quelle est votre date de naissance ?',
        validate: input => {
          if (/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/g.test(input)) {
            return true;
          }
          return 'La date de naissance doit être au format jj/mm/aaaa'
        }
      },
      {
        type: 'list',
        name: 'maritalStatus',
        choices: [
          { name: 'Célibataire', value: 'celibataire' },
          { name: 'Marié·e', value: 'marie' }
        ],
        message: 'Dans quelle situation êtes-vous ?'
      },
      {
        type: 'number',
        name: 'rentAmount',
        message: 'Quelle est le montant de votre loyer ?'
      },
      {
        type: 'list',
        name: 'housingStatus',
        choices: [
          { name: 'Locataire d\'un logement vide', value: 'locataire_vide' },
          { name: 'Locataire d\'un logement meublé', value: 'locataire_meuble' }
        ],
        message: 'Dans quelle situation êtes-vous ?'
      },
      {
        type: 'input',
        name: 'postalCode',
        message: 'Quelle est votre code postal ?'
      }
    ], function(answers) {

      // Individu
      store.dispatch(modifyDateOfBirth('demandeur', moment(answers.dateOfBirth, 'DD/MM/YYYY').format()));
      store.dispatch(modifyMaritalStatus('demandeur', answers.maritalStatus));

      // Menage
      store.dispatch(modifyHousingStatus(answers.housingStatus));
      store.dispatch(modifyRentAmount(parseInt(answers.rentAmount, 10)));
      store.dispatch(modifyPostalCode(answers.postalCode));

      callback();

      setTimeout(() => store.dispatch(simulate()), 1500)

    })

  });

vorpal
  .delimiter('mes-aides$')
  .show();

// store.dispatch(persist())
// // setTimeout(() => store.dispatch(simulate()), 5000)

// setTimeout(() => store.dispatch(persist()), 5000)
// setTimeout(() => store.dispatch(simulate()), 10000)
