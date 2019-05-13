<template>
<div class="main-content" @keydown.enter="keydownEnterFn">
    <el-collapse-transition>
        <setter 
        class="setter-content" 
        :class="{'setter-content-mac':osType=='mac'}" 
        v-show="setterShow" 
        @imageSourceChange="imageSourceChange"  
        :getDataFlag="getDataFlag"></setter>
    </el-collapse-transition>
    <!-- mac下显示三角 -->
    <div class="sanjiao" v-if="osType=='mac'"></div>
    <div class="image-main-content" :class="{'image-main-content-mac':osType=='mac'}">
        <div class="header">
            <el-row class="header-row-one">
                <div class="left">
                    <h1 class="text">Strawberry</h1>
                </div>
                <div class="right">
                    <i class="iconfont icon-wenjianjia" @click.stop="openDownloadFile"></i>
                    <div class="header-set">
                        <i class="iconfont icon-shezhi" @click.stop="setterShow=!setterShow"></i>
                    </div>
                </div>
            </el-row>

            <div class="header-search" v-if="imageSource==='paper'">
                <el-select class="header-search-input" v-model="searchKey" size="small" @change="searchKeyFn" @focus="searchKeyFocus=true" @blur="searchKeyFocus=false">
                    <el-option label="最新" :value="'latest'"></el-option>
                    <el-option label="最热" :value="'popular'"></el-option>
                </el-select>
            </div>

            <div class="header-search" v-else>
                <el-input class="header-search-input" v-model="searchKey" placeholder="关键词[英文]" size="small" @focus="searchKeyFocus=true" @blur="searchKeyFocus=false"></el-input>
                <i class="iconfont icon-sousuo" @click.stop="searchKeyFn"></i>
            </div>

            <sw-progress v-if="progressValue>0" :value="progressValue" :color="currentImageBacColor"></sw-progress>
        </div>

        <div class="content" :class="{'content-win':osType=='win'}" @scroll="contentScroll">
            <div class="content-main" v-if="images.length>0">
                <div class="image-item" :ref="'image_item_'+index" v-for="(img,index) in images" :key="index" :class="{'image-item-img-first':index===0}" 
                :style="{'backgroundColor':img.backgroundColor}" 
                @mousemove.stop="currentMouseOverIndex=index,setterShow=false" @mouseleave.stop="currentMouseOverIndex=-1">
                    <div class="image-item-img" v-imagematch="img.url"></div>
                    <div class="image-set-wallpaper" v-show="currentMouseOverIndex==index&&isSetting==false" @click.stop="setWallpaper(img,index)">
                        <i class="iconfont icon-xianshiqi"></i>
                        <span>设置壁纸</span>
                    </div>

                    <div class="image-item-flag" v-show="currentMouseOverIndex==index&&isSetting==false">
                        <div class="image-item-flag-direction" v-show="img.directionColumn">
                            <i class="iconfont icon-xiaoqing-tubiao-hengping"></i>
                        </div>
                        <div class="image-item-tip" 
                        :style="{'color':img.tip=='5k'?'#e0620d':img.tip=='4k'?'17abe3':'d3217b'}">{{img.tip}}</div>
                    </div>
                </div>
            </div>

            <div class="content-main-no" v-else @mousemove.stop="setterShow=false">
                <span v-if="getDataFlag==true">美好的事情即将发生...</span>
                <span v-else>暂时没有搜索到...</span>
            </div>
        </div>
    </div>

    <div class="refresh-btn" :class="{'refresh-btn-ing':refreshBtnIng}">
        <i class="iconfont icon-shuaxin" @click="refreshFn"></i>
    </div>
</div>
</template>

<script>
// 在渲染器进程 (网页) 中。
import { log } from 'util'
import { mapState, mapActions } from 'vuex'
import setter from './setter.vue'
import swProgress from './progress.vue'
import { version } from '../../../package'

const { shell } = require('electron')
const os = require('os')
const osu = require('node-os-utils')
const macaddress = require('macaddress')
const md5 = require('../assets/js/md5.js').md5_32
const { postRegister, apiStatisticActive } = require('../../api/api.js')
const { mkdirSync } = require('../../file/file.js')

