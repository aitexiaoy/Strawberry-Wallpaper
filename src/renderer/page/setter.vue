<template>
    <el-collapse-transition>
        <div class="setter" v-show="show">
            <div class="setter-sanjiao"></div>
            <div class="setter-content">
                <div class="setter-row flex-space-between">
                    <div>
                        {{version1}}
                        <span class="setter-link font-size-12" @click.stop="handleNewVersionClick">
                            检查更新
                        </span>
                    </div>
                    <div @click.stop="quit" class="setter-link">
                        退出
                    </div>
                </div>

                <div class="setter-row">
                    <el-checkbox v-model="config.isOpenStatr" @change="setOpenStart">
                        <span class="setter-header">开机自动启动</span>
                    </el-checkbox>
                </div>

                <div class="setter-row">
                    <el-checkbox v-model="config.wallpaperAutoUp" @change="wallpaperAutoChange">
                        <span class="setter-header">壁纸自动更新</span>
                    </el-checkbox>
                </div>

                <div class="setter-row flex-space-between">
                    <el-radio-group v-model="config.updataTime" @change="handleUpdataTimeInputChange">
                        <el-radio :label="3600" :disabled="config.wallpaperAutoUp==false">
                            <span class="checkbox-text">每小时</span>
                        </el-radio>
                        <el-radio :label="86400" :disabled="config.wallpaperAutoUp==false">
                            <span class="checkbox-text">每天</span>
                        </el-radio>
                    </el-radio-group>
                    <el-input
                        :disabled="config.wallpaperAutoUp==false"
                        class="input-width-100"
                        @input="handleUpdataTimeInputChange"
                        placeholder="自定义"
                        size="small"
                        :value="config.updataTime">
                        <span slot="suffix">秒</span>
                    </el-input>
                </div>


                <div class="setter-row" v-if="isMac">
                    <el-checkbox v-model="config.autoSetAllScreens" @change="setLocation">
                        <span class="setter-header">自动应用到所有屏幕</span>
                    </el-checkbox>
                </div>

                <div class="setter-row flex-space-between" v-if="isMac">
                    <span class="checkbox-text setter-header">壁纸填充方式:</span>
                     <el-select v-model="config.wallpaperScale" class="input-width-140" @change="handleWallpaperScale">
                          <el-option
                            v-for="item in wallpaperScaleOptions"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                            </el-option>
                    </el-select>
                </div>

                <div class="setter-row">
                    <span class="checkbox-text setter-header">自定义过滤方向:</span>
                    <i :class="['iconfont icon-heng-ping icon-direction',{'active':config.wallpaperSizeDirection.includes('heng')}]" @click="handleWallpaperSizeDirectionChange('heng')"></i>
                    <i :class="['iconfont icon-su-ping icon-direction',{'active':config.wallpaperSizeDirection.includes('su')}]" @click="handleWallpaperSizeDirectionChange('su')"></i>
                </div>

                <div class="setter-row">
                    <span class="checkbox-text setter-header">自定义过滤尺寸:</span>
                     <el-input
                        class="myselef-time"
                        @input="handleWallpaperSizeWidthChange"
                        placeholder="宽"
                        size="small"
                        :value="config.wallpaperSizeWidth">
                        <span slot="suffix">px</span>
                    </el-input>
                    <span class="size-icon">x</span>
                    <el-input
                        class="myselef-time"
                        @input="handleWallpaperSizeHeightChange"
                        placeholder="高"
                        size="small"
                        :value="config.wallpaperSizeHeight">
                        <span slot="suffix">px</span>
                    </el-input>
                </div>

                <div class="setter-row">
                    <span class="setter-header">设置保存地址:</span>
                    <span class="setter-link" @click="setDefalutDownloadPath">{{config.downloadImagePath}}</span>
                </div>
                
                <div class="setter-row flex-space-between">
                     <span class="setter-header">定时清空已下载图库:</span>
                     <el-input
                        class="input-width-100"
                        @input="handleClearnDownloadFilesTimeInput"
                
                        placeholder="自定义"
                        size="small"
                        :value="config.autoClearnDownloadFilesTime">
                        <span slot="suffix">天</span>
                    </el-input>
                </div>
             

                <div class="setter-row">
                    <span class="setter-header">图片来源:</span>
                    <span class="setter-link" @click="gotToWallPaperHome(config.imageSource)">{{config.imageSource}}</span>
                </div>

                <div class="setter-row">
                    <el-radio-group v-model="config.imageSource" @change="imageSourceChange">
                        <template v-for="item in imageSourceType">
                            <el-radio :label="item.value" :key="item.value">
                                <span class="checkbox-text">{{item.name}}</span>
                            </el-radio>
                        </template>
                    </el-radio-group>
                </div>           

                <div class="setter-content-footer">
                    <div class="setter-link" @click="suggestion">意见反馈</div>
                    <div class="setter-link" @click="aboutPro">关于项目</div>
                </div>
            </div>
        </div>
    </el-collapse-transition>
