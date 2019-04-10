<template>
<div class="suggestion">
    <div class="edit" ref="editer">
        <p :style="{color:'#ccc'}">非常感谢你提出宝贵的意见...</p>
    </div>
    <div class="tel-phone">
        <el-input placeholder="请留下你的联系方式" v-model="telUser" size="small"></el-input>
    </div>
    <div class="sure-post" >
        <el-button type="primary" @click.stop="sure_post" :loading="loading">提交</el-button>
    </div>
</div>
</template>

<script>
import WangEditor from 'wangeditor'

export default {
    name: 'suggestion',
    data() {
        return {
            editer: null,
            telUser: '',
            loading: false,
        }
    },
    mounted() {
        this.$ipcRenderer.on('sendnewEmail', (event, data, emailType, error) => {
            this.loading = false;
            if (emailType !== '意见反馈') { return; }
            if (data === 'success'){
                this.$alert('意见反馈成功，感谢你宝贵的意见', '反馈结果', {
                    confirmButtonText: '关闭',
                    callback: (action) => {
                        this.$ipcRenderer.send('btn', {
                            type: 'openChildren',
                            data: false,
                        });
                    }
                });
            } else {
                this.$alert(error, '反馈结果', {
                    confirmButtonText: '关闭',
                    callback: (action) => {
                        this.$ipcRenderer.send('btn', {
                            type: 'openChildren',
                            data: false,
                        });
                    }
                });
            }
        })
        this.$nextTick(() => {
            this.editer = new WangEditor(this.$refs.editer)
            this.editer.customConfig.colors = [
                '#000000',
                '#eeece0',
                '#1c487f',
                '#4d80bf',
                '#c24f4a',
                '#8baa4a',
                '#7b5ba1',
                '#46acc8',
                '#f9963b',
                '#ffffff'
            ]
            this.editer.create();
        })
    },
    methods: {
        sure_post(){
            const html = this.editer.txt.html();
            if (html === '<p data-v-6327ab11="" style="color: rgb(204, 204, 204);">非常感谢你提出宝贵的意见...</p><p><br></p>'){
                this.$message.warning('请填写宝贵意见再提交');
                return;
            }
            this.loading = true;
            this.$ipcRenderer.send('btn', {
                type: 'newEmail',
                data: {
                    html,
                    telUser: `[联系方式:${this.telUser}]`,
                    emailType: '意见反馈'
                }
            });
        }
    },
}

</script>

<style scoped lang='less'>
.suggestion{
    width: 100%;
    height: 100%;
    background-color: #fff;
    padding: 20px;
    cursor: default;
    .edit{
        width: 100%;
    }
    .tel-phone{
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        // padding-left: 20px;
    }
    .sure-post{
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
    }
}
</style>

<style lang="less">
    .el-message-box__wrapper{
        z-index:99999 !important;
    }
    .v-modal{
        z-index:99998 !important;
    }
    .el-message{
        z-index:99997 !important;
    }
</style>
