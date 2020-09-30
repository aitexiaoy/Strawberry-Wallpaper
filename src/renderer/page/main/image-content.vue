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

<style lang="less" scoped>
  .content {
      border-radius: 5px;
      background-color: #222222;
      width: 100%;
      height: 100%;
      overflow-x: hidden;
      overflow-y: scroll;
      padding: 1px;

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

</style>
