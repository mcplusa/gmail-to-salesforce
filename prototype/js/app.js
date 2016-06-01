var f = (function() {
  force.init({
    appId: '3MVG9sG9Z3Q1Rlbd2wD7XZNKcPOtSLWQVY7IYoMH6SMO471sTdS7v.dLW0C2L9OAx1ozDBm_vzeBmqET3HzQd',
    apiVersion: 'v32.0',
    proxyURL: 'http://localhost:8080/',
    oauthCallbackURL: 'http://localhost:8080/oauthcallback.html'
  });

  function serialize(obj) {
    var str = [];
    for(var p in obj) {
      if (obj.hasOwnProperty(p)) {
        str.push(p + "=" + obj[p]);
      }
    }
    return str.join("&");
  }

  function authorize(cb) {
    if(force.isLoggedIn()){
      cb();
    }else{
      console.log('Authorizing');
      chrome.storage.sync.get({
        'oauth' : ''
      }, function(token){
        if(token && token.oauth){
          token = token.oauth;
          force.init({
            accessToken: token.access_token,
            instanceURL: token.instance_url,
            refreshToken: token.refresh_token,
            loginURL: token.production ? 'https://login.salesforce.com' : 'https://test.salesforce.com'
          });
          cb();
        }else {
          force.login(function() {
            cb();
          },
          function(error) {
            console.log('Login failed: ' + error);
          });
        }
      });
    }
  };

  function oauthCallback(token){
    chrome.storage.sync.set({
      'oauth': token
    }, function(){
      console.log('Authorization token saved.');
      console.log(token);
    });
  };

  function request(req, cb){
    authorize(function(){
      switch(req.method){
        case 'query':
          force.query(req.q, cb);
          break;
        case 'create':
          force.create(req.q.type, req.q.content, cb);
          break;
        default:
          console.error('Method ' + req.method + ' not found.');
      }
    });
  }

  function executeQuery(query, cb) {
    force.query(query, cb);
  }

  function executeSearch(query, cb) {
    var req = {
      path: "/services/data/v33.0/search/?q=FIND%7B" + query + "%7D%20IN%20ALL%20FIELDS%20RETURNING%20Case(CaseNumber%2CDescription%2CIsClosed%2CPriority%2CStatus%2CSubject%2CType)"
    };
    force.request(req, cb,
      function(error) {
        console.log("Got search error: "+error);
      });
  }

  function executeCreate(object, data, cb) {
    force.create(object, data, cb, cb);
  }


  return {
    serialize: serialize,
    authorize: authorize,
    login: force.login,
    oauthCallback: oauthCallback,
    request: request,
    executeQuery: executeQuery,
    executeSearch: executeSearch,
    executeCreate: executeCreate
  }
}());

chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    chrome.storage.local.get('tokens', function(result) {

      var tokens = result.tokens;
      if (!force.isAuthenticated()) {
        force.init({
          accessToken: tokens.access_token,
          instanceURL: tokens.instance_url,
          refreshToken: tokens.refresh_token,
          loginURL: tokens.production ? 'https://login.salesforce.com' : 'https://test.salesforce.com',
          useProxy: false
        });
      }

      if (request.query) {
        f.executeQuery(request.query, function(query_result) {
          sendResponse(query_result);
        });
      }
      if (request.search) {
        f.executeSearch(request.search, function(query_result) {
          sendResponse({records: query_result});
        });
      }
      if (request.url) {
        chrome.tabs.create({ url: tokens.instance_url + "/" + request.url + "&" + f.serialize(request.queryParams)});
      }
      if (request.create) {
        f.executeCreate(request.create.object, request.create.data, function(create_result) {
          sendResponse(create_result);
        });
      }

    });
    return true;
  });
