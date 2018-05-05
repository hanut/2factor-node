const expect = require('chai').expect
const TwoFactor = new (require('../libs/2factor'))("e72cb6de-4f6f-11e8-a895-0200cd936042")
const TwoFactorWrongKey = new (require('../libs/2factor'))("abc123")

describe('2Factor API module', function() {
  describe('#balance()', function() {
    it('should be a function', function() {
      expect(TwoFactor.balance).is.a('function')
    })
    it('should return a promise', function() {
      expect(TwoFactorWrongKey.balance()).is.a('promise')
    })

    context('Invalid API Key', function() {
      it('should convert response string to json and handle invalid apikey error', function(done) {
        TwoFactorWrongKey.balance().then((response) => {
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
        TwoFactor.balance().then((response) => {
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

  describe('#send()', function() {
    it('should be a function', function() {
      expect(TwoFactor.send).is.a('function')
    })
    it('should return a promise', function() {
      expect(TwoFactorWrongKey.send(123, 'abc')).is.a('promise')
    })

    context('If some parameters are missing', function() {
      it('should reject with an error message', function(done) {
        TwoFactorWrongKey.send().then((response) => {
          done(new Error('did not reject an invalid function call'))
        }, (error) => {
          done()
        })
      })
    })

    context('Invalid API Key', function() {
      it('should convert response string to json and handle invalid apikey error', function(done) {
        TwoFactorWrongKey.send(7016907360, 'testing').then((response) => {
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
        TwoFactor.send(7016907360, 'test').then((response) => {
          expect(response).is.an('object')
          expect(response).has.keys(['Status', 'Details'])
          console.log(response)
          // expect(response.Status).is.equal('Success')
          // expect(+response.Details).is.a('number')
          done()
        }, (error) => {
          done(error)
        })
      })
    })
  })
})