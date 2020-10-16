<template>
    <Secondary title="意见反馈">
        <div class="suggestion">
            <el-form ref="form" :model="formData">
                <div class="content">
                    <el-form-item prop="content" :rules="[
                        {required: true, message: '反馈建议不能为空', trigger: 'blur'},
                    ]">
                        <el-input
                            v-model="formData.content"
                            type="textarea"
                            :rows="10"
                            resize="none"
                            placeholder="请在此处填写你的想法，帮助我完善此项目"
                            size="small"></el-input>
                    </el-form-item>
                </div>
                <div class="tel-phone">
                    <el-form-item prop="telUser" :rules="[
                        {required: true, message: '联系方式不能为空', trigger: 'blur'},
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                    ]">
                        <el-input v-model="formData.telUser" placeholder="请留下您的邮箱，方便作者与您联系" size="small"></el-input>
                    </el-form-item>
                </div>

                <div class="sure-post">
                    <el-button type="primary" :loading="loading" @click.stop="handleSurePost">提交</el-button>
                </div>

                <el-button class="issues" type="primary" @click.stop="goToGitHubIssues">或直接提交issues</el-button>
            </el-form>

            <div class="result">{{suggestionResult}}</div>
        </div>
    </Secondary>
</template>

<script>
import { shell } from 'electron'
import { utils, mail } from '$render/utils'

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
    
    },
    beforeRouteLeave(to, from, next) {
        this.formData.content = ''
        this.formData.telUser = ''
        this.suggestionResult = ''
        window.clearTimeout(timer)
        next()
    },
    
    methods: {
        handleSurePost() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    const { uid = '', version = '', username = '', } = this.$localStorage.getStore('osInfo')
                    this.loading = true

                    mail.sendMail(
                        `[${utils.version}][联系方式:${this.formData.telUser}]`,
                        {
                            uid,
                            username,
                            iVersion: version,
                            cVersion: utils.version,
                            osType: utils.osType,
                            tel: this.formData.telUser,
                            content: this.formData.content
                        }, 
                        '意见反馈'
                    ).then(() => {
                        this.suggestionResult = '意见反馈成功，感谢你宝贵的意见'
                        timer = window.setTimeout(() => {
                            this.suggestionResult = ''
                        }, 5000)
                    }).catch((error) => {
                        this.suggestionResult = `反馈失败:${error}`
                    })
                } else {
                    console.log('error submit!!')
                }
            })
        },

        goToGitHubIssues() {
            shell.openExternal('https://github.com/aitexiaoy/Strawberry-Wallpaper/issues')
        }
    },
}
</script>

<style lang="less" scoped>
.suggestion {
    .edit {
        width: 100%;
    }

    .tel-phone {
        display: flex;
        align-items: center;
        width: 100%;
        height: 50px;
    }

    .el-form-item {
        width: 100%;
    }

    .sure-post {
        display: flex;
        align-items: center;
        width: 100%;
        height: 50px;
    }

    .issues {
        margin-top: 40px;
    }

    .result {
        padding-top: 10px;
        line-height: 20px;
        color: #a5a5a5;
        font-size: 14px;
    }
}

</style>
