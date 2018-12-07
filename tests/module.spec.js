const APIKEY = process.env.APIKEY || ''
const TESTPHONE = process.env.TESTPHONE || ''
if (APIKEY === '' || TESTPHONE === '') {
  throw new Error('Invalid or missing APIKEY or TESTPHONE')
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
      it('should return Status as success and numeric balance in Details field', function(done) {
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
})