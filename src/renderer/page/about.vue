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
            content: '&nbsp &nbsp &nbsp &nbsp在寻找桌面壁纸app的过程中，在知乎上有人推荐Paper。'
            + '自己在使用Paper很长一段时间后，个人感觉paper的图库比较少，不能自己搜索。从而产生了自己做一个壁纸App的想法，'
            + '从最开始的网络爬虫，到相关页面的开发。从最开始只有pexels图库，到现在集成了多个图库。'
            + '从最开始的基本功能切换壁纸，到现在的已有的样子。一步一步，不断迭代。非常感谢那些对本项目支持的人，你们继续的使用是我不断更新的动力'
            + '如果觉得本软件确实不错，可以进入项目的开源地址为我点赞，非常感谢。'
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
