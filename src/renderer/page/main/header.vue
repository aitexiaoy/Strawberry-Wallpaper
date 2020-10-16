<template>
    <div class="header">
        <div class="header-content">
            <Nav></Nav>
            <Search v-on="$listeners"></Search>
        </div>
        <Progress v-if="progressValue > 0"  :value="progressValue" :color="progressColor"></Progress>
    </div>
</template>

<script>
import Nav from './nav.vue'
import Search from './search.vue'

export default {
    name: 'Header',
    components: {
        Nav,
        Search,
    },
}
</script>

<style lang="less" scoped>
 .header {
     position: fixed;
     z-index: 3000;
     background-color: rgba(34, 34, 34, 0.9);
     width: 100%;
     min-height: 50px;
     overflow: hidden;

     .header-content {
         width: 100%;
         padding: 0 12px;
     }
 }

</style>
