<template>
    <div :class="['chrome-icon',{nodisabled:!disabled}]" style="-webkit-app-region: no-drag" @click="handleClick">
        <i :class="['iconfont',icon]"></i>
    </div>
</template>

<script>
export default {
    name: 'chromeIcon',
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        icon: {
            type: String,
            default: ''
        }
    },
    methods: {
        handleClick(){
            this.$emit('click')
        }
    }
}
</script>

<style lang="less" scoped>
.chrome-icon {
    margin-right: 5px;
    border-radius: 100%;
    background-color: transparent;
    cursor: not-allowed;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;

    .iconfont {
        color: #aaaaaa;
        font-size: 24px;
    }

    &.nodisabled {
        cursor: default;

        .iconfont {
            color: #ffffff;
        }
    }

    &.nodisabled:hover {
        background-color: #aaaaaa;
    }
}

</style>
