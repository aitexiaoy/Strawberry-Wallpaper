/***
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
      let timeout = options.timeout || 60000
      let target = document.getElementsByTagName('head')[0] || document.head
      let timer, script
      // 超时自动取消
      if (timeout) {
        timer = setTimeout(() => {
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