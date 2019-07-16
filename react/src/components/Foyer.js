import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import Demandeur from './foyer/Demandeur'
import Enfants from './foyer/Enfants'
import Conjoint from './foyer/Conjoint'
import Logement from './foyer/Logement'

export default (props) => {

  return (
    <div>
      <Route path={ `${props.match.path}/demandeur` } component={ Demandeur } />
      <Route path={ `${props.match.path}/enfants` } component={ Enfants } />
      <Route path={ `${props.match.path}/conjoint` } component={ Conjoint } />
      <Route path={ `${props.match.path}/logement` } component={ Logement } />
    </div>
  )
}
