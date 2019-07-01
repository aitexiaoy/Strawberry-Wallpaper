<template>
    <transition name="page-transition">
        <div class="about">
            <ml-page-header>关于我们</ml-page-header>
        </div>
    </transition>
</template>

<script>
import {
    shell
} from 'electron'

export default {
    name: 'about',
    mounted() {

    },
    methods: {
        goToPro() {
            // shell.openExternal('https://github.com/aitexiaoy/Strawberry-Wallpaper')
        }
    }
}
</script>

<style lang="less" scoped>
.about {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #222222;
    padding: 20px;
    cursor: default;
    z-index: 5;
}
</style>