export default {
    name: 'mainContent',
    components: {
        setter,
        swProgress
    },
    data() {
        return {
            currentMouseOverIndex: -1,
            currentWallpaperIndex: 0, // 当前壁纸的索引
            searchKey: '',
            setterShow: false,
            isSetting: false,
            images: [],
            imageUrls: [],
            havaDataFlag: true, // 标记是否还有数据
            page: 0, // 请求数据的页数
            getDataFlag: false, // 标记页面是否正在请求数据
            searchKeyFocus: false,
            osType: 'mac',
            imageSource: 'pexels',
            sendnewEmailLoading: false, // 邮件发送loading
            progressValue: 0, // 进度值
            currentImageBacColor: '#fff', 
            refreshBtnIng: false,
        }
    },
    beforeCreate() {

    },

    computed: mapState({
        config: state => state.main.config
    }),

    mounted() {
        // 安装量的统计
        this.firstInstall()
        this.osType = os.type() === 'Darwin' ? 'mac' : 'win'
        this.imageSource = this.$localStorage.getStore('userConfig').imageSource || 'pexels'
        this.searchKey = this.$localStorage.getStore('searchKey')
        this.images = []
        this.imageUrls = []
        this.cleartLocalStorage()
        this.getData()
        this.eventInit()
    },

    methods: {
        ...mapActions([
            'changeOsInfoStore', 
        ]),

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
                this.$fbloading.close()
            })

            /**
             * 定时器
             */
            this.$ipcRenderer.on('intervalTime', (event, arg) => {
                this.wallpaperAuto()
                this.firstInstall()
        
                const nowDate = parseInt((new Date()).getTime() / 1000, 10)
                const statisticTimeFlag = this.$localStorage.getStore('statisticTimeFlag')
                if (!statisticTimeFlag){
                    this.$localStorage.setStore('statisticTimeFlag', nowDate)
                }
                const timingWipeDataFlag = this.$localStorage.getStore('timingWipeDataFlag')
                if (!timingWipeDataFlag){
                    this.$localStorage.setStore('timingWipeDataFlag', nowDate)
                }

                // 2小时
                if (nowDate - statisticTimeFlag >= 2 * 60 * 60){
                    apiStatisticActive(this.$localStorage.getStore('osInfoUid'))
                    this.$localStorage.setStore('statisticTimeFlag', nowDate)
                }
                // 7天
                if (nowDate - timingWipeDataFlag >= 7 * 24 * 60 * 60){
                    this.$localStorage.setStore('timingWipeDataFlag', nowDate)
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
            this.$ipcRenderer.on('datainfo', (event, arg) => {
                // 获得了接口列表
                if (arg.type === 'urls') {
                    this.getDataFlag = false
                    this.refreshBtnIng = false
                    if (arg.data.length === 0) {
                        this.havaDataFlag = false
                        return
                    }
                    if (this.page === 0) {
                        this.images = []
                        this.imageUrls = []
                    }
                    this.urlsDeal(arg.data)
                } 
                // 主窗口显示|隐藏
                else if (arg.type === 'windowShow') {
                    if (arg.data) {
                        this.setterShow = false
                    } else {
                        this.setterShow = false
                    }
                } 
                // 更新进度条
                else if (arg.type === 'updaterProgress') {
                    this.progressValue = arg.data
                    if (this.progressValue >= 100) {
                        const time = setTimeout(() => {
                            clearTimeout(time)
                            this.progressValue = 0
                        }, 1000)
                    }
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
           
            function getMacAddress(){
                return new Promise((resolve, reject) => {
                    macaddress.one((err, mac) => {
                        if (err){
                            reject()
                        }
                        else {
                            resolve(mac)
                        }
                    });
                })
            }
            if (this.$localStorage.getStore('first_install_flag_v1.1.1') !== 'strawberrywallpaper') {
                Promise.all([osu.osCmd.whoami(), osu.os.oos(), osu.os.arch(), getMacAddress()]).then((result) => {
                    const [userName, oss, arch, mac] = result
                    const time = (new Date()).getTime()
                    console.log(mac)
                    const data = {
                        username: userName.replace('\n', '').replace('\r', ''), // 用户名
                        version, // 软件版本
                        uid: md5(`${userName}${oss}${arch}${mac}`), // 软件唯一ID,
                    }
                    postRegister(data).then((res) => {
                        this.changeOsInfoStore(data)
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
         */
        setWallpaper(img, index) {
            this.isSetting = true
            this.setterShow = false
            if (!this.$refs[`image_item_${index}`][0]) {
                return
            }
            this.$fbloading.open(this.$refs[`image_item_${index}`][0])
            this.$ipcRenderer.send('dataWallpaper', img)
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
            return !(width >= height)
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
                this.imageUrls = []
                this.getData()
            }
            this.isSetting = false
            this.refreshBtnIng = true
            // 设置一个时间记录最后更新的时间
            this.$localStorage.setStore('lastUpdataTime', parseInt(new Date().getTime() / 1000, 10))
            this.isSetting = false
            this.$fbloading.close()
        },

        /**
         * 中断所有的请求
         * @function destroyAll
         */
        destroyAll() {
            this.progressValue = 0
            this.isSetting = false
            this.setterShow = false
            this.$fbloading.close()
            this.$ipcRenderer.send('cancelAllRequest', true) // 取消所有请求
        },

        /** 壁纸自动更新 */
        wallpaperAuto() {
            const userConfig = this.$localStorage.getStore('userConfig')
            // 如果正在设置,则弹出去
            if (this.isSetting === true || this.images.length === 0) {
                return
            }
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
                            this.setWallpaper(this.images[index], index)
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
            if (this.searchKey === this.$localStorage.getStore('searchKey')) {
                return
            }
            this.$localStorage.setStore('searchKey', this.searchKey)
            this.destroyAll()
            this.page = 0
            this.images = []
            this.imageUrls = []
            this.getData()
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
            this.imageUrls = []
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
                if (this.imageUrls.indexOf(e.url) === -1) {
                    const obj = {
                        url: e.url,
                        name: '',
                        tip: this.imageTip(e.width, e.height),
                        directionColumn: this.imageDirection(e.width, e.height),
                        downloadUrl: e.downloadUrl,
                        width: e.width,
                        height: e.height,
                        backgroundColor: this.randomColor()
                    }
                    this.imageUrls.push(e.url)
                    this.images.push(obj)
                }
            })
        },

        /**
         * 滚动条事件,请求下一页
         * @function contentScroll
         * @param {Object} event 事件
         */
        contentScroll(event) {
            const el = event.srcElement || event.target
            if (this.havaDataFlag === true && this.getDataFlag === false) {
                if (
                    el.scrollTop + 1800 > el.querySelector('.content-main').clientHeight
                ) {
                    this.page = this.page + 1
                    this.getData()
                }
            }
        },

        /**
         * 获取数据接口
         * @function getData
         */
        getData() {
            this.getDataFlag = true
            const obj = {
                searchKey: this.searchKey,
                page: this.page,
                imageSource: this.imageSource
            }
            this.$ipcRenderer.send('getImageUrls', obj)
        },
    },
    watch: {
        imageSource(val) {
            if (val === 'paper') {
                this.searchKey = 'latest'
            } else {
                this.searchKey = ''
                this.$localStorage.setStore('searchKey', this.searchKey)
            }
        },
    }
}
</script>

<style lang="less" scoped>
.image-main-content {
    border-radius: 6px;
    width: 100%;
    height: 100%;
    overflow: hidden;
    transform: rotate(0deg);
}

.sanjiao {
    width: 100%;
    height: 10px;
    display: flex;
    align-content: center;
    justify-content: center;
    background-color: transparent;
}

.sanjiao::before {
    content: "";
    width: 0;
    height: 0;
    border-width: 0 10px 10px;
    border-style: solid;
    border-color: transparent transparent rgb(37, 33, 33);
    /*透明 透明  灰*/
}

.setter-content {
    top: 45px;
}

.setter-content-mac {
    top: 55px;
}

.image-main-content-mac {
    height: calc(100% - 10px);
}

.main-content {
    // padding-top: 30px;
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    position: relative;

    background-color: transparent;

    // background-color: red;
    .header {
        position: fixed;
        width: 100%;
        height: 96px;
        z-index: 3000;
        padding-left: 20px;
        padding-right: 20px;
        background-color: rgba(34, 34, 34, 0.9);
        overflow: hidden;

        .header-row-one {
            display: flex;
            width: 100%;
            height: 56px;
            justify-content: space-between;

            .left {
                position: relative;
                width: 100%;
                height: 100%;

                .text {
                    color: rgba(255, 255, 255, 0.9);
                    cursor: default;
                    user-select: none;
                    // z-index: 2;
                    // -webkit-text-fill-color: transparent;
                    // -webkit-background-clip: text;
                    // -webkit-text-stroke: 2px rgba(255,255,255,0.9);
                }
            }
        }

        .iconfont {
            color: #fff;
            margin-left: 10px;
        }

        .left {
            flex: auto;
        }

        .right {
            flex: none;
            display: flex;
            align-items: center;
        }

        .header-set {
            position: relative;
        }

        .header-search {
            width: 100%;
            display: flex;
            align-items: center;
            position: relative;

            .header-search-input {
                width: 100%;
                flex: none;
            }

            .iconfont {
                position: absolute;
                right: 5px;
            }
        }
    }

    .header::before {
        content: "";
        display: block;
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        filter: blur(50px);
        /* opacity: 0.9; */
        background-color: rgba(37, 31, 30, 0.9);
    }

    .image-item-img-first {
        margin-top: 95px;
    }

    .content {
        width: calc(~"100% + 15px");
        height: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
        padding: 1px;
        background-color: #222222;
        border-radius: 5px;

        .image-item {
            width: 100%;
            height: 180px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: 1px solid #bbb;

            .image-item-img {
                width: 100%;
                height: 100%;
                overflow: hidden;
            }

            .image-set-wallpaper {
                position: absolute;
                background-color: rgba(0, 0, 0, 0.4);
                width: auto;
                height: 33px;
                width: 120px;
                line-height: 33px;
                cursor: default;
                color: #fff;
                text-align: center;
                border-radius: 15px;

                .iconfont {
                    margin-right: 8px;
                }
            }

            .image-set-wallpaper:hover {
                background-color: rgba(0, 0, 0, 0.7);
            }

            .image-item-flag {
                position: absolute;
                top: 10px;
                right: 14px;
                display: flex;
                justify-content: flex-end;
                width: auto;
                height: 26px;

                .image-item-flag-direction {
                    width: 26px;
                    height: 26px;
                    border-radius: 4px;
                    color: #fff;
                    background-color: rgba(0, 0, 0, 0.6);
                    line-height: 26px;
                    text-align: center;
                    cursor: default;
                    font-size: 12px;
                    margin-right: 10px;
                }

                .image-item-tip {
                    width: 26px;
                    height: 26px;
                    border-radius: 4px;
                    color: #52b7fc;
                    background-color: rgba(0, 0, 0, 0.6);
                    line-height: 26px;
                    text-align: center;
                    cursor: default;
                    font-size: 12px;
                }
            }

            .image-item-tip {
                width: 26px;
                height: 26px;
                border-radius: 4px;
                color: #52b7fc;
                background-color: rgba(0, 0, 0, 0.6);
                line-height: 26px;
                text-align: center;
                cursor: default;
                font-size: 12px;
            }
        }
    }

    .content-win {
        width: calc(~"100% + 17px");
    }

    .content-main-no {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color: #ccc;
        font-size: 12px;
    }
}

.refresh-btn {
    position: fixed;
    z-index: 999;
    left: 16px;
    bottom: 16px;
    color: #fff;

    .iconfont {
        font-size: 24px;
    }
}

.refresh-btn-ing {
    animation: refreshbtning 1.5s linear infinite;
    transform-origin: center center;
    transform: rotate(360deg);
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

<style lang="less">
.main-content {
    .el-input__inner {
        border: none;
        background-color: #383838;
        color: #a5a5a5;
    }

    ::-webkit-input-placeholder {
        /* WebKit browsers */
        color: #8a8484;
    }
}

.popper__arrow {
    border-bottom-color: #383838;
}

.el-popper[x-placement^="bottom"] .popper__arrow::after {
    border-bottom-color: #383838;
}

.el-popper[x-placement^="bottom"] .popper__arrow {
    border-bottom-color: #383838;
}

.el-select-dropdown {
    background-color: #383838;
    color: #000000;
    border: none;
}

.el-select-dropdown__item.selected {
    color: #ffffff;
}

.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
    background-color: #767676;
    color: #ffffff;
}
</style>
