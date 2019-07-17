import React, { Component } from 'react';
import StorageHelper from '../../lib/StorageHelper.js'
import { Button, Form, Navbar, Alert } from 'react-bootstrap'
import './Popup.css'

class Popup extends Component {

  state = {
    shortcutName: '',
    displaySuccessAlert: false,
  }

  componentDidMount() {
    this.newLinkInput.focus()

  }

  updateShortcutName = event => {
    const shortcutName = event.target.value
    this.setState({ shortcutName })
  }


  handleFormSubmit = (event) => {
    event.preventDefault()
    const shortcutName = this.state.shortcutName
    if (shortcutName === '') { return }
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, tabs => {
        var url = tabs[0].url;
        StorageHelper.saveShortcut(shortcutName, url, () => {
          this.setState({ shortcutName: '' })
          this.displaySuccessAlert()
        })
    });
  }

  SaveSucessAlert = props => (
    <div className='popup__alert-wrapper'>
      <Alert className='popup__alert' variant='success'>
        Shortcut Saved!
      </Alert>
    </div>
  )

  displaySuccessAlert = () => {
    this.setState({ displaySuccessAlert: true}, () => {
      setTimeout(() => {
        this.setState({ displaySuccessAlert: false })
      }, 3000);
    }) 
  }

  render() {
    return (
      <div className="popup__wrapper">
        <Navbar className='popup__navbar'>
          <Navbar.Brand className='popup__title'>Bang Links</Navbar.Brand>
        </Navbar>
        <div className="popup__content-wrapper">
          {this.state.displaySuccessAlert && (<this.SaveSucessAlert />)}
          <Form>
            <Form.Group>
              <Form.Label className='popup__label'>Create shortcut for current URL</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Shortcut" 
                ref={(input) => { this.newLinkInput = input; }} 
                value={this.state.shortcutName}
                onChange={event => this.updateShortcutName(event)}
              />
            </Form.Group>
            <Button 
              className='popup__add-link-button'
              variant="primary" 
              type="submit"
              onClick={event => this.handleFormSubmit(event)}
            >
              Save Shortcut
            </Button>
          </Form>
          <a
            className='popup__manage-link'
            href='#'
            onClick={() => {
              chrome.tabs.create({ url: '/index.html' });
            }}
          >Manage Shortcuts</a>
        </div>
      </div>
    );
  }
}

export default Popup;
