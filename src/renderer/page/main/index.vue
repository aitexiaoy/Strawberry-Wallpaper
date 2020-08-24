<template>
    <div class="main-content" @keydown.enter="keydownEnterFn">
        <div class="header">
            <div class="header-content">
                <Nav></Nav>
                <Search @search="handleSearch"></Search>
            </div>

            <Progress v-if="downloadProgress>0" :value="downloadProgress" :color="currentImageBacColor"></Progress>
        </div>

        <ImageContent 
        :images="images"
        @setWallpaperFinally="handleSetWallpaperFinally"></ImageContent>

        <div class="refresh-btn" :class="{'refresh-btn-ing':refreshBtnIng}">
            <Icon class="iconfont icon-shuaxin" @click="refreshFn"></Icon>
        </div>

    </div>
</template>

<script>
// 在渲染器进程 (网页) 中。

import { getSystemInfo, utils } from '$render/utils'
import { infoShowText } from '$render/config'
import { apiStatisticActive } from '$render/api'
import ImageSource from '$render/get-image'

import Nav from './nav.vue'
import ImageContent from './image-content.vue'
import Search from './search.vue'
import ImageDealMixin from './image-deal.mixin'
import SystemMixin from './system.mixin'


export default {
    name: 'mainContent',
    components: {
        Nav,
        Search,
        ImageContent,
    },
    mixins: [ImageDealMixin, SystemMixin],
    data() {
        return {
            page: 0, // 请求数据的页数
            
            havaDataFlag: true, // 标记是否还有数据
            getDataFlag: false, // 标记页面是否正在请求数据
            refreshBtnIng: false, // 是否正在刷新

            images: [], // 图片列表
            imageSource: '', // 图片来源
            currentImageBacColor: '#ddd', // 进度条的颜色
        }
    },

    computed: {
        imageSourceOptions(){
            return this.activeImageSource ? this.activeImageSource.options : {}
        }
    },

    created(){
        this.imageSource = this.config.imageSource
        this.storeActionActiveImageSource(ImageSource[this.imageSource])
    },

    mounted() {
        this.clearLocalStorage()
       
        this.pageInit()
        
        this.domContentMainMatch()
    },

    methods: {
        /**
         * 清除因版本更新后不再使用字段
         */
        clearLocalStorage(params) {
            ['first_install_flag', 'first_install_flag_v1.1', 'statisticTimeFlag'].forEach((key) => {
                this.$localStorage.removeStore(key)
            })
        },

        domContentMainMatch(){
            this.$nextTick(() => {
                if (this.$refs.content_main && document.querySelector('.header')){
                    this.$refs.content_main.style.paddingTop = `${document.querySelector('.header').offsetHeight}px`
                }
            })
        },

        handleSetWallpaperFinally(status){
            this.getDataFlag = false
            this.refreshBtnIng = false
            
            if (status){
                this.storeSetInfoShow(infoShowText.null)
            }
            else {
                this.storeSetInfoShow(infoShowText.netError)
            }
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
            this.refreshBtnIng = true
            // 设置一个时间记录最后更新的时间
            this.$localStorage.setStore('lastUpdataTime', +new Date())
            this.$swLoading.close()
        },

        /**
         * 中断所有的请求
         * @function destroyAll
         */
        destroyAll() {
            this.storeSetDownloadProgress(0)
            this.storeSetIsSetting(false)
            this.$swLoading.close()
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

        // 设置变更
        handleSetterChange(){
            this.config = this.$localStorage.getStore('userConfig') || {}
        },

        handleSearch(){
            this.page = 0
            this.images = []
            this.destroyAll()
            this.getData()
        },

        /**
         * 获取数据接口
         * @function getData
         */
        async getData() {
            this.getDataFlag = true
            this.storeSetInfoShow(infoShowText.loading)
            return new Promise((resolve, reject) => {
                this.activeImageSource.getImage({
                    searchKey: this.searchKey,
                    page: this.page,
                    imageSource: this.imageSource
                }).then((result) => {
                    this.getDataFlag = false            
                    this.refreshBtnIng = false
                    this.storeSetInfoShow(infoShowText.null)
                    this.urlsDeal(result)
                    resolve(result)
                }, reject)
            })
        },

        async pageInit(){
            this.images = []
            this.page = 0
            this.refreshBtnIng = false
            this.getDataFlag = false
            
            this.storeSetSearchKey('')
            this.storeSetIsSetting(false)
            this.storeSetDownloadProgress(0)
            this.storeSetCurrentWallpaperBkColor('#fff')
            this.storeSetCurrentWallpaperIndex(0)

            if (this.activeImageSource.getSearchTypes){
                const searchTypes = await this.activeImageSource.getSearchTypes()
                if (searchTypes.length){
                    this.storeSetSearchKey(searchTypes[0].value)
                }
            }
            
            this.getData()
        },

    },
    watch: {
        imageSource(val, oldVal) {
            this.pageInit()
        },
    }
}
</script>

<style lang="less" scoped>
.setter-content {
    top: 45px;

    // &.setter-content-mac {
    //     top: 55px;
    // }
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

        .header-content {
            width: 100%;
            padding-right: 20px;
            padding-left: 20px;
        }

        .iconfont {
            margin-left: 8px;
            // color: #dddddd;
        }

        .left {
            flex: auto;
        }

        .right {
            display: flex;
            flex: none;
            align-items: center;

            .icon-gonggao {
                &.no-watch {
                    color: #ff3f00;
                }
            }
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
