  /*!
 * ENGINE UX (Re-named and Refactored)
 * Version 5
 * Requires jQuery v1.11 or later  & Bootstrap 3
 * 
 * Author: Arun V.Sarma
 */
/*
 * TODO LIST:
 * - NA
 */

(function($) {

    $.engine = function(element, options) {

        var defaults = {
            strConfigurationPath                : 'application/config/config.json',
            strDefaultSkin                      : 'light',
            objSkins                            : {'dark':'application/styles/skin_dark.css', 'light':'application/styles/skin_white.css'},
            strSkinKey                          : 'mode',
            strConfigKey                        : 'config',
            strViewsPath                        : 'application/appviews/',
            strControllersPath                  : 'application/appcontrollers/',
            strPageTitle                        : 'Untitled',
            strNotificationFeedPath             : 'application/data/notification_feed.json',
            strAppMode                          : 'web',
            objAppServerURL                     : {'DEV':'http://dev.cst.akamai.com', 'PROD':'http://localhost/prod'},
            boolAuthEnabled                     : true,
            boolShowBackButton                  : true
        }

        var plugin = this;
        plugin.settings = {};

        var $engine = $(element),
             engine = element;
        
        var strFrameworkVersion = '5.00.03.2015';

        //VARIABLES
        var strConfigFile = '';
        var strDefaultSkin = '';
        var strSkinKey = '';
        var strConfigKey = '';
        var strViewsPath = '';
        var strControllersPath = '';
        var strPageController = '';
        var strPageControllerVersion = '';
        var strPage = '';
        var strViewDataset = '';
        var strApplicationName = '';
        var strApplicationVersion = '';
        var strApplicationAuthor = '';
        var strCurrentPageTitle = '';
        var strCurrentPageSubTitle = '';
        var strServerURL = '';
        var strAppEnvironment = '';
        var strNotificationFeedPath = '';
        var strApplicationMode ='';
        
        var objSkins = new Object();
        var objPages = new Object();
        var objPage = new Object();
        var objLibraries = new Object();
        var objEnvironment = new Object();
        var objPageContent = new Object();

        var boolScriptLoaded = false
        var boolLibrariesLoaded = false;
        var boolShowBackButton = true;
        var boolUserIsLoggedIn = false;
        var boolNotificationsShown = false;
        var numOfComponents = 0;
        var compCount = 1;
        
        
        // -- PUBLIC FUNCTIONS -- //
        plugin.init = function() {
            logMessage("Plugin loaded");
            plugin.settings = $.extend({}, defaults, options);
            showApplicationLoader(true);
            setOptions();
        };
        
        plugin.getCurrentPage = function(){
            strPage = getHashURL();
            logMessage('fn > getCurrentPage '+strPage)
            return strPage;
        };
        
        plugin.getFrameworkVersion = function() {
            return strFrameworkVersion;
        };
        
        plugin.getNavigationConfig = function() {
            var _objNavigation = {};
            var _navigationWrapper = $engine.find('#navigation-wrapper').parent().attr('id');
            var _navigationType = _navigationWrapper.split('-')[0];
            if(arrNavigationlist){
                arrNavigationlist.length=0;
            }
            var arrNavigationlist = [];

            $.each(objPages, function(i, _node) {
                if(_node['showInNavigation'] == true){
                    arrNavigationlist.push(_node['pageName']);
                }    
            })
            _objNavigation['navigationType'] = _navigationType;
            _objNavigation['navigationList'] = arrNavigationlist;
            return _objNavigation;
        };
        
        plugin.setLocalStorage = function(_id, _value){
            if (typeof (window.localStorage) != "undefined") {
                 localStorage.setItem(_id, _value);
            }else{
                $engine.log('setLocalStorage > ERROR: Unable to set Local Storage');
            }
        };

        plugin.deleteLocalStorageItem = function(deleteLocalStorageItem){
            if (typeof (window.localStorage) != "undefined") {
                localStorage.removeItem(_id);
                $engine.log('deleteLocalStorageItem > Deleted Item: ' + deleteLocalStorageItem);
            }else{
                $engine.log('deleteLocalStorageItem > ERROR: ' + deleteLocalStorageItem);
            }
            
        };

        plugin.getLocalStorage = function(_id){
            if (typeof (window.localStorage) != "undefined") {
                strViewDataset = localStorage.getItem(_id);
            }
            return strViewDataset;
        };
        
        plugin.clearLocalStorage = function(){
            localStorage.clear();
        };
        
        plugin.log = function(_strlog){
            logMessage(_strlog);
        };
        
        plugin.getQuerystringParam = function(_strkey){
            return getParameterByName(_strkey);
        };
        
        plugin.toggleViewLoader = function(_bool, _msg, _target){
            toggleViewLoader(_bool, _msg, _target);
        };
        
        plugin.toggleUIMessages = function(_bool, _msg, _target, _width, _height){
            toggleUIMessages(_bool, _msg, _target, _width, _height);
        };
        
        plugin.toggleMessageBox = function(_bool, _msg, _target, _width, _height){
            toggleMessageBox(_bool, _msg, _target, _width, _height);
        };

        plugin.toggleStatusMessages = function(_flag, _target, _message, _type){
            toggleStatusMessages(_flag, _target, _message, _type);
        };
        
        plugin.loadJSON = function(_src){
            return $.getJSON(_src);
        };
        
        plugin.makeAJAXRequest = function(_uri, _method, _data, _contenttype, _datatype, _context, _processdata, _successHandler, _errorHandler){
            var _jqXHR = $.ajax({
                url: _uri,
                type: _method,
                data: _data,
                contentType: _contenttype,
                dataType: _datatype,
                context: _context,
                processData: _processdata,
                cache: true,
            });
            _jqXHR.done( _successHandler );
            _jqXHR.fail( _errorHandler );
        };

        plugin.cleanupPage = function(){
            cleanPage();
        };
        
        plugin.getApplicationName = function(){
            return strApplicationName;
        };
        
        plugin.getApplicationVersion = function(){
            return strApplicationVersion;
        };
        
        plugin.getApplicationAuthor = function(){
            return strApplicationAuthor;
        };
        
        plugin.getCurrentPageTitle = function(){
            return strCurrentPageTitle;
        };
        
        plugin.getCurrentPageSubTitle = function(){
            return strCurrentPageSubTitle;
        };
        
        plugin.getUserIsLoggedIn = function(){
            boolUserIsLoggedIn = plugin.getLocalStorage("isLoggedIn")
            return boolUserIsLoggedIn;
        };
        
        plugin.setUserIsLoggedIn = function(_bool){
            plugin.setLocalStorage("isLoggedIn", _bool);
        };
        
        plugin.getApplicationEnvironment = function(){
            return strAppEnvironment;
        };
        
        plugin.setApplicationEnvironment = function(_strenvir){
            setAppEnvironment(objEnvironment[_strenvir]);
        };
        
        plugin.setContent = function(_strpage, _viewport){
            if(typeof _viewport === 'undefined') _viewport = '';
            if(strPage == _strpage){
                setupPage(_strpage);
            }else{
                if(_viewport !== ''){
                    window.open('#!'+_strpage.toUpperCase(), _viewport);
                }else{
                    var routeData = window.location.origin + window.location.pathname + '#!' +_strpage.toUpperCase();
            
                    window.location = routeData;
                }
            } 
        };
        
        plugin.getJSONObj = function(_objNode, _strElement){
            var _obj = getNode(_objNode, _strElement);
            return _obj;
        };
        
        plugin.setApplicationMode = function(_mode){
            strApplicationMode = _mode;
        };
        
        plugin.getApplicationMode = function(){
            return strApplicationMode;
        };
        
        // -- END PUBLIC FUNCTIONS -- //

        // -- FUNCTIONS -- //
        var setOptions = function(){
            var _strPageTitle = plugin.settings.strPageTitle;
            strConfigFile = plugin.settings.strConfigurationPath;
            strDefaultSkin = plugin.settings.strDefaultSkin;
            objSkins = plugin.settings.objSkins;
            strSkinKey = plugin.settings.strSkinKey;
            strConfigKey = plugin.settings.strConfigKey;
            strViewsPath = plugin.settings.strViewsPath;
            strControllersPath = plugin.settings.strControllersPath;
            objEnvironment = plugin.settings.objAppServerURL;
            boolShowBackButton = plugin.settings.boolShowBackButton;
            strNotificationFeedPath = plugin.settings.strNotificationFeedPath;
            strApplicationMode = plugin.settings.strAppMode;
            $('head').find('title').html(_strPageTitle);
            setSkin();
        };

        var setSkin = function(){
            var _strMode = '';
            var _strSkin = '';

            if(strSkinKey){
                _strMode = getParameterByName(strSkinKey);
                if(_strMode){
                    $.each(objSkins, function(key, value){
                        if(_strMode == key) _strSkin = value;
                    });     
                }else{
                    if(strDefaultSkin) _strSkin = objSkins[strDefaultSkin];
                }
            } else {
                if(strDefaultSkin) _strSkin = objSkins[strDefaultSkin];
                
            }

            if(_strSkin){
                $('head').append('<link href="' + _strSkin + '" rel="stylesheet">');
                logMessage('fn > setSkin - skin: '+ _strSkin);
            }else{
                logMessage('Mode and Default Skin has not been specified or is unavailable');
            }
            
            setConfiguration();
        };

        var setConfiguration = function(){
            var _strConfigValue = '';
            var _strConfig = '';
            var cb = Math.round(new Date().getTime() / 1000);
            if(strConfigKey){
                _strConfigValue = getParameterByName(strConfigKey);
                if(_strConfigValue){
                    _strConfig = _strConfigValue;
                }else{
                    _strConfig = strConfigFile;
                }
            }else{
                _strConfig = strConfigFile;
            }

            plugin.loadJSON(_strConfig + '?cb=' + cb).done(function( _json ) {
                var _objConfigData = _json.application;
                logMessage('fn > setConfiguration - config: ' + _strConfig + '?cb=' + cb);
                checkConfiguration(_objConfigData);

            })
            .fail(function(jqxhr, textStatus, error) {
                logMessage('Error loading config: '+ textStatus + ", " + error);
                showFailover();
            });
        };
        
        var checkConfiguration = function(_objData){
            strApplicationName = _objData['name'];
            strApplicationVersion = _objData['version'];
            strApplicationAuthor = _objData['author'];
            if(strApplicationName){
                objPages = getNode(_objData, 'pages');
                objLibraries = getNode(_objData, 'libraries');
                loadLibraries();
            }else{
                logMessage('The Application name has not been defined in config JSON file' );
            }
        };
        
        var loadLibraries = function(){
            var _lib_count = 0;
            var _cacheSettings = $.ajaxSettings.cache;
            $.ajaxSettings.cache = true;
            $.each(objLibraries, function(i, _node) {
                try {
                    switch(_node['type']){
                        case 'javascript':
                            $('body').append('<script type="text/javascript" src="' + _node['libpath'] + '?v=' + strApplicationVersion +'"></script>');
                            if ($('script[src*="'+ _node['libpath'] +'"]').length !== 0) {
                                _lib_count++;
                                logMessage(' fn > loadLibraries - Loaded > '+_node['libpath'])
                            } else {
                                logMessage(' fn > loadLibraries - Not Loaded > '+_node['libpath'])
                            }
                        break;
                        case 'css':
                            $('head').append('<link rel="stylesheet" type="text/css" href="' + _node['libpath'] + '?v=' + strApplicationVersion +'"/>');
                            _lib_count++;
                            logMessage(' fn > loadLibraries > ' + _node['libpath']);
                        break;
                    }
                } catch(err) {
                    logMessage(' fn > loadLibraries - Exception: '+err)
                }
            });
            $.ajaxSettings.cache = _cacheSettings;
            boolLibrariesLoaded = true;
            if(_lib_count === objLibraries.length) setupPage();
        };
        
        var setupPage = function(_strpage){
            if(typeof _strpage === 'undefined'){
                _strpage = '';
                strPage = getHashURL();
            }else{
                strPage = strPage
            }
            if(strPage === null){
                var _home = objPages[0].pageName
                plugin.setContent(_home)
            } 
            cleanPage();
            var _intCount = 1;
            logMessage(' > fn > setupPage - Page: '+ strPage)
            if(strPage){
                $.each(objPages, function(i, _node) {
                    var _strPageName = _node['pageName'];
                    if(_strPageName == strPage){
                        objPage = _node;
                        strCurrentPageTitle = _node['pageTitle'];
                        strCurrentPageSubTitle = _node['pageSubTitle'];
                        strPageController = _node['pageController'];
                        strPageControllerVersion = _node['pageControllerVersion'];
                        createWrappers($engine, objPage, 'componentList');
                    }else{
                        if(_intCount == objPages.length){
                            showFailover();
                        }
                        _intCount++
                    }
                });
            }else{
                if(strPage == false){
                    logMessage(' > fn > setupPage - Page: '+ strPage);
                    showFailover();
                }   
            }
        };
        
        var createWrappers = function(_target, _objPage, _strElement){
            logMessage('fn > addWrappers > ' + _strElement);
            var _objComponents = getNode(_objPage, _strElement);
            if(_objComponents.length != 0){
                numOfComponents = _objComponents.length;
                $.each(_objComponents, function(i, _elem) {
                    var _strWrapper = _elem.view;
                    var _strWrapperId = _strWrapper + "-wrapper";
                    var _strWrapperClass = _elem.wrapper;
                    var _strWrapperCol = _elem.column;
                    var _strFileVersion = strApplicationVersion;
                    if(!_strWrapperClass) _strWrapperClass = "container";
                    
                    switch(_strWrapperCol){
                        case "sidebar":
                            _target.append('<div id="sidebar-wrapper" class="col-xs-12 col-sm-3 col-md-3 col-lg-3"></div>');
                            $("#"+_strWrapperCol+"-wrapper").append('<div class="' + _strWrapperClass + '" id="'+_strWrapperId+'"></div>');
                        break;
                        case "content":
                            _target.append('<div id="content-wrapper" class="col-xs-12 col-sm-9 col-md-9 col-lg-9"></div>');
                            $("#"+_strWrapperCol+"-wrapper").append('<div class="' + _strWrapperClass + '" id="'+_strWrapperId+'"></div>');
                        break;
                        case "page":
                            $("#"+_strWrapperCol+"-wrapper").append('<div class="' + _strWrapperClass + '" id="'+_strWrapperId+'"></div>');
                        break;
                    }
                    addComponents(_strWrapperId, _strFileVersion);

                });
            }else{
                showFailover();
            }
        };

        var addComponents = function(_strWrapper, _strVersion){
            logMessage(' fn > addComponents > ' + _strWrapper);
            var _target = $('#'+_strWrapper);
            var _strView = _strWrapper.split('-')[0];
            var _strComp = strViewsPath + _strView + '.html';  
            objPageContent[_strWrapper] =  _strComp;    
            loadPage(_target, _strComp, _strVersion);
        };

        var addPageController = function(){
            if(strPageController !== ''){
                var _strControllerSrc = strControllersPath + strPageController;
                logMessage(' fn > addControllers > ' + _strControllerSrc);
                try{
                    if(!boolScriptLoaded){
                        $engine.append('<script type="text/javascript" src="' + _strControllerSrc + '.js?v=' + strApplicationVersion+'"></script>');
                        showApplicationLoader(false);
                    }
                } catch(ex){
                    logMessage('fn > addControllers - Exception: '+ ex);
                }               
            }

            $.event.trigger({ type: "HASH_CHANGE" });            
            appendScrollButton();
            if(!boolNotificationsShown) displayPrimaryNotification();
        };
        
        var appendScrollButton = function(){
            var _scrollButton = '<div class="scroll-button small-heading pull-right init-hide" data-role="scrollButton" style="cursor:pointer"><i class="fa fa-chevron-up darkgrey-text"></i>'
            var _offset = 120;
            if(boolShowBackButton){
                $engine.append(_scrollButton);
                bindUIEvents();
                $(window).scroll(function() {
                    if ($(this).scrollTop() > _offset) {
                        $engine.find('div[data-role=scrollButton]').fadeIn(500);
                    } else {
                        $engine.find('div[data-role=scrollButton]').fadeOut(500);
                    }
                });
            }
        };
        
        var bindUIEvents = function(){
            var scrollBtn = $engine.find('div[data-role=scrollButton]')
            scrollBtn.on('click', function(){
               event.preventDefault();
               $(getScrollContainer()).animate({scrollTop: 0}, 200);
               return false; 
            });
        };
        
        var setContent = function(_target, _strPage){
          if(_strPage == strPage){
            var _targetDiv = $('#'+_target);
            var _content = JSON.stringify(objPageContent[_target]).replace(/"/g, '');
            _targetDiv.find('div').detach();            
            $.ajaxSetup({
                cache:true
            });
            _targetDiv.load(_content, function(){
                logMessage('page loaded')
            })
          }else{
            window.location.href = '#!'+ _strPage.toUpperCase();
          }
        };
          
        var getAppEnvironment = function(){
            var _userenv = ''
            var _env = getParameterByName('env');
            if(_env.toLowerCase()){
                _userenv = objEnvironment[_env];
                setAppEnvironment(_userenv);
            }else{
                _userenv = objEnvironment[Object.keys(objEnvironment)[0]]
                setAppEnvironment(_userenv)
            }
        };
        
        var setAppEnvironment = function(_strEnvir){ 
            strAppEnvironment = _strEnvir;
            logMessage(' fn > setAppEnvironment > '+ strAppEnvironment);
        };
        
        var cleanPage = function(){
            logMessage("fn > cleanPage  - Cleaning page.. ")
            $engine.find("div").remove(); 
            $engine.find('script').remove();
            boolLibrariesLoaded = false;
            boolScriptLoaded = false;
        };
        
       var getScrollContainer = function() {
            var _body = $('body');
            var _p = _body.scrollTop;
            _body.scrollTop++;
            if (_body.scrollTop === _p) {
                return document.documentElement;
            } else {
                _body.scrollTop--;
                return _body;
            }
        };
        
        var getHashURL = function(){
            var a = window.location.href.match(/#(.)(.*)$/);
            return a&&a[1]=="!"&&a[2].replace(/^\//,"");
        };  

        var getNode = function(_objNode, _strElement){
            var _objResNode = _objNode[_strElement]; 
            return _objResNode;
        };

        var showApplicationLoader = function(_boolflag){
            if(_boolflag){
                $engine.prepend('<div id="loader" class="page-block"><div class="loader-ui"><img src="skin/images/ajax-loader2.gif" />&nbsp;Loading</div></div>');
            }else{
               $engine.find('#loader').remove();
            }
        };
        
        var toggleViewLoader = function(_flag, _text, _target){
            if(_flag){
                $engine.prepend('<div id="viewloader" class="page-block"><div class="views-loader"><img src="skin/images/ajax-loader2.gif" />&nbsp;'+_text+'</div></div>');
            }else{
               $engine.find('#viewloader').remove();
            }
        };

        var toggleUIMessages = function(_flag, _text, _target, _width, _height){
            if(_flag){
                $engine.find(_target).prepend('<div class="message-ui" style="width:' + _width + '%;height:'+ _height +'px">'+ _text + '</div>');
                $engine.find(_target).fadeTo("slow",0.45);
            }else{
                $engine.find(_target).fadeTo("fast",1);
                $engine.find(_target).find('.message-ui').remove();
            }
        };
        
        var toggleMessageBox = function(_flag, _text, _target, _width, _height){
            if(_flag){
                $engine.find(_target).prepend('<div class="messagebox-ui" style="width:' + _width + ';height:'+ _height +'">'+ _text + '</div>');
            }else{
                $engine.find(_target).find('.message-ui').remove();
            }
        };

        var toggleStatusMessages = function(_flag, _target, _message, _type){
            _message = (typeof _message === "undefined") ? '' : _message;
            _type = (typeof _type === "undefined") ? '' : _type;

            if(_flag){
                _target.show();
                _target.html(_message);
                if(_type == 'error'){
                    _target.removeClass('status-msg-success');
                    _target.addClass('status-msg-error');
                }else{
                    _target.removeClass('status-msg-error');
                    _target.addClass('status-msg-success');
                }
            }else{
                _target.hide();
                _target.html('');
            }
        };

        var showFailover = function(){
            cleanPage();
            var _strFailoverView = strViewsPath + 'failover.html'
            loadPage($engine, _strFailoverView)
            showApplicationLoader(false);
        };
        
        var loadPage = function(_target, _strSrc, _strVersion){
            if(typeof(_strController)==='undefined') _strController = '';
            _target.load(_strSrc + '?v=' + _strVersion, function(response, status, xhr){
                switch(status){
                  case "success":
                    logMessage(' fn > loadPage - Comp > ' + _strSrc);
                    if(numOfComponents == compCount){
                        addPageController();     
                        compCount = 1;
                    }else{
                        compCount++
                    }        
                    break;
                  case "error":
                    logMessage(' fn > loadPage - Error ' + _strSrc);
                    window.location.href = '#!ERROR';
                    boolPageLoaded = false; 
                    break;
                }
            });
        };
        
        var displayPrimaryNotification = function(){
            if(strNotificationFeedPath !== ''){
                logMessage(' fn > displayPrimaryNotification - status: ' + strNotificationFeedPath);
                getNotification();
                boolNotificationsShown = true;
            }else{
                logMessage(' fn > displayPrimaryNotification - status: No notification feeds');
            }
            function getNotification(){
                plugin.makeAJAXRequest(
                    strNotificationFeedPath + '?dt=' + Math.round(new Date().getTime() / 1000),
                    'GET',
                    {},
                    'application/json',
                    'json',
                    {},
                    true,
                    getTodaysNotifications,
                    notifyDataErrorHandler
                );
            }
            function getTodaysNotifications(_data){
                var _notifications = _data.application.notifications
                var _today = moment().format('YYYY MM DD');
                var _messages = [];
                $.each(_notifications, function(_index, _elem){
                    if(_elem.date === _today.toString()){
                        _messages.push(_elem);
                    }else{
                        logMessage(' fn > displayPrimaryNotification - Notify: No other messages for the day: ' + _today );
                    }
                })
                if(_messages.length > 0) displayMessages(_messages);
            }
            function displayMessages(_obj){
                $main_heading = $('<h4 class="blue-text">').html('Notifications');
                $close_btn = $('<button class="button tiny pull-right">').text('DISMISS')
                $notifications_container = $('<div id="notifications_container" class="notifications_container">');
                $engine.append($('<div id="notifications_dialog">').attr('class', 'page-block'));
                $engine.find('#notifications_dialog').prepend($('<div>').attr('class', 'notifications-view'));
                $notifications_container.appendTo('.notifications-view');
                
                $notifications_list = $('<ul id="notifications_list" class="list-group">').appendTo($notifications_container);
                $.each(_obj, function(_index, _elem){
                    var $item = $('<li class="list-group-item-dark">').append(
                        $('<div>').html('<label class="label label-' + _elem.type + '">'+ _elem.name.toUpperCase() +'<label>'),
                        $('<div class="notification-msg">').html(_elem.message)
                    ).appendTo('#notifications_list');
                });
                $close_btn.appendTo('.notifications-view');
                $main_heading.prependTo('.notifications-view');
                $('#notifications_container').slimScroll({
                    size: '5px',
                    height: '320px',
                    position: 'right',
                    color: '#666',
                    alwaysVisible: false,
                    distance: '1px',
                    railVisible: true,
                    railColor: '#222',
                    railOpacity: 0.3,
                    wheelStep: 10,
                    allowPageScroll: false,
                    disableFadeOut: false
                });
                $close_btn.on('click', function(event){
                    $('#notifications_dialog').hide();
                })
            }
            function notifyDataErrorHandler(jqXHR, textStatus, errorThrown){
                logMessage(' fn > displayPrimaryNotification - error: Error loading feed '+errorThrown);
            }
        };
        
        var logMessage = function(_strMsg){
            console.log("** ENGINE UX > "+_strMsg);
        };

        var getParameterByName = function(name) {
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
            return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        };
        
        $(window).on('hashchange', function(){
            strPage = getHashURL();
            setupPage();
        });
        
        plugin.init();

    }

    $.fn.engine = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('engine')) {
                var plugin = new $.engine(this, options);
                $(this).data('engine', plugin);
            }
        });

    }

})(jQuery);