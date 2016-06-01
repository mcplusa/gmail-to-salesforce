setTimeout(function(){
  angular.bootstrap(document, ['SalesForceApp']);
}, 1000);

var gmail = new Gmail();
var angularApp = angular.element(document.querySelector('[ng-controller=GmailCtrl]'));

var trackedCompose = null;
var sfButton = {
  content : '<i class="fa fa-paper-plane"></i> Save To SFDC',
  class : 'btn-SFModal',
  toolbarButton : function (){
    angularApp.scope().openModal();
  },
  composeButton : function (){
    angularApp.scope().openModal();
    trackedCompose = $(this).closest('.M9');
  }
}

setInterval(function(){
  if(gmail.dom.composes().length){
    $(gmail.dom.composes()).each(function(){
      if(!this.find('.btn-SFModal').length){
        gmail.tools.add_compose_button(this, sfButton.content, sfButton.composeButton, sfButton.class);
      }
    });
  }

  if(!$('[gh="mtb"] .btn-SFModal').length){
    if($('div[role="checkbox"][aria-checked="true"]').length || gmail.check.is_inside_email()){
      gmail.tools.add_toolbar_button(sfButton.content, sfButton.toolbarButton, sfButton.class);

      if(gmail.check.is_inside_email()){
        $('.adf.ads').click(function(){
          $('.adf.ads.selected').removeClass('selected');
          $(this).addClass('selected')
        });
      }
    }
  }
},500);
