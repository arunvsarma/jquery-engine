$(document).ready(function(){
  $engine = '';
  $('#page-wrapper').engine({
        strConfigurationPath                : 'config/application.json',
        strDefaultSkin                      : 'light',
        objSkins                            : {dark:'', light:'skin/css/styles.css'},
        strSkinKey                          : 'mode',
        strConfigKey                        : 'config',
        strViewsPath                        : 'views/',
        strControllersPath                  : 'controllers/',
        strPageTitle                        : 'Engine Sample Page',
        strNotificationFeedPath             : 'config/notification_feed.json',
        objAppServerURL: {
          'SELF': '',
          'DEV': 'https://app-dev.myserver.com',
          'STAG': 'https://app-stag.myserver.com',
          'PROD': 'https://app.server.com'
        },
        boolShowBackButton                  : true
  });
  $engine = $('#page-wrapper').data('engine');
  $engine.setApplicationEnvironment('SELF');

});
