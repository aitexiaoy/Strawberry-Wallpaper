
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

Works on macOS 10.12+, and Windows 10, Windows7.

目前只在mac10.14.3与win10上进行了测试

#### 1.安装软件

提供两个打包好的下载地址:

[Strawberry Wallpaper-mac](http://sw.taoacat.com/Strawberry%20Wallpaper-mac.dmg) 

[Strawberry Wallpaper-win](http://sw.taoacat.com/Strawberry%20Wallpaper-win.exe)


#### 2.软件介绍

【软件主页】

用于显示壁纸照片，可以切换图库，可以进行关键词搜索。

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

> v1.0.0
- 修改mac下的图标颜色
- 增加pap.er壁纸库
- 增加自动设置壁纸的超时取消
- 增加eslint对代码进行了格式上的更改
- 增加设置壁纸失败的处理
- 修改pexels在某些情况下的Bug

> 1.1.0
- 增加自定义设置图片的保存目录
- 增加统计用户安装量接口以及用户留存情况统计(去除之前的邮件统计)
- 增加定时移除图片设置，7天为周期移除已保存的图片
- 增加unsplash图库
- 增加图片列表最小宽度1600px的限制
- 优化页面数据处理逻辑
- 修复自动命名出现NaN的bug
- 修改定时功能逻辑，解决在mac下定时更新失败的问题

> 1.1.1
- 采用新规则生成软件的uid，存储字段：first_install_flag_v1.1.1

> 1.2.0
- 针对已经设置完壁纸的图片做缓存处理，不再继续下载
- 修改意见反馈页面
- 修改pexels地址变化带来的图片加载不出来Bug，优化pexels爬虫逻辑
- 增加下一页请求中提示，增加请求失败提示。
- 增加搜索中文关键词的支持
- 修改Paper的图库处理，对标Paper3.3
- 修复在多显示器纵轴方向拼接时，定位不对问题。

> 1.3.0
- 修改用户反馈意见目标邮箱，增加输入校验
- 增加自定义设置壁纸时间
- 增加保存最近搜索词，可作为快速分类
- 增加wallhaven图库

> 1.3.1
- 增加NASA图库
- 增加电影壁纸图库themoviedb

> 1.3.2
- 修复pexels与500px壁纸库加载失败问题


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