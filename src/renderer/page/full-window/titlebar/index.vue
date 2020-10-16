
<template>
    <div class="titlebar" :class="[styleClass, stylePlatform]">
        <div class="titlebar-resize-handle top"></div>
        <div class="titlebar-resize-handle right"></div>
        <div class="titlebar-resize-handle left"></div>
        <div v-if="platform === 'darwin'" class="titlebar-buttons-osx">
            <div class="macButton macButtonClose" @click="onClose()">
                <svg name="TitleBarCloseMac" width="12" height="12" viewBox="0 0 12 12">
                    <path stroke="#4c0000" fill="none"
                          d="M8.5,3.5 L6,6 L3.5,3.5 L6,6 L3.5,8.5 L6,6 L8.5,8.5 L6,6 L8.5,3.5 Z"></path>
                </svg>
            </div>
            <div class="macButton macButtonMinimize" @click="onMinimize()">
                <svg name="TitleBarMinimizeMac" width="12" height="12" viewBox="0 0 12 12">
                    <rect fill="#975500" width="8" height="2" x="2" y="5" fill-rule="evenodd"></rect>
                </svg>
            </div>
            <div class="macButton macButtonMaximize" @click="onMaximize()">
                <svg name="TitleBarMaximizeMac" width="12" height="12" viewBox="0 0 12 12">
                    <g fill="#006500" fill-rule="evenodd">
                        <path d="M5,3 C5,3 5,6.1325704 5,6.48601043 C5,6.83945045 5.18485201,7 5.49021559,7 L9,7 L9,6 L8,6 L8,5 L7,5 L7,4 L6,4 L6,3 L5,3 Z"
                              transform="rotate(180 7 5)"></path>
                        <path d="M3,5 C3,5 3,8.1325704 3,8.48601043 C3,8.83945045 3.18485201,9 3.49021559,9 L7,9 L7,8 L6,8 L6,7 L5,7 L5,6 L4,6 L4,5 L3,5 Z"></path>
                    </g>
                </svg>
            </div>
        </div>

        <div class="titlebar-header">
            <div v-if="showIcon" class="titlebar-icon">
                <slot name="icon"></slot>
            </div>

            <div v-if="showTitle" class="titlebar-name">
                <slot name="title"></slot>
            </div>
        </div>

        <div v-if="platform !== 'darwin'" class="titlebar-menu">
            <div v-for="(item, index) in menu" :key="index" class="titlebar-menu-item">
                <button @click="item.click()">
                    {{item.label}}
                </button>
            </div>
        </div>

        <div v-if="platform !== 'darwin'" class="titlebar-buttons">
            <button aria-label="minimize" title="Minimize" tabindex="-1" @click="onMinimize()">
                <svg aria-hidden="true" version="1.1" width="10" height="10">
                    <path d="M 0,5 10,5 10,6 0,6 Z"></path>
                </svg>
            </button>

            <button aria-label="maximize" title="Maximize" tabindex="-1" @click="onMaximize()">
                <svg aria-hidden="true" version="1.1" width="10" height="10">
                    <path d="M 0,0 0,10 10,10 10,0 Z M 1,1 9,1 9,9 1,9 Z"></path>
                </svg>
            </button>

            <button aria-label="close" title="Close" tabindex="-1" class="close" @click="onClose()">
                <svg aria-hidden="true" version="1.1" width="10" height="10">
                    <path d="M 0,0 0,0.7 4.3,5 0,9.3 0,10 0.7,10 5,5.7 9.3,10 10,10 10,9.3 5.7,5 10,0.7 10,0 9.3,0 5,4.3 0.7,0 Z"></path>
                </svg>
            </button>
        </div>
    </div>
</template>
<script>

import { remote } from 'electron'

const os = require('os')

