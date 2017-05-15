window.conApp = {};


/*
 *
 * YAY sidebar
 *
 */
!function($) {
  "use strict";

  var YAY = function(element, options) {
    this.options    = options;
    this.$yay       = $(element);
    this.$content   = this.$yay.find('~ .content-wrap');
    this.$nano      = this.$yay.find(".nano");
    this.$html      = $('html');
    this.$body      = $('body');
    this.$window    = $(window);

    // set in true when first time were clicked on toggle button
    this.changed    = false;

    this.init();
  };

  YAY.DEFAULTS = {
    // duration od animations
    duration: 300,

    // set small sidebar when window width < resizeWnd
    resizeWnd: 1000
  };

  YAY.prototype.init = function() {
    var _this = this;

    // no transition enable
    _this.$body.addClass('yay-notransition');

    // init Nano Scroller
    _this.$nano.nanoScroller({ preventPageScrolling: true });

    // sidebar toggle
    $('.yay-toggle').on( 'click', function(e) {
      e.preventDefault();
      _this.toggleYay();
    });

    // hide sidebar when push content overlay
    _this.$content.on( 'click', function() {
      if( _this.isHideOnContentClick() ) {
        _this.hideYay();
      }
    });

    // toggle sub menus
    _this.$yay.on('click', 'li a.yay-sub-toggle', function(e) {
      e.preventDefault();
      _this.toggleSub($(this));
    });

    // init gesture swipes
    if( _this.$yay.hasClass('yay-gestures') ) {
      _this.useGestures();
    }

    // on window resize - set small sidebar
    _this.$window.on('resize', function() {
      _this.windowResize();
    });
    
    _this.windowResize();

    // no transition disable
    setTimeout(function() {
      _this.$body.removeClass('yay-notransition');
    }, 1);

    // select item public function (tested only on angularjs)
    conApp.yaySelectItem = function( link ) {
      // find item
      var item = _this.$yay.find('[href*="'+link+'"]');

      if(item.length) {
        // remove old active items
        _this.$yay.find('.active').removeClass('active');
        // _this.$yay.find('.open').removeClass('open');

        // find toggle menu item
        var toggle = item.parent('li').parent('ul').siblings('.yay-sub-toggle');
        var subClosed = !toggle.parent('.open').length;
        
        // open submenu
        if(toggle.length && subClosed) {
          _this.toggleSub(toggle);
        }

        // highlight new active item
        item.parent('li').addClass('active');
      }
    }
  };

  YAY.prototype.isShow = function() {
    return !this.$body.hasClass('yay-hide');
  };

  // check show type
  YAY.prototype.showType = function() {
    if(this.$yay.hasClass('yay-overlay')) return 'overlay';
    if(this.$yay.hasClass('yay-push')) return 'push';
    if(this.$yay.hasClass('yay-shrink')) return 'shrink';
  };


  // check if hide on content click
  YAY.prototype.isHideOnContentClick = function() {
    return this.$yay.hasClass('yay-overlap-content');
  };

  // check if sidebar static position
  YAY.prototype.isStatic = function() {
    return this.$yay.hasClass('yay-static');
  };


  YAY.prototype.toggleYay = function(type) {
    var _this = this;
    var show = !_this.isShow();

    if(type) {
      if(
        (type=='show' && !show)
        || (type=='hide' && show)) {
        return;
      }
    }

    _this.options.changed = true;

    if( show ) {
      _this.showYay();
    } else {
      _this.hideYay();
    }
  };

  YAY.prototype.showYay = function() {
    var _this = this;

    _this.$body.removeClass('yay-hide');

    setTimeout(function() {
      // restore scroller on normal sidebar after end animation (300ms)
      _this.$nano.nanoScroller();

      // resize for charts reinit
      _this.$window.resize();
    }, _this.options.duration);
  };

  YAY.prototype.hideYay = function() {
    var _this = this;

    _this.$body.addClass('yay-hide');

    // destroy scroller on hidden sidebar
    _this.$nano.nanoScroller({ destroy: true });

    // resize for charts reinit
    setTimeout(function() {
      _this.$window.resize();
    }, _this.options.duration);
  };


  // toggle submenu [open or close]
  YAY.prototype.toggleSub = function(toggle) {
    var _this = this;

    var toggleParent = toggle.parent();
    var subMenu = toggleParent.find('> ul');
    var opened = toggleParent.hasClass('open');

    if(!subMenu.length) {
      return;
    }

    // close
    if(opened) {
      _this.closeSub(subMenu);
    }

    // open
    else {
      _this.openSub(subMenu, toggleParent);
    }
  };

  // close submenus
  YAY.prototype.closeSub = function(subMenu) {
    var _this = this;

    subMenu.css('display', 'block').stop()
      .slideUp(_this.options.duration, 'swing', function() {
      // close child dropdowns
      $(this).find('li a.yay-sub-toggle').next().attr('style', '');

      // reinit nano scroller
      _this.$nano.nanoScroller();
    });
    
    subMenu.parent().removeClass('open');
    subMenu.find('li a.yay-sub-toggle').parent().removeClass('open');
  };

  // open submenus
  YAY.prototype.openSub = function(subMenu, toggleParent) {
    var _this = this;

    subMenu
      .css('display', 'none').stop()
      .slideDown(_this.options.duration, 'swing', function() {
        // reinit nano scroller
        _this.$nano.nanoScroller();
      });
    toggleParent.addClass('open');

    _this.closeSub( toggleParent.siblings('.open').find('> ul') );
  };

  // use gestures for show / hide menu
  YAY.prototype.useGestures = function() {
    var _this = this;
    var touchStart = 0;
    var startPoint = 0; // x position
    var endPoint = 0; // x position

    // on touch start
    _this.$window.on('touchstart', function(e) {
      startPoint = (e.originalEvent.touches?e.originalEvent.touches[0]:e).pageX;
      endPoint = (e.originalEvent.touches?e.originalEvent.touches[0]:e).pageX;
      touchStart = 1;
    });

    // on swipe start
    _this.$window.on('touchmove', function(e) {
      if( touchStart ) {
        endPoint = (e.originalEvent.touches?e.originalEvent.touches[0]:e).pageX;
      }
    });

    // on swipe end
    _this.$window.on('touchend', function(e) {
      if( touchStart ) {
        var resultSwipe = startPoint - endPoint,
            rtl = _this.$html.hasClass('rtl');

        touchStart = 0;

        // swipe min width 100px
        if( Math.abs( resultSwipe ) < 100 ) {
          return;
        }

        // change values if rtl
        if( rtl ) {
          resultSwipe *= -1;
          startPoint = _this.$window.width() - startPoint;
        }

        // from left to right
        if(resultSwipe < 0) {
          // show only when touch started from left corner
          if( startPoint < 40 ) {
            _this.showYay();
          }
        }

        // from right to left
        else {
          _this.hideYay();
        }
      }
    });
  };

  // on resize window and on start
  var resizeTimer;
  YAY.prototype.windowResize = function() {
    var _this = this;

    // if user currently changed size of sidebar, stop change it
    if(!_this.options.changed) {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        if(_this.$window.width() < _this.options.resizeWnd) {
          _this.toggleYay('hide');
        }
      }, 50);
    }
  };




  // init
  conApp.initSidebar = function() {
    $('.yaybar').each(function() {
      var options = $.extend({}, YAY.DEFAULTS, $(this).data(), typeof option == 'object' && option);
      var curyay = new YAY(this, options);
    });
  };

  if(typeof conAngular === 'undefined') {
    conApp.initSidebar();
  }

}(jQuery);



