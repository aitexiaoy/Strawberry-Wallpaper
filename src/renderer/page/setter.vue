<template>
<div class="setter">
    <div class="setter-sanjiao"></div>
    <div class="setter-bk"></div>
    <div class="setter-content">
        <div class="setter-row-one">
            <div>
                <!-- <i class="iconfont icon-banbenhao"></i> -->
                {{version1}}
            </div>
            <div @click.stop="quit">
                <i class="iconfont icon-tuichu"></i>
            </div>
        </div>

        <div class="setter-row">
            <el-checkbox v-model="isOpenStatr" @change="set_open_start"><span class="checkbox-text">开机自动启动</span></el-checkbox>
        </div>

        

        <!-- <div class="setter-row">
            <el-radio-group v-model="imageSource">
                <el-radio label="Biying">必应</el-radio>
                <el-radio label="pexels"><span class="checkbox-text">pexels</span></el-radio>
                <el-radio label="pola">pola</el-radio>
            </el-radio-group>
        </div> -->

        <div class="setter-row">
            <el-checkbox v-model="wallpaperAutoUp" @change="wallpaper_auto_change"><span class="checkbox-text">壁纸自动更新</span></el-checkbox>
        </div>

        <div class="setter-row">
            <el-radio-group v-model="updataTime" @change="updata_time_change">
                <el-radio label="3600" :disabled="wallpaperAutoUp==false"><span class="checkbox-text">每小时</span></el-radio>
                <el-radio label="604800" :disabled="wallpaperAutoUp==false"><span class="checkbox-text">每周</span></el-radio>
            </el-radio-group>
        </div>

        <div class="setter-row image-sourece">图片来源: pexels.com</div>
        <div class="about-pro" @click="about_pro">关于项目</div>
    </div>

</div>
</template>

<script>
import {
    open_autoStart,
    open_disStart,
    open_type
} from '../../file/open-start.js'

const shell = require('electron').shell

export default {
    name: 'setter',
    data() {
        return {
            version1: 'v0.1试用版',
            imageSource: 'pexels',
            updataTime: '3600',
            isOpenStatr: false, //开机启动
            wallpaperAutoUp: false, //壁纸自动更新
        }
    },
    mounted() {
        let data = this.$localStorage.getStore('userConfig');
        for (let index in data) {
            this[index] = data[index] || this[index];
        }
        if (open_type()) {
            this.isOpenStatr = true;
        } else {
            this.isOpenStatr = false;
        }
    },
    methods: {
        set_open_start() {
            if (this.isOpenStatr) {
                open_autoStart();
            } else {
                open_disStart();
            }
            Vue.$ipcRenderer.send('btn', {
                type: 'openStart',
                data: this.isOpenStatr
            });
            this.setLocation();
        },
        quit() {
            Vue.$ipcRenderer.send('btn', {
                type: 'quit',
                data: ''
            });
        },

        //打开外部链接
        about_pro(){
            shell.openExternal('http://electron.atom.io')
        },

        /***将配置信息存到localstorage中 */
        setLocation() {
            Vue.$localStorage.setStore('userConfig', {
                // version: this.version,
                imageSource: this.imageSource,
                updataTime: this.updataTime,
                isOpenStatr: this.isOpenStatr, //开机启动
                wallpaperAutoUp: this.wallpaperAutoUp, //壁纸自动更新
            })
        },

        wallpaper_auto_change() {
            if(!this.wallpaperAutoUp){
                this.updataTime=-1;
            }
            else{
                this.updataTime='3600'; 
            }
            this.setLocation();
        },
        updata_time_change() {
            this.setLocation();
            this.$localStorage.setStore('lastUpdataTime', parseInt((new Date()).getTime() / 1000))
        },
    }
}
</script>

<style lang="less" scoped>
.setter {
    // background-color: #767678;
    width: 240px;
    height: 200px;
    position: absolute;
    right: -10px;
    top: 30px;
    z-index: 4000;
    // padding: 20px;
    // color: #fff;
    // user-select: none;
    // cursor: default;
    // font-size: 12px;

    .setter-row {
        display: flex;
        width: 100%;
        height: 34px;
        align-items: center;
    }

    .image-sourece {
        height: 30px;
        font-weight: 500px;
    }

    .setter-row-one {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        .icon-tuichu{
            font-size: 20px;
        }
    }
    .setter-content{
        background-color: rgba(43, 42, 42, 0.8);
        width: 240px;
        height: 200px;
        position: absolute;
        right: 0px;
        top: 0px;
        padding: 20px;
        color: #fff;
        user-select: none;
        cursor: default;
        font-size: 12px;
        padding-top: 10px;
    }

    .setter-bk {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0px;
        left: 0px;
        background-color: rgba(43, 42, 42, 0.8);
        filter: blur(2px);
        overflow: hidden;
    }

    .checkbox-text{
        color: #fff;
    }

    .about-pro:hover{
        text-decoration:underline;
    }

}

.setter-sanjiao {
    content: '';
    display: block;
    width: 0;
    height: 0;
    position: absolute;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid rgba(43, 42, 42, 0.8);
    top: -8px;
    right: 10px;
}
</style>

<style lang="less">
.setter {
    .el-checkbox__label {
        color: #fff;
    }

    .el-radio__label {
        color: #fff;
    }
    .el-checkbox__inner{
        background-color: rgba(52, 52, 53, 0.2) !important;
        border-color: #f3f3f3 !important;
    }
    .el-radio__inner{
        background-color: rgba(52, 52, 53, 0.2) !important;
        border-color: #f3f3f3 !important;
    }
}
</style>
