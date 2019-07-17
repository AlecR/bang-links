const saveShortcut = (shortcut, url, callback = () => null) => {
  const parameters = parseParameters(url)
  const shortcutData = {
    url,
    visitCount: 0,
    paramaterized: parameters.length > 0,
    parameters
  }
  chrome.storage.sync.set({[shortcut]: JSON.stringify(shortcutData)}, function() {
    callback()
  });
}

const deleteShortcut = (shortcut, callback = () => null) => {
  chrome.storage.sync.remove(shortcut, () => {
    callback()
  });
}

const getShortcuts = callback => {
  chrome.storage.sync.get(null, result => {
    const shortcutData = {}
    Object.keys(result).forEach(shortcut => {
      const data = JSON.parse(result[shortcut])
      shortcutData[shortcut] = data
    })
    callback(shortcutData)
  });
}

const getUrlForShortcut = (shortcut, callback) => {
  chrome.storage.sync.get(shortcut, result => {
    if (Object.keys(result).length === 0) { 
      callback(null)
    } else {
      const shortcutData = JSON.parse(result[shortcut])
      callback(shortcutData)
    }
  });
}

const recordViewCount = (shortcut, callback = () => null) => {
  chrome.storage.sync.get(shortcut, result => {
    const shortcutData = JSON.parse(result[shortcut])
    shortcutData.visitCount += 1
    chrome.storage.sync.set({[shortcut]: JSON.stringify(shortcutData)}, () => {
      callback()
    });
  });
}

const parseParameters = (url) => {
  var i = 0
  const parameters = []
  while (i < url.length) {
    if (url.charAt(i) == '{') {
      const startIndex = i
      while (i < url.length && url.charAt(i) != '}') i++
      parameters.push({
        startIndex,
        endIndex: i,
        parameterName: url.substring(startIndex, i + 1)
      })
    }
    i++
  }
  return parameters
}

export default { 
  saveShortcut, 
  deleteShortcut, 
  getShortcuts, 
  getUrlForShortcut,
  recordViewCount 
}