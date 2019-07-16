import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import { LocaleProvider } from 'antd'
import fr_FR from 'antd/lib/locale-provider/fr_FR'
import moment from 'moment'
import 'moment/locale/fr'

import 'antd/dist/antd.css'

import Foyer from './Foyer'
import Resultat from './Resultat'

moment.locale('fr')

function Index() {
  return (
    <div className="text-center">
      <Link className="btn btn-primary" to="/foyer/demandeur">Démarrer</Link>
    </div>
  )
}

export default () => {

	return (
    <Router>
      <LocaleProvider locale={ fr_FR }>
        <div className="container">
          <div className="row">
            <Route path="/" exact component={ Index } />
            <Route path="/foyer" component={ Foyer } />
            <Route path="/resultat" exact component={ Resultat } />
          </div>
        </div>
      </LocaleProvider>
    </Router>
  )
}
