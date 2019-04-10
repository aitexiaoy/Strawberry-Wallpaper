/** *
 * 动态的创建script标签
 */

function loadJs({
    url,
    options = {}
}) {
    return new Promise((resolve, reject) => {
        if (!url) {
            reject(new Error('NO URL'))
        }
        const timeout = options.timeout || 60000
        const target = document.getElementsByTagName('head')[0] || document.head
        let timer; let 
            script
        // 超时自动取消
        if (timeout) {
            timer = setTimeout(() => {
                // eslint-disable-next-line no-use-before-define
                cleanup()
                reject(new Error('Timeout'))
            }, timeout)
        }
        // 清理函数
        function cleanup() {
            if (script.parentNode) {
                script.parentNode.removeChild(script)
            }
            if (timer) {
                clearTimeout(timer)
            }
        }
        // 创建js文件
        script = document.createElement('script')
        script.type = 'text/javascript'
        script.charset = 'utf-8'
        script.async = true
        script.src = url
        target.appendChild(script)
        // IE的script 元素支持onreadystatechange事件，不支持onload事件 FF的script
        // 元素不支持onreadystatechange事件，只支持onload事件
        // eslint-disable-next-line no-multi-assign
        script.onload = script.onreadystatechange = function () {
            if (!script.readyState || script.readyState === 'loaded' || script.readyState === 'complete') {
                resolve()
                if (timer) {
                    clearTimeout(timer)
                }
            }
        }
    })
} 

export default loadJs
