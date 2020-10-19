<template>
    <div class="content">
        <template v-if="images.length > 0">
            <ImageItem
                v-for="img in images"
                :key="img.downloadUrl"
                :img="img"
                class="image-item"></ImageItem>

            <div ref="last-row" class="last-row is-loading">
                <i v-if="pageStatus === PageStatusEnum.loading" class="el-icon-loading"></i>
                <span v-html="infoShow"></span>
            </div>
        </template>

        <div v-else class="content-no">
            <span v-html="infoShow"></span>
        </div>
    </div>
</template>

<script>
import ImageItem from './image-item.vue'
import { InfoShowText, PageStatusEnum } from '$render/config'

let listenerEl = null

export default {
    name: 'ImageContent',
    components: { ImageItem },
    props: ['images'],
    data() {
        return {
           
        }
    },
    computed: {
        infoShow(){
            return InfoShowText[this.pageStatus] || ''
        },

        hasData(){
            return this.images.length > 0
        }
    },

    watch: {
        'images.length': function (val){
            if (val > 0){
                this.listenerGetNext()
            }
            else {
                this.offListenerGetNext()
            }
        }
    },

    created(){
        this.PageStatusEnum = PageStatusEnum
        this.initListener()
    },
    methods: {

        initListener(){
            this.$nextTick(() => {
                this.$oberserver = new IntersectionObserver((enteries) => {
                    // 下拉
                    if (enteries[0].intersectionRatio > 0.5) {
                        if (![PageStatusEnum.loading, PageStatusEnum.refresh].includes(this.pageStatus)){
                            this.$emit('next')
                        }
                    }
                    this.lastIntersectionRatio = enteries[0].intersectionRatio
                }, { 
                    root: this.$el, 
                    threshold: [0, 1],
                })
            })
        },

        /**
         * 监听
         */
        listenerGetNext(){
            this.$nextTick(() => {
                this.offListenerGetNext()
                
                const index = Math.max(this.images.length - 5, 0)
                listenerEl = this.$el.querySelectorAll('.image-item')[index]
                this.$oberserver.observe(listenerEl)
                    
                this.$once('hook:beforeDestroy', () => {
                    this.$oberserver.unobserve(listenerEl)
                    listenerEl = null
                })
            })
        },

        offListenerGetNext(){
            if (listenerEl){
                this.$oberserver.unobserve(listenerEl)
                listenerEl = null
            }
        }
    }
}
</script>

<style lang="less" scoped>
.content {
    border-radius: 4px;
    background-color: var(--main-bk-color);
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;

    .content-no {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 20px;
        line-height: 20px;
        color: var(--main-text-color);
        font-size: 12px;
    }

    .is-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 40px;
        color: var(--main-text-color);
        font-size: 12px;

        i {
            margin-right: 5px;
            font-size: 16px;
        }
    }
}

</style>
