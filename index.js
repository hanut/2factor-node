const request = require('request')
const baseURL = "https://2factor.in/API/V1/"
const EP_SMS_BAL = "/BAL/SMS"
const EP_SMS = "/SMS/"
const EP_SMS_VERIFY = "/SMS/VERIFY/"
const EP_TSMS_BAL = "/ADDON_SERVICES/BAL/TRANSACTIONAL_SMS"
const EP_TSMS_SEND = "/ADDON_SERVICES/SEND/TSMS"
const EP_TSMS_RPT = "/ADDON_SERVICES/RPT/TSMS/"
const EP_PSMS_BAL = "/ADDON_SERVICES/BAL/PROMOTIONAL_SMS"
const EP_PSMS_SEND = "/BAL/SMS"
const EP_PSMS_RPT = "/ADDON_SERVICES/RPT/PSMS/"

/**
* Constructor function that takes an API key and
* an optional default senderid as parameters and returns
* a new TwoFactor api client.
*
* @param {string} APIKEY - The apikey to be used while making requests.
* @param {string} [SENDERID=TFCTOR] - default senderid to be used if no sender id
* is specified in send().
*/
const TwoFactor = function (APIKEY, SENDERID) {
  this.apikey = APIKEY
  this.defaultSID = SENDERID || "TFCTOR"
}

/**
* Method to retrieve balance for this client. It expects a type parameter which
* is a string defining the type of balance to return.
* Type can be either 'ALL', SMS', 'TRANSACTIONAL_SMS' or 'PROMOTIONAL_SMS'.*
* @param {string} type - The type of balance to return
* @return {Promise} A promise object that resolves after the api call has completed
*/
TwoFactor.prototype.balance = function(type) {
  return new Promise((resolve, reject) => {
    if (!type) {
      type = 'ALL'
    }
    if (['ALL', 'SMS', 'TRANSACTIONAL_SMS', 'PROMOTIONAL_SMS'].indexOf(type) === -1) {
      reject(new Error("Invalid value of `type` parameter"))
      return
    }
    let url = ''
    if (type === 'ALL') {
      let balances = {
        sms: undefined,
        transactional: undefined,
        promotional: undefined
      }
      let promises = []
      promises.push(this.balance('SMS'))
      promises.push(this.balance('TRANSACTIONAL_SMS'))
      promises.push(this.balance('PROMOTIONAL_SMS'))
      Promise.all(promises).then(results => {
        balances.sms = results[0].Details
        balances.transactional = results[1].Details
        balances.promotional = results[2].Details
        resolve(balances)
      }).catch(reject)
      return
    } else if (type === 'SMS') {
      url = `${baseURL}${this.apikey}${EP_SMS_BAL}`
    } else if (type === 'TRANSACTIONAL_SMS') {
      url = `${baseURL}${this.apikey}${EP_TSMS_BAL}`
    } else if (type === 'PROMOTIONAL_SMS') {
      url = `${baseURL}${this.apikey}${EP_PSMS_BAL}`
    } else {
      throw new Error('Invalid `type` field. Valid values are SMS, TRANSACTIONAL_SMS and PROMOTIONAL_SMS')
    }
    var req = request.get({
      url: url
    }, function(err, res, body) {
      if (err) {
        reject(err)
        return
      }
      try {
        let parsedBody = JSON.parse(body)
        resolve(parsedBody)
      } catch(e) {
        reject(e)
      }
    })
  })
}


/**
* Send a transactional, open template SMS
* @param  {array} phoneNumbers - An array of phone numbers without country codes
* @param  {string} message - The message to be sent
* @param  {string} [senderId] - A senderId to be used while sending this message otherwise the defaultSID is used
* @param  {date} [sendAt] - time to schedule this SMS for
* @return {Promise} A promise object that resolves after the api call has completed
*/
TwoFactor.prototype.sendTransactional = function(phoneNumbers, message, senderId, sendAt) {
  return new Promise((resolve, reject) => {
    if (typeof phoneNumbers === 'undefined' || typeof message === 'undefined') {
      reject(new Error('sendTransactional() expects phoneNumbers and message to be specified'))
    } else {
      if(!Array.isArray(phoneNumbers)) {
        phoneNumbers = [phoneNumbers]
      }
      let payload = {
        From: senderId || this.defaultSID,
        To: phoneNumbers.join(","),
        Msg: message
      }
      if (sendAt) {
        payload.SendAt = sendAt
      }
      var req = request.post({
        url: `${baseURL}${this.apikey}${EP_TSMS_SEND}`,
        form: payload
      }, function(err, res, body) {
        if (err) {
          reject(err)
          return
        }
        try {
          let parsedBody = JSON.parse(body)
          resolve(parsedBody)
        } catch(e) {
          reject(e)
        }
      })
    }
  })
}

