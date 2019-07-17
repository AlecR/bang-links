import React from 'react'
import Modal from 'react-modal'
import { Button, Form } from 'react-bootstrap'
import './SuggestFeatureModal.css'

const SuggestFeatureModal = props => {

  const handleSubmit = event => {
    event.preventDefault()
    const elements = event.target.elements
    const email = elements[0].value
    const suggestion = elements[1].value
    const endpoint = 'https://dygluemt20.execute-api.us-east-1.amazonaws.com/dev/email/send'
    if (suggestion !== '') {
      fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          email,
          suggestion
        })
      })
      props.onCloseAfterSend()
    }
  }

  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.onCloseRequest}
      ariaHideApp={false}
      style={{
        content : {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          transform: 'translate(-50%, -50%)',
          height: 'auto',
          width: '500px'
        }
      }}
    >
      <p className='suggest-feature-modal__modal-title'>Suggest A Feature</p>
      <Form onSubmit={event => handleSubmit(event)}>
        <Form.Label className='suggest-feature-modal__subtitle'>
          Thanks for using Bang Links! If you have a suggestion for a new{' '} 
          feature please send it below
        </Form.Label>
        <Form.Group>
          <Form.Label>
            Email (Optional)
          </Form.Label>
          <Form.Control />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            Suggestion
          </Form.Label>
          <Form.Control as="textarea" rows="3" />
        </Form.Group>
        <Button 
          className='options__modal-add-button'
          variant="primary" 
          type="submit"
        >Send Suggestion</Button>
      </Form>
    </Modal>
  )
}

export default SuggestFeatureModal