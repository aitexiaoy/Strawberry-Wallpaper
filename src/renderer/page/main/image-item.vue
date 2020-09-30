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
            <div class="flag-item direction" v-show="img.direction==='su'">
                <i class="iconfont icon-su-ping"></i>
            </div>
            <div class="flag-item tip" :style="{'color':img.tip=='5k'?'#e0620d':img.tip=='4k'?'17abe3':'d3217b'}">{{img.tip}}</div>
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
            }).finally(() => {
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

<style lang="less" scoped>
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
        cursor: pointer;
        width: auto;
        width: 120px;
        height: 33px;
        text-align: center;
        line-height: 33px;
        color: var(--main-text-color);

        &:hover {
            background-color: rgba(0, 0, 0, 0.7);
        }

        .iconfont {
            margin-right: 8px;
        }
    }

    .image-item-flag {
        display: flex;
        justify-content: flex-end;
        position: absolute;
        top: 10px;
        right: 14px;

        .flag-item {
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            background-color: rgba(0, 0, 0, 0.6);
            width: 26px;
            height: 26px;
            color: var(--main-text-color);

            /deep/ & + .flag-item {
                margin-left: 8px;
            }
        }

        .tip {
            color: #52b7fc;
            font-size: 12px;
        }
    }
}

</style>
