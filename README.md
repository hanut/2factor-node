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

## New in this version (1.0.6)
Open template / transactional SMS are now supported. Will add support for OTP messages but I don't have
any credits for it right now and can't afford to buy them.

## Usage
The module exports a constructor that returns new TwoFactor instances.
The constructor expects the `api key` to be passed to it.  
~~~~
const TwoFactor = new (require('2factor'))(<your api key>)
~~~~
**Note** - You shouldn't store your API key in your code or in text files you will commit to 
your repositories. Ideally, you want to use environment variables as given below - 
~~~~
let APIKEY = process.env.my_api_key || ''
if (APIKEY === '') {
  throw new Error('Missing 2Factor api key in environment')
}
const TwoFactor = new(require('2factor'))(APIKEY)
~~~~


### To get your balance - 
The `balance()` method takes a single string parameter for the type of balance you want to retrieve.
To get all balances, specify type as `ALL` or omit the parameter.
~~~~
TwoFactor.balance().then((response) => {
  console.log(response)
}, (error) => {
  console.log(error)
})
~~~~

### To send an sms otp - 
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

### To verify an sms otp - 
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

### To send a template SMS to a single user
~~~~
TwoFactor.sendTemplate('123456789', 'YOUR SENDER ID', ['VAR1','VAR2', 'VAR3']).then((response) => {
  console.log(response)
}, (error) => {
  console.log(error)
})
~~~~

### To send a template SMS to a multiple users
~~~~
TwoFactor.sendTemplate(['123456789','987654321'], 'YOUR SENDER ID', ['VAR1','VAR2', 'VAR3']).then((response) => {
  console.log(response)
}, (error) => {
  console.log(error)
})
~~~~

### To send an transactional / open template SMS -
Please ensure that open template SMS is enabled for your account.
If it is not, create a new request for a template and specify the senderid you wish to use for
sending the Open Template SMS and write in the description that you want to enable open
template sending ie. dynamic content.
If you are sending to a single user, you can just put the phone number as the first parameter.
~~~~
TwoFactor.sendTransactional(["1234567890", "2103456789"], "Your message", 'YOUR SENDER ID')
.then((response) => {
  console.log(response)
}, (error) => {
  console.log(error)
})
~~~~


## Author
Hanut Singh Gusain <hanutsingh@gmail.com> [http://www.hanutsingh.in]