/*
*
* WEATHER WIDGET
*
*/
!function($) {
  "use strict";
  
  var Weather = function(element, options) {
    this.options   = options;
    this.$element  = $(element);

    // init
    this.init();
  };

  Weather.DEFAULTS = {
    // when navigator no support geolocation
    // [location, woeid]
    fallback: ['Seattle',''],

    // weather icons
    icons: ['wi-tornado','wi-night-thunderstorm','wi-storm-showers','wi-thunderstorm','wi-storm-showers','wi-rain-mix','wi-rain-mix','wi-rain-mix','wi-rain-mix','wi-snow','wi-rain-mix','wi-snow','wi-snow','wi-snow','wi-snow','wi-rain-mix','wi-snow','wi-rain-mix','wi-rain-wind','wi-cloudy-windy','wi-cloudy-windy','wi-cloudy-windy','wi-cloudy-windy','wi-cloudy-windy','wi-cloudy-gusts','wi-cloudy-gusts','wi-cloudy','wi-night-cloudy','wi-day-cloudy','wi-night-cloudy','wi-day-cloudy','wi-night-clear','wi-day-sunny','wi-night-clear','wi-day-sunny','wi-rain-mix','wi-day-sunny','wi-storm-showers','wi-storm-showers','wi-storm-showers','wi-rain','wi-rain-mix','wi-snow','wi-rain-mix','wi-night-cloudy','wi-storm-showers','wi-rain-wind','wi-storm-showers']
  };

  Weather.prototype.init = function() {
    var _this = this;
    // Check user geolocation and show weather
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        _this.loadWeather(position.coords.latitude+','+position.coords.longitude); //load weather using your lat/lng coordinates
      });
    } else {
      // load fallback location
      _this.loadWeather(_this.options.fallback[0], _this.options.fallback[1]);
    }
  };

  Weather.prototype.loadWeather = function(location, woeid) {
    var _this = this;
    $.simpleWeather({
      location: location,
      woeid: woeid,
      unit: 'c',
      success: function(weather) {
        var html = [
          '<div class="row">',
            '<div class="temp col s7">',
              weather.temp+'&deg;'+weather.units.temp,
              ' <span class="alt">'+weather.alt.temp+'&deg;F</span>',
            '</div>',
            '<div class="city col s5"><i class="fa fa-map-marker"></i> '+weather.city+'</div>',
          '</div>',
          '<div class="icon"><i class="wi '+_this.options.icons[weather.code]+'"></i></div>',
          '<div class="currently">'+weather.currently+'</div>'
        ].join('');  
        
        _this.$element.html(html);
      },
      error: function(error) {
        _this.$element.html('<h4>Error</h4>'+'<p>'+error+'</p>');
      }
    });
  };

  // init plugin
  conApp.initCardWeather = function() {
    $(".weather-card").each(function() {
      new Weather(this, Weather.DEFAULTS);
    });
  };

  if(typeof conAngular === 'undefined') {
    conApp.initCardWeather();
  }

}(jQuery);



