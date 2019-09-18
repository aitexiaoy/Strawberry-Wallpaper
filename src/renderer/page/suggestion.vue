<template>
    <transition name="page-transition">
        <div class="suggestion">
            <ml-page-header>意见反馈</ml-page-header>
            <el-form :model="formData" ref="form">
                <div class="content">
                    <el-form-item prop="content" :rules="[
                        {required: true, message: '反馈建议不能为空', trigger: 'blur'},
                    ]">
                        <el-input
                            type="textarea"
                            :rows="10"
                            resize="none"
                            placeholder="请在此处填写你的想法，帮助我完善此项目"
                            v-model="formData.content"
                            size="small"></el-input>
                    </el-form-item>
                </div>
                <div class="tel-phone">
                    <el-form-item prop="telUser" :rules="[
                        {required: true, message: '联系方式不能为空', trigger: 'blur'},
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                    ]">
                        <el-input placeholder="请留下您的邮箱，方便作者与您联系" v-model="formData.telUser" size="small"></el-input>
                    </el-form-item>
                </div>

                <div class="sure-post">
                    <el-button type="primary" @click.stop="sure_post" :loading="loading">提交</el-button>
                </div>
            </el-form>

            <div class="result">{{suggestionResult}}</div>
        </div>
    </transition>
</template>

<script>
let timer = 0

export default {
    name: 'suggestion',
    data() {
        return {
            editer: null,

            loading: false,
            formData: {
                content: '',
                telUser: '',
            },
            suggestionResult: '' // 反馈结果
        }
    },

    mounted() {
        this.$ipcRenderer.on('sendnewEmail', (event, data, emailType, error) => {
            this.loading = false
            if (emailType !== '意见反馈') {
                return
            }
            if (data === 'success') {
                this.suggestionResult = '意见反馈成功，感谢你宝贵的意见'
                timer = window.setTimeout(() => {
                    this.suggestionResult = ''
                }, 5000)
            } else {
                this.suggestionResult = `反馈失败:${error}`
            }
        })
        this.$nextTick(() => {})
    },
    beforeRouteLeave(to, from, next) {
        this.formData.content = ''
        this.formData.telUser = ''
        this.suggestionResult = ''
        window.clearTimeout(timer)
        next()
    },
    methods: {
        sure_post() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    const { uid = '', version = '', username = '' } = this.$localStorage.getStore('osInfo')
                    this.loading = true
                    this.$ipcRenderer.send('btn', {
                        type: 'newEmail',
                        data: {
                            telUser: `[联系方式:${this.formData.telUser}]`,
                            emailType: '意见反馈',
                            data: {
                                uid,
                                version,
                                username,
                                content: this.formData.content
                            }
                        }
                    })
                } else {
                    console.log('error submit!!')
                }
            })
        }
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
    }

    .el-form-item {
        width: 100%;
    }

    .sure-post {
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
    }

    .result {
        padding-top: 10px;
        color: #a5a5a5;
        font-size: 14px;
        line-height: 20px;
    }
}
</style>
