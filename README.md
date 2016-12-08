# aws-lambda-http
Web framework for AWS Lambda.

## Usage (lambda)
index.js (lambda)
```js
var app = require('aws-lambda-http');

//middleware (e.g Authorization header validation /resource access)

app.use(function(req,resp,next){

    if (!req.hearders.Authorization){
        resp.send("Unauthorised access",401);
        return;
    }
    next();
});

app.get('/greeting', function (req, res) {
  res.send('Hello World');
});

// This is the handler that's invoked by Lambda
exports.handler = app.handler;

```

## Installation

```bash
$ npm install aws-lambda-http
```

## NOTE:
check the option 'Use Lambda Proxy integration' when you integrate with AWS API Gateway


#### sample project
https://github.com/aranga-au/lambda-helloworld