/* 
* 
* Cards
* 
*/
!function($) {
  "use strict";
  
  var Card = function(element, options) {
    this.options      = options;
    this.$card        = $(element);
    this.$closeBtn    = this.$card.find('> .title > .close');
    this.$minimizeBtn = this.$card.find('> .title > .minimize');
    this.$content     = this.$card.find('> .content');
  };

  Card.DEFAULTS = {
    // duration of all animations
    duration: 300
  };

  function resize() {
    // resize for nano scroller and charts
    $(window).resize();
  }

  // init card
  Card.prototype.init = function() {
    var _this = this;

    // Remove card
    _this.$closeBtn.on('click', function(e) {
      e.preventDefault();
      _this.close();
    });

    // Minimize card
    _this.$minimizeBtn.on('click', function(e) {
      e.preventDefault();
      _this.minimize();
    });
  };

  // cloase card
  Card.prototype.close = function() {
    var _this = this;

    // remove animation
    _this.$card.velocity({
      opacity: 0,
      translateY: -20
    }, _this.options.duration )
    
    .velocity('slideUp', _this.options.duration, function() {
      _this.$card.remove();
      resize();
    });
  };

  // minimize card
  Card.prototype.minimize = function() {
    var _this = this;

    if(_this.$content.hasClass('velocity-animating')) {
      return;
    }

    if(_this.$card.hasClass('minimized')) {
      _this.$content
        .css('display', 'none')
        .velocity('slideDown', 'swing', _this.options.duration, resize);
    } else {
      _this.$content
        .css('display', 'block')
        .velocity('slideUp', 'swing', _this.options.duration, resize);
    }

    _this.$card.toggleClass('minimized');
  };



  // init
  conApp.initCards = function() {
    $('.card').each(function() {
      var options = $.extend({}, Card.DEFAULTS, $(this).data(), typeof option == 'object' && option);
      var curCard = new Card(this, options);

      // call init
      curCard.init();
    });
  };
  
  if(typeof conAngular === 'undefined') {
    conApp.initCards();
  }

}(jQuery);



