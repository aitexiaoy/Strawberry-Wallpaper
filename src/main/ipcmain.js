const {ipcMain} =require('electron');
ipcMain.on('dataWallpaper', (event, arg) => {
    // downloadPic(arg.downloadUrl, function (result) {
    //   setOnCurrentSpace(result);
    //   event.sender.send('dataWallpaper', 'success');
    // });
  })
  
  ipcMain.on('getImageUrls', (event, data) => {
    get_urls(data).then(result => {
      mainWindow.webContents.send('datainfo', {
        type: 'urls',
        data: result
      })
    })
    log.info(data);
  })
  
  ipcMain.on('btn', (event, data) => {
    log.info(data);
    if (data.type == 'quit') {
      app.quit();
    } else if (data.type == 'searchKey') {
  
    } 
    else if (data.type == 'openStart') {
      if (data.data) {
        open_autoStart();
      } else {
        open_disStart();
      }
    }
    else if(data.type=='openChildren'){
      if(data.data){
        showChildrenWinndow()
      }
      else{
        hideChildrenWindow()
      }
    }
    else if(data.type=='newEmail'){
      newEmail(data.data.html,data.data.telUser,{
        version:version,
      }).then(result=>{
        event.sender.send('sendnewEmail', 'success');
      }).catch(error=>{
        event.sender.send('sendnewEmail', 'error',error);
      })
    }
    else if(data.type=='check_newVersion'){
      autoUpdater.checkForUpdates().then(result=>{
        log.error('----------yyyyy')
        log.error(result);
        mainWindow.webContents.send('check_newVersion', {'type':'lll',data:result});
  
      }).catch(error=>{
        log.error('-----------xxxx')
        mainWindow.webContents.send('check_newVersion', {'type':'ierr',data:error});
  
        log.error(error)
      })
    }
  })
  
  