import React from 'react'
import { withRouter } from 'react-router-dom'
import { Button, Form, DatePicker } from 'antd'
import { connect } from 'react-redux'

import { modifyDateOfBirth } from '../../../../app/redux/actions'

const Enfants = (props) => {

  function handleSubmit(e) {
    e.preventDefault()
    props.history.push('/foyer/conjoint')
  }

	return (
    <div>
      <h1>Enfants</h1>
      <Form layout="vertical" onSubmit={ handleSubmit }>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Valider
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

function mapStateToProps(state) {

  return {

  }
}

function mapDispatchToProps (dispatch) {

  return {
    // modifyDateOfBirth: date => dispatch(modifyDateOfBirth(date))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Enfants))