/* 
* 
* Open Layers with ripple effect
* 
* Usage:

  // Init layer
  var myLayer = $('.myLayer');

  // Init layer
  myLayer.MDLayer({
    duration: 400
  });

  // toggle layer
  $('.myLayer-toggle').on('click', function() {
    myLayer.MDLayer();
  });

  // hide layer
  $('.myLayer-hide').on('click', function() {
    myLayer.MDLayer('hide');
  });

  // show layer
  $('.myLayer-show').on('click', function() {
    myLayer.MDLayer('show');
  });
*/
!function($) {
  "use strict";
  
  var Layer = function(element, options) {
    this.options     = options;
    this.$body       = $('body');
    this.$navbar     = $('.navbar-top:eq(0)');
    this.$layer      = $(element);
    this.$overlay    = this.$layer.find('> .layer-overlay');
    this.$content    = this.$layer.find('> .layer-content');

    // duration and delay for content show / hide
    this.contDuration = this.options.duration * 0.8;

    // if layer currently opened (will change)
    this.isOpened    = this.$layer.hasClass('layer-opened');

    // when animation plays busy = true (will change)
    this.busy        = false;

    // start styles for layer (will change)
    this.startStyles = { left: 0, top: 0, width: 0, height: 0, marginTop: 0, marginLeft: 0 };

    // check if SVG supported
    this.useSVG      = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") && !/^((?!chrome).)*safari/i.test(navigator.userAgent);

    // start init (apply styles)
    this.init();
  };

  Layer.DEFAULTS = {
    duration: 600,
    fixScrollbar: false,

    // call after end animation
    onhide: false,
    onshow: false
  };

  Layer.prototype.init = function() {
    var _this = this;

    if( _this.useSVG ) {
      _this.prepareSVG();
    } else {
      _this.$overlay.css({
        position: 'absolute',
        borderRadius: '50%',
        zIndex: 0
      });
    }

    // hide content background
    if(this.$content[0]) {
      this.$content[0].style.background = 'none';
    }

    _this.$content.css({
      zIndex: 2
    });
  };


  // create svg object to animate it
  Layer.prototype.prepareSVG = function() {
    var color = this.$overlay.css('background-color');

    var svg = [
      '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">',
        '<g><circle cx="0" cy="0" r="0" fill="'+color+'"></circle></g>',
      '</svg>'
    ].join('');

    this.$overlay.css({
      position: 'absolute',
      width: '100%',
      height: '100%',
      background: 'none',
      zIndex: 0,
      transform: 'scale(1)'
    }).html( svg );

    if(this.$overlay[0]) {
      this.$overlay[0].style.background = 'none';
    }
  };


  // set circle start position and size
  Layer.prototype.setPosition = function( item ) {
    if( this.useSVG ) {
      item.find('g').attr({
        transform: 'translate('+this.startStyles.left+', '+this.startStyles.top+')'
      });

      item = item.find('circle');
      item.attr({
        r: this.startStyles.radius
      });
    } else {
      item.css({
        left: this.startStyles.left,
        top: this.startStyles.top,
        width: this.startStyles.radius * 2,
        height: this.startStyles.radius * 2,
        marginTop: - this.startStyles.radius,
        marginLeft: - this.startStyles.radius
      })
    }

    return item;
  };

  // show or hide layer
  // @type = ['show', 'hide']
  Layer.prototype.toggle = function(type) {
    if(
      this.busy ||
      (type == 'show' && this.isOpened) ||
      (type == 'hide' && !this.isOpened)
      ) {
      return false;
    }

    this.busy = true;

    this.calculateStartStyles();

    if(this.isOpened) {
      this.hide(1);
    } else {
      this.show(1);
    }
  };


  Layer.prototype.show = function(noredirect) {
    // redirect to toggle function
    if(!noredirect) {
      this.toggle('show');
      return false;
    }

    var _this = this;

    // scrollbar
    if(_this.options.fixScrollbar) {
      _this.checkScrollbar();
      _this.setScrollbar();
      _this.$body.addClass('layer-fix-scroll');
    }

    // start overlay animation
    _this.setPosition( _this.$overlay )
      .velocity({scale:0},0)
      .velocity({translateZ: 0, scale:1}, _this.options.duration, function() {
        // is opened now
        _this.isOpened = true;

        // end function
        if(_this.options.onshow) {
          _this.options.onshow();
        }

        // now not busy
        _this.busy = false;
      });

    // fade in content
    _this.$content
      .hide()
      .delay(_this.contDuration)
      .velocity('fadeIn', _this.contDuration);

    // show layer
    // timeout to prevent blinking on devices
    setTimeout(function() {
      _this.$layer.addClass('layer-opened').show();
    });
  };


  Layer.prototype.hide = function(noredirect) {
    // redirect to toggle function
    if(!noredirect) {
      this.toggle('hide');
      return false;
    }

    var _this = this;

    // content fadeout
    _this.$content.velocity('fadeOut', _this.contDuration);

    // start overlay animation
    _this.setPosition( _this.$overlay )
      .velocity({scale:1},0)
      .velocity({translateZ: 0, scale:0}, _this.options.duration, function() {
        // is hidde now
        _this.isOpened = false;

        // hide layer
        _this.$layer.removeClass('layer-opened').hide();

        // end function
        if(_this.options.onhide) {
          _this.options.onhide();
        }

        // scrollbar
        if(_this.options.fixScrollbar) {
          _this.$body.removeClass('layer-fix-scroll');
          _this.resetScrollbar();
        }

        // now not busy
        _this.busy = false;
      });
  };

  // calculate positions, sizes of layer
  Layer.prototype.calculateStartStyles = function(e) {
    var _this = this;
    var layer = _this.$layer;

    // layer pos
    // to get position need to show layer
    if(!this.isOpened) {
      layer.css({visibility: 'hidden',display: 'block'});
    }
    var layerPos = {
      top: layer.position().top,
      left: layer.position().left,
      width: layer.width(),
      // fix isue with fixed element
      height: (layer.css('position')=='fixed'?$(window).height():layer.height())
    };
    // after got position - hide layer
    if(!this.isOpened) {
      layer.css({display: 'none',visibility: 'visible'});
    }

    // start position of overlay
    _this.startStyles = {
      left: window.mousePos.x - layerPos.left,
      top: window.mousePos.y - layerPos.top
    };

    // correct position when click out of layer
    if(_this.startStyles.left < 0) {
      _this.startStyles.left = 0;
    }
    if(_this.startStyles.top < 0) {
      _this.startStyles.top = 0;
    }

    // end position overlay
    $.extend(_this.startStyles, {
      radius: Math.sqrt(Math.pow(layerPos.width, 2) + Math.pow(layerPos.height, 2))
    });
  };


  /*
    Fix Scrollbar
    functions from Bootstrap Modal
  */
  Layer.prototype.checkScrollbar = function () {
    this.bodyIsOverflowing = document.body.scrollHeight > document.documentElement.clientHeight;
    this.scrollbarWidth = this.measureScrollbar();
  };

  Layer.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10);
    if (this.bodyIsOverflowing) {
      this.$body.css('padding-right', bodyPad + this.scrollbarWidth);
      this.$navbar.css('padding-right', bodyPad + this.scrollbarWidth);
    }
  };

  Layer.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', '');
    this.$navbar.css('padding-right', '');
  };

  Layer.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div');
    scrollDiv.className = 'layer-scrollbar-measure';
    this.$body.append(scrollDiv);
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    this.$body[0].removeChild(scrollDiv);
    return scrollbarWidth;
  };


  // PLUGIN DEFINITION
  // =======================
  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this);
      var data    = $this.data('mdlayer');
      var options = $.extend({}, Layer.DEFAULTS, $this.data(), typeof option == 'object' && option);

      if (!data) $this.data('mdlayer', (data = new Layer(this, options)));
      if (typeof option == 'string' && data[option]) data[option]();
      if (typeof option == 'undefined') data.toggle();
    })
  }

  $.fn.MDLayer             = Plugin;
  $.fn.MDLayer.Constructor = Layer;



  /* Mouse Position - global */
  window.mousePos = {x: 0, y: 0};
  $(document).on('mousemove', function(e){ 
    window.mousePos.x = e.clientX || e.pageX; 
    window.mousePos.y = e.clientY || e.pageY;
  });

}(jQuery);



/*
 *
 * CHAT
 *
 */
