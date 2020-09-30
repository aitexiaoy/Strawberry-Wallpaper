<template>
    <div class="page-header">
        <Icon class="icon-back" @click="handleClick"></Icon>
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
.page-header {
    display: flex;
    align-items: center;
    width: 100%;
    height: 40px;
    padding: 0 24px;
    color: #ffffff;
    font-size: 14px;

    .icon-back {
        cursor: pointer;
    }

    .title-text {
        width: 100%;
        text-align: center;
    }
}

</style>
