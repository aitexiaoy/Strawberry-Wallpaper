export default {
    install(Vue, options) {
    // tip 的展示方向
        Vue.directive('imagematch', {
            bind(el, binding) {
                const matchType = ['width', 'height', 'auto'];
                const q = matchType.filter(placement => binding.modifiers[placement]);
                let time = 0;
                el._type = q.length ? q[0] : 'auto';

                // eslint-disable-next-line camelcase
                function _choponent_size_fn(e) {
                    const parentWidth = el.clientWidth;
                    const parentHeight = el.clientHeight;
                    
                    // 宽度与高度自适应
                    if (el._type === 'auto') {
                        if (parentWidth / parentHeight > el._childrenWidth / el._childrenHeight) {
                            children.style.cssText = `width:${`${parentWidth}px`};
                            height:auto;
                            transform: translateY(${`${(el._childrenHeight - (parentHeight * el._childrenWidth / parentWidth)) / 2 / (el._childrenWidth / parentWidth) * -1}px`});`
                        } else {
                            children.style.cssText = `width:auto;
                            height:${`${parentHeight}px`};
                            transform: translateX(${`${(el._childrenWidth - (parentWidth * el._childrenHeight / parentHeight)) / 2 / (el._childrenHeight / parentHeight) * -1}px`});`
                        }
                    }
        
                    // 宽度适应尺寸,高度自动
                    else if (el._type === 'width') {
                        children.style.cssText = `width:${`${parentWidth}px`};height:auto;`
                    }
                    
                    // 高度适应尺寸，宽度自动
                    else if (el._type === 'height') {
                        children.style.cssText = `width:auto;height:${`${parentHeight}px`};`
                    }
                }

                el._choponent_size = function (e) {
                    // if(time!=0){
                    //   return;
                    // }
                    time = window.setTimeout(() => {
                        window.clearTimeout(time);
                        time = 0;
                        _choponent_size_fn(e);
                    }, 100)
                }

                let children = document.createElement('img');
                children.src = binding.value;
                el.appendChild(children);
                children.onload = function () {
                    el._childrenWidth = children.width;
                    el._childrenHeight = children.height;
                    el._children = children;
                    _choponent_size_fn();
                    window.addEventListener('resize', () => {
                        el._choponent_size();
                    })
                }

                // window.addEventListener('resize', el._choponent_size);
            },
            inserted(el, binding) {

            },

            update(el) {

            },
            componentUpdated(el, binding) {


            },

            unbind(el) {
                if (el._choponent_size) {
                    window.removeEventListener('resize', el._choponent_size);
                }
            }
        })
    }
}