!function($) {
  var Chat = function(element, options) {
    this.options    = options;
    this.$chat      = $(element);
    this.$window    = $(window);
    this.$document  = $(document);
    this.$chatForm  = this.$chat.find('.send > form');
    this.$msgNano   = this.$chat.find('.messages .nano');
    this.$msgCont   = this.$msgNano.find('> .nano-content');
    this.$msgInput  = this.$chat.find('input[name=chat-message]');
  };

  Chat.DEFAULTS = {
    // duration animation show new message
    msgDuration: 300,

    // set false to prevent demo message send
    msgDemo: 'Demo chat message ;)' 
  };

  Chat.prototype.init = function() {
    var _this = this;

    // Bindings

    // layer init
    _this.initLayer();

    // send message
    _this.$chatForm.on('submit', function(e) {
      e.preventDefault();
      _this.sendMsg();
    });

    // open chat with user
    _this.$chat.on('click', '.contacts .user', function(e) {
      e.stopPropagation();
      _this.$chat.addClass('open-messages');
    });
    // close chat with user
    _this.$chat.on('click', '.messages .topbar > .chat-back', function(e) {
      e.stopPropagation();
      e.preventDefault();
      _this.$chat.removeClass('open-messages');
    });
    
    _this.$chat.on('click', function(e) {
      if(!$(e.target).hasClass('chat-toggle') && !$(e.target).parent().hasClass('chat-toggle')) {
        e.stopPropagation();
      }
    });


    // init nanoScroller
    _this.$chat.find('.nano').each(function() {
      var scrollTo = '';
      if($(this).hasClass('scroll-bottom')) {
        scrollTo = 'bottom';
      } else if ($(this).hasClass('scroll-top')) {
        scrollTo = 'top';
      }

      $(this).nanoScroller({
        preventPageScrolling: true,
        scroll: scrollTo
      })
    });
  };

  Chat.prototype.initLayer = function() {
    var _this = this;

    // Toggle chat layer
    _this.$chat.MDLayer({
      duration: 400,
      onshow: function() {
        _this.$window.resize();
      }
    });

    // open chat
    _this.$document.on('click', '.chat-toggle', function(e) {
      e.preventDefault();
      e.stopPropagation();
      _this.$chat.MDLayer();
    });
    // close chat on document click
    _this.$document.on('click', function(e) {
      _this.$chat.MDLayer('hide');
    });
    // close chat on ESC press
    _this.$document.on('keyup', function(e) {
      if (e.keyCode == 27) {
        _this.$chat.MDLayer('hide');
      }
    });
  };

  Chat.prototype.sendMsg = function() {
    var _this = this;
    var message = _this.$msgInput.val() || _this.options.msgDemo;

    if(!message) {
      return;
    }

    // clear input
    _this.$msgInput.val('');

    // prepare new msg
    var newMsg = $('<div class="from-me">'+message+'</div>');
    _this.$msgCont.append('<div class="clear"></div>').append(newMsg);

    // animate new message
    newMsg.velocity({scale: 0, opacity: 0}, 0)
          .velocity({scale: 1, opacity: 1}, _this.options.msgDuration);

    // scroll to chat bottom
    _this.$msgNano.nanoScroller().nanoScroller({scroll: 'bottom'});
  };


  // init
  conApp.initChat = function() {
    $('.chat').each(function() {
      var options = $.extend({}, Chat.DEFAULTS, $(this).data(), typeof option == 'object' && option);
      var curChat = new Chat(this, options);

      // call init
      curChat.init();
    });
  };
  
  if(typeof conAngular === 'undefined') {
    conApp.initChat();
  }

}(jQuery);



/* 
* 
* conSparkline extend sparkline (responsive fix)
* 
*/
!function($) {
  "use strict";

  $.fn.conSparkline = function(data, options) {
    var $element = $(this);
    var $window = $(window);

    // init sparkline
    var initSpark = function() {
      if(!$.fn.sparkline) {
        return;
      }
      
      // change width
      var newOpts = {};
      if(options.type == 'bar' && /%/g.test(options.width)) {
        newOpts.barSpacing = 1;
        newOpts.barWidth = $element.width() / data.length;
      }

      // init
      $element.sparkline(data, $.extend(options, newOpts) );
    };
    initSpark();

    // resize sparkline
    var resizeSpark;
    $window.on('resize', function() {
      clearTimeout(resizeSpark);
      resizeSpark = setTimeout(initSpark, 50);
    });
  }

}(jQuery);



/* 
* 
* TODO
* 
*/
!function($) {
  "use strict";
  
  var TODO = function(element, options) {
    this.options  = options;
    this.$todo    = $(element);
    this.$add     = this.$todo.find('#todo-add');
  };

  TODO.DEFAULTS = {
    demoTask: 'This is Lorem ipsum task'
  };

  TODO.prototype.init = function() {
    var _this = this;

    // add new task
    _this.$add.on('keypress', function(e) {
      if (e.which == 13) {
        _this.addTask();
      }
    });

    // remove task
    this.$todo.on('click', '.todo-task .todo-remove', function(e) {
      e.preventDefault();
      e.stopPropagation();
      _this.removeTask( $(this).parents('.todo-task:eq(0)') );
    })
  };

  // Add new task
  TODO.prototype.addTask = function() {
    var taskID = 'todo-task-' + this.getUniqueID();
    var taskMsg = this.$add.val() || this.options.demoTask;
    var newTask = [
      '<div class="todo-task" style="display: none">',
        '<input type="checkbox" id="'+taskID+'">',
        '<label for="'+taskID+'">'+taskMsg+' <span class="todo-remove mdi-action-delete"></span></label>',
      '</div>'
    ].join('');
    newTask = $(newTask);

    // clean input
    this.$add.val('');

    // insert new task
    this.$add.parent().before(newTask);
    newTask.velocity("slideDown", 300);
  };

  // Remove Task
  TODO.prototype.removeTask = function(task) {
    task.velocity({ opacity: 0 }, 200, function() {
      $(this).velocity("slideUp", 200, function() {
        $(this).remove();
      });
    });
  };


  // get unique ID for task
  var unique = 100;
  TODO.prototype.getUniqueID = function() {
    if( $('#todo-task-'+unique)[0] ) {
      unique++;
      return this.getUniqueID();
    } else {
      return unique;
    }
  };


  // init
  conApp.initCardTodo = function() {
    $('.todo-card').each(function() {
      var options = $.extend({}, TODO.DEFAULTS, $(this).data(), typeof option == 'object' && option);
      var curTodo = new TODO(this, options);

      // call init
      curTodo.init();
    });
  };
  
  if(typeof conAngular === 'undefined') {
    conApp.initCardTodo();
  }

}(jQuery);



