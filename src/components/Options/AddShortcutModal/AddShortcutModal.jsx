import React from 'react'
import Modal from 'react-modal'
import { Formik } from 'formik'
import StorageHelper from '../../../lib/StorageHelper.js'
import { Button, Form } from 'react-bootstrap'
import * as yup from 'yup';

const validationSchema = yup.object({
  shortcut: yup.string().required(''),
  url: yup.string().required(''),
});
const AddShortcutModal = props => (
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
    <p 
      className='options__modal-title'
    >{props.editing ? 'Edit Shortcut' : 'Add Shortcut'}</p>
    <Formik
      initialValues={{ shortcut: props.initalValues.shortcut, url: props.initalValues.url }}
      validationSchema={validationSchema}
      onSubmit={(values, event) => {
        const { url, shortcut } = values
        if (props.editing) {
          const originalShortcut = props.initalValues.shortcut
          StorageHelper.deleteShortcut(originalShortcut, () => {
            StorageHelper.saveShortcut(shortcut, url, () => {
              props.onSave()
            })
          })
        } else {
          StorageHelper.saveShortcut(shortcut, url, () => {
            props.onSave()
          })
        }
      }}
    >
      {({
        handleSubmit,
        handleChange,
        values,
        touched,
        isValid,
        errors,
      }) => (
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Shortcut</Form.Label>
            <Form.Control 
              type='text'
              name='shortcut'
              placeholder='Ex. ggl' 
              value={values.shortcut}
              onChange={handleChange}
              isInvalid={touched.shortcut && !!errors.shortcut}
            />
            <Form.Control.Feedback type="invalid">
              {errors.shortcut}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>URL</Form.Label>
            <Form.Control 
              type='text'
              name='url'
              placeholder='Ex. https://google.com' 
              value={values.url}
              onChange={handleChange}
              isInvalid={touched.url && !!errors.url}
            />
            <Form.Text className="text-muted">Be sure to include https:// or http://</Form.Text>
            <Form.Control.Feedback type="invalid">
              {errors.url}
            </Form.Control.Feedback>
          </Form.Group>
          <Button 
            className='options__modal-add-button'
            variant="primary" 
            type="submit"
          >
            Add Shortuct
          </Button>
        </Form>
      )}
    </Formik>
  </Modal>
)

export default AddShortcutModal