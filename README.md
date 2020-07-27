
## Strawberry Wallpaper 草莓壁纸🍓

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

Works on macOS 10.12+, and Windows 10+.

目前只在mac10.14.3与win10上进行了测试

#### 1.安装软件

提供两个打包好的下载地址:

[Strawberry Wallpaper-mac](http://sw.taoacat.com/Strawberry%20Wallpaper-mac.dmg)

[Strawberry Wallpaper-win](http://sw.taoacat.com/Strawberry%20Wallpaper-win.exe)

macOS可以使用[homebrew](https://brew.sh/index_zh-cn)进行安装：

```bash
brew cask install strawberry-wallpaper
```

#### 2.软件介绍

【软件主页】

用于显示壁纸照片，可以切换图库，可以进行关键词搜索，并可存储最近搜索的关键词。

<img src="http://file.qiniu.taoacat.com/stwallpaper-1.png" width="300px" />

【设置】

<img src="http://file.qiniu.taoacat.com/stwallpaper-2.png" width="300px" />


【检测更新】

<img src="http://file.qiniu.taoacat.com/stwallpaper-3.png" width="500px" />


【意见反馈】

<img src="http://file.qiniu.taoacat.com/stwallpaper-4.png" width="500px" />

【公告】

<img src="http://file.qiniu.taoacat.com/stwallpaper-5.png" width="500px" />

【网页模式】

可在网页中对图库图片进行搜索、下载、设置为壁纸

<img src="http://file.qiniu.taoacat.com/stwallpaper-6.png" width="700px" />


## 更新日志

> v1.4.2
- 修复1.4.1已知问题

> v1.4.1
- 修复新安装用户不能设置壁纸问题

> v1.4
- 修复pexels图库加载不成功问题
- 增加设置壁纸的填充方式（mac下有效）
- 增加是否自动应用到所有屏幕设置（mac下有效）
- 增加壁纸方向与尺寸的筛选
- 增加网页模式，网页模式下加载相关网页，并可直接在网页中可以下载图片到本地以及设置壁纸
- 增加公告展示


[历史更新](./update-log.md)


## 用户统计
草莓壁纸会针对用户安装量以及用户的活跃量进行统计，根据用户的网卡信息生成唯一UID。统计信息只获取用户的电脑系统，用户电脑用户名。
可以打开[草莓壁纸后台统计平台](http://sw.taoacat.com)进行查看相关统计数据。后台统计相关接口采用go语言开发，[项目地址](https://github.com/wangkaibo/strawberry-wallpaper)：https://github.com/wangkaibo/strawberry-wallpaper 欢迎点赞，支持。

## LICENSE

MIT

## 点👍

如果觉得本项目不错，请点击页面右上角的的小星星。也可以为作者点👍，欢迎打赏。

![👍](http://file.qiniu.taoacat.com/github-start.png)

<img src="http://file.qiniu.taoacat.com/wechat-money.png" width="200px" />

## 感谢
- vue
- electron
- vue-electron
- ...
