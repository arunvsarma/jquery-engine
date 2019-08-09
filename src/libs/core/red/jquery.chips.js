  /*!
 * Chips
 * Version 1
 * Requires jQuery v1.11 or later  & Bootstrap 3
 * 
 * Author: Arun V.Sarma
 */
/*
 * TODO LIST:
 * - NA
 */

(function($) {
    $.chips = function(element, options) {
        var defaults = {
            data: [],
            clickable: false
        };

        var plugin = this;
        plugin.settings = {};

        var $chips = $(element),
             chips = element;
        
        var STR_VERSION = '1.00.10.2016';
        var elem_popover;

        plugin.init = function() {
            logMessage("Plugin loaded. Plugin version: " + STR_VERSION);
            plugin.settings = $.extend({}, defaults, options);
            setup_plugin();
        };

        plugin.set_data = function(_data){
            set_plugin_data(_data);
        };

        plugin.destory = function(){
            $chips.detach();
            $chips.empty();
        };

        plugin.get_version = function(){
            return STR_VERSION;
        };


        var setup_plugin = function(){
            var bool_clickable = plugin.settings.clickable;
            var arr_data = plugin.settings.data;
            set_plugin_data(arr_data);
        };

        var set_plugin_data = function(_arr){
            var elem_child = '';
            var elem_close_btn = '';
            var arr = [];
            var str_values = '';
            $chips.empty();
            if(_arr.length > 0){
                $.each(_arr, function(index, element){
                    switch(element.type){
                        case 'count':
                            if (element.values) {
                                if (element.values.length > 0) {
                                    elem_child = '<span class="count_txt">' + element.values.length + '</span>';
                                } else {
                                    elem_child = '<span class="count_txt">ALL</span>';
                                }
                            }
                            
                        break;
                        case 'image':
                            elem_child = '<img src="img_avatar.png" alt="'+element.label+'" width="96" height="96">';
                        break;
                    }

                    if(element.closeable) elem_close_btn = '<span class="chip_close_btn">&times;</span>';
                    if (element.values) {
                        if (element.values.length > 0) {
                            str_values = element.values.join(', ');
                        } else {
                            str_values = 'All';
                        }
                    }
                    
                    $chips.append(
                        '<div class="chip" data-values='+element.values+'>' +
                        '<div class="details_popup">'+str_values+'</div>' +
                        elem_child +
                        '<span class="chip_txt">'+element.label + '</span>' +
                        elem_close_btn +
                        '</div>'
                    );
                });

                bind_event_listener($chips.find('.chip'));
            }
            
        };

        var bind_event_listener = function(_target){
            
            _target.off('mouseenter').on('mouseenter', function(event){
                $(this).find('.details_popup').show();
            });

            _target.off('mouseleave').on('mouseleave', function(event){
                $(this).find('.details_popup').hide();
            });

        };

        var logMessage = function(_strMsg){
            console.log("** CHIPS > "+_strMsg);
        };

        plugin.init();

    };

    $.fn.chips = function(options) {
        return this.each(function() {
            if (undefined === $(this).data('chips')) {
                var plugin = new $.chips(this, options);
                $(this).data('chips', plugin);
            }
        });

    };

})(jQuery);