<template>
    <el-row class="header-nav">
        <div class="left">
            <h1 class="text">Strawberry</h1>
        </div>
        <div class="right">
            <Icon :class="['icon-gonggao',{'no-watch':noticeNoWatch}]" @click="handleGoToNotice"></Icon>
            <Icon class="icon-quanping" @click="handleOpenFullWindow"></Icon>
            <Icon class="icon-wenjianjia" @click="openDownloadFile"></Icon>
            <Icon class="icon-shezhi" @click="$router.push('/setting')"></Icon>
        </div>
    </el-row>
</template>

<script>
import mkdir from 'make-dir'
import { shell } from 'electron'
import { apiGetNotices } from '$render/api'

let time = 0

export default {
    name: 'MainNav',
    data() {
        return {
            noticeNoWatch: false, // 公告是否已阅
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.getNotices()
            this.$once('hook:beforeDestroy', () => {
                window.clearTimeout(time)
            })
        })
    },
    
    methods: {
        /**
         * 打开图片存的文件夹
         * @function openDownloadFile
         */
        openDownloadFile() {
            // 判断是否有文件夹
            mkdir.sync(this.config.downloadImagePath)
            shell.openItem(this.config.downloadImagePath)
        },

        /**
         * 打开全屏模式
         * @function openDownloadFile
         */
        handleOpenFullWindow(){
            // this.$ipcRenderer.send('fullWindow', true) // 打开全屏 ， false 关闭全屏
        },

        handleGoToNotice(){
            this.$router.push('/notice')
            this.noticeNoWatch = false
        },

        // 获取公告
        async getNotices(){
            // 获取公告
            apiGetNotices().then((res) => {
                // 存公告
                this.$localStorage.setStore('noticeList', res)
                if (res.length > 0){
                    // 取出最后一次阅读时间
                    const lastWatchNoticeTime = this.$localStorage.getStore('watchNoticeTime')
                    if (!lastWatchNoticeTime || new Date(res[0].time).getTime() > lastWatchNoticeTime) {
                        this.noticeNoWatch = true
                    }
                }
            }).finally(() => {
                // 每小时请求一次
                time = window.setTimeout(() => {
                    window.clearTimeout(time)
                    this.getNotices()
                }, 60 * 60 * 1000)
            })
        },
    }
}
</script>

<style lang="less" scoped>
.header-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 56px;

    .left {
        flex: auto;
        position: relative;
        width: 100%;
        height: 100%;

        .text {
            cursor: default;
            color: var(--header-text-color);

            user-select: none;
            // z-index: 2;
        }
    }

    .right {
        display: flex;
        flex: none;
        align-items: center;

        /deep/ .icon {
            cursor: pointer;
        }

        .icon-gonggao {
            &.no-watch {
                color: #ff3f00;
            }
        }
    }
}

</style>
