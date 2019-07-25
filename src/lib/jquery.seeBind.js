if (typeof jQuery === 'undefined') {
  throw new Error('jquery.seeBind requires jQuery');
}

(function($) {
  var dataBind = {};
  var handlers = {}; // name -> [callbacks]
  var binding = {}; // name -> {selector: 'selector', handlers: [callbacks]}

  /**
   * bind a handler to a selector
   * @param {string} name
   * @param selector Element selector, can be a pure string, like '#id, .class' or a template string, like '[data-type="{{type}}"]',
   *     and all template should be wrapped in {{}}
   * @param {*} handler function/string, if string, it should be a name registered by registerHandler,
   *     and handler will be called with two arguments: $el(current element's jquery Object), data(passed by setData)
   */
  dataBind.bind = function(name, selector, handler) {
    // not registered
    if (!binding[name]) {
      binding[name] = {
        selector: selector,
        handlers: [],
      };
    }
    // name id registered, but selector is another one
    else if (binding[name].selector != selector) {
      console.error('Bind name (' + name + ') has registered.');
      return;
    }
    binding[name].handlers.push(handler);
  };

  /**
   * set data to a element
   * @param name
   * @param data Pass to handler's second argument.
   * @param selectorData If selector of name is a template string, and this will be use to compile it
   */
  dataBind.setData = function(name, data, selectorData) {
    var selector = !!binding[name] && binding[name].selector,
      $el;

    if (!selector) {
      console.error('Selector name (' + name + ') is not registered.');
      return;
    }

    !!selectorData &&
      Object.keys(selectorData).map(function(key) {
        selector = selector.replace(
          new RegExp('{{' + key + '}}', 'g'),
          selectorData[key]
        );
      });

    $el = $(selector);

    binding[name].handlers.map(function(handler) {
      // function
      typeof handler == 'function'
        ? handler($el, data)
        : // string
          !!handlers[handler] &&
          handlers[handler].map(function(callback) {
            callback($el, data);
          });
    });
  };

  /**
   * register handler
   * @param name
   * @param callback($el, data) Will be called with two arguments: $el(current element's jquery Object), data(passed by setData)
   */
  dataBind.registerHandler = function(name, callback) {
    !handlers[name] && (handlers[name] = []);
    handlers[name].push(callback);
  };

  dataBind.registerHandler('attr', function($el, data) {
    $el.attr(data);
  });
  dataBind.registerHandler('val', function($el, data) {
    $el.val(data);
  });
  dataBind.registerHandler('text', function($el, data) {
    $el.text(data);
  });
  dataBind.registerHandler('html', function($el, data) {
    $el.html(data);
  });
  dataBind.registerHandler('prop', function($el, data) {
    $el.prop(data);
  });
  dataBind.registerHandler('css', function($el, data) {
    $el.css(data);
  });
  dataBind.registerHandler('class', function($el, data) {
    typeof data == 'object'
      ? Array.isArray(data)
        ? data.map(function(klass) {
            $el.addClass(klass);
          })
        : Object.keys(data).map(function(klass) {
            !!data[klass] ? $el.addClass(klass) : $el.removeClass(klass);
          })
      : typeof data == 'string' && $el.addClass(data);
  });

  $.seeBind = dataBind;
})(jQuery);
