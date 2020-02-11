<template>
    <div class="main-content" 
    @mouseleave="handleMouseLeave"
    @keydown.enter="keydownEnterFn">
        <div class="header">
            <el-row class="header-row-one">
                <div class="left">
                    <h1 class="text">Strawberry</h1>
                </div>
                <div class="right">
                    <i class="iconfont icon-quanping" @click.stop="handleOpenFullWindow"></i>
                    <i class="iconfont icon-wenjianjia" @click.stop="openDownloadFile"></i>
                    <div class="header-set">
                        <i class="iconfont icon-shezhi" @click.stop="setterShow=!setterShow"></i>
                    </div>
                </div>
            </el-row>

            <div class="header-search" v-if="imageSource==='paper'">
                <el-select
                    class="header-search-input"
                    v-model="searchKey"
                    size="small"
                    @change="searchKeyFn"
                    @focus="searchKeyFocus=true"
                    @blur="searchKeyFocus=false">
                    <el-option v-for="item in paperClass" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
            </div>

            <div class="header-search" v-else-if="currentImageSource.search">
                <el-input
                    class="header-search-input"
                    v-model="searchKey"
                    placeholder="请输入关键词"
                    size="small"
                    @focus="searchKeyFocus=true"
                    @blur="searchKeyFocus=false"></el-input>
                <i class="iconfont icon-sousuo" @click.stop="searchKeyFn"></i>
            </div>

            <div class="header-tag" v-if="currentImageSource.search&&searchKeyList.length>0">
                <div :class="['header-tag-item',tag === searchKey? 'active' : '']"   
                    v-for="(tag) in searchKeyList" 
                    :key="tag"
                    @click="searchItemClick(tag)"
                >
                    <div class="header-tag-item-text">{{tag}}</div>
                    <span class="header-tag-item-del" @click.stop="searchKeyListDelete(tag)">x</span>
                </div>
            </div>

            <sw-progress v-if="progressValue>0" :value="progressValue" :color="currentImageBacColor"></sw-progress>
        </div>

        <div class="content" :class="{'content-win':osType=='win'}" @scroll="contentScroll">
            <div class="content-main" ref="content_main" v-if="images.length>0">
                <div
                    class="image-item"
                    :ref="'image_item_'+index"
                    v-for="(img,index) in images"
                    :key="index"
                    :style="{'backgroundColor':img.backgroundColor}"
                    @mousemove.stop="currentMouseOverIndex=index,setterShow=false"
                    @mouseleave.stop="currentMouseOverIndex=-1">
                    <div class="image-item-img" v-imagematch="img.url"></div>
                    <div class="image-set-wallpaper" v-show="currentMouseOverIndex==index&&isSetting==false" @click.stop="setWallpaper(img,index)">
                        <i class="iconfont icon-xianshiqi"></i>
                        <span>设置壁纸</span>
                    </div>

                    <div class="image-item-flag" v-show="currentMouseOverIndex==index&&isSetting==false">
                        <div class="image-item-flag-direction" v-show="img.direction==='su'">
                            <i class="iconfont icon-su-ping"></i>
                        </div>
                        <div class="image-item-tip" :style="{'color':img.tip=='5k'?'#e0620d':img.tip=='4k'?'17abe3':'d3217b'}">{{img.tip}}</div>
                    </div>
                </div>
                 <div class="is-loading" v-if="infoShow!==''">
                     <i v-if="getDataFlag" class="el-icon-loading"></i>
                     <span v-html="infoShow"></span>
                </div>
            </div>

            <div class="content-main-no" v-else @mousemove.stop="setterShow=false">
                <span v-html="infoShow"></span>
            </div>
        </div>
        <div class="refresh-btn" :class="{'refresh-btn-ing':refreshBtnIng}">
            <i class="iconfont icon-shuaxin" @click="refreshFn"></i>
        </div>

        <setter
            :class="['setter-content',osType=='mac'?'setter-content-mac':'']"
            :show.sync="setterShow"
            @imageSourceChange="imageSourceChange"
            :getDataFlag="getDataFlag">
        </setter>

    </div>
</template>

<script>
// 在渲染器进程 (网页) 中。
import { mapState, mapActions } from 'vuex'
import { osType, imageSourceType } from '../../utils/utils'
import { version } from '../../../package'
import setter from './setter'
import swProgress from './progress'
import { defaultConfig } from '../../utils/config'


