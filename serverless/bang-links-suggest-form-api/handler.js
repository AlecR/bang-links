const aws = require('aws-sdk')
const ses = new aws.SES()
const myEmail = process.env.EMAIL
const myDomain = process.env.DOMAIN

function generateResponse(code, payload) {
  return {
    statusCode: code,
    header: {
      'Access-Control-Allow-Origin': myDomain,
      'Access-Control-Allow-Headers': 'x-requested-with',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(payload)
  }
}

function generateError(code, err) {
  console.log(err)
  return {
    statusCode: code,
    headers: {
      'Access-Control-Allow-Origin': myDomain,
      'Access-Control-Allow-Headers': 'x-requested-with',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(err.message)
  }
}

function generateEmailParams(body) {
  const { email, suggestion } = JSON.parse(body)
  if (!suggestion) {
    throw new Error('Missing parameters! Make sure to add parameter suggestion.')
  }

  return {
    Source: myEmail,
    Destination: { ToAddresses: [myEmail] },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `Email: ${email}\nSuggestion: ${suggestion}`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `Bang Links new suggestion submitted`
      }
    }
  }
}

module.exports.send = async(event) => {
  const emailParams = generateEmailParams(event.body)
  const sendPromise = await ses.sendEmail(emailParams).promise()
  sendPromise.then(res => {
    return res.json()
  }).then(json => {
    console.log(json)
    return generateResponse(200, json)
  }).catch(err => {
    console.log(err)
    return generateResponse(500, err)
  })
}
