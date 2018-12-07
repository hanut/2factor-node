const APIKEY = process.env.APIKEY || ''
const TESTPHONE = process.env.TESTPHONE || ''
const TEMPLATE = process.env.TEMPLATE || ''

let otpSessionId = undefined 

function getRandomOTP(min, max) {
    min = Math.ceil(1000);
    max = Math.floor(9999);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

if (APIKEY === '' || TESTPHONE === '' || TEMPLATE === '') {
  throw new Error('Invalid or missing APIKEY, TESTPHONE or TEMPLATE env variables')
  process.exit(1)
}
const expect = require('chai').expect
const TwoFactor = new (require('../index'))(APIKEY)
const TwoFactorWrongKey = new (require('../index'))("abc123")

describe('2Factor API module', function() {
  describe('#balance()', function() {
    it('should be a function', function() {
      expect(TwoFactor.balance).is.a('function')
    })
    it('should return a promise', function() {
      let returnValue = TwoFactorWrongKey.balance()
      returnValue.catch(error => error)
      expect(returnValue).is.a('promise')
    })

    context('missing or invalid type parameter', function() {
      it('should throw an error reporting invalid or missing type field', function(done) {
        TwoFactorWrongKey.balance().then((response) => {
          done(new Error('Failed to stop missing balance type parameter'))
        }).catch((error) => {
          TwoFactorWrongKey.balance('bad type value').then(response => {
            done(new Error('Failed to stop invalid balance type value'))
          }).catch(error => {
            error = null
            done()
          })
    context('invalid type parameter', function() {
      it('should throw an error reporting invalid or missing type field', function(done) {
        TwoFactorWrongKey.balance('bad type value').then(response => {
          done(new Error('Failed to stop invalid balance type value'))
        }).catch(error => {
          error = null
          done()
        })
      })
    })

    context('Invalid API Key', function() {
      it('should convert response string to json and handle invalid apikey error', function(done) {
        TwoFactorWrongKey.balance('SMS').then((response) => {
          if (response.Status.match(/Success/)) {
            done('2Factor API allowed invalid key')
          } else {
            done()
          }
        }).catch((error) => {
          done(error)
        })
      })
    })

    context('Valid API Key', function() {
      it('should return Status as success and numeric balance in Details field if type = `SMS`', function(done) {
        TwoFactor.balance('SMS').then((response) => {
          expect(response).is.an('object')
          expect(response).has.keys(['Status', 'Details'])
          expect(response.Status).is.equal('Success')
          expect(+response.Details).is.a('number')
          done()
        }, (error) => {
          done(error)
        })
      })
      it('should return Status as success and numeric balance in Details field if type = `TRANSACTIONAL_SMS`', function(done) {
        TwoFactor.balance('SMS').then((response) => {
          expect(response).is.an('object')
          expect(response).has.keys(['Status', 'Details'])
          expect(response.Status).is.equal('Success')
          expect(+response.Details).is.a('number')
          done()
        }, (error) => {
          done(error)
        })
      })
      it('should return Status as success and numeric balance in Details field if type = `PROMOTIONAL_SMS`', function(done) {
        TwoFactor.balance('SMS').then((response) => {
          expect(response).is.an('object')
          expect(response).has.keys(['Status', 'Details'])
          expect(response.Status).is.equal('Success')
          expect(+response.Details).is.a('number')
          done()
        }, (error) => {
          done(error)
        })
      })
      
      it('should return Status as success and an object with numeric balances of different types if type = `ALL`', function(done) {
        TwoFactor.balance('ALL').then((response) => {
          // console.log(response)
          expect(response).is.an('object')
          expect(response).has.keys(['sms', 'transactional', 'promotional'])
          expect(+response.sms).is.a('number')
          expect(+response.transactional).is.a('number')
          expect(+response.promotional).is.a('number')
          done()
        }, (error) => {
          done(error)
        })
      })

      it('should consider `type` as `ALL` if parameter is missing', function(done) {
        TwoFactor.balance().then((response) => {
          // console.log(response)
          expect(response).is.an('object')
          expect(response).has.keys(['sms', 'transactional', 'promotional'])
          expect(+response.sms).is.a('number')
          expect(+response.transactional).is.a('number')
          expect(+response.promotional).is.a('number')
          done()
        }, (error) => {
          done(error)
        })
      })
    })
  })

  describe('#sendTransactional()', function() {
    it('should be a function', function() {
      expect(TwoFactor.sendTransactional).is.a('function')
    })
    it('should return a promise', function() {
      expect(TwoFactorWrongKey.sendTransactional(123, 'abc')).is.a('promise')
    })

    context('If phone numbers or message are missing', function() {
      it('should reject with an error message', function(done) {
        TwoFactorWrongKey.sendTransactional().then((response) => {
          done(new Error('did not reject an invalid function call'))
        }, (error) => {
          done()
        })
      })
    })

    context('Invalid API Key', function() {
      it('should convert response string to json and handle invalid apikey error', function(done) {
        TwoFactorWrongKey.sendTransactional(TESTPHONE, 'testing').then((response) => {
          if (response.Status.match(/Success/)) {
            done('2Factor API allowed invalid key')
          } else {
            done()
          }
        }).catch((error) => {
          done(error)
        })
      })
    })

    context('Valid API Key', function() {
      it('should return Status as success and status in Details field', function(done) {
        TwoFactor.sendTransactional(TESTPHONE, 'test').then((response) => {
          expect(response).is.an('object')
          expect(response).has.keys(['Status', 'Details'])
          done()
        }, (error) => {
          done(error)
        })
      })
    })
  })

  describe('#sendTemplate()', function() {
    it('should be a function', function() {
      expect(TwoFactor.sendTemplate).is.a('function')
    })
    it('should return a promise', function() {
      expect(TwoFactorWrongKey.sendTemplate(123, 'abc')).is.a('promise')
    })

    context('If phone numbers or template name are missing', function() {
      it('should reject with an error message', function(done) {
        TwoFactorWrongKey.sendTemplate().then((response) => {
          done(new Error('did not reject an invalid function call'))
        }, (error) => {
          done()
        })
      })
    })

    context('Invalid API Key', function() {
      it('should convert response string to json and handle invalid apikey error', function(done) {
        TwoFactorWrongKey.sendTemplate(TESTPHONE, 'testing').then((response) => {
          if (response.Status.match(/Success/)) {
            done('2Factor API allowed invalid key')
          } else {
            done()
          }
        }).catch((error) => {
          done(error)
        })
      })
    })

    context('Valid API Key', function() {
      it('should return Status as success and status in Details field', function(done) {
        TwoFactor.sendTemplate(TESTPHONE, 'test', ['Sweety','https://webclient.patchus.in/regenerate/test']).then((response) => {
          expect(response).is.an('object')
          expect(response).has.keys(['Status', 'Details'])
          done()
        }, (error) => {
          done(error)
        })
      })
    })
  })

  describe('#sendOTP()', function() {
    it('should be a function', function() {
      expect(TwoFactor.sendOTP).is.a('function')
    })
    it('should return a promise', function() {
      let returnValue = TwoFactorWrongKey.sendOTP()
      returnValue.catch(error => error)
      expect(returnValue).is.a('promise')
    })

    context('If phone number is missing', function() {
      it('should reject with an error message', function(done) {
        TwoFactorWrongKey.sendOTP().then((response) => {
          done(new Error('did not reject an invalid function call with missing phoneNumber'))
        }).catch(error => {
          done()
        })
      })
    })

    context('Invalid API Key', function() {
      it('should convert response string to json and handle invalid apikey error', function(done) {
        TwoFactorWrongKey.sendOTP(TESTPHONE).then((response) => {
          done(response)
        }).catch((error) => {
          done()
        })
      })
    })

    context('Valid API Key', function() {
      // describe('No options object given', function() {
      //   it('should return Status as success and status in Details field', function(done) {
      //     TwoFactor.sendOTP(TESTPHONE).then((response) => {
      //       console.log(response)
      //       // expect(response).is.an('object')
      //       // expect(response).has.keys(['Status', 'Details'])
      //       done(new Error('WIP'))
      //     }, (error) => {
      //       done(error)
      //     })
      //   })
      // })
      
      // describe('Custom otp', function() {
      //   it('should return Status as success and status in Details field', function(done) {
      //     TwoFactor.sendOTP(TESTPHONE, {otp: getRandomOTP()}).then((response) => {
      //       console.log(response)
      //       // expect(response).is.an('object')
      //       // expect(response).has.keys(['Status', 'Details'])
      //       done(new Error('WIP'))
      //     }, (error) => {
      //       done(error)
      //     })
      //   })
      // })

      // describe('Custom template', function() {
      //   it('should return Status as success and status in Details field', function(done) {
      //     TwoFactor.sendOTP(TESTPHONE, {template: TEMPLATE}).then((response) => {
      //       console.log(response)
      //       // expect(response).is.an('object')
      //       // expect(response).has.keys(['Status', 'Details'])
      //       done(new Error('WIP'))
      //     }, (error) => {
      //       done(error)
      //     })
      //   })
      // })

      describe('Custom otp and template', function() {
        it('should return Status as success and status in Details field', function(done) {
          TwoFactor.sendOTP(TESTPHONE, {template: TEMPLATE, otp: getRandomOTP()}).then((response) => {
            done()
          }, (error) => {
            done(new Error(error))
          })
        })
      })
    })
  })

  describe('#verifyOTP()', function() {
    it('should be a function', function() {
      expect(TwoFactor.verifyOTP).is.a('function')
    })
    it('should return a promise', function() {
      let returnValue = TwoFactorWrongKey.verifyOTP()
      returnValue.catch(error => error)
      expect(returnValue).is.a('promise')
    })

    context('Incorrect or missing parameters', function() {
      it('should reject undefined or blank sessionId', function(done) {
        TwoFactorWrongKey.sendOTP().then((response) => {
          done(new Error('did not reject on missing sessionId'))
        }).catch(error => {
          TwoFactorWrongKey.sendOTP("").then((response) => {
            done(new Error('did not reject on blank sessionId'))
          }).catch(error => {
            done()
          })
        })
      })

      it('should reject undefined or blank otp', function(done) {
        TwoFactorWrongKey.sendOTP("abc").then((response) => {
          done(new Error('did not reject on missing otp'))
        }).catch(error => {
          TwoFactorWrongKey.sendOTP("abc", "").then((response) => {
            done(new Error('did not reject on blank otp'))
          }).catch(error => {
            done()
          })
        })
      })

    })

    context('Invalid API Key', function() {
      it('should convert response string to json and handle invalid apikey error', function(done) {
        TwoFactorWrongKey.verifyOTP("abc", "123").then((response) => {
          done(new Error("2Factor allowed invalid api key"))
        }).catch((error) => {
          done()
        })
      })
    })

    context('Valid API Key', function() {
      it('should validate the correct otp and return the result', function(done) {
        this.timeout(360000)
        let otp = getRandomOTP()
        TwoFactor.sendOTP(TESTPHONE, {template: TEMPLATE, otp: otp}).then((response) => {
          let interval = setInterval(() => {
            TwoFactor.verifyOTP(response, otp).then(response => {
              clearInterval(interval)
              done()
            }).catch(error => {
              done(new Error(error))
            })
          }, 3000)
        }).catch(error => {
          done(new Error(error))
        })
      })

      it('should validate the correct otp and return the result', function(done) {
        this.timeout(360000)
        let otp = getRandomOTP()
        TwoFactor.sendOTP(TESTPHONE, {template: TEMPLATE, otp: 'blah'}).then((response) => {
          let interval = setInterval(() => {
            TwoFactor.verifyOTP(response, otp).then(response => {
              clearInterval(interval)
              done(new Error('validated an invalid otp'))
            }).catch(error => {
              clearInterval(interval)
              console.log(error)
              done()
            })
          }, 3000)
        }).catch(error => {
          done(new Error(error))
        })
      })

    })

  })

})