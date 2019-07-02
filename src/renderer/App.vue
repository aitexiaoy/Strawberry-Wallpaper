<template>
    <div class="sw-main" id='app'>
        <!-- mac下显示三角 -->
        <div class="sanjiao" v-if="osType === 'mac'"></div>
        <div :class="['sw-main-content', osType === 'mac' ? 'sw-main-content-mac': '']">
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </div>
    </div>
</template>

<script>
const { osType } = require('../utils/utils')

export default {
    name: 'appMain',
    data() {
        return {
            osType,
        }
    },
    mounted() {
        this.$ipcRenderer.on('datainfo', (event, arg) => {
            // 主窗口显示|隐藏
            if (arg.type === 'windowShow') {
                if (arg.data) {
                    this.$router.replace('/')
                } else {
                    this.$router.replace('/')
                }
            }
        })
    }
};
</script>

<style lang="less">
.sw-main {
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    position: relative;
    background-color: transparent;

    .sanjiao {
        width: 100%;
        height: 10px;
        display: flex;
        align-content: center;
        justify-content: center;
        background-color: transparent;

        &::before {
            content: "";
            width: 0;
            height: 0;
            border-width: 0 10px 10px;
            border-style: solid;
            border-color: transparent transparent rgb(37, 33, 33);
            /*透明 透明  灰*/
        }
    }
}
</style>

<style lang="less">
.sw-main-content {
    width: 100%;
    height: 100%;
    border-radius: 6px;
    overflow: hidden;
    transform: rotate(0deg);
    background-color: #222222;

    &.sw-main-content-mac {
        height: calc(100% - 10px);
    }
}
</style>
