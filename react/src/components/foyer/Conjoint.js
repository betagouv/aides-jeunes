import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Button, Form, Radio } from 'antd'
import { connect } from 'react-redux'

import { modifyMaritalStatus } from '../../../../app/redux/actions'

class Conjoint extends Component {

  constructor (props) {
    super(props)
    this.state = {
      status: 'seul.e'
    }
  }

  _onChange(e) {

    const status = e.target.value

    if (status === 'seul.e') {
      this.props.modifyMaritalStatus('demandeur', 'celibataire')
    }

    this.setState({ status })
  }

  _onSubmit(e) {
    e.preventDefault()
    this.props.history.push('/foyer/logement')
  }

  render() {

    return (
      <div>
        <h1>Conjoint</h1>
        <Form layout="vertical" onSubmit={ this._onSubmit.bind(this) }>
          <Form.Item label="Vivez-vous seul.e ou en couple ?">
            <Radio.Group onChange={ this._onChange.bind(this) } defaultValue={ this.state.status }>
              <Radio.Button value="seul.e">Je vis seul.e</Radio.Button>
              <Radio.Button value="en_couple">Je vis en couple</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Valider
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

function mapStateToProps(state) {

  return {

  }
}

function mapDispatchToProps (dispatch) {

  return {
    modifyMaritalStatus: (id, status) => dispatch(modifyMaritalStatus(id, status))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Conjoint))
