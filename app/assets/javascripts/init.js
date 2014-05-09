com = {
  glados : {
    utils   : {},
    views   : {},
    widgets : {},
    lib : {},
    init: function() {
      $(function () {
        $('.checkall').on('click', function () {
          $(this).closest('form').find(':checkbox').prop('checked', this.checked);
        });
      });
    }
  }
};

// stub for innerShiv for non-IE browsers - http://bit.ly/ishiv
if(window.innerShiv === undefined) {
  window.innerShiv = function(html){
    return html;
  };
}