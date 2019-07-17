const StorageHelper = require('./lib/StorageHelper.js').default
const Fuse = require('fuse.js')

chrome.omnibox.onInputEntered.addListener(input => {
  const shortcut = input.split(' ')[0]
  StorageHelper.getUrlForShortcut(shortcut, shortcutData => {
    debugger
    if (shortcutData == null) {
      chrome.tabs.create({'url': `/index.html?errorCode=0&invalidShortcut=${shortcut}` })
    } else {
      var url = null
      if (!shortcutData.paramaterized) {
        url = shortcutData.url
      } else {
        url = substituteParameters(input, shortcutData)
      }
      StorageHelper.recordViewCount(shortcut)
      chrome.tabs.update({ url });
    }
  })
})

const substituteParameters = (input, shortcutData) => {
  debugger
  const endOfShortcut = input.indexOf(' ')
  if (!shortcutData.paramaterized) {
    return shortcutData.url
  } else {
    const inputParameters = input.substring(endOfShortcut + 1).split('|')
    if (inputParameters.length < shortcutData.parameters.length || endOfShortcut === -1) {
      return '/index.html?errorCode=1'
    } else {
      var url = shortcutData.url
      for (let i = 0; i < shortcutData.parameters.length; i++) {
        url = url.replace(shortcutData.parameters[i].parameterName, encodeURIComponent(inputParameters[i].trim()))
      }
      return url
    }
  }
}

const options = {
  keys: [{
    name: 'shortcut',
    weight: 1
  }]
}

const generateSearchSuggestions = (input, callback) => {
  StorageHelper.getShortcuts(result => {
    const data = Object.keys(result).map(shortcut => {
      const url = result[shortcut].url
      return {
        shortcut,
        url
      }
    })
    const fuse = new Fuse(data, options)
    var searchResults = fuse.search(input).slice(0, 3)
    if (searchResults.length > 0) {
      searchResults = searchResults.map(result => (
        { 
          content: result.shortcut, 
          description: `<url>${result.shortcut}</url> - <dim>${result.url}</dim>`
        }
      ))
      callback(searchResults)
    }
  })
}

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  text = text.replace(" ", "")
  generateSearchSuggestions(text, searchSuggestions => {
    suggest(searchSuggestions)
  })
}); 