const { shell } = require('electron')
const os = require('os')
const osu = require('node-os-utils')
const macaddress = require('macaddress')
const md5 = require('../../utils/md5').md5_32
const { postRegister, apiStatisticActive } = require('../../api/api')
const { mkdirSync } = require('../../file/file')

const INFOSHOW = {
    loading: '美好的事情即将发生...',
    noData: '暂时没有得到想要的内容...',
    netError: '&nbsp &nbsp &nbsp &nbsp网络暂时发生了错误，请求不到数据了。可能是网络没有正常连接，请确保网络已连接。'
    + '也可能是所选择图库相关接口以修改，请在设置->意见反馈中联系作者，或者在设置中换个图库试试。非常感谢你的支持。',
    null: '',
    noMatchFilter: '请求到了内容但不满足筛选条件，请更换筛选条件...'
}
// 定义存储最近搜索的最大长度
const SEARCHKEYSMAX = 8
const DEFAULTSEARCHLIST = ['cat', 'dog', '沙漠', '自然', '食物']

export default {
    name: 'mainContent',
    components: {
        setter,
        swProgress,
    },
    data() {
        return {
            imageSourceType,
            currentMouseOverIndex: -1, // 当前鼠标在那个图片上
            currentWallpaperIndex: 0, // 当前壁纸的索引
            page: 0, // 请求数据的页数
            progressValue: 0, // 进度值
            searchKey: '', // 搜索关键字
            searchKeyList: DEFAULTSEARCHLIST, // 储存最近搜索的10次关键字
            setterShow: false, // 是否显示设置
            isSetting: false, // 是否正在设置壁纸
            havaDataFlag: true, // 标记是否还有数据
            getDataFlag: false, // 标记页面是否正在请求数据
            searchKeyFocus: false, // 标记当前搜索框是否正在焦点中
            refreshBtnIng: false, // 是否正在刷新
            images: [], // 图片列表
            osType, // 系统类型
            imageSource: 'pexels', // 图片来源
            currentImageBacColor: '#ddd', // 进度条的颜色
            infoShow: INFOSHOW.loading, // 相关提示信息
            paperClass: [], // paper的分类
            config: { ...defaultConfig }
        }
    },

    computed: mapState({
        config: state => state.main.config,
        currentImageSource() { return imageSourceType.find(item => item.value === this.imageSource) }
    }),

    mounted() {
        // 安装量的统计
        this.firstInstall()
        // 获得配置
        const config = this.$localStorage.getStore('userConfig')
        if (config){
            this.config = { ...config }
        }
        this.imageSource = this.config.imageSource
        this.searchKey = this.$localStorage.getStore('searchKey') || ''
        this.searchKeyList = this.$localStorage.getStore('searchKeyList') || DEFAULTSEARCHLIST
        this.images = []
        this.cleartLocalStorage()
        if (this.imageSource === 'paper'){
            this.paperInit()
        }
        this.getData()
        this.eventInit()
        this.domContentMainMatch()
    },

    methods: {
        /**
         * 清除因版本更新后不再使用字段
         */
        cleartLocalStorage(params) {
            this.$localStorage.removeStore('first_install_flag')
            this.$localStorage.removeStore('first_install_flag_v1.1')
        },

        /**
         * 主进程过来的消息事件注册
         * @function eventInit
         */
        eventInit() {
            /**
             * 设置壁纸完成事件
             */
            this.$ipcRenderer.on('dataWallpaper', (event, arg) => {
                // 设置一个时间记录最后更新的时间
                if (arg === 'success') {
                    this.currentWallpaperIndex = this.currentWallpaperIndex + 1
                }
                this.$localStorage.setStore('lastUpdataTime', parseInt((new Date()).getTime() / 1000, 10))
                this.isSetting = false
                this.progressValue = 0
                this.$swLoading.close()
            })

            /**
             * 定时器
             */
            this.$ipcRenderer.on('intervalTime', (event, arg) => {
                this.wallpaperAuto()
                this.firstInstall()

                const nowDate = parseInt((new Date()).getTime() / 1000, 10)
                
                const statisticTimeFlag = this.$localStorage.getStore('statisticTimeFlag')
                if (!statisticTimeFlag) {
                    this.$localStorage.setStore('statisticTimeFlag', nowDate)
                }
                const lastCleararnDownloadFilesTime = this.$localStorage.getStore('lastCleararnDownloadFilesTime')
                if (!lastCleararnDownloadFilesTime) {
                    this.$localStorage.setStore('lastCleararnDownloadFilesTime', nowDate)
                }

                // 2小时 统计日活
                if (nowDate - statisticTimeFlag >= 2 * 60 * 60) {
                    apiStatisticActive({
                        uid: this.$localStorage.getStore('osInfoUid'),
                        version
                    })
                    this.$localStorage.setStore('statisticTimeFlag', nowDate)
                }
                // 7天 自动清除已下载
                if (nowDate - lastCleararnDownloadFilesTime >= (this.config.autoClearnDownloadFilesTime || 7) * 24 * 60 * 60) {
                    this.$localStorage.setStore('lastCleararnDownloadFilesTime', nowDate)
                    // 删除默认文件下的所有内容
                    this.$ipcRenderer.send('btn', {
                        type: 'deleteFile',
                        data: this.config.downloadImagePath
                    })
                }
            })

            /**
             * 数据相关事件
             */
            this.$ipcRenderer.on('datainfo', (event, { type = '', data }) => {
                // 获得了接口列表
                if (type === 'urls') {
                    this.getDataFlag = false
                    this.infoShow = INFOSHOW.null
                    this.refreshBtnIng = false
                    if (data.length === 0) {
                        // this.havaDataFlag = false
                        this.infoShow = INFOSHOW.noData
                        return
                    }
                    if (this.page === 0) {
                        this.domContentMainMatch()
                        this.images = []
                    }
                    this.urlsDeal(data)
                }
                else if (type === 'urlsError'){
                    this.refreshBtnIng = false
                    this.getDataFlag = false
                    this.infoShow = INFOSHOW.netError
                }
                // 主窗口显示|隐藏
                else if (type === 'windowShow') {
                    if (data) {
                        this.setterShow = false
                    } else {
                        this.setterShow = false
                    }
                }
                // 更新进度条
                else if (type === 'updaterProgress') {
                    this.progressValue = data
                    if (this.progressValue >= 100) {
                        const time = setTimeout(() => {
                            clearTimeout(time)
                            this.progressValue = 0
                        }, 1000)
                    }
                }
            })
        },

        domContentMainMatch(){
            this.$nextTick(() => {
                if (this.$refs.content_main){
                    this.$refs.content_main.style.paddingTop = `${document.querySelector('.header').offsetHeight}px`
                }
            })
        },

        /**
         * enter按键 搜索
         * @function keydownEnterFn 
         */
        keydownEnterFn() {
            if (this.searchKeyFocus) {
                this.searchKeyFn()
            }
        },

        /**
         * 检测首次安装
         * @function firstInstall
         */
        firstInstall() {
            // 第一次注册
            function getMacAddress() {
                return new Promise((resolve, reject) => {
                    macaddress.one((err, mac) => {
                        if (err) {
                            reject()
                        } else {
                            resolve(mac)
                        }
                    })
                })
            }
            if (this.$localStorage.getStore('first_install_flag_v1.1.1') !== 'strawberrywallpaper') {
                Promise.all([osu.osCmd.whoami(), osu.os.oos(), osu.os.arch(), getMacAddress()]).then((result) => {
                    const [userName, oss, arch, mac] = result
                    const time = (new Date()).getTime()
                    const data = {
                        username: userName.replace('\n', '').replace('\r', ''), // 用户名
                        version, // 软件版本
                        uid: md5(`${userName}${oss}${arch}${mac}`), // 软件唯一ID,
                    }
                    postRegister(data).then((res) => {
                        this.$localStorage.setStore('osInfo', data)
                        this.$localStorage.setStore('osInfoUid', data.uid)
                        this.$localStorage.setStore('first_install_flag_v1.1.1', 'strawberrywallpaper')
                    })
                })
            }
        },

        /**
         * 返回随机颜色值
         * @function randomColor
         */
        randomColor() {
            return `#${Math.floor(Math.random() * 0xffffff).toString(16)}`
        },

        /**
         * 设置壁纸
         * @function setWallpaper
         * @param {Object} img 当前图片数据
         * @param {Number} index 数组索引
         * @param {Boolearn} isAutoSet 是否是自动设置触发的
         */
        setWallpaper(img, index, isAutoSet = false) {
            this.isSetting = true
            this.setterShow = false
            if (!this.$refs[`image_item_${index}`][0]) {
                return
            }
            const { wallpaperScale } = this.config
            this.$swLoading.open(this.$refs[`image_item_${index}`][0])
            this.$ipcRenderer.send('dataWallpaper', { ...img, options: { scale: wallpaperScale, isAutoSet } })
            this.currentImageBacColor = this.images[index].backgroundColor
            this.currentWallpaperIndex = index
        },

        /**
         * 打开图片存的文件夹
         * @function openDownloadFile
         */
        openDownloadFile() {
            // 判断是否有文件夹
            mkdirSync(this.config.downloadImagePath)
            shell.openItem(this.config.downloadImagePath)
        },

        /**
         * 打开图片存的文件夹
         * @function openDownloadFile
         */
        handleOpenFullWindow(){
            this.$ipcRenderer.send('fullWindow', true) // 打开全屏 ， false 关闭全屏
        },

        /**
         * 判断图片质量
         * @function imageTip
         * @param {Number} width 宽
         * @param {Number} height 高
         */
        imageTip(width, height) {
            const val = parseInt(width, 10) * parseInt(height, 10)
            if (val > 5120 * 2880) {
                return '5k'
            }
            if (val > 4096 * 2160) {
                return '4k'
            }
            return '2k'
        },

        /**
         * 判断图片是横图还是竖图
         * @function imageDirection
         */
        imageDirection(width, height) {
            return width >= height ? 'heng' : 'su'
        },

        /**
         * 刷新
         * @function refreshFn
         */
        refreshFn() {
            if (this.refreshBtnIng === false) {
                this.destroyAll()
                this.page = 0
                this.images = []
                this.getData()
            }
            this.isSetting = false
            this.refreshBtnIng = true
            // 设置一个时间记录最后更新的时间
            this.$localStorage.setStore('lastUpdataTime', parseInt(new Date().getTime() / 1000, 10))
            this.isSetting = false
            this.$swLoading.close()
        },

        /**
         * 中断所有的请求
         * @function destroyAll
         */
        destroyAll() {
            this.progressValue = 0
            this.isSetting = false
            this.setterShow = false
            this.$swLoading.close()
            this.$ipcRenderer.send('cancelAllRequest', true) // 取消所有请求
        },

        /** 壁纸自动更新 */
        wallpaperAuto() {
            const userConfig = this.$localStorage.getStore('userConfig')
            // 如果正在设置,则弹出去
            if (this.isSetting === true || this.images.length === 0) {
                return
            }
            // 自动设置壁纸的时候还剩下5张就请求下一页
            if (this.havaDataFlag && this.currentWallpaperIndex === this.images.length - 5) {
                this.page = this.page + 1
                this.getData()
            }
            if (userConfig.wallpaperAutoUp === true) {
                if (this.$localStorage.getStore('lastUpdataTime')) {
                    const currentTime = parseInt(new Date().getTime() / 1000, 10)
                    // eslint-disable-next-line no-restricted-globals
                    if (!isNaN(parseInt(userConfig.updataTime, 10))) {
                        let time = this.$localStorage.getStore('lastUpdataTime')
                        time = parseInt(time, 10)
                        const updataTime = parseInt(userConfig.updataTime, 10)
                        if (Math.abs(currentTime - time) > updataTime) {
                            const index = this.images[this.currentWallpaperIndex] ? this.currentWallpaperIndex : 0
                            this.setWallpaper(this.images[index], index, true)
                        }
                    }
                }
            }
        },

        /**
         * 搜索按钮
         * @function searchKeyFn
         */
        searchKeyFn() {
            this.$localStorage.setStore('searchKey', this.searchKey)
            if (!this.searchKeyList.includes(this.searchKey) && this.searchKey !== ''){
                this.domContentMainMatch()
                this.searchKeyList.unshift(this.searchKey)
                if (this.searchKeyList.length > SEARCHKEYSMAX){
                    this.searchKeyList.pop()
                }
                this.$localStorage.setStore('searchKeyList', this.searchKeyList)
            }
            this.destroyAll()
            this.images = []
            this.getData()
        },

        searchItemClick(tag){
            console.log(tag)
            
            this.searchKey = tag
            this.searchKeyFn()
        },

        /**
         * 改变图片来源
         * @function imageSourceChange
         */
        imageSourceChange(val) {
            this.destroyAll()
            this.imageSource = val
            this.page = 0
            this.images = []
            window.setTimeout(() => {
                this.getData()
            }, 100)
        },

        /**
         * 对获取到的地址进行处理
         * @function urlsDeal
         */
        urlsDeal(urls) {
            urls.forEach((e) => {
                const obj = {
                    url: e.url,
                    name: '',
                    tip: this.imageTip(e.width, e.height),
                    direction: this.imageDirection(e.width, e.height),
                    downloadUrl: e.downloadUrl,
                    width: e.width,
                    height: e.height,
                    backgroundColor: this.randomColor()
                }
                const { wallpaperSizeWidth = 1600, wallpaperSizeHeight = 1080, wallpaperSizeDirection = [] } = this.config
                const { width, height, direction } = obj
                if (width > wallpaperSizeWidth && height > wallpaperSizeHeight 
                && (wallpaperSizeDirection.length === 0 || wallpaperSizeDirection.includes(direction))) 
                { this.images.push(obj) }
            })
            if (this.images.length === 0){
                this.infoShow = INFOSHOW.noMatchFilter
            }
        },

        /**
         * 滚动条事件,请求下一页
         * @function contentScroll
         * @param {Object} event 事件
         */
        contentScroll(event) {
            const el = event.srcElement || event.target
            if (this.havaDataFlag === true && this.getDataFlag === false) {
                this.$nextTick(() => {
                    if (el.scrollTop + 1800 > el.querySelector('.content-main').clientHeight) {
                        this.page = this.page + 1
                        this.getData()
                    }
                })
            }
        },

        /**
         * 获取数据接口
         * @function getData
         */
        async getData() {
            this.getDataFlag = true
            this.infoShow = INFOSHOW.loading
            const obj = {
                searchKey: this.searchKey,
                page: this.page,
                imageSource: this.imageSource
            }
            this.$ipcRenderer.send('getImageUrls', obj)
        },

        handleMouseLeave(){
            if (this.setterShow){
                this.setterShow = false
            }
        },

        searchKeyListDelete(tag){
            this.searchKeyList = this.searchKeyList.filter(i => i !== tag)
            this.domContentMainMatch()
        },

        paperInit(){
            if (this.paperClass.length === 0){
                // 发送同步消息，主进程通过returnValue返回 [注意：同步消息会阻塞渲染进程，会阻塞。也就是在此期间渲染进程什么都干不了！！干不了！！]
                this.paperClass = this.$ipcRenderer.sendSync('runFunc', 'getPaperSetting')
                if (this.paperClass.length){
                    this.searchKey = this.paperClass[0].value
                }
                else {
                    window.setTimeout(() => {
                        this.searchKey = ''
                        this.refreshBtnIng = false
                        this.getDataFlag = false
                        this.infoShow = INFOSHOW.netError
                    }, 100)
                }
            }
        }
    },
    watch: {
        imageSource(val, oldVal) {
            if (val === 'paper') {
                this.paperInit()
            }
        },
    }
}
</script>

