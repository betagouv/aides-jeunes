import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import Demandeur from './foyer/Demandeur'

export default (props) => {

  return (
    <div>
      <Route path={ `${props.match.path}/demandeur` } component={ Demandeur } />
    </div>
  )
}
