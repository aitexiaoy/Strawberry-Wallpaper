### 软件在window下会存在重复运行的问题
即双击打开软件，在windows下会创建一个新的运行程序。

#### 解决方法
```js
// 创建程序锁，保证只能打开单个实例 
if (isWin()) {
        const gotTheLock = app.requestSingleInstanceLock()
        if (!gotTheLock) {
            app.quit()
        } else {
            app.on('second-instance', (event, commandLine, workingDirectory) => {
                if (mainWindow) {
                    if (!mainWindow.isVisible()) {
                        mainWindowShow()
                    }
                    mainWindow.focus()
                }
            })
        }
    }
```

### win.setPosition方法报错
##### 原因：setPosition方法中的参数不支持浮点数，只支持整数