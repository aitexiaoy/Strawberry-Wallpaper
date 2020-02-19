<template>
    <div class="full-window">
        <div class="full-window-ctrl" style="-webkit-app-region: drag">
            <vueTitlebar></vueTitlebar>
            <div class="ctrl-content">
                <div class="button">
                    <chromeIcon icon="icon-back1" :disabled="backDisabled" @click="handleGoBack"></chromeIcon>
                    <chromeIcon icon="icon-forwad" :disabled="forwadDisabled" @click="handleGoForward"></chromeIcon>
                    <chromeIcon icon="icon-research" v-show="!isLoading" @click="handleReload()"></chromeIcon>
                    <chromeIcon icon="icon-close" v-show="isLoading" @click="handleAbort"></chromeIcon>
                </div>
                <div class="nav">
                    <template v-for="item in imageSourceType">
                        <div
                            style="-webkit-app-region: no-drag"
                            v-if="item.home"
                            :key="item.value"
                            :class="['nav-item',{active:currentPath===item.home}]"
                            @click="handleNavClick(item)">{{item.name}}
                        </div>

                    </template>
                </div>
            </div>

        </div>
        <sw-progress
            v-if="progressValue>0"
            width='100%'
            :value="progressValue"
            :color="currentImageBacColor"></sw-progress>
        <div class="webview">
            <webview
                v-if="currentPath"
                ref="fullWindowView"
                :src="currentPath"
                :key="currentPath"
                :preload="fileAbsolutePath"
                class="position content"></webview>
            <div
                v-show="isLoading"
                class="position loading"
                v-loading="isLoading"
                element-loading-text="拼命加载中..."
                element-loading-background="#222222 !important"
                element-loading-customClass="webview-loading">
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import customTitlebar from 'custom-electron-titlebar'
import chromeIcon from '../components/chrome-icon/index.vue'
import { imageSourceType } from '../../utils/utils'
import swProgress from './progress'

import vueTitlebar from '../components/titlebar/index.vue'


const { resolve } = require('path')
const fs = require('fs')

// eslint-disable-next-line no-undef
const fileBasePath = file => resolve(__static, `./page-script/${file}`)
const readFileSync = file => fs.readFileSync(fileBasePath(file)).toString()

const renderFile = readFileSync('render.js')
global.kjj = null

export default {
    name: 'fullWindow',
    components: { chromeIcon, swProgress, vueTitlebar },
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
    mounted() {
        const config = this.$localStorage.getStore('userConfig')
        this.handleNavClick(this.imageSourceType[0])
        // this.webviewEventInit()
        this.renderEventInit()
        this.registerKeyEvent()
    },
    computed: {
        fileAbsolutePath(){
            return `file://${fileBasePath(`${this.currentSourceValue}.js`)}` 
        } 
    },
    methods: {
        webviewEventInit(){
            this.$nextTick(() => {
                const webview = this.$refs.fullWindowView
                webview.addEventListener('did-start-loading', () => {
                    // console.log('==========', webview.preload)
                    // webview.openDevTools()
                })

                webview.addEventListener('dom-ready', () => {
                    this.isLoading = false
                    webview.send('dom-ready')
                })

                webview.addEventListener('did-finish-load', () => {
                    // console.log('==============我加载完成了')
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
                        webview.downloadURL(data.downloadUrl)
                    }
                    else if (channel === 'setWallpaper'){
                        const { autoSetAllScreens } = this.config
                        const { wallpaperScale } = this.config
                        this.$ipcRenderer.send('dataWallpaper', { 
                            ...data, 
                            options: { scale: wallpaperScale, autoSetAllScreens } 
                        })
                    }
                    else if (channel === 'notify'){
                        this.$notify({ ...data, customClass: 'full-screen-notify', offset: 100, duration: 2000 })
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
            document.addEventListener('keydown', (e) => {
                console.log(e)
                let ctrlPressed = 0
                let altPressed = 0
                let shiftPressed = 0
                const webview = this.$refs.fullWindowView

                shiftPressed = e.shiftKey
                altPressed = e.altKey
                ctrlPressed = e.ctrlKey
                const { shiftKey, ctrlKey, altKey, metaKey, key } = e

                console.log(e)

                if (webview){
                    // DevTools for each tab => command+Shift+I
                    if ((metaKey && shiftKey && key === 'i') || key === 'F12'){
                        e.preventDefault()
                        e.stopPropagation()
                        if (webview.isDevToolsOpened()){
                            webview.closeDevTools()
                        }
                        else {
                            webview.openDevTools()
                        }             
         
                        return false
                    }
                }
                return false
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
            this.$nextTick(() => {
                this.webviewEventInit()
            })
            this.currentSourceValue = value
            this.isLoading = true
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
        .ctrl-content{
            width: 100%;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #222222;
            padding-left: 3px;
            padding-right: 10px;
            border-bottom: 1px solid #333;
        }

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
        height: calc(100% - 68px);
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

.full-screen-notify {
    background-color: #222222;
    border: none;

    .el-notification__title {
        color: #cccccc;
    }
}
</style>
