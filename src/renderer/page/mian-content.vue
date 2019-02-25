<template>
<div class="main-content" @keydown.enter="keydown_enter_fn">
    <el-collapse-transition>
        <setter class="setter-content" v-show="setterShow"></setter>
    </el-collapse-transition>
    <div class="header">
        <el-row class="header-row-one">
            <div class="left">
                <h1 class="text">Strawberry</h1>
            </div>
            <div class="right">
                <i class="iconfont icon-wenjianjia" @click.stop="open_download_file"></i>
                <div class="header-set">
                    <i class="iconfont icon-shezhi" @click.stop="setterShow=!setterShow"></i>
                </div>
            </div>
        </el-row>
        <div class="header-search">
            <el-input class="header-search-input" v-model="searchKey" placeholder="关键词[英文]" size="small" @focus="searchKeyFocus=true" @blur="searchKeyFocus=false"></el-input>
            <i class="iconfont icon-sousuo" @click.stop="search_key_fn"></i>
        </div>
    </div>

    <div class="content"  @scroll="content_scroll">
        <div class="content-main" v-if="images.length>0">
            <div class="image-item" :ref="'image_item_'+index" v-for="(img,index) in images" :key="index" :class="{'image-item-img-first':index===0}" :style="{'backgroundColor':img.backgroundColor}" @mousemove.stop="currentMouseOverIndex=index" @mouseleave.stop="currentMouseOverIndex=-1">
                <div class="image-item-img" v-imagematch="img.url">
                    <!-- <img class="image-item-img" 
                :src="img.url" 
                @load="img_load($event,img)" 
                :alt="img.name"> -->
                </div>
                <div class="image-set-wallpaper" v-show="currentMouseOverIndex==index&&isSetting==false" @click.stop="set_wallpaper(img,index)">
                    <i class="iconfont icon-xianshiqi"></i>
                    <span>设置壁纸</span>
                </div>

                <div class="image-item-flag" v-show="currentMouseOverIndex==index&&isSetting==false">
                    <div class="image-item-flag-direction" v-show="img.directionColumn">
                        <i class="iconfont icon-xiaoqing-tubiao-hengping"></i>
                    </div>
                    <div class="image-item-tip" :style="{'color':img.tip=='5k'?'#e0620d':img.tip=='4k'?'17abe3':'d3217b'}">
                        {{img.tip}}
                    </div>
                </div>

            </div>
        </div>

        <div class="content-main-no" v-else>
            <span v-if="get_data_flag==true">美好的事情即将发生...</span>
            <span v-else>暂时没有搜索到...</span>
        </div>

    </div>
</div>
</template>

<script>
//在渲染器进程 (网页) 中。

global.vue = null;

const shell = require('electron').shell
const os = require('os')

import setter from './setter.vue'
import {
    request
} from 'http';

