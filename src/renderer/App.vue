<template>
    <div id='app' class="app">
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
    .app {
        position: relative;
        box-sizing: border-box;
        background-color: transparent;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

</style>
