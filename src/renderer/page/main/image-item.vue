<template>
    <div
        class="image-item"
        :style="{'backgroundColor':img.backgroundColor}"
        @mousemove.stop="setterShow = true"
        @mouseleave.stop="setterShow = false">
        <div v-imagematch="img.url" class="image-item-img"></div>
        <div v-show="setterShow && isSetting==false" class="image-set-wallpaper" @click.stop="setWallpaperItem(img)">
            <i class="iconfont icon-xianshiqi"></i>
            <span>设置壁纸</span>
        </div>

        <div v-show="setterShow && isSetting==false" class="image-item-flag">
            <div v-show="img.direction==='su'" class="flag-item direction">
                <i class="iconfont icon-su-ping"></i>
            </div>
            <div class="flag-item tip" :style="{'color':img.tip=='5k'?'#e0620d':img.tip=='4k'?'#17abe3':'#d3217b'}">{{img.tip}}</div>
        </div>
    </div>
</template>

<script>
import SetWallpaperMixin from '$render/mixin/set-wallpaper.mixin'
import { wallpaper } from '$render/utils'

export default {
    name: 'ImageItem',
    props: ['img'],
    mixins: [SetWallpaperMixin],
    data() {
        return {
            setterShow: false,
        }
    },

    methods: {
        /**
         * 设置壁纸
         * @function setWallpaperItem
         * @param {Object} img 当前图片数据
         */
        setWallpaperItem(img) {
            this.$swLoading.open(this.$el)
            this.setWallpaper(img).finally(() => {
                this.$swLoading.close(this.$el)
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
    border-bottom: 1px solid var(--image-item-bottom-color);
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
        background-color: var(--image-item-wallpaper-bk);
        cursor: pointer;
        width: auto;
        width: 120px;
        height: 33px;
        text-align: center;
        line-height: 33px;
        color: var(--main-text-color);

        &:hover {
            background-color: var(--image-item-wallpaper-bk-hover);
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
            background-color: var(--image-item-wallpaper-flag-bk);
            width: 26px;
            height: 26px;
            color: var(--main-text-color);

            & + .flag-item {
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