import {
    mkdirSync
} from '../../file/file2.js'
export default {
    name: 'mainContent',
    components: {
        setter
    },
    data() {
        return {
            currentMouseOverIndex: -1,
            currentWallpaperIndex: 0,
            searchKey: '',
            setterShow: false,
            isSetting: false,
            images: [],
            hava_data_flag: true, //标记是否还有数据
            page: 0, //请求数据的页数
            get_data_flag: false,
            searchKeyFocus: false,
            osType:'Darwin',
        }
    },
    beforeCreate() {
        vue = this;
    },

    mounted() {

        this.osType=os.type();

        Vue.$ipcRenderer.on('dataWallpaper', (event, arg) => {
            //设置一个时间记录最后更新的时间
            vue.$localStorage.setStore('lastUpdataTime', parseInt((new Date()).getTime() / 1000))
            vue.isSetting = false;
            vue.$fbloading.close();
        })

        Vue.$ipcRenderer.on('datainfo', (event, arg) => {
            if (arg.type == 'urls') {
                this.get_data_flag = false;
                if (arg.data.length == 0) {
                    this.hava_data_flag = false;
                    return;
                }
                if (this.page == 0) {
                    this.images = [];
                }
                vue.get_urls(arg.data);
            } else if (arg.type == 'windowShow') {
                if (arg.data) {
                    this.setterShow = false;
                } else {
                    this.setterShow = false;
                }
            }
        })

        Vue.$ipcRenderer.on('check_newVersion', (event, arg) => {
            console.log(arg);
            this.haveNewVersion(arg);
        })

        Vue.$ipcRenderer.on('rendererConfirm',(event,data)=>{
            console.log(data);
              this.$confirm(data.content||'', data.title||'消息提醒', {
                confirmButtonText:data.suerText||'确定',
                cancelButtonText:data.cancelText||'取消',
                type: data.type||'info'
            }).then(() => {
                if(data.sureFn){
                    Vue.$ipcRenderer.send('maincallback',data.sureFn,data.argument)
                }
            }).catch(() => {
                if(data.cancelFn){
                    Vue.$ipcRenderer.send('maincallback',data.sureFn,data.argument)                    
                }
            });
        })

        this.searchKey = this.$localStorage.getStore('searchKey');

        vue.images = [];
        this.get_data();

        // if (this.$localStorage.getStore('aa')) {
        //     vue.images = [];
        //     let urls = this.$localStorage.getStore('aa');
        //     this.urls_deal(urls);
        // }

        //30s执行一次
        window.setInterval(() => {
            this.wallpaperAuto();
        }, 3000);
    },

    methods: {

        keydown_enter_fn() {
            if (this.searchKeyFocus) {
                this.search_key_fn();
            }
        },
        randomColor() {
            return '#' + Math.floor(Math.random() * 0xffffff).toString(16);
        },
        /*** 设置壁纸按钮 */
        set_wallpaper(img, index) {
            this.isSetting = true;
            if (!this.$refs['image_item_' + index][0]) {
                return;
            }
            this.$fbloading.open(this.$refs['image_item_' + index][0]);
            Vue.$ipcRenderer.send('dataWallpaper', img);
            this.currentWallpaperIndex = index;
        },
        img_load(img) {
            console.log(img)
        },
        open_download_file() {
            // shell.showItemInFolder(os.homedir()+'/Downloads/');
            mkdirSync(os.homedir() + '/Downloads/wallpaper');    //判断是否有文件夹
            shell.openItem(os.homedir() + '/Downloads/wallpaper');
        },
        image_tip(width, height) {
            let val = parseInt(width) * parseInt(height);
            if (val > (5120 * 2880)) {
                return '5k';
            } else if (val > (3840 * 2160)) {
                return '4k'
            } else {
                return '2k';
            }
        },

        image_direction(width, height) {
            return width >= height ? false : true;
        },

        /** 壁纸自动更新 */
        wallpaperAuto() {
            let userConfig = this.$localStorage.getStore('userConfig');
            //如果正在设置,则弹出去
            if (this.isSetting == true || this.images.length == 0) {
                return;
            }
            if (this.hava_data_flag && this.currentWallpaperIndex == this.images.length - 5) {
                this.page = this.page + 1;
                this.get_data();
            }
            if (userConfig.wallpaperAutoUp == true) {
                if (this.$localStorage.getStore('lastUpdataTime')) {
                    let current_time = parseInt((new Date()).getTime() / 1000);
                    if (!isNaN(parseInt(userConfig.updataTime))) {
                        if (Math.abs(current_time - parseInt(this.$localStorage.getStore('lastUpdataTime'))) > parseInt(userConfig.updataTime)) {
                            let index = this.images[this.currentWallpaperIndex + 1] ? this.currentWallpaperIndex + 1 : 0;
                            this.set_wallpaper(this.images[index], index);
                        }
                    }
                }
            }
        },

        /** 搜索按钮 */
        search_key_fn() {
            if (this.searchKey == this.$localStorage.getStore('searchKey')) {
                return;
            }
            this.$localStorage.setStore('searchKey', this.searchKey);
            this.page = 0;
            this.images = [];
            this.get_data();
        },

        get_urls(urls) {
            this.urls_deal(urls);
            // this.$localStorage.setStore('aa', vue.images);
        },
        /*** 对获取到的地址进行处理 */
        urls_deal(urls) {
            urls.forEach(e => {
                let obj = {
                    url: e.url,
                    name: '',
                    tip: vue.image_tip(e.width, e.height),
                    directionColumn: vue.image_direction(e.width, e.height),
                    downloadUrl: e.downloadUrl,
                    width: e.width,
                    height: e.height,
                    backgroundColor: vue.randomColor(),
                };
                vue.images.push(obj);
            });
        },

        /*** 滚动条事件 */
        content_scroll(event) {
            let el = event.srcElement || event.target;
            if (this.hava_data_flag == true && this.get_data_flag == false) {
                if (el.scrollTop + 900 > el.querySelector('.content-main').clientHeight) {
                    this.page = this.page + 1;
                    this.get_data();
                }
            }

        },
        get_data() {
            this.get_data_flag = true;
            let obj = {
                searchKey: this.searchKey,
                page: this.page
            }
            Vue.$ipcRenderer.send('getImageUrls', obj);
        },
        haveNewVersion(newVersion) {
            this.$confirm(newVersion, '版本检测', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                Vue.$ipcRenderer.send('btn', {
                    type: 'updataNewVersion',
                })
            }).catch(() => {

            });
        }
    },
}
</script>

<style lang="less" scoped>
.main-content {
    // padding-top: 30px;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    border-radius: 5px;
    box-sizing: border-box;
    position: relative;

    // background-color: red;
    .header {
        position: fixed;
        width: 100%;
        height: 96px;
        z-index: 3000;
        padding-left: 20px;
        padding-right: 20px;
        background-color: rgba(34, 34, 34, 0.9);
        /* opacity: 0.9; */
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

        .setter-content {}

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
        content: '';
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
        margin-top: 96px;
    }

    .content {
        width: calc(~'100% + 15px');
        height: 600px;
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
            border-bottom: 1px solid #fff;

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
    .content-win{
        width: calc(~'100% + 17px');
        .image-item{
            height: 240px;
        }
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
</style>
