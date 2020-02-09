<template>
    <div :class="['chrome-icon',{nodisabled:!disabled}]" @click="handleClick">
        <i :class="['iconfont',icon]" ></i>
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
    background-color: transparent;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    margin-right:5px;
    border-radius: 100%;
    cursor:not-allowed;

    .iconfont{
        font-size: 24px;
        color: #aaaaaa;
      
    }

    &.nodisabled {
        cursor: default;
        .iconfont{
            color: #ffffff;
        } 
    }

    &.nodisabled:hover {
        background-color: #aaaaaa;
    }
}

</style>
