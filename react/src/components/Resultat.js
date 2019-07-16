import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Button, Form, DatePicker } from 'antd'
import { connect } from 'react-redux'

import { simulate } from '../../../app/redux/actions'

class Resultat extends Component {

	constructor (props) {
    super(props)
  }

  componentDidMount() {
    this.props.simulate()
  }

  // function handleSubmit(e) {
  //   e.preventDefault()
  //   props.history.push('/foyer/enfants')
  // }

  // function handleChange(date, dateString) {
  //   props.modifyDateOfBirth('demandeur', dateString)
  // }

  render() {
    return (
      <div>
        <h1>Resultat</h1>
        { this.props.isLoading && (<span>CHARGEMENT...</span>) }
      </div>
    )
  }

}

function mapStateToProps(state) {

  return {
    isLoading: state.isSimulating
  }
}

function mapDispatchToProps (dispatch) {

  return {
    simulate: _ => dispatch(simulate())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Resultat))
