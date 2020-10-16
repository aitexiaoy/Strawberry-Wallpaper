<template>
    <div class="header-search">
        <el-select
            v-if="activeImageSource.searchSelectLists"
            :value="searchKey"
            size="mini"
            @change="handleSearch"
            >
            <el-option
                v-for="item in activeImageSource.searchSelectLists"
                :key="item.value"
                :label="item.name"
                :value="item.value"></el-option>
        </el-select>
        <template v-else-if="activeImageSource.options && activeImageSource.options.search">
            <div class="search">
                <el-input
                    :value="searchKey"
                    placeholder="请输入关键词"
                    size="mini"
                    @input="storeSetSearchKey"
                    @keyup.enter.native="handleSearch">
                    <Icon slot="suffix" class="iconfont icon-sousuo" @click="handleSearch"></Icon>
                </el-input>
            </div>
            <div v-if="searchKeyList.length>0" class="header-tag">
                <el-tag
                    v-for="tag in searchKeyList"
                    :key="tag"
                    size="mini"
                    :class="['tag-item',tag === searchKey? 'active' : '']"
                    closable
                    @click="handleTagClick(tag)"
                    @close="handleTagClose(tag)"
                    >
                    <span class="text">{{tag}}</span>
                </el-tag>
            </div>
        </template>
    </div>

</template>

<script>
import { searchKeyMax, defaultSearchList } from '$render/config'

export default {
    name: 'MainSearch',
    methods: {
        
        handleTagClose(tag){
            this.storeSetSearchKeyList(this.searchKeyList.filter(i => i !== tag))
        },
        handleTagClick(tag){
            this.storeSetSearchKey(tag)
            this.handleSearch()
        },

        handleSearch(){
            const searchKeyList = [...this.searchKeyList]
            if (!searchKeyList.includes(this.searchKey) && this.searchKey !== ''){
                searchKeyList.unshift(this.searchKey)
                if (searchKeyList.length > searchKeyMax){
                    searchKeyList.pop()
                }

                this.storeSetSearchKeyList(searchKeyList)
            }
            
            this.$emit('search', this.searchKey)
        },

    }
}
</script>

<style lang="less" scoped>
.header-search {
    width: 100%;

    .iconfont {
        cursor: pointer;
        line-height: 28px;
    }

    .header-tag {
        display: flex;
        flex-wrap: wrap;
        cursor: default;
        padding: 5px 0;

        user-select: none;

        .tag-item {
            .text {
                display: inline-block;
                max-width: 50px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
}

</style>
