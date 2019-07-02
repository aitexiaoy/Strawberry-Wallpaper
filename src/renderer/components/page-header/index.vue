<template>
    <div class="page-header">
        <i class="iconfont icon-back" @click="handleClick"></i>
        <div class="title-text"><slot></slot></div>
    </div>
</template>
<script>
export default {
    name: 'mlPageHeader',
    methods: {
        handleClick(){
            this.$router.replace('/')
        }
    }
}
</script>

<style lang="less" scoped>
.page-header{
        width: 100%;
        height: 60px;
        display: flex;
        align-items: center;
        margin-top: -10px;
        line-height: 60px;
        color: #ffffff;
        font-size: 16px;
        .title-text{
            width: 100%;
            text-align: center;
        }
}
</style>
