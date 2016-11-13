/**
 * process event variable and invoke get /put/post and delete
 */

var _resourceMap={};
_resourceMap['GET']={};
_resourceMap['POST']={};
_resourceMap['PUT']={};
_resourceMap['DELETE']={};
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

    handler:function (event,context,callback){

        if (!(_resourceMap[event.httpMethod])){

            callback(null,httpResponse({"message":"invalid handler"},'500'));
            return;
        }
        if (!(_resourceMap[event.httpMethod][event.resource])){
            callback(null,httpResponse({"message":"invalid handler"},'500'));
            return;

        }

        var fn = _resourceMap[event.httpMethod][event.resource];
        var json = null;
        try
        {
             json = converter(event.body);
        }catch (e)
        {

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
                callback(null,httpResponse(json,status));
            },
            sendError:function(json,status){
                status = status || '500';
                callback(null,httpResponse(json,status));
            }
        };
        try
        {

            fn(request,response);
        }catch(e){
            callback(null,httpResponse(e,'500'));
        }

    }

};
