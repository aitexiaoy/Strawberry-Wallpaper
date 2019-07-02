<template>
    <transition name="page-transition">
        <div class="suggestion">
            <ml-page-header>意见反馈</ml-page-header>
            <div class="content">
                <el-input
                    type="textarea"
                    :rows="10"
                    resize="none"
                    placeholder="非常感谢你的建议，你的建议将会帮助我们更好的完善此项目"
                    v-model="content"
                    size="small"></el-input>
            </div>
            <div class="tel-phone">
                <el-input placeholder="请留下你的联系方式，方便我们找到你" v-model="telUser" size="small"></el-input>
            </div>
            <div class="sure-post">
                <el-button type="primary" @click.stop="sure_post" :loading="loading">提交</el-button>
            </div>

            <div class="result">{{suggestionResult}}</div>
        </div>
    </transition>
</template>

<script>
// import WangEditor from 'wangeditor'

export default {
    name: 'suggestion',
    data() {
        return {
            editer: null,
            telUser: '',
            loading: false,
            content: '',
            suggestionResult: '' // 反馈结果
        }
    },
    mounted() {
        this.$ipcRenderer.on('sendnewEmail', (event, data, emailType, error) => {
            this.loading = false;
            if (emailType !== '意见反馈') {
                return;
            }
            if (data === 'success') {
                this.suggestionResult = '意见反馈成功，感谢你宝贵的意见'
                window.setTimeout(() => {
                    this.suggestionResult = ''
                }, 5000)
            } else {
                this.suggestionResult = `反馈失败:${error}`
            }
        })
        this.$nextTick(() => {})
    },
    methods: {
        sure_post() {
            if (this.content === '') {
                return;
            }
            const { uid = '', version = '', username = '' } = this.$localStorage.getStore('osInfo')
            this.loading = true;
            this.$ipcRenderer.send('btn', {
                type: 'newEmail',
                data: {
                    telUser: `[联系方式:${this.telUser}]`,
                    emailType: '意见反馈',
                    data: {
                        uid,
                        version,
                        username,
                        content: this.content
                    }
                }
            });
        },
    },
}
</script>

<style lang="less" scoped>
.suggestion {
    width: 100%;
    height: 100%;
    padding: 14px;
    cursor: default;
    .edit {
        width: 100%;
    }

    .tel-phone {
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        // padding-left: 20px;
    }
    .sure-post {
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
    }
    .result{
        padding-top: 10px;
        color: #a5a5a5;
        font-size: 14px;
        line-height: 20px;
    }
}
</style>
