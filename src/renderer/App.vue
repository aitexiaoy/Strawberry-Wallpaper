<template>
    <div class="app" id='app'>
        <keep-alive>
                <router-view></router-view>
        </keep-alive>
    </div>
</template>

<script>
export default {
    name: 'app',
    data() {
        return {}
    },
    mounted() {},
    methods: {}
}
</script>

<style lang="less">
    .app{
        width: 100%;
        height: 100%;
        overflow: hidden;
        box-sizing: border-box;
        position: relative;
        background-color: transparent;
    }
</style>
