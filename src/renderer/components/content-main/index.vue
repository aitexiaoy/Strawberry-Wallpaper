<template>
    <div class="content">
        <div class="content-main" :class="{'content-win':osType=='win'}">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import { osType } from '../../../utils/utils'

export default {
    name: 'content-div',
    data(){
        return {
            osType
        }
    }

}
</script>

<style lang="less" scoped>
.content {
    width: 100%;
    overflow: hidden;
    .content-main {
        width: calc(~"100% + 15px");
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
    }
    .content-win {
        width: calc(~"100% + 17px");
    }
}
</style>