export default {
    name: 'v-titlebar',
    props: {
        theme: {
            type: String,
            default: 'dark'
        },
        menu: {
            type: Array,
            default() {
                return []
            }
        },
        showIcon: {
            type: Boolean,
            default: true
        },
        showTitle: {
            type: Boolean,
            default: true
        }
    },
    data(){
        return {
            platform: os.type().toLowerCase(), 
            isMaximizable: remote.getCurrentWindow().isMaximizable(),
            isMinimizable: remote.getCurrentWindow().isMinimizable(),
            isClosable: remote.getCurrentWindow().isClosable(),
        }
    },
    computed: {
        styleClass() {
            return `titlebar-style-${this.theme}`
        },
        stylePlatform() {
            return `titlebar-platform-${this.platform}`
        }
    },
    methods: {
        onClose() {
            remote.getCurrentWindow().close()
        },
        onMaximize() {
            const win = remote.getCurrentWindow()
            if (win.isFullScreen()){
                win.setFullScreen(false)
            }
            else {
                win.setFullScreen(true)
            }
        },
        onMinimize() {
            remote.getCurrentWindow().minimize()
        }
    }
}
</script>

<style lang="less" scoped>
    .titlebar {
        display: flex;
        flex-direction: row;
        flex-grow: 0;
        flex-shrink: 0;
        width: 100%;
        height: 28px;

        -webkit-app-region: drag;

        &.titlebar-style-dark {
            background: #2d3135;
            color: #ffffff;
        }

        &.titlebar-style-light {
            background: #f6f6f6;
            color: #2c2c2c;
        }

        .titlebar-resize-handle {
            position: absolute;
            top: 0;
            left: 0;

            -webkit-app-region: no-drag;

            &.top {
                width: 100%;
                height: 3px;
            }

            &.right {
                right: 0;
                left: auto;
                width: 3px;
                height: 28px;
            }

            &.left {
                width: 3px;
                height: 28px;
            }
        }

        .titlebar-header {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .titlebar-icon,
        .titlebar-name {
            display: flex;
            flex-grow: 0;
            flex-shrink: 0;
            align-content: center;
            align-self: center;
            height: 28px;
            padding: 0 12px;
            line-height: 28px;
            font-size: 14px;

            > svg,
            > img {
                display: block;
                align-content: center;
                align-self: center;
                width: auto;
                height: 16px;
            }
        }

        .titlebar-icon ~ .titlebar-name {
            padding-left: 0;
        }

        &.titlebar-platform-darwin {
            .titlebar-header {
                position: absolute;
                width: 100%;
                text-align: center;

                pointer-events: none;
            }
        }

        .titlebar-menu {
            display: flex;

            -webkit-app-region: no-drag;

            .titlebar-menu-item {
                position: relative;
                cursor: pointer;
                min-width: 0;

                button {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    position: relative;
                    margin: 0;
                    outline: none;
                    border: none;
                    box-shadow: none;
                    background: transparent;
                    width: 100%;
                    height: 100%;
                    padding: 0 10px;
                    color: currentColor;
                    font-size: 13px;

                    &:hover {
                        background-color: rgba(0, 0, 0, 0.2);
                    }
                }
            }
        }

        .titlebar-buttons {
            display: flex;
            flex-direction: row;
            flex-grow: 0;
            flex-shrink: 0;
            margin-left: auto;

            button {
                display: inline-block;
                position: relative;
                margin: 0;
                outline: none;
                border: none;
                border-radius: 0;
                box-shadow: none;
                background-color: transparent;
                width: 45px;
                height: 100%;
                overflow: hidden;
                padding: 0;
                line-height: 10px;
                color: currentColor;

                -webkit-app-region: no-drag;

                svg {
                    fill: currentColor;
                }

                &:hover {
                    background-color: rgba(0, 0, 0, 0.2);
                    color: currentColor;
                }

                &.close:hover {
                    background-color: #e81123;
                    color: #ffffff;
                }
            }
        }

        .titlebar-buttons-osx {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            box-sizing: border-box;
            width: 70px;
            padding: 10px;

            -webkit-box-pack: justify;

            .macButton {
                border-color: #d1d1d1;
                border-radius: 50%;
                        box-sizing: border-box;
                background-color: #dcdcdc;
                width: 12px;
                height: 12px;

                -webkit-app-region: no-drag;
                -webkit-box-sizing: border-box;

                &.macButtonClose {
                    background-color: #fc615d;
                }

                &.macButtonMinimize {
                    background-color: #fdbc40;
                }

                &.macButtonMaximize {
                    background-color: #34c749;
                }

                svg {
                    display: block;
                    visibility: hidden;
                }
            }

            &:hover {
                .macButton {
                    svg {
                        visibility: visible;
                    }
                }
            }
        }
    }

</style>
