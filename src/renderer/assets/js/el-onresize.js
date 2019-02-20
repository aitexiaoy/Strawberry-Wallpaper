/***
 * 监听元素尺寸变化
 * 原理参见：https://blog.crimx.com/2017/07/15/element-onresize/
 * 原理参见:https://codepen.io/straybugs/full/mwgWad/
 * 相关讨论参见：https://segmentfault.com/q/1010000010192841?sort=created
 * 使用: 
 * import onresize from './el-onresize.js'
 * 绑定事件
 * onresize.$on(el,callback);
 * 注销事件
 * onresize.$off();
 * 
 */



function ElOnResize() {


  var onResize = null;
  var onScroll = null;

  var expand = null;
  var shrink = null;

  // scroll passive events
  var passiveEvents = false;
  try {
    var opts = Object.defineProperty({}, 'passive', {
      get: function get() {
        passiveEvents = {
          passive: true
        };
      }
    });

    window.addEventListener('test', null, opts);
  } catch (e) {}

  this.$on = function (el, handler) {
    if (!(el instanceof HTMLElement)) {
      throw new TypeError("Parameter 1 is not instance of 'HTMLElement'.");
    }
    // https://www.w3.org/TR/html/syntax.html#writing-html-documents-elements
    if (/^(area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr|script|style|textarea|title)$/i.test(el.tagName)) {
      throw new TypeError('Unsupported tag type. Change the tag or wrap it in a supported tag(e.g. div).');
    }
    if (typeof handler !== 'function') {
      throw new TypeError("Parameter 2 is not of type 'function'.");
    }


    var lastWidth = el.offsetWidth || 1;
    var lastHeight = el.offsetHeight || 1;
    var maxWidth = 10000 * lastWidth;
    var maxHeight = 10000 * lastHeight;

    expand = document.createElement('div');
    expand.style.cssText = 'position:absolute;top:0;bottom:0;left:0;right:0;z-index=-10000;overflow:hidden;visibility:hidden;';
    shrink = expand.cloneNode(false);

    var expandChild = document.createElement('div');
    expandChild.style.cssText = 'transition:0s;animation:none;';
    var shrinkChild = expandChild.cloneNode(false);

    expandChild.style.width = maxWidth + 'px';
    expandChild.style.height = maxHeight + 'px';
    shrinkChild.style.width = '250%';
    shrinkChild.style.height = '250%';

    expand.appendChild(expandChild);
    shrink.appendChild(shrinkChild);
    el.appendChild(expand);
    el.appendChild(shrink);

    if (expand.offsetParent !== el) {
      el.style.position = 'relative';
    }

    expand.scrollTop = shrink.scrollTop = maxHeight;
    expand.scrollLeft = shrink.scrollLeft = maxWidth;

    var newWidth = 0;
    var newHeight = 0;

    onResize = function () {
      if (newWidth !== lastWidth || newHeight !== lastHeight) {
        lastWidth = newWidth;
        lastHeight = newHeight;
        handler();
      }
    }

    onScroll = function () {
      newWidth = el.offsetWidth || 1;
      newHeight = el.offsetHeight || 1;
      if (newWidth !== lastWidth || newHeight !== lastHeight) {
        requestAnimationFrame(onResize);
      }
      expand.scrollTop = shrink.scrollTop = maxHeight;
      expand.scrollLeft = shrink.scrollLeft = maxWidth;
    }
    expand.addEventListener('scroll', onScroll, passiveEvents);
    shrink.addEventListener('scroll', onScroll, passiveEvents);
  };

  this.$off = function () {
    try {
      expand.removeEventListener('scroll', onScroll);
      shrink.removeEventListener('scroll', onScroll);
      window.addEventListener('test', null);
    } catch (error) {
      
    }
  }
}


export default new ElOnResize();
