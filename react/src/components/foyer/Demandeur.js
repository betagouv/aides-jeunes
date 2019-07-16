import React from 'react'
import { Button, Form, DatePicker } from 'antd'
import { connect } from 'react-redux'

import { modifyDateOfBirth } from '../../../../app/redux/actions'

const Demandeur = (props) => {

  function handleSubmit(e) {
    e.preventDefault()
    console.log('handleSubmit')
  }

  function handleChange(date, dateString) {
    console.log('handleChange', date)
    props.modifyDateOfBirth(dateString)
  }

	return (
    <Form layout="vertical" onSubmit={ handleSubmit }>
      <Form.Item label="Date de naissance">
        <DatePicker format="DD/MM/YYYY" onChange={ handleChange } />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Valider
        </Button>
      </Form.Item>
    </Form>
  )
}

function mapStateToProps(state) {

  return {

  }
}

function mapDispatchToProps (dispatch) {

  return {
    modifyDateOfBirth: date => dispatch(modifyDateOfBirth(date))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Demandeur)