/**
* Send a template based SMS with pre approved senderid
* @param  {array} phoneNumbers - An array of phone numbers without country codes
* @param  {string} templateName - Name of the template to be used
* @param  {string} values - An array holding maximum of 5 values to be used in the template. 
* @param  {string} [senderId] - Optional parameter to specify a different senderid for this request
* @return {Promise} A promise object that resolves after the api call has completed
*/
TwoFactor.prototype.sendTemplate = function(phoneNumbers, templateName, values, senderId) {
  return new Promise((resolve, reject) => {
    if (typeof phoneNumbers === 'undefined' || typeof templateName === 'undefined') {
      return reject(new Error('sendTemplate() expects phoneNumbers and template name to be specified'))
    }
    if (values && values.length > 5) {
      return reject(new Error("values field must be an array with a maximum of 5 values."))
    }
    if(!Array.isArray(phoneNumbers)) {
      phoneNumbers = [phoneNumbers]
    }
    let payload = {
      From: senderId || this.defaultSID,
      To: phoneNumbers.join(","),
      TemplateName: templateName
    }
    if(Array.isArray(values)) {
      values.forEach((element, index) => {
        payload['VAR' + (index + 1)] = element
      })
    }
    var req = request.post({
      url: `${baseURL}${this.apikey}${EP_TSMS_SEND}`,
      form: payload
    }, function(err, res, body) {
      if (err) {
        reject(err)
        return
      }
      try {
        let parsedBody = JSON.parse(body)
        resolve(parsedBody)
      } catch(e) {
        reject(e)
      }
    })
  })
}

/**
* Send an OTP to a given phone number. Accepts a phone number parameter along with an
* optional `options` parameter. Options object has the following attributes - 
* 1. {number} otp - The otp you want to send to the phone number
* 2. {string} template - A string containing the template name to use for sending the otp
*
* @param  {string} phoneNumber - An string containig a 10 digit phone number
* @param  {object} options - An object containing configuration options for the request
* @return {Promise} A promise object that resolves after the api call has completed
*/
TwoFactor.prototype.sendOTP = function (phoneNumber, options) {
  return new Promise((resolve, reject) => {
    if (!phoneNumber) {
      reject(new Error('invalid or missing phoneNumber field'))
      return
    }
    if (phoneNumber.length !== 10) {
      reject(new Error('phone number must be exactly 10 digits'))
      return
    }
    let url = ''
    if (!options || (!options.otp && !options.template)) {
      // No otp or template specified
      url = `${baseURL}${this.apikey}${EP_SMS}${phoneNumber}/AUTOGEN`
    } else  if (options.template && !options.otp) {
      // Custom template, No otp specified
      url = `${baseURL}${this.apikey}${EP_SMS}${phoneNumber}/AUTOGEN/${options.template}`
    } else if (options.otp && !options.template) {
      // Custom otp, No template specified
      url = `${baseURL}${this.apikey}${EP_SMS}${phoneNumber}/${options.otp}`
    } else {
      // Custom otp and template
      url = `${baseURL}${this.apikey}${EP_SMS}${phoneNumber}/${options.otp}/${options.template}`
    }
    let req = request.post({
      url: url
    }, function(err, res, body) {
      if (err) {
        reject(err)
        return
      }
      try {
        let parsedBody = JSON.parse(body)
        if (parsedBody.Status === 'Error') {
          reject(parsedBody.Details)
        } else {
          resolve(parsedBody.Details)
        }
      } catch(e) {
        reject(e)
      }
    })
  })
}

/**
* Verify an OTP sent to a given phone number
*
* @param  {string} sessionId - A string containig the session id returned while sending the otp
* @param  {object} otp - A string containing the otp code to verify 
* @return {Promise} A promise object that resolves after the api call has completed
*/
TwoFactor.prototype.verifyOTP = function (sessionId, otp) {
  return new Promise((resolve, reject) => {
    if (!sessionId || sessionId === '') {
      reject(new Error('invalid or missing sessionId parameter'))
      return
    }
    if (!otp || otp.length < 4 || otp.length > 6) {
      reject(new Error('invalid or missing otp parameter'))
      return
    }
    let url = `${baseURL}${this.apikey}/SMS/VERIFY/${sessionId}/${otp}`
    console.log(url)
    let req = request.post({
      url: url
    }, function(err, res, body) {
      if (err) {
        reject(err)
        return
      }
      try {
        let parsedBody = JSON.parse(body)
        if (parsedBody.Status === 'Error') {
          reject(parsedBody.Details)
        } else {
          resolve(parsedBody.Details)
        }
      } catch(e) {
        reject(e)
      }
    })
  })
}

module.exports = TwoFactor