<style lang="less" scoped>
.setter-content {
    top: 45px;

    &.setter-content-mac {
        top: 55px;
    }
}

.main-content {
    position: relative;
    box-sizing: border-box;
    background-color: transparent;
    // padding-top: 30px;
    width: 100%;
    height: 100%;
    overflow: hidden;

    // background-color: red;
    .header {
        position: fixed;
        z-index: 3000;
        background-color: rgba(34, 34, 34, 0.9);
        width: 100%;
        min-height: 50px;
        overflow: hidden;
        padding-right: 20px;
        padding-left: 20px;

        .header-row-one {
            display: flex;
            justify-content: space-between;
            width: 100%;
            height: 56px;

            .left {
                position: relative;
                width: 100%;
                height: 100%;

                .text {
                    cursor: default;
                    color: #dddddd;

                    user-select: none;
                    // z-index: 2;
                }
            }
        }

        .iconfont {
            margin-left: 10px;
            color: #dddddd;
        }

        .left {
            flex: auto;
        }

        .right {
            display: flex;
            flex: none;
            align-items: center;
        }

        .header-set {
            position: relative;
        }

        .header-search {
            display: flex;
            align-items: center;
            position: relative;
            width: 100%;
            padding-bottom: 6px;

            .header-search-input {
                flex: none;
                width: 100%;
            }

            .iconfont {
                position: absolute;
                right: 5px;
            }
        }

        .header-tag {
            display: flex;
            flex-wrap: wrap;
            cursor: default;
            padding: 5px 0;

            user-select: none;

            .header-tag-item {
                position: relative;
                height: 20px;
                padding: 0 6px;
                line-height: 20px;
                color: #a5a5a5;
                font-size: 12px;

                .header-tag-item-text {
                    width: auto;
                    max-width: 100px;
                    height: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .header-tag-item-del {
                    display: none;
                    position: absolute;
                    top: -2px;
                    right: -3px;
                    border-radius: 100%;
                    background-color: rgba(#aaaaaa, 0.6);
                    width: 12px;
                    height: 12px;
                    text-align: center;
                    line-height: 12px;
                    font-size: 12px;
                }

                &:hover {
                    color: #dddddd;
                    font-weight: bold;

                    .header-tag-item-del {
                        display: inline-block;
                    }
                }
            }

            .active {
                color: #dddddd;
                font-weight: bold;
            }
        }
    }

    .content {
        border-radius: 5px;
        background-color: #222222;
        width: calc(~"100% + 15px");
        height: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
        padding: 1px;

        .image-item {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            border-bottom: 1px solid #bbbbbb;
            width: 100%;
            height: 180px;

            .image-item-img {
                width: 100%;
                height: 100%;
                overflow: hidden;
            }

            .image-set-wallpaper {
                position: absolute;
                border-radius: 15px;
                background-color: rgba(0, 0, 0, 0.4);
                cursor: default;
                width: auto;
                width: 120px;
                height: 33px;
                text-align: center;
                line-height: 33px;
                color: #dddddd;

                .iconfont {
                    margin-right: 8px;
                }
            }

            .image-set-wallpaper:hover {
                background-color: rgba(0, 0, 0, 0.7);
            }

            .image-item-flag {
                display: flex;
                justify-content: flex-end;
                position: absolute;
                top: 10px;
                right: 14px;
                width: auto;
                height: 26px;

                .image-item-flag-direction {
                    margin-right: 10px;
                    border-radius: 4px;
                    background-color: rgba(0, 0, 0, 0.6);
                    cursor: default;
                    width: 26px;
                    height: 26px;
                    text-align: center;
                    line-height: 26px;
                    color: #dddddd;
                    font-size: 12px;
                }

                .image-item-tip {
                    border-radius: 4px;
                    background-color: rgba(0, 0, 0, 0.6);
                    cursor: default;
                    width: 26px;
                    height: 26px;
                    text-align: center;
                    line-height: 26px;
                    color: #52b7fc;
                    font-size: 12px;
                }
            }

            .image-item-tip {
                border-radius: 4px;
                background-color: rgba(0, 0, 0, 0.6);
                cursor: default;
                width: 26px;
                height: 26px;
                text-align: center;
                line-height: 26px;
                color: #52b7fc;
                font-size: 12px;
            }
        }

        .is-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 40px;
            color: #dddddd;
            font-size: 12px;

            i {
                margin-right: 5px;
                font-size: 16px;
            }
        }
    }

    .content-win {
        width: calc(~"100% + 17px");
    }

    .content-main {
        padding-top: 96px;
    }

    .content-main-no {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 20px;
        line-height: 20px;
        color: #cccccc;
        font-size: 12px;
    }
}

.refresh-btn {
    position: fixed;
    bottom: 8px;
    left: 14px;
    z-index: 999;
    color: #dddddd;

    .iconfont {
        font-size: 24px;
    }
}

.refresh-btn-ing {
    transform: rotate(360deg);
    transform-origin: center center;

    animation: refreshbtning 1.5s linear infinite;
}

@keyframes refreshbtning {
    0% {
        transform: rotate(360deg);
    }

    100% {
        transform: rotate(0);
    }
}

</style>
