<template>
    <div
        class="image-item"
        :style="{'backgroundColor':img.backgroundColor}"
        @mousemove.stop="setterShow = true"
        @mouseleave.stop="setterShow = false">
        <div class="image-item-img" v-imagematch="img.url"></div>
        <div class="image-set-wallpaper" v-show="setterShow && isSetting==false" @click.stop="setWallpaper(img,index)">
            <i class="iconfont icon-xianshiqi"></i>
            <span>设置壁纸</span>
        </div>

        <div class="image-item-flag" v-show="setterShow && isSetting==false">
            <div class="image-item-flag-direction" v-show="img.direction==='su'">
                <i class="iconfont icon-su-ping"></i>
            </div>
            <div class="image-item-tip" :style="{'color':img.tip=='5k'?'#e0620d':img.tip=='4k'?'17abe3':'d3217b'}">{{img.tip}}</div>
        </div>
    </div>
</template>

<script>
import { wallpaper } from '$render/utils'

export default {
    name: 'ImageItem',
    props: ['img'],
    data() {
        return {
            setterShow: false,
        }
    },
    methods: {
        /**
         * 设置壁纸
         * @function setWallpaper
         * @param {Object} img 当前图片数据
         * @param {Number} index 数组索引
         */
        setWallpaper(img, index) {
            this.isSetting = true
            this.storeSetIsSetting(true)
            this.$swLoading.open(this.$el)
            
            this.currentImageBacColor = img.backgroundColor
            wallpaper.setWallpaper(img, this.config, (progress) => {
                this.storeSetDownloadProgress(progress)
            }).finish(() => {
                this.storeSetIsSetting(false)
                this.$swLoading.close(this.$el)
            }).then(() => {
                this.storeSetCurrentWallpaperIndex(this.currentWallpaperIndex + 1)
                this.$localStorage.setStore('lastUpdataTime', +new Date())
            })
        },
    }
}
</script>

<style>

</style>
