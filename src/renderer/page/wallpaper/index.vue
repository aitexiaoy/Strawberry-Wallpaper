<template>
    <div id='app' class="sw-main">
        <!-- mac下显示三角 -->
        <div v-if="isMac" class="sanjiao"></div>
        <div :class="['sw-main-content', isMac ? 'sw-main-content-mac': '']">
            <keep-alive :include="['mainContent','about']">
                <router-view></router-view>
            </keep-alive>
        </div>
    </div>
</template>

<script>

import { utils } from '$render/utils'

const { isMac } = utils

export default {
    name: 'appMain',
    data() {
        return {
            isMac,
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
}
</script>

<style lang="less">
.sw-main {
    position: relative;
    box-sizing: border-box;
    background-color: transparent;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .sanjiao {
        display: flex;
        align-content: center;
        justify-content: center;
        background-color: transparent;
        width: 100%;
        height: 10px;

        &::before {
            border-width: 0 10px 10px;
            border-style: solid;
            border-color: transparent transparent rgb(37, 33, 33);
            width: 0;
            height: 0;
            content: "";
            /*透明 透明  灰*/
        }
    }
}

</style>

<style lang="less">
.sw-main-content {
    transform: rotate(0deg);
    border-radius: 6px;
    background-color: #222222;
    width: 100%;
    height: 100%;
    overflow: hidden;

    &.sw-main-content-mac {
        height: calc(100% - 10px);
    }
}

</style>
