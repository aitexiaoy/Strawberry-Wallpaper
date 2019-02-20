var AutoLaunch = require('auto-launch');

var minecraftAutoLauncher = new AutoLaunch({
    name: 'Strawberry Wallpaper',
    path: '/Applications/Strawberry Wallpaper.app',
});
 
export const open_autoStart=function(){
  return  minecraftAutoLauncher.enable();   //设置开机自动启动
}

export const open_disStart=function(){
    return minecraftAutoLauncher.disable();   //禁止开机自动启动
}

export const open_type=async function(){
    return await minecraftAutoLauncher.isEnabled();
}