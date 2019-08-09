/* COMPONENTS, UTILS AND PROTOTYPES */
var host_url = window.location.hostname;
var host_name = host_url.split('.')[0];


var setupApplication = function(){
    appServerURL = $engine.getApplicationEnvironment();
    currentPage = $engine.getCurrentPage();
    applicationName = $engine.getApplicationName();
    applicationVersion = $engine.getApplicationVersion();
    applicationAuthor = $engine.getApplicationAuthor();
    selectedAccountId = '';
    setApplicationInfo();
    configureNavigation();
};
/* DIAGNOSTICS */

/* SETUP HEADER & FOOTER PANEL */
var setApplicationInfo = function(){
    $('#appname_txt').html(applicationName);
    $('#appversion_txt').html('<i>Version: </i>'+applicationVersion);
    $('#appauthor_txt').html('<i>Hand-crafted By: </i>' + applicationAuthor);
    $('#logo-brand-text').text('WEB');
};
/* CONFIGURE NAVIGATION AND BIND NAV EVENTS */
var configureNavigation = function(){
    currentPage = $engine.getCurrentPage();
    boolUserIsLoggedIn = $engine.getUserIsLoggedIn();

    $('#side_main_nav').empty();
    $.each(CONFIG_SIDE_NAV, function (index, element) {
        if (host_name === 'events-media') {
            if ((element.category === 'media') || (element.category === 'all')) {
                $('#side_main_nav').append(
                    '<li id="' + element.name + '" class="nav-toggle">' +
                    '<a class= "btn-nav white-text gen" data-link="' + element.page + '" data-toggle="tooltip" data-container="body" data-placement="right" title="' + element.title +'" href="javascript:;" >'+
                    '<div class="nav-caption-icon"><i class="nav-icon fa ' + element.icon +'"></i></div>' + 
                    '<div class="nav-caption">' + element.title +'</div>' +
                    '</a>' +
                    '</li>'
                );
            }
        } else {
            if ((element.category === 'web') || (element.category === 'all')) {
                $('#side_main_nav').append(
                    '<li id="' + element.name + '" class="nav-toggle">' +
                    '<a class= "btn-nav white-text gen" data-link="' + element.page + '" data-toggle="tooltip" data-container="body" data-placement="right" title="' + element.title + '" href="javascript:;" >' +
                    '<div class="nav-caption-icon"><i class="nav-icon fa ' + element.icon +'"></i></div>' +
                    '<div class="nav-caption">' + element.title + '</div>' +
                    '</a>' +
                    '</li>'
                );
            }
        }
        
    });

    $('#side_main_nav > li .btn-nav').each(function () {
        var _id= $(this).parent().attr('id');
        if(_id !== 'NA'){
            if(_id === currentPage.toLowerCase()){
                $(this).addClass('buttonactive');
            }else{
                $(this).removeClass('buttonactive');
            }
        }
    });
    $('.btn-nav').on('click', function(event){
        var _content = $(this).attr('data-link');
        if(_content !== 'NA'){
            switch(_content.toLowerCase()){
                case 'export':
                    setExportOptions();
                break;
                case 'faq':
                    $engine.setContent(_content, '_blank');
                break;
                default:
                    $engine.setContent(_content);
            }
        }
        event.preventDefault();
    });
    $('#navigation-wrapper').on('mouseover', function(event){
        $(this).addClass('leftpanel-expand');
        $(this).removeClass('leftpanel-collapsed');
        event.preventDefault();
    });
    $('#navigation-wrapper').on('mouseout', function(event){
        $(this).addClass('leftpanel-collapsed');
        $(this).removeClass('leftpanel-expand');
        event.preventDefault();
    });
    $('.close-wl-win').on('click', function(event){
        $(this).parent().hide();
        $('#btn-edit').removeClass('active');
        event.preventDefault();
    });
    $('body').on('click', function (e) {
        $(this).find('.tooltip').remove();
        $('[class="popover"]').each(function () {
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                $(this).popover('hide');
            }
        });
    });
    
    $('.btn-icon').tooltip();
};

var setApplicationDataError = function(){
    $engine.setContent('ERROR');
};
var cleanupBeforeNavigate = function(){
    $engine.log('Cleaning up and garbage collection: ');
};
var bindPageEvents = function (){
    $('#home-btn').on('click', function (event){
        $engine.setContent('HOME');
        event.preventDefault();
    });
};
$(document).on("HASH_CHANGE", function(event){
    setupApplication();
});
