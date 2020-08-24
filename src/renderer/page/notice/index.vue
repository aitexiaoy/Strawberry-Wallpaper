<template>
    <transition name="page-transition">
        <div class="notice">
            <ml-page-header>公告</ml-page-header>
            <contentMain class="content" ref="content">
                <template v-if="noticeList.length>0">
                    <div class="notice-item" v-for="item in noticeList" :key="`${item.content}-${item.time}`">
                        <span>{{`【${item.time}】`}}</span>
                        <span v-html="item.content"></span>
                    </div>
                </template>

                <div v-else class="no-data">
                    暂无公告信息
                </div>
            </contentMain>
        </div>
    </transition>
</template>

<script>
import { shell } from 'electron'
import contentMain from '$render/components/content-main/index.vue'

export default {
    name: 'notice',
    components: {
        contentMain
    },
    data() {
        return {
            noticeList: []
        }
    },
    mounted() {
        this.noticeList = (this.$localStorage.getStore('noticeList') || []).map(item => ({
            time: this.dateFormat(item.time),
            content: item.content
        }))
        this.$nextTick(() => {
            this.$refs.content.$el.addEventListener('click', this.contentEvent, false)
        })
    },
    methods: {
        dateFormat(time){ 
            let fmt = 'MM-dd hh:mm'
            const date = new Date(time)
            const o = { 
                'M+': date.getMonth() + 1, // 月份 
                'd+': date.getDate(), // 日 
                'h+': date.getHours(), // 小时 
                'm+': date.getMinutes(), // 分 
                's+': date.getSeconds(), // 秒 
                'q+': Math.floor((date.getMonth() + 3) / 3), // 季度 
                S: date.getMilliseconds() // 毫秒 
            } 
            if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length)) } 
            for (const k in o) { if (new RegExp(`(${k})`).test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length))) } 
            return fmt 
        },

        contentEvent(e){
            e.preventDefault()
            const { target } = e
            if (target.tagName === 'A'){
                const { href } = target
                shell.openExternal(href)
            }
        }
    },
    beforeDestroy(){
        // 存最近一次看公告的时间,来判断公告是否已阅
        this.$localStorage.setStore('watchNoticeTime', (new Date()).getTime())
        this.$refs.content.$el.removeEventListener('click', this.contentEvent, false)
    }
}
</script>

<style lang="less" scoped>
.notice {
    cursor: default;
    width: 100%;
    height: 100%;
    padding: 14px;

    .content {
        height: calc(100% - 60px);
        line-height: 24px;
        color: #a5a5a5;
        font-size: 13px;

        .notice-item {
            border-bottom: 1px dashed #a5a5a5;
            padding: 10px 0;
            color: #a5a5a5;
        }

        .no-data {
            padding-left: 20px;
            text-align: center;
            line-height: 100px;
        }
    }
}

</style>

<style lang="less">
.notice {
    .content {
        .notice-item {
            * {
                color: #a5a5a5;
            }

            a {
                text-decoration: none;

                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
}

</style>
