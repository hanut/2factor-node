const request = require('request')

const TwoFactor = function (APIKEY, SENDERID) {
  this.baseURL = "https://2factor.in/API/V1/" + APIKEY + "/ADDON_SERVICES"
  this.defaultSID = SENDERID || "TFCTOR"
}

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

TwoFactor.prototype.send = function(phone, message, senderid) {
  return new Promise((resolve, reject) => {
    if (typeof phone === 'undefined' || typeof message === 'undefined') {
      reject(new Error('send(phone, message) expects phone and message to be specified'))
    } else {
      var req = request.post({
        url: this.baseURL + "/SEND/TSMS",
        form: {
          From: senderid || this.defaultSID,
          To: phone,
          Msg: message
        }
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