<template>
    <div class="content" :class="{'content-win':osType=='win'}" @scroll="contentScroll">
        <div class="content-main" ref="content_main" v-if="images.length>0">
            <ImageItem
                v-for="(img) in images"
                :key="img.downloadUrl"
                :img="img"
                class="image-item">
            </ImageItem>
            <div class="is-loading" v-if="infoShow!==''">
                <i v-if="getDataFlag" class="el-icon-loading"></i>
                <span v-html="infoShow"></span>
            </div>
        </div>

        <div class="content-main-no" v-else>
            <span v-html="infoShow"></span>
        </div>
    </div>
</template>

<script>
import ImageItem from './image-item.vue'

import { utils } from '$render/utils'

const { osType } = utils
export default {
    name: 'ImageContent',
    components: { ImageItem },
    props: ['images'],
    data() {
        return {
            osType
        }
    },
    methods: {
        /**
         * 滚动条事件,请求下一页
         * @function contentScroll
         * @param {Object} event 事件
         */
        contentScroll(event) {
            const el = event.srcElement || event.target
            if (this.havaDataFlag === true && this.getDataFlag === false) {
                this.$nextTick(() => {
                    if (el.scrollTop + 1800 > el.querySelector('.content-main').clientHeight) {
                        this.page = this.page + 1
                        this.getData()
                    }
                })
            }
        },
    }

}
</script>

<style>

</style>
