<template>
    <div class="full-window">
        <div class="full-window-ctrl">
            <div class="button">
                <chromeIcon icon="icon-back1" :disabled="backDisabled" @click="handleGoBack"></chromeIcon>
                <chromeIcon icon="icon-forwad" :disabled="forwadDisabled" @click="handleGoForward"></chromeIcon>
                <chromeIcon icon="icon-research" v-show="!isLoading" @click="handleReload()"></chromeIcon>
                <chromeIcon icon="icon-close" v-show="isLoading" @click="handleAbort"></chromeIcon>
            </div>
            <div class="nav">
                <template v-for="item in imageSourceType">
                    <div
                        v-if="item.home"
                        :key="item.value"
                        :class="['nav-item',{active:currentPath===item.home}]"
                        @click="handleNavClick(item)">{{item.name}}
                    </div>

                </template>
            </div>
        </div>
        <sw-progress v-if="progressValue>0" width='100%' :value="progressValue" :color="currentImageBacColor"></sw-progress>
        <div class="webview">
            <webview
                ref="fullWindowView"
                :src="currentPath"
                nodeintegration
                class="position content"></webview>
            <div
                v-show="isLoading"
                class="position loading"
                v-loading="isLoading"
                element-loading-text="拼命加载中..."
                element-loading-background="#222222 !important"
                element-loading-customClass="webview-loading"></div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import chromeIcon from '../components/chrome-icon/index.vue'
import { imageSourceType } from '../../utils/utils'
import swProgress from './progress'

const { resolve } = require('path')
const fs = require('fs')

// eslint-disable-next-line no-undef
const fileBasePath = file => resolve(__static, `./page-script/${file}`)
const readFileSync = file => fs.readFileSync(fileBasePath(file)).toString()

const renderFile = readFileSync('render.js')

global.kjl = null

export default {
    name: 'fullWindowCtrl',
    components: { chromeIcon, swProgress },
    data() {
        return {
            backDisabled: true,
            forwadDisabled: true,
            isLoading: true,
            imageSourceType,
            currentPath: '',
            progressValue: 0,
            currentImageBacColor: '#ff66ff', // 进度条的颜色
            currentSourceValue: '',
            config: {}
        }
    },
    computed: mapState({
        config: state => state.main.config,
    }),
    mounted() {
        kjl = this
        console.log('=================11', new Date())
        const config = this.$localStorage.getStore('userConfig')
        this.handleNavClick(this.imageSourceType[0])
        this.webviewEventInit()
        console.log('=================33', new Date())
        this.renderEventInit()
        this.registerKeyEvent()
        console.log('=================66', new Date())
    },
    methods: {

        webviewEventInit(){
            this.$nextTick(() => {
                const webview = this.$refs.fullWindowView
                webview.addEventListener('did-start-loading', () => {
                    console.log('did-start-loading')
                    webview.openDevTools()
                })

                webview.addEventListener('dom-ready', () => {
                    this.isLoading = false
                    console.log('==============dom-ready')
                    const jsString = readFileSync(`${this.currentSourceValue}.js`)
                        .replace('const { render } = require(\'./render\')\n', renderFile)
                    webview.executeJavaScript(jsString)
                    // webview.executeJavaScript('console.log(\'我执行脚本了\');')
                })

                webview.addEventListener('did-finish-load', () => {
                    console.log('==============我加载完成了')
                })

                webview.addEventListener('update-target-url', () => {
                    this.backDisabled = !webview.canGoBack()
                    this.forwadDisabled = !webview.canGoForward()
                })
                webview.addEventListener('console-message', (e) => {
                    console.log(`webview: ${e.message}`)
                })
                webview.addEventListener('ipc-message', (event) => {
                    const { channel, args: [data] } = event
                    if (channel === 'download'){
                        webview.downloadURL(data)
                    }
                    else if (channel === 'setWallpaper'){
                        this.$ipcRenderer.send('dataWallpaper', { ...data, options: { scale: this.config.wallpaperScale, isAutoSet: true } })
                    }
                })
            })
        },

        renderEventInit(){
            // 数据相关事件
            this.$ipcRenderer.on('datainfo', (event, { type = '', data }) => {
            // 更新进度条
                if (type === 'updaterProgress') {
                    this.progressValue = data
                    if (this.progressValue >= 100) {
                        const time = setTimeout(() => {
                            clearTimeout(time)
                            this.progressValue = 0
                        }, 1000)
                    }
                }
            })

            // 设置壁纸完成事件
            this.$ipcRenderer.on('dataWallpaper', (event, arg) => {
                this.progressValue = 0
            })
        },

        registerKeyEvent(){
            const webview = this.$refs.fullWindowView
            document.addEventListener('keydown', (e) => {
                console.log(e)
                let ctrlPressed = 0
                let altPressed = 0
                let shiftPressed = 0

                shiftPressed = e.shiftKey
                altPressed = e.altKey
                ctrlPressed = e.ctrlKey
                const { shiftKey, ctrlKey, altKey, metaKey, key } = e
      
                // DevTools for each tab => command+Shift+I
                if ((metaKey && shiftKey && key === 'i') || key === 'F12'){
                    if (webview.isDevToolsOpened()){
                        webview.closeDevTools()
                    }
                    else {
                        webview.openDevTools()
                    }             
                    e.preventDefault()        
                    return false
                }
                return true
            })
        },

        // 后退
        handleGoBack(){
            this.$refs.fullWindowView.goBack()
        },
        // 前进
        handleGoForward(){
            this.$refs.fullWindowView.goForward()()
        },
        // 刷新
        handleReload(){
            this.$refs.fullWindowView.reload()
            this.isLoading = true
        },
        // 终止
        handleAbort(){
            this.$refs.fullWindowView.reload()
            this.isLoading = false
        },

        // 打开指定连接
        handleNavClick(item){
            const webview = this.$refs.fullWindowView
            const { home: path, value } = item
            this.currentPath = path
            this.currentSourceValue = value
            this.isLoading = true
            // webview.setAttribute('preload', `file://${require('path').resolve(__dirname, `../../page-script/${this.currentSourceValue}.js`)}`)
        } 
    }

}
</script>

<style lang="less" scoped>
.full-window {
    width: 100%;
    height: 100%;

    .full-window-ctrl {
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #222222;
        padding: 0 10px;
        border-bottom: 1px solid #333;

        .button {
            display: flex;
        }

        .nav {
            display: flex;

            .nav-item {
                width: auto;
                padding: 0 10px;
                color: #aaa;
                cursor: default;

                &.active {
                    color: #ffffff;
                }

                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }

    .webview {
        display: inline-flex;
        width: 100%;
        height: calc(100% - 40px);
        position: relative;

        .position {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            right: 0;
        }
    }
}
</style>

<style lang="less">
.loading {
    .el-loading-spinner .path {
        stroke: #fff;
    }

    .el-loading-spinner .el-loading-text {
        color: #ffffff;
    }
}
</style>
