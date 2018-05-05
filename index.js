const request = require('request')

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
  this.baseURL = "https://2factor.in/API/V1/" + APIKEY + "/ADDON_SERVICES"
  this.defaultSID = SENDERID || "TFCTOR"
}

/**
* Method to retrieve balance for this client
* @return {Promise} A promise object that resolves after the api call has completed
*/
TwoFactor.prototype.balance = function() {
  return new Promise((resolve, reject) => {
    var req = request.get({
      url: this.baseURL + "/BAL/TRANSACTIONAL_SMS"
    }, function(err, res, body) {
      if (err) {
        reject(err);
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
        url: this.baseURL + "/SEND/TSMS",
        form: payload
      }, function(err, res, body) {
        if (err) {
          reject(err);
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
 * @param  {string} values - An array of variables to be used in the template
 * @param  {string} [senderId] - Optional parameter to specify a different senderid for this request
 * @return {Promise} A promise object that resolves after the api call has completed
 */
 TwoFactor.prototype.sendTemplate = function(phoneNumbers, templateName, values, senderId) {
  return new Promise((resolve, reject) => {
    if (typeof phoneNumbers === 'undefined' || typeof templateName === 'undefined') {
      reject(new Error('sendTemplate() expects phoneNumbers and message to be specified'))
    } else {
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
        url: this.baseURL + "/SEND/TSMS",
        form: payload
      }, function(err, res, body) {
        if (err) {
          reject(err);
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

module.exports = TwoFactor