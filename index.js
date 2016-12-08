/**
 * process event variable and invoke get /put/post and delete
 */

var _resourceMap={};
_resourceMap['GET']={};
_resourceMap['POST']={};
_resourceMap['PUT']={};
_resourceMap['DELETE']={};
var _middleware =[];
var httpResponse;
httpResponse = function (json, status, headers) {

    status = status || '200';
    headers = headers || {'Content-Type': 'application/json'};

    return {
        statusCode: status,
        body: JSON.stringify(json),
        headers: headers
    };
};

var converter;
converter = function (body) {

    if (!body || body === ''){
        console.log("empty body");
        return null;
    }
    var cleaned = body.trim();
    var json = JSON.parse(cleaned);
    return json;

};



module.exports = {

    get:function get(url,callback){
        _resourceMap['GET'][url] = callback;

    },
    post:function post(url,callback) {

        _resourceMap['POST'][url] = callback;

    },
    put:function put(url,callback) {
        _resourceMap['PUT'][url] = callback;
    },
    del:function del(url,callback) {
        _resourceMap['DELETE'][url] = callback;
    },
    delete:function del(url,callback) {
        _resourceMap['DELETE'][url] = callback;
    },

    use:function(callback){
        _middleware.push(callback);

    },


    handler:function (event,context,callback){

        if (!(_resourceMap[event.httpMethod])){

            callback(null,httpResponse({"message":"invalid handler"},'500'));
            return;
        }
        if (!(_resourceMap[event.httpMethod][event.resource])){
            callback(null,httpResponse({"message":"invalid handler"},'500'));
            return;

        }
        //request method
        var fn = _resourceMap[event.httpMethod][event.resource];

        var executionChainDone = false;
        var json = null;
        try
        {
            json = converter(event.body);
        }catch (e)
        {
            console.log("parsing error in body");
            error = {
                "message":"could't parse the request body - valid json object required",
                "error":e
            };
            //sending bad request
            callback(null,httpResponse(error,'400'));
            return;
        }
        var request = {
            headers:event.headers,
            body : json,
            params:event.queryStringParameters ||{},
            pathParams: event.pathParameters ||{},
            method:event.httpMethod || 'GET'
        };
        var response ={
            send:function(json,status){
                status = status || '200';
                executionChainDone = true;
                callback(null,httpResponse(json,status));

            },
            sendError:function(json,status){
                status = status || '500';
                executionChainDone = true;
                callback(null,httpResponse(json,status));
            }
        };
        try
        {
            i=1;
            var mf = null;
            //middleware execution
            var next = function(){
                if (executionChainDone){
                    console.log('execution done !!!')
                    return;
                }
                if (i >= _middleware.length){
                    fn(request,response);
                }
                else{
                    mf = _middleware[i];
                    i++;
                    mf(request,response,next);
                }
            };

            if (_middleware.length >0){
                mf =_middleware[0];
                mf(request,response,next);
            }
            else{
                fn(request,response);
            }
        }catch(e){
            callback(null,httpResponse(e,'500'));
        }

    }

};
