import React from 'react'
import { withRouter } from 'react-router-dom'
import { Button, Form, InputNumber, Radio } from 'antd'
import { connect } from 'react-redux'

import { modifyRentAmount, modifyHousingStatus, modifyPostalCode } from '../../../../app/redux/actions'

const Logement = (props) => {

  function onChangeHousingStatus(e) {
    e.preventDefault()
    props.modifyHousingStatus(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    props.history.push('/resultat')
  }

	return (
    <div>
      <h1>Logement</h1>
      <Form layout="vertical" onSubmit={ handleSubmit }>
      	<Form.Item label="Dans quelle situation êtes-vous ?">
          <Radio.Group onChange={ onChangeHousingStatus } defaultValue="locataire_vide">
            <Radio.Button value="locataire_vide">Locataire d'un logement vide</Radio.Button>
            <Radio.Button value="locataire_meuble">Locataire d'un logement meublé</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Quel est le montant de votre loyer ?">
          <InputNumber onChange={ value => props.modifyRentAmount(value) } />
        </Form.Item>
        <Form.Item label="Quel est votre code postal ?">
          <InputNumber onChange={ value => props.modifyPostalCode(value) } />
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

function mapStateToProps(state) {

  return {

  }
}

function mapDispatchToProps (dispatch) {

  return {
    modifyRentAmount: amount => dispatch(modifyRentAmount(amount)),
    modifyHousingStatus: status => dispatch(modifyHousingStatus(status)),
    modifyPostalCode: postalCode => dispatch(modifyPostalCode(status)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Logement))
