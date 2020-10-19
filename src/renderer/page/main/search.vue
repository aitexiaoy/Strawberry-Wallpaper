<template>
    <div class="header-search">
        <el-select
            v-if="searchType==='select'"
            :value="searchKey"
            size="mini"
            @change="handleSearchSelect"
            >
            <el-option
                v-for="item in searchSelectLists"
                :key="item.value"
                :label="item.name"
                :value="item.value"></el-option>
        </el-select>
        <template v-else>
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
import ImageSource from '$render/get-image'


export default {
    name: 'MainSearch',
    data() {
        return {
            searchType: 'input' // input|search
        }
    },
    watch: {
        'config.imageSource': {
            handler(val){
                this.searchType = ImageSource[val].searchSelectLists ? 'select' : 'input'
            },
            immediate: true,
        },
    },


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

        handleSearchSelect(val){
            this.storeSetSearchKey(val)
            this.$emit('search', val)
        }
    },
}
</script>

<style lang="less" scoped>
.header-search {
    width: 100%;
    padding-bottom: 12px;

    .iconfont {
        cursor: pointer;
        line-height: 28px;
    }

    .header-tag {
        display: flex;
        flex-wrap: wrap;
        cursor: default;
        padding-top: 4px;

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
