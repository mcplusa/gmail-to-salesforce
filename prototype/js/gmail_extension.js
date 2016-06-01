var app = angular.module('SalesForceApp', ['ngDialog']);

app.controller('GmailCtrl', [ '$scope', 'ngDialog', function ($scope, ngDialog) {
  $scope.openModal = function(){
    ngDialog.open({
      template: 'SFModal',
      controller: 'SFModalCtrl',
      width: '75%'
    });
  }
}]);

app.controller('SFModalCtrl', ['$scope', '$filter', 'ngDialog', function($scope, $filter, ngDialog){
  $scope.caseComment = {};
  $scope.results = [];
  $scope.pageSize = 10;
  $scope.currentPage = 0;
  $scope.sortColumn = '-Priority';
  $scope.confirmingCases = false;
  $scope.addingCases = false;

  var extensionKey = 'ehhnajnaccjlbiphipjglncflaedjnok';

  var formatEmailContent = function(email){
    var html = document.createElement('div');
    html.innerHTML = email;

    if(html.getElementsByClassName('gmail_quote').length)
      html.getElementsByClassName('gmail_quote')[0].parentNode.remove();

    return html.innerHTML
      .replace(/<style([\s\S]*?)<\/style>/gi, '')
      .replace(/<script([\s\S]*?)<\/script>/gi, '')
      .replace(/<\/div>/ig, '\n')
      .replace(/<\/li>/ig, '\n')
      .replace(/<li>/ig, ' * ')
      .replace(/<\/ul>/ig, '\n')
      .replace(/<\/p>/ig, '\n')
      .replace(/<br\s*[\/]?>/i, '\n')
      .replace(/<[^>]+>/ig, '')
      .replace(/&[^\s]*/g, '');
  }

  $scope.setSelectedCase = function (idSelectedCase) {
     $scope.idSelectedCase = idSelectedCase;
  };

  $scope.createCaseFeed = function(){
    var e = Gmail().get.selected_emails_data()[0].threads;
    var subject = e[Object.keys(e)[0]].subject;
    var sender = e[Object.keys(e)[0]].from;
    var timestamp = e[Object.keys(e)[0]].timestamp;
    var date = new Date(timestamp*1000);
    var emailBody = e[Object.keys(e)[0]].content_plain;
    var comment = "Email received on: "+date.toTimeString();

    $scope.caseComment.CommentBody = emailBody;
    $scope.openNewTabWithNewCase(sender, subject, emailBody, comment);
  };

  $scope.openNewTabWithNewCase = function(sender, subject, description, comment) {
    queryParams = {
      'cas3': encodeURIComponent(sender),
      'cas14': encodeURIComponent(subject),
      'cas15': encodeURIComponent(description),
      'cas16': encodeURIComponent(comment),
      'cas11': 'Email'
    };
    chrome.runtime.sendMessage(
      extensionKey,
      {url: '/500/e?retURL=%2F500%3F', queryParams: queryParams}, function(response) {
    });
  }

  $scope.getAllCases = function(){
    $scope.results = [];
    $scope.currentPage = 0;
    $scope.loading = true;
    $scope.confirmingCases = false;
    $scope.addingCases = false;
    chrome.runtime.sendMessage(
      extensionKey,
      {query: 'SELECT Id,CaseNumber,Description,IsClosed,Priority,Status,Subject,Type FROM Case ORDER BY IsClosed ASC NULLS FIRST'}, function(response) {
      $scope.results = response;
      $scope.loading = false;
      $scope.$apply();
    });
  };

  $scope.getCasesByQuery = function(query) {
    $scope.currentPage = 0;
    $scope.loading = true;
    chrome.runtime.sendMessage(
      extensionKey,
      {search: query}, function(response) {
      $scope.results = response;
      $scope.loading = false;
      $scope.$apply();
    });
  };

  $scope.addCommentToCases = function() {
    $scope.addingCases = true;
    $scope.confirmingCases = false;
    var selectedCases = $scope.results.records;

    selectedCases.forEach(function(element) {
      element.loading = true;
      $scope.addCommentToCase(element.Id, function(response) {
        element.loading = false;
        $scope.$apply();
      });
    });

    $scope.finishDialog();
  }

  $scope.addCommentToCase = function(commentId, cb) {
    var e = Gmail().get.selected_emails_data()[0].threads;
    var emailBody = e[Object.keys(e)[0]].content_plain;

    var commentData = {
      CommentBody: JSON.stringify(emailBody),
      IsPublished: true,
      ParentId: commentId
    }

    chrome.runtime.sendMessage(
      extensionKey,
      {
        create: {
          object: 'CaseComment',
          data: commentData
        }
      }, function(response) {
        cb(response);
      }
    );
  }

  $scope.casesChosen = function() {
    var trues = $filter("filter")( $scope.results.records , {isSelected:true} );
    if (!trues) {
      return undefined;
    }
    return trues;
  }

  $scope.sortResults = function(column) {
    if (column === $scope.sortColumn.substring(1)) {
      var direction = $scope.sortColumn.substring(0,1);
      if (direction === '-') {
        direction = '+';
      } else {
        direction = '-';
      }
      $scope.sortColumn = direction + column;
    } else {
      $scope.sortColumn = '-' + column;
    }
    $scope.currentPage = 0;
  }

  var allRecordsSelected = [];
  $scope.confirmCases = function() {
    allRecordsSelected = $scope.results.records;
    $scope.currentPage = 0;
    $scope.results.records = $scope.casesChosen();

    $scope.confirmingCases = true;
  }

  $scope.undoConfirmCases = function() {
    $scope.confirmingCases = false;
    $scope.results.records = allRecordsSelected;
    allRecordsSelected = [];
  }

  $scope.finishDialog = function(){
    $scope.closeThisDialog('');
    ngDialog.open({
      template: 'SFModalFinish',
      controller: 'FinishDialogCtrl',
      width: '30%'
    });
  }
}]);

app.controller('FinishDialogCtrl', [ '$scope', 'ngDialog', function ($scope, ngDialog) {
}]);

app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        if (input) {
          return input.slice(start);
        }
        return input;
    }
});


app.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  };
});
