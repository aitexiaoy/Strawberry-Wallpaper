<template>
    <transition name="page-transition">
        <div class="secondary-content">
            <page-header>{{title}}</page-header>
            <div class="content">
                <slot></slot>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'Secondary',
    props: ['title'],
    data() {
        return {
            
        }
    },
    mounted() {

    },
    methods: {
        
    }
}
</script>

<style lang="less" scoped>
.secondary-content {
    width: 100%;
    height: 100%;

    .content {
        margin-bottom: 20px;
        padding: 0 12px;
    }
}

</style>
