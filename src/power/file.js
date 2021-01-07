const electron = require('electron')

const { dialog } = electron
function setDownloadPath(mainWindow, defaultPath){
    mainWindow.setAlwaysOnTop(false)
    dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory', 'createDirectory', 'promptToCreate'], 
        message: '选择要下载图片所在文件夹',
        defaultPath,
    }).then(({ paths }) => {
        mainWindow.setAlwaysOnTop(true)
        if (paths){
            // 清空原目录中的文件
            // delPath(data.data)
            mainWindow.sendData('defaultPath', paths[0])
        }
    })
}
