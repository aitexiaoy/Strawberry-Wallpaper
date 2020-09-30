<template>
    <div class="main-content" @keydown.enter="keydownEnterFn">
        <Header @search="handleSearch"></Header>
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

import ImageContent from './image-content.vue'
import ImageDealMixin from './image-deal.mixin'
import SystemMixin from './system.mixin'
import Header from './header.vue'


export default {
    name: 'mainContent',
    components: {
        Header,
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
}

.main-content {
    position: relative;
    box-sizing: border-box;
    background-color: transparent;
    // padding-top: 30px;
    width: 100%;
    height: 100%;
    overflow: hidden;
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
