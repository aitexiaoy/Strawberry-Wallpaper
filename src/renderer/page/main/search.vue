<template>
    <div class="header-search" 
    v-if="config.imageSource==='paper'" 
   >
        <el-select
            class="header-search-input"
            v-model="searchKey"
            size="small"
            @change="handleSearch"
        >
            <el-option
                v-for="item in activeImageSource.searchTypes"
                :key="item.value"
                :label="item.name"
                :value="item.value"></el-option>
        </el-select>
    </div>

    <div class="header-search" v-else-if="activeImageSource.option&&activeImageSource.option.search">
        <div class="search">
            <el-input
                class="header-search-input"
                :value="searchKey"
                :input="storeSetSearchKey"
                placeholder="请输入关键词"
                size="small"
                @keydown.enter="handleSearch"
            ></el-input>
            <Icon class="iconfont icon-sousuo" @click="handleSearch"></Icon>
        </div>
        <div class="header-tag" v-if="searchKeyList.length>0">
            <div
                :class="['header-tag-item',tag === searchKey? 'active' : '']"
                v-for="(tag) in searchKeyList"
                :key="tag"
                @click="handleSearchTagAdd(tag)">
                <div class="header-tag-item-text">{{tag}}</div>
                <span class="header-tag-item-del" @click.stop="handleSearchTagRemove(tag)">x</span>
            </div>
        </div>
    </div>

</template>

<script>
import { searchKeyMax } from '$render/config'

export default {
    name: 'MainSearch',
    data(){
        return {

        }
    },
    methods: {
        /**
         * 搜索按钮
         * @function searchKeyFn
         */
        searchKeyFn() {
            const searchKeyList = [...this.searchKeyList]
            if (!searchKeyList.includes(this.searchKey) && this.searchKey !== ''){
                this.domContentMainMatch()
                searchKeyList.unshift(this.searchKey)
                if (searchKeyList.length > searchKeyMax){
                    searchKeyList.pop()
                }

                this.storeSetSearchKeyList()
            }
            this.destroyAll()
            this.images = []
            this.getData()
        },
        
        handleSearchTagRemove(tag){
            this.searchKeyList = this.searchKeyList.filter(i => i !== tag)
            this.$localStorage.setStore('searchKeyList', this.searchKeyList)
        },
        handleSearchTagAdd(tag){
            this.searchKey = tag
            this.handleSearch()
        },

        handleSearch(){
            const searchKeyList = [...this.searchKeyList]
            if (!searchKeyList.includes(this.searchKey) && this.searchKey !== ''){
                this.domContentMainMatch()
                searchKeyList.unshift(this.searchKey)
                if (searchKeyList.length > searchKeyMax){
                    searchKeyList.pop()
                }

                this.storeSetSearchKeyList(searchKeyList)
            }
            
            this.$emit('search', this.searchKey)
        },

        handleKeydownEnter(){
            if (this.searchKeyFocus) {
                this.$emit('search', this.searchKey)
            }
        }
    }
}
</script>

<style>

</style>