</template>

<script>
import { ipcRenderer, remote, shell } from 'electron'
import { version } from '../../../package'
import { imageSourceType, wallpaperScaleOptions, isMac, } from '../../utils/utils'
import { defaultConfig } from '../../utils/config'

const os = require('os')

const { dialog } = remote

export default {
    name: 'setter',
    props: {
        get_data_flag: {
            type: Boolean,
            default: false
        },
        show: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            version1: version, // 版本
            ...defaultConfig,
            isMac: isMac(),
            config: {},
            imageSourceType,
            wallpaperScaleOptions,
        }
    },

    beforeMount(){
        this.config = this.$localStorage.getStore('userConfig')
    },

    mounted() {
        this.$ipcRenderer.on('defaultPath', (event, arg) => {
            this.config.downloadImagePath = arg
            this.setLocation()
        })
    },
    methods: {

        setOpenStart() {
            this.$ipcRenderer.send('btn', {
                type: 'openStart',
                data: this.config.isOpenStatr
            })
            this.setLocation()
        },
        quit() {
            this.$parent.setterShow = false
            this.$ipcRenderer.send('btn', {
                type: 'quit',
                data: ''
            })
        },

        /**
         * 关于项目
         */
        aboutPro() {
            this.$emit('update:show', false)
            this.$router.push('/about')
        },

        /**
         * 意见反馈
         */
        suggestion() {
            this.$emit('update:show', false)
            this.$router.push('/suggestion')
        },

        /** *将配置信息存到localstorage中 */
        setLocation() {
            this.$localStorage.setStore('userConfig', this.config)
        },

        // 壁纸自动更新
        wallpaperAutoChange() {
            this.handleUpdataTimeInputChange(!this.config.wallpaperAutoUp ? -1 : 3600)
        },

        // 设置更新周期
        handleUpdataTimeInputChange(val){
            this.beforeInputNumberValueChange(val, 'updataTime', { min: 120, max: 864000, defaultValue: 3600 }, () => {
                this.setLocation()
                this.$localStorage.setStore('lastUpdataTime', parseInt(new Date().getTime() / 1000, 10))
            })
        },
        
        // 设置自动清空周期
        handleClearnDownloadFilesTimeInput(val){
            this.beforeInputNumberValueChange(val, 'autoClearnDownloadFilesTime', { min: 1, max: 9999, defaultValue: 7 }, () => {
                this.setLocation()
                this.$localStorage.setStore('lastCleararnDownloadFilesTime', parseInt(new Date().getTime() / 1000, 10))
            })
        },


        // input输入框的数字处理
        beforeInputNumberValueChange(val, key, { min = 1, max = 999999, defaultValue = 1 }, callback){
            const value = parseInt(val, 10)
            if (val === ''){
                this.config[key] = ''
                window.setTimeout(() => {
                    if (this.config[key] === ''){
                        this.config[key] = defaultValue
                        callback()
                    }
                }, 500)
                return
            }
            if (Number.isNaN(value)){
                this.config[key] = defaultValue
            }
            else {
                this.config[key] = Math.min(Math.max(value, min), max)
            }
            callback()
        },

        
        /**
         * 更改图片来源
         */
        imageSourceChange(val) {
            this.$emit('imageSourceChange', val)
            this.setLocation()
        },
        /**
         * 检测更新
         */
        handleNewVersionClick() {
            this.$ipcRenderer.send('btn', {
                type: 'handleNewVersionClick',
                data: true
            })
        },

        /**
         * 设置默认下载图片路径
         */
        setDefalutDownloadPath() {
            this.$ipcRenderer.send('btn', {
                type: 'setDefaultDownPath',
                data: this.config.downloadImagePath
            })
        },

        /** 
         * 浏览器打开指定链接 
        */
        gotToWallPaperHome(sourece) {
            const current = this.imageSourceType.find(i => i.value === sourece)
            if (current && current.home) {
                shell.openExternal(current.home)
            }  
        },

        // 更改填充方式
        handleWallpaperScale(val){
            this.setLocation()
            this.$ipcRenderer.send('btn', {
                type: 'changeWallpaperScale',
                data: val
            })
        },

        // 尺寸宽
        handleWallpaperSizeWidthChange(val){
            this.beforeInputNumberValueChange(val, 'wallpaperSizeWidth', { min: 1, max: 999999, defaultValue: 1600 }, this.setLocation)
        },

        // 尺寸高
        handleWallpaperSizeHeightChange(val){
            this.beforeInputNumberValueChange(val, 'wallpaperSizeHeight', { min: 1, max: 999999, defaultValue: 1080 }, this.setLocation)
        },

        // 更改方向

        handleWallpaperSizeDirectionChange(direction){
            if (this.config.wallpaperSizeDirection.includes(direction)){
                this.config.wallpaperSizeDirection = this.config.wallpaperSizeDirection.filter(i => i !== direction)
            }
            else {
                this.config.wallpaperSizeDirection.push(direction)
            }
            this.setLocation()
        }
    },
    watch: {}
}
</script>

