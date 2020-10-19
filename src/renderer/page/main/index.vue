<template>
    <div class="main-content">
        <Header @search="handleSearch"></Header>
        <ImageContent :images="images" @next="handleNext"></ImageContent>
        
        <div class="refresh-btn" :class="{'refresh-btn-ing':pageStatus === PageStatusEnum.loading}">
            <Icon class="iconfont icon-shuaxin" @click="refreshFn"></Icon>
        </div>

    </div>
</template>

<script>
// 在渲染器进程 (网页) 中。

import { getSystemInfo, utils } from '$render/utils'
import { PageStatusEnum } from '$render/config'
import { apiStatisticActive } from '$render/api'
import ImageSource from '$render/get-image'

import SystemMixin from '$render/mixin/system.mixin'
import ImageDealMixin from '$render/mixin/image-deal.mixin'

import ImageContent from './image-content.vue'
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
            page: 1, // 请求数据的页数，从1开始编号
            
            havaDataFlag: true, // 标记是否还有数据
            getDataFlag: false, // 标记页面是否正在请求数据
            refreshBtnIng: false, // 是否正在刷新
            
            images: [], // 图片列表
        }
    },

    created(){
        this.PageStatusEnum = PageStatusEnum
        this.activeImageSource = ImageSource[this.config.imageSource]
    },

    mounted() {
        this.pageInit()
    },

    methods: {
        domContentMainMatch(){
            window.setTimeout(() => {
                const header = this.$el.querySelector('.header')
                const content = this.$el.querySelector('.content')
                if (header && content) {
                    const { height } = header.getBoundingClientRect()
                    content.style.paddingTop = `${height}px`
                }
            }, 500)
        },

        /**
         * 刷新
         * @function refreshFn
         */
        refreshFn() {
            this.storeSetPageStatus(PageStatusEnum.refresh)
            this.destroyAll()
            this.pageInit()
        },

        /**
         * 中断所有的请求
         * @function destroyAll
         */
        destroyAll() {
            this.$swLoading.close()
            // 取消列表请求
            this.activeImageSource.cancelImage()
            // 取消设置壁纸
            this.cancelWallpaper()
        },

        handleSearch(keyWord){
            this.destroyAll()
            this.pageDataInit()
            this.getData()
        },

        /**
         * 获取数据接口
         * @function getData
         */
        async getData() {
            this.storeSetPageStatus(PageStatusEnum.loading)
            const params = {
                searchKey: this.searchKey,
                page: this.page,
                imageSource: this.config.imageSource
            }
            
            return new Promise((resolve, reject) => {
                this.activeImageSource.getImage(params).then((result) => {
                    this.urlsDeal(result)
                    resolve(result)
                }).catch((error) => {
                    this.storeSetPageStatus(PageStatusEnum.netError)
                    reject(error)
                })
            })
        },

        pageDataInit(){
            this.images = []
            this.page = 1

            this.storeSetPageStatus(PageStatusEnum.null)
            this.storeSetIsSetting(false)
            this.storeSetProgressValue(0)
            this.storeSetCurrentWallpaperBkColor('#fff')
            this.storeSetCurrentWallpaperIndex(0)
        },

        handleNext(){
            this.page = this.page + 1
            this.getData()
        },

        async pageInit(){
            this.pageDataInit()
            
            this.storeSetSearchKey('')
            
            if (this.activeImageSource.getSearchSelectLists){
                if (this.activeImageSource.searchSelectLists.length === 0){
                    await this.activeImageSource.getSearchSelectLists().then((res) => {
                        if (res.length){
                            this.storeSetSearchKey(res[0].value)
                        }
                        this.storeSetSearchSelectLists(res)
                    })
                } else {
                    this.storeSetSearchSelectLists(this.activeImageSource.searchSelectLists)
                    this.storeSetSearchKey(this.activeImageSource.searchSelectLists[0].value)
                }
            }

            this.domContentMainMatch()
            
            this.getData()
        },

    },
    watch: {
        'config.imageSource': function (val, oldVal) {
            if (ImageSource[oldVal].getSearchSelectLists){
                this.storeSetSearchKey('')
            }
            this.activeImageSource = ImageSource[val]
            this.pageInit()
        },
    },
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
    cursor: pointer;
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
