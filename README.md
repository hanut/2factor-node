# 2factor-node
NodeJS module for using the 2factor.in APIs for sending transactional and OTP sms in india

## Installation
To install the library use
```sh
$ npm i 2factor --save
```
To install the library and save it as a dependency in package.json use
```sh
$ npm i 2factor --save
```

## Usage
Include 2Factor in a script
~~~~
const TwoFactor = require('2factor')
~~~~

To get your balance - 
The `balance()` method takes a single string parameter for the type of balance you want to retrieve.
To get all balances, specify type as `ALL` or omit the parameter.
~~~~
TwoFactor.balance().then((response) => {
  console.log(response)
}, (error) => {
  console.log(error)
})
~~~~

To send an sms otp - 
Simply call the `sendOTP` function with a phone number and options object containing the
otp and template fields. It will return a `Promise` that resolves with the sessionId
or reject with the reason for failure.
~~~~
TwoFactor.sendOTP(<phone number>, {otp: <otp code>, template: <template_name>}).then((sessionId) => {
  console.log(sessionId)
}, (error) => {
  console.log(error)
})
~~~~

To verify an sms otp - 
Call `verifyOTP()` with the sessionId returned from the `sendOTP` function and the otp
you want to check. If the otp was correct, it will resolve with a success message else
it will reject with the response from 2Factor.in
~~~~
TwoFactor.verifyOTP(sessionId, otp).then((response) => {
  console.log(response)
}, (error) => {
  console.log(error)
})
~~~~

To send a template SMS to a single user
~~~~
TwoFactor.sendTemplate('123456789', 'YOUR SENDER ID', ['VAR1','VAR2', 'VAR3']).then((response) => {
  console.log(response)
}, (error) => {
  console.log(error)
})
~~~~

To send a template SMS to a single user
~~~~
TwoFactor.sendTemplate(['123456789','987654321'], 'YOUR SENDER ID', ['VAR1','VAR2', 'VAR3']).then((response) => {
  console.log(response)
}, (error) => {
  console.log(error)
})
~~~~


## Author
Hanut Singh Gusain <hanutsingh@gmail.com> [http://www.hanutsingh.in]