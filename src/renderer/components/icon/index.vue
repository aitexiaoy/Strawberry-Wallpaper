<template>
    <i class="icon" @click.stop="handleClick"></i>
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
    color: #dddddd;

    &:hover {
        color: #ffffff;
    }
}

</style>
