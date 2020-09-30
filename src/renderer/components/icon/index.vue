<template>
    <i class="icon icon-btn iconfont" @click.stop="handleClick"></i>
</template>

<script>

export default {
    name: 'Icon',
    methods: {
        handleClick(){
            this.$emit('click')
        }
    }

}
</script>

<style lang="less" scoped>
.icon {
    color: var(--main-text-color);

    &:hover {
        color: #ffffff;
    }
}

</style>

<style lang="less">
.icon-btn {
    & + .icon-btn {
        margin-left: 8px;
    }
}

</style>
