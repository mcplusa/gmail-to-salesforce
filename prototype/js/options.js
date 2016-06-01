var app = angular.module('SalesForceOptions',['forceng'])
  .controller('OptionsCtrl', ['$scope', 'force', function( $scope,  force){
  var appId = '3MVG9sG9Z3Q1Rlbd2wD7XZNKcPOtSLWQVY7IYoMH6SMO471sTdS7v.dLW0C2L9OAx1ozDBm_vzeBmqET3HzQd';

  $scope.loggedUser = false;
  $scope.loading = false;
  $scope.error = "";
  $scope.productionSelected = true;
  $scope.loginBtnText = "Connect to Salesforce";

  $scope.checkToken = function() {
    $scope.loading = true;
    chrome.storage.local.get('tokens', function(result) {
      if (result.tokens) {
        $scope.productionSelected = result.tokens.production;
        $scope.authenticate(result.tokens);
        $scope.updateUserData(result.tokens);
      } else {
        $scope.loading = false;
      }
      $scope.$apply();
    });
  }

  $scope.login = function() {
    force.init({
      appId: appId,
      apiVersion: 'v32.0',
      proxyURL: 'http://localhost/',
      oauthCallbackURL: 'http://localhost/oauthcallback.html',
      loginURL: $scope.productionSelected ? 'https://login.salesforce.com' : 'https://test.salesforce.com'
    });

    $scope.loading = true;
    $scope.loginBtnText = "Connecting to Salesforce";
    force.login();
  }

  $scope.authenticate = function(tokens){
    force.init({
      appId: appId,
      accessToken: tokens.access_token,
      instanceURL: tokens.instance_url,
      refreshToken: tokens.refresh_token,
      loginURL: tokens.production ? 'https://login.salesforce.com' : 'https://test.salesforce.com',
      useProxy: false
    });
    $scope.loggedUser = true;
  }

  $scope.updateUserData = function(tokens) {
    // Update user data
    var req = {
      path: tokens.id.substring(tokens.id.search('id'))
    };

    force.request(req).then(function (user) {
        $scope.loggedUser = user;
        $scope.loading = false;

        // Store tokens
        tokens.production = $scope.productionSelected;
        chrome.storage.local.set({'tokens': tokens});
      },
      function() {
        $scope.error = "Unable to Connect Salesforce";
        $scope.loading = false;
    });
  }

  $scope.logout = function(){
    force.discardToken();
    chrome.storage.local.remove('tokens');
    $scope.loggedUser = false;
    $scope.loading = false;
    $scope.loginBtnText = "Connect to Salesforce";
  }
}]);

chrome.tabs.onUpdated.addListener(
  function authorizationHook(tabId, changeInfo, tab) {
    if (tab.title.indexOf('oauthcallback.html') >= 0) {
      var url = tab.title;
      var access_token = url.substring(url.indexOf("access_token"));
      access_token = access_token.split("&");
      var token = {};
      access_token.forEach(function(element, index, array) {
        var elemKeyValue = element.split("=");
        var elemKey = elemKeyValue[0];
        var elemValue = elemKeyValue[1];
        switch (elemKey) {
          case ('access_token'):
            token.access_token = decodeURIComponent(elemValue);
            break;
          case ('refresh_token'):
            token.refresh_token = decodeURIComponent(elemValue);
            break;
          case ('instance_url'):
            token.instance_url = decodeURIComponent(elemValue);
            break;
          case ('id'):
            token.id = decodeURIComponent(elemValue);
            break;
        }
      });
      var scope = angular.element(document.body).scope();
      scope.authenticate(token);
      scope.updateUserData(token);
      chrome.tabs.onUpdated.removeListener(authorizationHook);
      chrome.tabs.remove(tab.id, function() {});
    }
});
