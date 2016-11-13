# aws-lambda-http
Web framework for AWS Lambda.

## Usage (lambda)
index.js (lambda)
```js
var app = require('aws-lambda-http')


app.get('/greeting', function (req, res) {
  res.send('Hello World')
})

// This is the handler that's invoked by Lambda
exports.handler = app.handler;

```

## Installation

```bash
$ npm install aws-lambda-http
```

## NOTE:
check the option 'Use Lambda Proxy integration' when you intergrate with AWS API Gateway