<template>
    <Secondary class="setter" title="设置">
        <div class="setter-content">
            <div class="setter-row flex-space-between">
                <div>
                    {{version}}
                    <span class="setter-link font-size-12" @click.stop="handleNewVersionClick">
                        检查更新
                    </span>
                </div>
                <div class="setter-link" @click.stop="quit">
                    退出
                </div>
            </div>

            <div class="setter-row">
                <el-checkbox size="mini" :value="config.isOpenStatr" @change="setOpenStart">
                    <span class="setter-header">开机自动启动</span>
                </el-checkbox>
            </div>

            <div class="setter-row">
                <el-checkbox size="mini" :value="config.wallpaperAutoUp" @change="wallpaperAutoChange">
                    <span class="setter-header">是否自动更新</span>
                </el-checkbox>

                <el-radio-group
                    size="mini"
                    :value="config.updataTime"
                    :disabled="config.wallpaperAutoUp===false"
                    :style="{'whiteSpace':'nowrap'}"
                    @input="handleUpdataTimeInputChange">
                    <el-radio :label="3600">
                        <span class="checkbox-text">小时</span>
                    </el-radio>
                    <el-radio :label="86400">
                        <span class="checkbox-text">天</span>
                    </el-radio>
                </el-radio-group>
                <el-input
                    :disabled="config.wallpaperAutoUp==false"
                    placeholder="自定义"
                    size="mini"
                    :value="config.updataTime"
                    @input="handleUpdataTimeInputChange">
                    <span slot="suffix">秒</span>
                </el-input>

            </div>

            <div class="setter-row">
                <span class="checkbox-text setter-header">自定义过滤图片方向：</span>
                <el-checkbox-group size="mini" :value="config.wallpaperSizeDirection" @input="handleDirectionChange">
                    <el-checkbox label="heng">横向</el-checkbox>
                    <el-checkbox label="su">纵向</el-checkbox>
                </el-checkbox-group>
            </div>
            
            <div class="setter-row">
                <span class="checkbox-text setter-header">自定义过滤尺寸：</span>
                <el-input
                    class="myselef-time"
                    placeholder="宽"
                    size="mini"
                    :value="config.wallpaperSizeWidth"
                    @input="handleWallpaperSizeWidthChange">
                    <span slot="suffix">px</span>
                </el-input>
                <span class="size-icon">x</span>
                <el-input
                    class="myselef-time"
                    placeholder="高"
                    size="mini"
                    :value="config.wallpaperSizeHeight"
                    @input="handleWallpaperSizeHeightChange">
                    <span slot="suffix">px</span>
                </el-input>
            </div>

            <div v-if="isMac" class="setter-row flex-space-between">
                <span class="checkbox-text setter-header">壁纸填充方式：</span>
                <el-select
                    size="mini"
                    :value="config.wallpaperScale"
                    class="input-width-140"
                    @change="handleWallpaperScale">
                    <el-option
                        v-for="item in wallpaperScaleOptions"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div v-if="isMac" class="setter-row">
                <span class="checkbox-text setter-header">多屏设置：</span>
                <el-radio-group size="mini" :value="config.autoSetAllScreens" @input="handleSetAllScreensChange">
                    <el-radio :label="true">
                        <span class="checkbox-text">应用到所有屏幕</span>
                    </el-radio>
                    <el-radio :label="false">
                        <span class="checkbox-text">当前屏幕</span>
                    </el-radio>
                </el-radio-group>
            </div>

            <div class="setter-row">
                <span class="setter-header">壁纸保存路径：</span>
                <span class="setter-link" @click="setDefalutDownloadPath">{{config.downloadImagePath}}</span>
            </div>

            <div class="setter-row flex-space-between">
                <span class="setter-header">定时清空已下载壁纸：</span>
                <el-input
                    class="input-width-100"
                    placeholder="自定义"
                    size="mini"
                    :value="config.autoClearnDownloadFilesTime"
                    @input="handleClearnDownloadFilesTimeInput">
                    <span slot="suffix">天</span>
                </el-input>
            </div>

            <div class="setter-row">
                <span class="setter-header">图片来源：</span>
                <span class="setter-link" @click="gotToWallPaperHome(config.imageSource)">{{config.imageSource}}</span>
            </div>

            <div class="setter-row">
                <el-radio-group :value="config.imageSource" @input="handleImageSourceChange">
                    <template v-for="item in imageSourceType">
                        <el-radio :key="item.name" :label="item.name">
                            <span class="checkbox-text">{{item.label}}</span>
                        </el-radio>
                    </template>
                </el-radio-group>
            </div>

            <div class="setter-content-footer">
                <div class="setter-link" @click="suggestion">意见反馈</div>
                <div class="setter-link" @click="aboutPro">关于项目</div>
            </div>
        </div>
    </Secondary>

</template>

