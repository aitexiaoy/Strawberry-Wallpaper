<template>
    <div class="progress-main">
        <div class="progress-content-val" :style="{'width':value+'%'}">
            <div class="progress-content-bac" :style="{'width':width,'background': `linear-gradient(to right, rgba(125, 125, 125, 1), ${color})`}"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Progress',
    props: {
        value: {
            type: Number,
            default: 0
        },
        color: {
            type: String,
            default: '#fff'
        },
        width: {
            type: String,
            default: '300px'
        }
    }
}

</script>

<style scoped lang='less'>
.progress-main {
    position: relative;
    bottom: 0;
    left: 0;
    background-color: transparent;
    width: 100%;
    height: 3px;

    .progress-content-val {
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 5px;
        height: 100%;
        overflow: hidden;
    }

    .progress-content-bac {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
    }
}

</style>
