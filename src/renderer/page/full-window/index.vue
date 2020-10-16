<template>
    <div class="full-window">
        <div class="full-window-ctrl" style="-webkit-app-region: drag">
            <vueTitlebar></vueTitlebar>
            <div class="ctrl-content">
                <div class="button">
                    <chromeIcon icon="icon-back1" :disabled="backDisabled" @click="handleGoBack"></chromeIcon>
                    <chromeIcon icon="icon-forwad" :disabled="forwadDisabled" @click="handleGoForward"></chromeIcon>
                    <chromeIcon v-show="!isLoading" icon="icon-research" @click="handleReload()"></chromeIcon>
                    <chromeIcon v-show="isLoading" icon="icon-close" @click="handleAbort"></chromeIcon>
                </div>
                <div class="nav">
                    <template v-for="item in imageSourceType">
                        <div
                            v-if="item.home"
                            :key="item.value"
                            style="-webkit-app-region: no-drag"
                            :class="['nav-item',{active:currentPath===item.home}]"
                            @click="handleNavClick(item)">{{item.name}}
                        </div>

                    </template>
                </div>
            </div>

        </div>
        <SwProgress
            v-if="progressValue>0"
            width='100%'
            :value="progressValue"
            :color="currentImageBacColor">
        </SwProgress>
        <div class="webview">
            <webview
                v-if="currentPath"
                ref="fullWindowView"
                :key="currentPath"
                :src="currentPath"
                :preload="fileAbsolutePath"
                class="position content"></webview>
            <div
                v-show="isLoading"
                v-loading="isLoading"
                class="position loading"
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
import { resolve } from 'path'
import fs from 'fs'
import chromeIcon from './chrome-icon/index.vue'
import SwProgress from '$render/components/progress'

import vueTitlebar from './titlebar/index.vue'

const imageSourceType = []


// eslint-disable-next-line no-undef
const fileBasePath = file => resolve(__static, `./page-script/${file}`)
const readFileSync = file => fs.readFileSync(fileBasePath(file)).toString()

const renderFile = readFileSync('render.js')

export default {
    name: 'fullWindow',
    components: { chromeIcon, SwProgress, vueTitlebar },
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
            config: this.$localStorage.getStore('userConfig'),
        }
    },
    mounted() {
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
                            options: { scale: wallpaperScale, autoSetAllScreens }, 
                            userConfig: this.config
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
                let ctrlPressed = 0
                let altPressed = 0
                let shiftPressed = 0
                const webview = this.$refs.fullWindowView

                shiftPressed = e.shiftKey
                altPressed = e.altKey
                ctrlPressed = e.ctrlKey
                const { shiftKey, ctrlKey, altKey, metaKey, key } = e

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

        .ctrl-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #333333;
            background-color: #222222;
            width: 100%;
            height: 40px;
            padding-right: 10px;
            padding-left: 3px;
        }

        .button {
            display: flex;
        }

        .nav {
            display: flex;

            .nav-item {
                cursor: default;
                width: auto;
                padding: 0 10px;
                color: #aaaaaa;

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
        position: relative;
        width: 100%;
        height: calc(100% - 68px);

        .position {
            position: absolute;
            right: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    }
}

</style>

<style lang="less">
.loading {
    .el-loading-spinner .path {
        stroke: #ffffff;
    }

    .el-loading-spinner .el-loading-text {
        color: #ffffff;
    }
}

.full-screen-notify {
    border: none;
    background-color: #222222;

    .el-notification__title {
        color: #cccccc;
    }
}

</style>
