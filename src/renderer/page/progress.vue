<template>
    <div class="progress-main">
        <div class="progress-content-val" :style="{'width':value+'%'}">
            <div class="progress-content-bac" :style="{'width':width,'background': `linear-gradient(to right, rgba(125, 125, 125, 1), ${color})`}"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name:'progress',
        props:{
            value:{
                type:Number,
                default:0
            },
            color:{
                type:String,
                default:'#fff'
            },
            width:{
                type:String,
                default:'300px'
            }
        }
    }
</script>

<style scoped lang='less'>
.progress-main{
    width: 100%;
    height: 3px;
    position: absolute;
    bottom: 0px;
    left: 0px;    
    background-color: transparent;

    .progress-content-val{
        height: 100%;
        position: absolute;
        left: 0px;
        top: 0px;
        border-radius:5px; 
        overflow: hidden;
    }
    .progress-content-bac{
        height: 100%;
        position: absolute;
        left: 0px;
        top: 0px;  
    }
}
</style>