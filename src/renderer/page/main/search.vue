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

<style lang="less" scoped>
.header-search {
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
    padding-bottom: 6px;

    .header-search-input {
        flex: none;
        width: 100%;
    }

    .iconfont {
        position: absolute;
        right: 5px;
    }

    .header-tag {
        display: flex;
        flex-wrap: wrap;
        cursor: default;
        padding: 5px 0;

        user-select: none;

        .header-tag-item {
            position: relative;
            height: 20px;
            padding: 0 6px;
            line-height: 20px;
            color: #a5a5a5;
            font-size: 12px;

            .header-tag-item-text {
                width: auto;
                max-width: 100px;
                height: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .header-tag-item-del {
                display: none;
                position: absolute;
                top: -2px;
                right: -3px;
                border-radius: 100%;
                background-color: rgba(#aaaaaa, 0.6);
                width: 12px;
                height: 12px;
                text-align: center;
                line-height: 12px;
                font-size: 12px;
            }

            &:hover {
                color: #dddddd;
                font-weight: bold;

                .header-tag-item-del {
                    display: inline-block;
                }
            }
        }

        .active {
            color: #dddddd;
            font-weight: bold;
        }
    }
}

</style>
