### 软件在window下会存在重复运行的问题
即双击打开软件，在windows下会创建一个新的运行程序。

#### 解决方法
```js
// 创建程序锁，保证只能打开单个实例 
if (isWin) {
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

### 远程升级相关问题
#### 1.远程升级只能在build后生效
#### 2.mac端远程升级需要development ID 到官网申请
#### 3.安装最新的electron-update后，运行提示缺少`whenReady()`方法，那是因为`electron-vue`的`electron`版本为2.7的而`whenReady()`为electron3.0.0更新的。解决办法就是升级electron
