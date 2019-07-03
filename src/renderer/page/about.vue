<template>
    <transition name="page-transition">
        <div class="about">
            <ml-page-header>关于项目</ml-page-header>
            <div class="content" v-html="content"></div>
            <el-button type="primary" @click.stop="goToPro">gitHub</el-button>
        </div>
    </transition>
</template>

<script>
import {
    shell
} from 'electron'

export default {
    name: 'about',
    data() {
        return {
            content: '&nbsp &nbsp &nbsp &nbsp起初的需求是需要一款能切换壁纸的App，在使用pap.er很长一段时间后有了自己开发壁纸App的想法。'
            + '恰逢当时手上的工作不是太忙，便开始了本项目的开发。'
            + '在解决了一个又一个的问题后，软件功能与使用体验得到了不断的完善。'
            + '没有足够的完美，但有一颗不断尝试的心。非常感谢那些对本项目支持的人，我将继续不断的完善优化，让草莓更加好用。'
            + '本软件代码完全开源，如果觉得本软件还不错，欢迎进入项目地址为我点赞，再次感谢。'
        }
    },
    mounted() {

    },
    methods: {
        goToPro() {
            shell.openExternal('https://github.com/aitexiaoy/Strawberry-Wallpaper')
        }
    }
}
</script>

<style lang="less" scoped>
.about {
    width: 100%;
    height: 100%;
    padding: 14px;
    cursor: default;

    .content{
        margin-bottom: 20px;
        font-size: 13px;
        line-height: 24px;
        color: #a5a5a5;
    }
}
</style>