<script>
import { ipcRenderer, remote, shell } from 'electron'
import { utils, autoOpen, wallpaper } from '$render/utils'
import { wallpaperScaleOptions } from '$render/config'
import ImageSource from '$render/get-image'

const { isMac, version } = utils

export default {
    name: 'Setter',
    props: {},
    data() {
        return {
            version, // 版本    
            isMac,
            wallpaperScaleOptions,
            imageSourceType: [],
        }
    },

    created(){
        this.imageSourceType = Object.values(ImageSource).map(item => item.options)
    },

    mounted() {
        this.$ipcRenderer.on('defaultPath', (event, arg) => {
            this.storeSetConfig({ downloadImagePath: arg })
        })
    },
    methods: {

        // 设置开机启动
        setOpenStart(val) {
            autoOpen.openAutoStart(val)
            this.storeSetConfig({ isOpenStatr: val })
        },
        
        /**
         * 关于项目
         */
        aboutPro() {
            this.$router.replace('/about')
        },

        /**
         * 意见反馈
         */
        suggestion() {
            this.$router.replace('/suggestion')
        },

        handleSetAllScreensChange(val) {
            this.storeSetConfig({ autoSetAllScreens: val })
        },

        // 壁纸自动更新
        wallpaperAutoChange(val) {
            this.storeSetConfig({ wallpaperAutoUp: val })
         
            this.handleUpdataTimeInputChange(!val ? -1 : val)
        },

        // 设置更新周期
        handleUpdataTimeInputChange(val){
            this.beforeInputNumberValueChange(val, 'updataTime', { min: 120, max: 864000, defaultValue: 3600 }, () => {
                this.$localStorage.setStore('lastUpdataTime', +new Date())
            })
        },
        
        // 设置自动清空周期
        handleClearnDownloadFilesTimeInput(val){
            this.beforeInputNumberValueChange(val, 'autoClearnDownloadFilesTime', { min: 1, max: 999999, defaultValue: 9999 }, () => {
                this.$localStorage.setStore('lastCleararnDownloadFilesTime', +new Date())
            })
        },

        // input输入框的数字处理
        beforeInputNumberValueChange(val, key, { min = 1, max = 999999, defaultValue = 1 }, callback = () => {}){
            const value = parseInt(val, 10)
            if (val === ''){
                this.config[key] = ''
                window.setTimeout(() => {
                    if (this.config[key] === ''){
                        this.storeSetConfig({ [key]: defaultValue })
                        callback()
                    }
                }, 500)
                return
            }
            if (Number.isNaN(value)){
                this.storeSetConfig({ [key]: defaultValue })
            }
            else {
                this.storeSetConfig({ [key]: Math.min(Math.max(value, min), max) })
            }
            callback()
        },

        
        /**
         * 更改图片来源
         */
        handleImageSourceChange(val) {
            this.storeSetConfig({ imageSource: val })
            this.$router.go(-1)
        },
        /**
         * 检测更新
         */
        handleNewVersionClick() {
            this.$ipcRenderer.send('btn', {
                type: 'checkNewVersion',
                data: { version }
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

        // 退出
        quit() {
            this.$ipcRenderer.send('btn', {
                type: 'quit',
                data: ''
            })
        },

        /** 
         * 浏览器打开指定链接 
        */
        gotToWallPaperHome(sourece) {
            const current = this.imageSourceType.find(i => i.name === sourece)
            if (current && current.home) {
                shell.openExternal(current.home)
            }  
        },

        // 更改填充方式
        handleWallpaperScale(val){
            this.storeSetConfig({ wallpaperScale: val })
            wallpaper.changeWallpaperScale({ scale: val })
        },

        // 尺寸宽
        handleWallpaperSizeWidthChange(val){
            this.beforeInputNumberValueChange(val, 'wallpaperSizeWidth', { min: 1, max: 999999, defaultValue: 1600 })
        },

        // 尺寸高
        handleWallpaperSizeHeightChange(val){
            this.beforeInputNumberValueChange(val, 'wallpaperSizeHeight', { min: 1, max: 999999, defaultValue: 1080 })
        },

        // 更改方向
        handleDirectionChange(direction){
            this.storeSetConfig({ wallpaperSizeDirection: direction })
        }
    },
    watch: {}
}
</script>

<style lang="less" scoped>
.setter {
    cursor: default;

    .setter-content {
        width: 100%;
        height: auto;
        color: #ffffff;
        font-size: 12px;

        user-select: none;

        .setter-row {
            display: flex;
            align-items: center;
            // margin: 12px 0;
            // border-bottom: 1px dashed rgba(#cccccc,0.3);
            width: 100%;
            height: 38px;

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
            font-size: 12px;
            font-weight: 500;
        }

        .setter-link {
            cursor: pointer;
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

        .iconfont {
            cursor: pointer;
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
    .el-checkbox {
        margin-right: 12px;

        &.is-checked,
        & {
            .el-checkbox__label {
                color: #ffffff;
                font-size: 12px;
            }
        }
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
