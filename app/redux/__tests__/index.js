import store from '..'
import reducer from '../reducers'
import { modifyIndividu, modifyDateOfBirth } from '../actions'

describe('select_reducer', () => {

	it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(
      {
        resultat: {},
        situation: {
          individus: []
        }
      }
    )
  })

  it('should add individu with role "demandeur"', () => {

    const action = modifyIndividu('demandeur', { nationalite: 'fr' });
    const actual = reducer(undefined, action);

    const expected = {
      resultat: {},
      situation: {
        individus: [
          {
            role: 'demandeur',
            nationalite: 'fr'
          }
        ]
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should modify individu with role "demandeur"', () => {

    const initialState = {
      resultat: {},
      situation: {
        individus: [
          {
            role: 'demandeur',
            nationalite: 'fr'
          }
        ]
      }
    }

    const action = modifyIndividu('demandeur', { nationalite: 'es' });
    const actual = reducer(undefined, action);

    const expected = {
      resultat: {},
      situation: {
        individus: [
          {
            role: 'demandeur',
            nationalite: 'es'
          }
        ]
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should modify individu prop "date_naissance"', () => {

    const initialState = {
      resultat: {},
      situation: {
        individus: [
          {
            id: 'demandeur',
            role: 'demandeur',
            nationalite: 'fr'
          }
        ]
      }
    }

    const action = modifyDateOfBirth('demandeur', '1983-06-06T00:00:00.000Z');
    const actual = reducer(initialState, action);

    const expected = {
      resultat: {},
      situation: {
        individus: [
          {
            id: 'demandeur',
            role: 'demandeur',
            nationalite: 'fr',
            date_naissance: '1983-06-06T00:00:00.000Z'
          }
        ]
      }
    }

    expect(actual).toEqual(expected)
  })

});
