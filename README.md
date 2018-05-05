# 2factor-node
NodeJS module for using the 2factor.com APIs for sending transactional and OTP sms in india

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


## Maintainers
Hanut Singh Gusain