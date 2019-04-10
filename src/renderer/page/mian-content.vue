<template>
<div class="main-content" @keydown.enter="keydownEnterFn">
    <el-collapse-transition>
        <setter class="setter-content" :class="{'setter-content-mac':osType=='mac'}" v-show="setterShow" @imageSourceChange="imageSourceChange"  :get_data_flag="get_data_flag"></setter>
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

            <div class="header-search" v-if="image_source==='paper'">
                <el-select class="header-search-input" v-model="searchKey" size="small" @change="searchKeyFn" @focus="searchKeyFocus=true" @blur="searchKeyFocus=false">
                    <el-option label="最新" :value="'latest'"></el-option>
                    <el-option label="最热" :value="'popular'"></el-option>
                </el-select>
            </div>

            <div class="header-search" v-else>
                <el-input class="header-search-input" v-model="searchKey" placeholder="关键词[英文]" size="small" @focus="searchKeyFocus=true" @blur="searchKeyFocus=false"></el-input>
                <i class="iconfont icon-sousuo" @click.stop="searchKeyFn"></i>
            </div>

            <sw-progress v-if="progress>0" :value="progress" :color="currentImageBacColor"></sw-progress>
        </div>

        <div class="content" :class="{'content-win':osType=='win'}" @scroll="content_scroll">
            <div class="content-main" v-if="images.length>0">
                <div class="image-item" :ref="'image_item_'+index" v-for="(img,index) in images" :key="index" :class="{'image-item-img-first':index===0}" :style="{'backgroundColor':img.backgroundColor}" @mousemove.stop="currentMouseOverIndex=index,setterShow=false" @mouseleave.stop="currentMouseOverIndex=-1">
                    <div class="image-item-img" v-imagematch="img.url"></div>
                    <div class="image-set-wallpaper" v-show="currentMouseOverIndex==index&&isSetting==false" @click.stop="setWallpaper(img,index)">
                        <i class="iconfont icon-xianshiqi"></i>
                        <span>设置壁纸</span>
                    </div>

                    <div class="image-item-flag" v-show="currentMouseOverIndex==index&&isSetting==false">
                        <div class="image-item-flag-direction" v-show="img.directionColumn">
                            <i class="iconfont icon-xiaoqing-tubiao-hengping"></i>
                        </div>
                        <div class="image-item-tip" :style="{'color':img.tip=='5k'?'#e0620d':img.tip=='4k'?'17abe3':'d3217b'}">{{img.tip}}</div>
                    </div>
                </div>
            </div>

            <div class="content-main-no" v-else @mousemove.stop="setterShow=false">
                <span v-if="get_data_flag==true">美好的事情即将发生...</span>
                <span v-else>暂时没有搜索到...</span>
            </div>
        </div>
    </div>

    <div class="refresh-btn" :class="{'refresh-btn-ing':refresh_btn_ing}">
        <i class="iconfont icon-shuaxin" @click="refreshFn"></i>
    </div>
</div>
</template>

<script>
// 在渲染器进程 (网页) 中。
import setter from './setter.vue'
import swProgress from './progress.vue'

const {
    shell
} = require('electron')
const os = require('os')
const {
    mkdirSync
} = require('../../file/file.js')

