
## Strawberry Wallpaper 草莓壁纸

> 采用electron-vue开发的壁纸应用
> 本应用相关图片都源自于网络，壁纸图片的一切版权归壁纸来源网站所有，切不可将版权图片作为商用。


#### 开发
```
npm install
npm run dev
```
#### 打包
1.先执行webpack打包页面
```
npm run build
```
2.按平台打包 `electron-builder` 会默认当前平台进行打包
```
npm run build-mac
npm run build-win
```

## 使用说明

### 1.适用范围

Works on macOS 10.12+, and Windows 10, Windows7.

目前只在mac10.14.3与win10上进行了测试

#### 1.安装软件

提供两个打包好的下载地址:

[Strawberry Wallpaper-mac](https://swallpaper.oss-cn-beijing.aliyuncs.com/Strawberry%20Wallpaper-mac.dmg) 

[Strawberry Wallpaper-win](https://swallpaper.oss-cn-beijing.aliyuncs.com/Strawberry%20Wallpaper-win.exe)


#### 2.软件介绍

【软件主页】

用于显示壁纸照片，可以进行关键词搜索[目前只支持英文关键词搜索]。

<img src="http://file.qiniu.taoacat.com/stwallpaper-1.png" width="300px" />

【设置页面可进行简单的设置】

<img src="http://file.qiniu.taoacat.com/stwallpaper-2.png" width="300px" />


【检测更新】

<img src="http://file.qiniu.taoacat.com/stwallpaper-3.png" width="500px" />


【意见反馈】

<img src="http://file.qiniu.taoacat.com/stwallpaper-4.png" width="500px" />


## 更新日志

> v0.0.1发行版
- 动态更新壁纸
- 设置开机启动
- 意见反馈
- 自动更新
- 支持win10

> v0.0.2
- 修改win下主窗口的显示位置，win7测试成功

> v0.0.3
- 增加壁纸来源的选择，增加500px壁纸来源

> v0.0.4
- 增加软件初次安装数统计

> v0.0.5
- 增加图片下载以及软件更新下载进度条(进度条颜色随机，部分时候可能不便于显示)
- 解决在部分电脑下主窗口显示定位问题
- 优化mac下主窗口显示,增加小三角。增加软件开启过渡动画。
- 解决在win下多实例打开的问题

> v0.0.6
- 修改采用500px图库预案的时候加载的为大尺寸的问题
- 增加刷新按钮
- 修改预览图片重复问题

> v0.0.7
- 增加相关接口的取消操作
- 解决pexels图库的图片重复问题

> v0.0.8
- 修改搜索不能搜索的Bug

> v1.0
- 修改mac下的图标颜色
- 增加pap.er壁纸库
- 增加自动设置壁纸的超时取消

## 待开发功能

- 针对图片库处理，尽量剔除已使用过的图片

## 开发采坑

很多坑，容我细细道来。

## LICENSE

MIT

## 点👍

如果觉得本项目不错，请点击页面右上角的的小星星。也可以为作者点👍，欢迎打赏。

![👍](http://file.qiniu.taoacat.com/github-start.png)

<img src="http://file.qiniu.taoacat.com/wechat-money.png" width="200px" />