/* 
* 
* Bubble Canvas
* background effect with bubbles
* 
* 
*/
!function($) {
  "use strict";
  var width;
  var height;
  var ctx;

  var Bubbles = function(element) {
    if(!element) return;
    
    this.bubbles = [];
    this.$element = $(element);
    
    ctx = element.getContext('2d');

    this.init();
  };

  // Each Bubble drawer
  var OneBubble = function() {
    var _this = this;
    _this.pos = {};

    function init(first) {
      if(first) {
        _this.pos.y = height + Math.random()*height*0.2;
      } else {
        _this.pos.y = height + 20;
      }
      _this.pos.x = Math.random()*width;
      _this.scale = 0.1+Math.random()*0.7;
      _this.velocity = 0.5*Math.random();
      _this.alpha = 0.1+Math.random()*0.2;
    }

    this.draw = function() {
      if(_this.alpha <= 0) {
          init();
      }
      _this.pos.y -= _this.velocity;
      _this.alpha -= 0.0004;
      ctx.beginPath();
      ctx.arc(_this.pos.x, _this.pos.y, _this.scale*10, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'rgba(105, 109, 136,'+ _this.alpha+')';
      ctx.fill();
    };

    init(true);
  };


  // init
  Bubbles.prototype.init = function() {
    var _this = this;
    
    // update width and height of canvas
    _this.updateSizes();
    $(window).on('resize', function() {
      _this.updateSizes();
    });

    // enable start styles for canvas
    _this.$element.css({
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1
    });

    // create particles
    for(var x = 0; x < width * 0.5; x++) {
      var c = new OneBubble();
      _this.bubbles.push(c);
    }
    
    // start animate
    _this.animate();
  };


  // update width and height
  Bubbles.prototype.updateSizes = function() {
    width = window.innerWidth;
    height = window.innerHeight;

    // enable 
    this.$element.attr({
      width: width,
      height: height
    });
  };

  // animate bubbles
  Bubbles.prototype.animate = function() {
    var _this = this;
    ctx.clearRect(0, 0, width, height);
    for(var i in _this.bubbles) {
      _this.bubbles[i].draw();
    }
    requestAnimationFrame(function() {
      _this.animate();
    });
  };

  // init
  new Bubbles( $('#bubble-canvas')[0] );

}(jQuery);



/*
 * Init Plugins
 */
conApp.initMaterialPlugins = function() {
  // init selects
  if(typeof $.fn.material_select !== 'undefined') {
    $('select:not(.select2, .disabled)').each(function() {
      var label = $(this).parent('label');
      $(this).material_select();
      if(label.length) {
        label.wrap('<span style="color: #9e9e9e">');
        $(this).parent().unwrap();
      }
    });
  }

  // init sliders
  if(typeof $.fn.slider !== 'undefined') {
    $('.slider').slider({full_width: true});
  }

  // init parallax
  if(typeof $.fn.parallax !== 'undefined') {
    $('.parallax').parallax();
  }

  // init scrollSpy
  if(typeof $.fn.scrollSpy !== 'undefined') {
    $('.scrollspy').scrollSpy();
  }
  
  // init datepicker
  if(typeof $.fn.pickadate !== 'undefined') {
    $('.datepicker').pickadate();
  }

  // init dropdown
  if(typeof $.fn.dropdown !== 'undefined') {
    $('.dropdown-button').each(function() {
      var hover = $(this).attr('data-hover') == "true" || false;
      var constrainWidth = $(this).attr('data-constrainwidth') == "false" || true;
      var inDuration = $(this).attr('data-induration') || 300;
      var outDuration = $(this).attr('data-outduration') || 300;
      $(this).dropdown({
        hover: hover,
        constrain_width: constrainWidth,
        inDuration: inDuration,
        outDuration: outDuration
      });
    });
  }

  // init collapsible
  if(typeof $.fn.collapsible !== 'undefined') {
    $('.collapsible').each(function() {
      $(this).collapsible({
        accordion: $(this).attr('data-collapsible') === 'accordion'
      });
    });
  }

  // init modals
  if(typeof $.fn.leanModal !== 'undefined') {
    $('.modal-trigger').each(function() {
      var dismissible = $(this).attr('data-dismissible') || true;
      var opacity = $(this).attr('data-opacity') || 0.5;
      var in_duration = $(this).attr('data-induration') || 300;
      var out_duration = $(this).attr('data-outduration') || 300;

      $(this).leanModal({
        dismissible: dismissible,
        opacity: opacity,
        in_duration: in_duration,
        out_duration: out_duration
      });
    });
  }
};


conApp.initPlugins = function() {
  //  // init select2
  //  if(typeof $.fn.select2 !== 'undefined') {
  //    $('.select2').each(function() {
  //      $(this)
  //        .wrap('<div style="width:100%;position:relative;"></div>')
  //        .select2();
  //    });
  //    function initSelect2() {
  //      $('.select2').select2({width: 'resolve'})
  //    }
  //    var resizeTimeout;
  //    $(window).on('resize', function() {
  //      clearTimeout(resizeTimeout);
  //      resizeTimeout = setTimeout(initSelect2, 50);
  //    });
  //  }

  // init input tags
  if(typeof $.fn.tagsInput !== 'undefined') {
    $('.input-tag').tagsInput({
      width: '100%',
      height: 'auto'
    });
  }

  // init pikaday
  if(typeof $.fn.pikaday !== 'undefined') {
    $('.pikaday').pikaday();
  }

  // init clock picker
  if(typeof $.fn.clockpicker !== 'undefined') {
    $('.clockpicker').clockpicker();
  }

  // init spectrum
  if(typeof $.fn.spectrum !== 'undefined') {
    $('.spectrum').spectrum({
      showButtons: false
    });
  }

  // init masked inputs
  if(typeof $.fn.inputmask !== 'undefined') {
    $('input[data-inputmask]').inputmask();
  }

  // init prettyPrint
  if(typeof prettyPrint !== 'undefined') {
    prettyPrint();
  }

  // init markItUp
  if(typeof $.fn.markItUp !== 'undefined') {
    $(".markItUp").markItUp(mySettings);
  }

  // init Sortable
  if(typeof Sortable !== 'undefined') {
    $('.col.sortable, .sortable > .col').each(function() {
      var options = {
        group: 'widgets'
      };

      // if widget has title - use it for dragplace
      if($(this).find('.title')[0]) {
        options.handle = ".title";
      }

      Sortable.create(this, options);
    });
  }

  // init WOW.js
  if(typeof WOW !== 'undefined') {
    new WOW().init();
  }

  // init isotope
  if(typeof $.fn.isotope !== 'undefined') {
    var $isotopeConts = $('.isotope');
    function initIsotope() {
      $isotopeConts.isotope({
        itemSelector: '.item',
        layoutMode: 'masonry',
        isResizeBound: false
      });
    }
    var resizeTimeout;
    $(window).on('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(initIsotope, 50);
    });
  }

  // close dismissible alerts
  $('.alert').on('click', '.close', function() {
    // remove animation
    $(this).parents('.alert').velocity({
      opacity: 0,
      translateY: -20
    }, 300 )
    
    .velocity('slideUp', 300, function() {
      $(this).remove();
    });

  });

  /*
   * Search For Icons
   */
  (function() {
    var input = $('#inputIconSearch');

    if(input.length === 0) {
      return;
    }

    input.on('keyup', function () {
      var val = input.val();
      $('.icon-preview').hide();
      $('.icon-preview:contains("' + val + '")').show();

      $('.icon-card').hide();
      $('.icon-card:contains("' + val + '")').show();
    });

  }());

  /* PhotoSwipe */
  (function() {
    if(typeof PhotoSwipe === 'undefined') {
      return;
    }

    // prepare photoswipe markup
    var markup = [
      '<div id="gallery" class="pswp" tabindex="-1" role="dialog" aria-hidden="true">',
      '  <div class="pswp__bg"></div>',
      '  <div class="pswp__scroll-wrap">',
      '    <div class="pswp__container">',
      '      <div class="pswp__item"></div>',
      '      <div class="pswp__item"></div>',
      '      <div class="pswp__item"></div>',
      '    </div>',
      '    <div class="pswp__ui pswp__ui--hidden">',
      '      <div class="pswp__top-bar">',
      '        <div class="pswp__counter"></div>',
      '        <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>',
      '        <button class="pswp__button pswp__button--share" title="Share"></button>',
      '        <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>',
      '        <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>',
      '        <div class="pswp__preloader">',
      '          <div class="pswp__preloader__icn">',
      '            <div class="pswp__preloader__cut">',
      '              <div class="pswp__preloader__donut"></div>',
      '            </div>',
      '          </div>',
      '        </div>',
      '      </div>',
      '      <!-- <div class="pswp__loading-indicator"><div class="pswp__loading-indicator__line"></div></div> -->',
      '      <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">',
      '        <div class="pswp__share-tooltip">',
      '          <!-- <a href="#" class="pswp__share--facebook"></a>',
      '          <a href="#" class="pswp__share--twitter"></a>',
      '          <a href="#" class="pswp__share--pinterest"></a>',
      '          <a href="#" download class="pswp__share--download"></a> -->',
      '        </div>',
      '      </div>',
      '      <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>',
      '      <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>',
      '      <div class="pswp__caption">',
      '        <div class="pswp__caption__center">',
      '        </div>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');
    $('body').append(markup);

    // init code
    var initPhotoSwipeFromDOM = function(gallerySelector) {
      var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            el,
            childElements,
            thumbnailEl,
            size,
            item;

        for(var i = 0; i < numNodes; i++) {
          el = thumbElements[i];
          // include only element nodes 
          if(el.nodeType !== 1) {
            continue;
          }

          childElements = el.children;
          size = el.getAttribute('data-size').split('x');

          // create slide object
          item = {
            src: el.getAttribute('href'),
            w: parseInt(size[0], 10),
            h: parseInt(size[1], 10),
            author: el.getAttribute('data-author')
          };

          item.el = el; // save link to element for getThumbBoundsFn

          if(childElements.length > 0) {
            item.msrc = childElements[0].getAttribute('src'); // thumbnail url
            if(childElements.length > 1) {
              item.title = childElements[1].innerHTML; // caption (contents of figure)
            }
          }

          var mediumSrc = el.getAttribute('data-med');
          if(mediumSrc) {
            size = el.getAttribute('data-med-size').split('x');
            // "medium-sized" image
            item.m = {
              src: mediumSrc,
              w: parseInt(size[0], 10),
              h: parseInt(size[1], 10)
            };
          }
          // original image
          item.o = {
            src: item.src,
            w: item.w,
            h: item.h
          };
          items.push(item);
        }

        return items;
      };

      // find nearest parent element
      var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
      };

      var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        var clickedListItem = closest(eTarget, function(el) {
          return el.tagName === 'A';
        });

        if(!clickedListItem) {
          return;
        }

        var clickedGallery = clickedListItem.parentNode;

        var childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
          if(childNodes[i].nodeType !== 1) { 
            continue; 
          }

          if(childNodes[i] === clickedListItem) {
            index = nodeIndex;
            break;
          }
          nodeIndex++;
        }

        if(index >= 0) {
          openPhotoSwipe( index, clickedGallery );
        }
        return false;
      };

      var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
            params = {};

        if(hash.length < 5) { // pid=1
          return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
          if(!vars[i]) {
            continue;
          }
          var pair = vars[i].split('=');  
          if(pair.length < 2) {
            continue;
          }           
          params[pair[0]] = pair[1];
        }

        if(params.gid) {
          params.gid = parseInt(params.gid, 10);
        }

        return params;
      };

      var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {
          galleryUID: galleryElement.getAttribute('data-pswp-uid'),
          getThumbBoundsFn: function(index) {
            // See Options->getThumbBoundsFn section of docs for more info
            var thumbnail = items[index].el.children[0],
                pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                rect = thumbnail.getBoundingClientRect(); 

            return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
          },
          addCaptionHTMLFn: function(item, captionEl, isFake) {
            if(!item.title) {
              captionEl.children[0].innerText = '';
              return false;
            }
            captionEl.children[0].innerHTML = (item.title || '') +  (item.author ? '<br/><small>Photo: ' + item.author + '</small>' : '');
            return true;
          }
        };

        if(fromURL) {
          if(options.galleryPIDs) {
            // parse real index when custom PIDs are used 
            // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
            for(var j = 0; j < items.length; j++) {
              if(items[j].pid == index) {
                options.index = j;
                break;
              }
            }
          } else {
            options.index = parseInt(index, 10) - 1;
          }
        } else {
          options.index = parseInt(index, 10);
        }

        // exit if index not found
        if( isNaN(options.index) ) {
          return;
        }

        var radios = document.getElementsByName('gallery-style');
        for (var i = 0, length = radios.length; i < length; i++) {
          if (radios[i].checked) {
            if(radios[i].id == 'radio-all-controls') {

            } else if(radios[i].id == 'radio-minimal-black') {
              options.mainClass = 'pswp--minimal--dark';
              options.barsSize = {top:0,bottom:0};
              options.captionEl = false;
              options.fullscreenEl = false;
              options.shareEl = false;
              options.bgOpacity = 0.85;
              options.tapToClose = true;
              options.tapToToggleControls = false;
            }
            break;
          }
        }

        if(disableAnimation) {
          options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);

        // see: http://photoswipe.com/documentation/responsive-images.html
        var realViewportWidth,
            useLargeImages = false,
            firstResize = true,
            imageSrcWillChange;

        gallery.listen('beforeResize', function() {
          var dpiRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
          dpiRatio = Math.min(dpiRatio, 2.5);
          realViewportWidth = gallery.viewportSize.x * dpiRatio;

          if(realViewportWidth >= 1200 || (!gallery.likelyTouchDevice && realViewportWidth > 800) || screen.width > 1200 ) {
            if(!useLargeImages) {
              useLargeImages = true;
              imageSrcWillChange = true;
            }
          } else {
            if(useLargeImages) {
              useLargeImages = false;
              imageSrcWillChange = true;
            }
          }

          if(imageSrcWillChange && !firstResize) {
            gallery.invalidateCurrItems();
          }

          if(firstResize) {
            firstResize = false;
          }

          imageSrcWillChange = false;
        });

        gallery.listen('gettingData', function(index, item) {
          if( useLargeImages ) {
            item.src = item.o.src;
            item.w = item.o.w;
            item.h = item.o.h;
          } else {
            item.src = item.m.src;
            item.w = item.m.w;
            item.h = item.m.h;
          }
        });

        gallery.init();
      };

      // select all gallery elements
      var galleryElements = document.querySelectorAll( gallerySelector );
      for(var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
      }

      // Parse URL and open gallery if it contains #&pid=3&gid=1
      var hashData = photoswipeParseHash();
      if(hashData.pid && hashData.gid) {
        openPhotoSwipe( hashData.pid,  galleryElements[ hashData.gid - 1 ], true, true );
      }
    };

    initPhotoSwipeFromDOM('.photoswipe-gallery');
  }());
};


conApp.initSearchBar = function() {
  // toggle search bar layer
  var searchBar = $('.search-bar:eq(0)');
  searchBar.MDLayer({
    duration: 500,
    fixScrollbar: true,
    onshow: function() {
      searchBar.find('input').focus();
    }
  });
  $(document).on('click', '.search-bar-toggle', function(e) {
    e.preventDefault();
    e.stopPropagation();
    searchBar.MDLayer();
  });
  // close search bar on ESC press
  $(document).on('keyup', function(e) {
    if (e.keyCode == 27) {
      searchBar.MDLayer('hide');
    }
  });
};

jQuery(function() {
  // variables
  var $ = jQuery;

  // init all if not Angular version
  if(typeof conAngular === 'undefined') {
    conApp.initSearchBar();

    conApp.initPlugins();

    conApp.initMaterialPlugins();
  }

  // redraw all charts on window resize
  $(window).on('resize', function() {
    if(typeof nv !== 'undefined' && typeof nv.graphs !== 'undefined' && nv.graphs.length) {
      for(var k in nv.graphs) {
        nv.graphs[k].update();
      }
    }
  });

});