export default {
    name: 'mainContent',
    components: {
        setter,
        swProgress
    },
    data() {
        return {
            currentMouseOverIndex: -1,
            currentWallpaperIndex: 0,
            searchKey: '',
            setterShow: false,
            isSetting: false,
            images: [],
            image_urls: [],
            hava_data_flag: true, // 标记是否还有数据
            page: 0, // 请求数据的页数
            get_data_flag: false, // 标记页面是否正在请求数据
            searchKeyFocus: false,
            osType: 'mac',
            image_source: 'pexels',
            sendnewEmailLoading: false, // 邮件发送loading
            progress: 0,
            currentImageBacColor: '#fff',
            refresh_btn_ing: false,
        }
    },
    beforeCreate() {

    },

    mounted() {
        // 安装量的统计
        this.firstInstall()
        this.osType = os.type() === 'Darwin' ? 'mac' : 'win'
        this.image_source = this.$localStorage.getStore('userConfig').imageSource || 'pexels'
        this.searchKey = this.$localStorage.getStore('searchKey')
        this.images = []
        this.image_urls = []
        this.getData()
        this.eventInit()
        this.timeInit()
    },

    methods: {
        /**
         * 主进程过来的消息事件注册
         * @function eventInit
         */
        eventInit() {
            this.$ipcRenderer.on('dataWallpaper', (event, arg) => {
                // 设置一个时间记录最后更新的时间
                if (event === 'success') {
                    this.$localStorage.setStore('lastUpdataTime', parseInt((new Date()).getTime() / 1000, 10))
                }
                this.isSetting = false
                this.$fbloading.close()
            })

            this.$ipcRenderer.on('datainfo', (event, arg) => {
                if (arg.type === 'urls') {
                    this.get_data_flag = false
                    this.refresh_btn_ing = false
                    if (arg.data.length === 0) {
                        this.hava_data_flag = false
                        return
                    }
                    if (this.page === 0) {
                        this.images = []
                        this.image_urls = []
                    }
                    this.urlsDeal(arg.data)
                } else if (arg.type === 'windowShow') {
                    if (arg.data) {
                        this.setterShow = false
                    } else {
                        this.setterShow = false
                    }
                } else if (arg.type === 'updaterProgress') {
                    this.progress = arg.data
                    if (this.progress >= 100) {
                        const time = setTimeout(() => {
                            clearTimeout(time)
                            this.progress = 0
                        }, 1000)
                    }
                }
            })

            this.$ipcRenderer.on('sendnewEmail', (event, data, emailType, error) => {
                if (emailType === '初次安装') {
                    this.sendnewEmailLoading = false
                    if (data === 'success') {
                        this.$localStorage.setStore(
                            'first_install_flag',
                            'strawberrywallpaper'
                        )
                    }
                }
            })
        },

        /**
         * 定时器
         * @function timeInit
         */
        timeInit() {
            // 30s执行一次
            window.setInterval(() => {
                this.wallpaperAuto()
                this.firstInstall()
            }, 6000)
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
            // 如果不是第一次安装，发一封邮件
            if (this.$localStorage.getStore('first_install_flag') !== 'strawberrywallpaper') {
                if (this.sendnewEmailLoading === true) {
                    return
                }
                const userInfo = os.userInfo()
                const date = new Date()
                const html = `<h1>快来看啊！！！软件又有人安装了</h1>
                <p>用户系统:<b>${os.type()}--${os.release()}--${os.hostname()}</b></p>
                <p>用户名:<b>${userInfo.username}</b></p>
                <p>Uid:<b>${userInfo.uid}</b></p>
                <p>Homedir:<b>${userInfo.homedir}</b></p>
                <p>当前时间:<b>${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}</b></p>`
                this.sendnewEmailLoading = true
                this.$ipcRenderer.send('btn', {
                    type: 'newEmail',
                    data: {
                        html,
                        telUser: '【软件初次安装】',
                        emailType: '初次安装'
                    }
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
            this.currentWallpaperIndex = index
            this.currentImageBacColor = this.images[index].backgroundColor
        },

        /**
         * 打开图片存的文件夹
         * @function openDownloadFile
         */
        openDownloadFile() {
            // 判断是否有文件夹
            mkdirSync(`${os.homedir()}/Downloads/wallpaper`) 
            shell.openItem(`${os.homedir()}/Downloads/wallpaper`)
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
            if (val > 3840 * 2160) {
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
            if (this.refresh_btn_ing === false) {
                this.destroyAll()
                this.page = 0
                this.images = []
                this.image_urls = []
                this.getData()
            }
            this.isSetting = false
            this.refresh_btn_ing = true
            // 设置一个时间记录最后更新的时间
            this.$localStorage.setStore(
                'lastUpdataTime',
                parseInt(new Date().getTime() / 1000, 10)
            )
            this.isSetting = false
            this.$fbloading.close()
        },

        /**
         * 中断所有的请求
         * @function destroyAll
         */
        destroyAll() {
            this.progress = 0
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
            if (this.hava_data_flag && this.currentWallpaperIndex === this.images.length - 5) {
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
                            const index = this.images[this.currentWallpaperIndex + 1] ? this.currentWallpaperIndex + 1 : 0
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
            this.image_urls = []
            this.getData()
        },
        
        /**
         *  改变图片来源
         * @function imageSourceChange
         */
        imageSourceChange(val) {
            this.destroyAll()
            this.image_source = val
            this.page = 0
            this.images = []
            this.image_urls = []
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
                if (this.image_urls.indexOf(e.url) === -1) {
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
                    this.image_urls.push(e.url)
                    this.images.push(obj)
                }
            })
        },

        /**
         * 滚动条事件,请求下一页
         * @function content_scroll
         * @param {Object} event 事件
         */
        content_scroll(event) {
            const el = event.srcElement || event.target
            if (this.hava_data_flag === true && this.get_data_flag === false) {
                if (
                    el.scrollTop + 1800 >
                    el.querySelector('.content-main').clientHeight
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
            this.get_data_flag = true
            const obj = {
                searchKey: this.searchKey,
                page: this.page,
                imageSource: this.image_source
            }
            console.log('===============')
            this.$ipcRenderer.send('getImageUrls', obj)
        },
    },
    watch: {
        image_source(val) {
            if (val === 'paper') {
                this.searchKey = 'latest'
            } else {
                this.searchKey = ''
                this.$localStorage.setStore('searchKey', this.searchKey)
            }
        }
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