<style lang="less" scoped>
.setter {
    position: absolute;
    z-index: 4000;
    width: 100%;
    height: auto;
    min-height: 270px;

    .setter-sanjiao {
        display: block;
        position: absolute;
        top: -8px;
        right: 20px;
        border-right: 8px solid transparent;
        border-bottom: 8px solid rgba(43, 42, 42, 0.8);
        border-left: 8px solid transparent;
        width: 0;
        height: 0;
        content: "";
    }

    .setter-content {
        position: absolute;
        top: 0;
        right: 0;
        background-color: rgba(43, 42, 42, 0.9);
        cursor: default;
        width: 100%;
        height: auto;
        padding: 20px;
        padding-top: 10px;
        padding-bottom: 0;
        color: #ffffff;
        font-size: 12px;

        user-select: none;

        .setter-row {
            display: flex;
            align-items: center;
            margin: 8px 0;
            // border-bottom: 1px dashed rgba(#cccccc,0.3);
            width: 100%;

            &.flex-space-between {
                justify-content: space-between;
            }
        }

        .input-width-100 {
            width: 100px;
        }

        .input-width-140 {
            width: 140px;
        }

        .font-size-12 {
            font-size: 12px;
        }

        .checkbox-text {
            color: #ffffff;
            font-size: 12px;
        }

        .setter-header {
            margin-right: 10px;
            white-space: nowrap;
            color: #ffffff;
            font-size: 14px;
            font-weight: 500;
        }

        .setter-link {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 12px;

            &:hover {
                text-decoration: underline;
            }
        }

        .icon-direction {
            margin: 0 5px;
            color: #bbbbbb;

            &.active {
                color: #ffffff;
            }
        }

        .size-icon {
            margin: 0 10px;
        }
    }

    .setter-content-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 40px;
        line-height: 40px;
    }
}

</style>

<style lang="less">
.setter {
    .el-checkbox__label {
        color: #ffffff;
    }

    .el-radio__label {
        color: #ffffff;
    }

    .el-checkbox__inner {
        border-color: #f3f3f3 !important;
        background-color: rgba(52, 52, 53, 0.2) !important;
    }

    .el-radio__inner {
        border-color: #f3f3f3 !important;
        background-color: rgba(52, 52, 53, 0.2) !important;
    }

    .el-radio {
        margin-right: 10px !important;
    }

    .el-input__suffix {
        line-height: 26px;
    }

    .el-input__inner {
        height: 26px;
        padding-right: 15px;
        padding-left: 5px;
        line-height: 26px;
    }

    .el-input__icon {
        line-height: 26px;
    }

    .el-input.is-disabled .el-input__inner {
        background-color: #383838;
    }
}

</style>
