import React, { Component } from 'react'
import StorageHelper from '../../lib/StorageHelper.js'
import { Table, Navbar, Button, Alert } from 'react-bootstrap'
import AddShortcutModal from './AddShortcutModal/AddShortcutModal.jsx'
import SuggestFeatureModal from './SuggestFeatureModal/SuggestFeatureModal.jsx'
import { createBrowserHistory } from 'history'
import './Options.css'

class Options extends Component {

  state = {
    shortcuts: {},
    displayAddModal: false,
    displaySuggestionModal: false,
    modalEditMode: false,
    modalFormData: {
      shortcut: '',
      url: '',
    },
    displayAlert: true,
  }

  alertText = ''
  alertVariant = ''

  componentDidMount() {
    this.refreshShortcuts()
    const queryParams = this.parseQueryParams()
    if (queryParams['errorCode']) {
      const errorCode = queryParams['errorCode']
      switch (errorCode) {
        case "0":
          this.displayAlert(`'${queryParams['invalidShortcut'] || 'Supplied shortcut'}' is not a valid shortcut`, 'danger')
          break
        case "1":
          this.displayAlert('Not enough parameters for shortcut', 'danger')
          break
        default:
          this.displayAlert('Something went wrong. Try again', 'danger') 
          break
      }
    }
  }

  displayAlert = (text, variant) => {
    this.alertText = text
    this.alertVariant = variant
    this.setState({ displayAlert: true}, () => {
      setTimeout(() => {
        this.setState({ displayAlert: false })
      }, 3000);
    }) 
  }

  handleAddButtonClicked = () => {
    this.setState({
      displayAddModal: true,
      modalEditMode: false,
      modalFormData: {
        shortcut: '',
        url: '',
      },
    })
  }

  handleSuggestButtonClicked = () => {
    this.setState({ displaySuggestionModal: true })
  }

  handleEditButtonClicked = (shortcut, url) => {
    this.setState({
      displayAddModal: true,
      modalEditMode: true,
      modalFormData: {
        shortcut,
        url,
      },
    })
  }

  handleDeleteButtonClicked = (event, shortcut) => {
    event.preventDefault()
    StorageHelper.deleteShortcut(shortcut, () => {
      StorageHelper.getShortcuts(shortcuts => {
        this.setState({ shortcuts })
      })
    })
  }

  refreshShortcuts = () => {
    StorageHelper.getShortcuts(shortcuts => {
      this.setState({ shortcuts })
    })
  }
  
  closeModal = () => {
    this.setState(() => {
      return { 
        displayAddModal: false, 
        displaySuggestionModal: false 
      }
    })
  } 

  parseQueryParams = () => {
    const history = createBrowserHistory()
    const queryMap = {}
    var location = history.location.search
    if (location.length < 1) {
      return queryMap
    } else {
      const queryParams = location.substring(1).split('&')
      queryParams.forEach(query => {
        const parts = query.split('=')
        queryMap[parts[0]] = parts[1]
      })
      return queryMap  
    }
  }

  OptionsAlert = () => (
    <div className='options__alert-wrapper'>
      <Alert className='options__alert' variant={this.alertVariant}>
        {this.alertText}
      </Alert>
    </div>
  )
  
  render() {
    const shortcuts = this.state.shortcuts
    return (
      <div className='options__wrapper'>
        <Navbar className='options__navbar justify-content-between'>
          <Navbar.Brand>Bang Links</Navbar.Brand>
          <div>
            <Button 
              onClick={() => this.handleAddButtonClicked()}  
            >Add Shortcut</Button>
            <Button 
              className='options__suggest-button'
              onClick={() => this.handleSuggestButtonClicked()}  
              variant='dark'
            >Suggest A Feature</Button>
          </div>
        </Navbar>
        {this.state.displayAlert && (<this.OptionsAlert />)}
        <Table className='options__shortcut-table'>
          <tbody>
            <tr>
              <th>Shortcut</th>
              <th>Url</th>
              <th>Visit Count</th>
              <th></th>
            </tr>
            {Object.keys(shortcuts).length > 0 && (
              Object.keys(shortcuts).map((shortcut, index) => {
                const { url, visitCount, paramaterized, parameters } = shortcuts[shortcut]
                return (
                  <tr key={`shortcut-${index}`}>
                    <td>{shortcut} {paramaterized ? (
                      parameters.map(p => p.parameterName)
                    ) : null}</td>
                    <td>{paramaterized ? (
                      url
                    ) : (
                      <a href={url}>{url}</a>
                    )}</td>
                    <td>{visitCount}</td>
                    <td className='options__shortcut-table-button-column'>
                      <Button 
                        className='options__edit-button'
                        onClick={event => this.handleEditButtonClicked(shortcut, url)}
                        variant={'primary'}
                      >Edit</Button>
                      <Button 
                        className='options__delete-button'
                        onClick={event => this.handleDeleteButtonClicked(event, shortcut)}
                        variant={'danger'}
                      >X</Button>
                    </td>
                  </tr>
                )
              }
            ))}
          </tbody>
        </Table>
        <AddShortcutModal 
          isOpen={this.state.displayAddModal}
          onSave={() => {
            this.closeModal()
            this.refreshShortcuts()
            this.displayAlert('Shortcut saved!', 'success')
          }}
          initalValues={this.state.modalFormData}
          onCloseRequest={this.closeModal}
          editing={this.state.modalEditMode}
        />
        <SuggestFeatureModal
          isOpen={this.state.displaySuggestionModal}
          onCloseRequest={this.closeModal}
          onCloseAfterSend={() => {
            this.closeModal()
            this.displayAlert('Thank you! Your feedback has been sent', 'success')
          }}

        />   
      </div>
    ) 
  }
}

export default Options;
