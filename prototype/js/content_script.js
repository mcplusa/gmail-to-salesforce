inject = {
  JS : function (scriptPath) {
    var script = document.createElement('script');
    script.src = chrome.extension.getURL(scriptPath);
    (document.head || document.documentElement).appendChild(script);
  },
  CSS : function (cssPath) {
    var link = document.createElement('link');
    link.href = chrome.extension.getURL(cssPath);
    link.type = "text/css";
    link.rel = "stylesheet";
    (document.head || document.documentElement).appendChild(link);
  },
  HTML : function(htmlPath){
    var div = document.createElement('div');
    document.body.appendChild(div);

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        div.innerHTML = this.response;
    };

    xhr.open('GET', chrome.extension.getURL(htmlPath), true);
    xhr.send();
  }
};

inject.JS('bower_components/jquery/dist/jquery.min.js');
inject.JS("bower_components/angular/angular.min.js");
inject.JS('bower_components/gmailjs/index.js');


localStorage.setItem('gmail_to_salesforce_key',chrome.runtime.id);

window.addEventListener("load", function() {
  inject.HTML('modal.html');
  inject.JS('bower_components/ngDialog/js/ngDialog.min.js');
  inject.JS("bower_components/bootstrap/dist/js/bootstrap.min.js");

  inject.JS("js/gmail_extension.js");
  inject.JS("js/gmailButton.js");

  inject.CSS('bower_components/bootstrap/dist/css/bootstrap.min.css');
  inject.CSS('bower_components/ngDialog/css/ngDialog.min.css');
  inject.CSS('bower_components/ngDialog/css/ngDialog-theme-default.min.css');
  inject.CSS('bower_components/font-awesome/css/font-awesome.min.css');
  inject.CSS('bower_components/salesforce-lightning-design-system/assets/styles/salesforce-lightning-design-system.min.css');
  inject.CSS('css/style.css');
});
